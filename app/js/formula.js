/*
 * XLGuide — moteur de formules
 *  - tokenize()  : découpe une formule (chaînes, noms de feuilles, références structurées, constantes {…})
 *  - translate() : traduit une formule Excel FR ⇄ EN (noms de fonctions, séparateurs, décimales, VRAI/FAUX)
 *  - highlight() : coloration syntaxique HTML avec liens vers les fiches
 * Aucune dépendance, fonctionne dans le navigateur, Electron et Node (tests).
 */
(function (g) {
  'use strict';
  var XL = (g.XL = g.XL || {});

  var maps = null;
  function buildMaps() {
    var fr2en = {}, en2fr = {}, fiche = {};
    (XL.functions || []).forEach(function (f) { fr2en[f.fr] = f.en; en2fr[f.en] = f.fr; fiche[f.fr] = true; });
    Object.keys(XL.extraNames || {}).forEach(function (fr) {
      var en = XL.extraNames[fr];
      if (!fr2en[fr]) fr2en[fr] = en;
      if (!en2fr[en]) en2fr[en] = fr;
    });
    // fiche : noms qui ont une fiche (les autres, comme les anciennes fonctions, sont traduits mais pas liés)
    maps = { fr2en: fr2en, en2fr: en2fr, fiche: fiche, bool: { fr2en: { VRAI: 'TRUE', FAUX: 'FALSE' }, en2fr: { TRUE: 'VRAI', FALSE: 'FAUX' } } };
    return maps;
  }
  XL.resetFormulaMaps = function () { maps = null; };
  function getMaps() { return maps || buildMaps(); }

  /* Découpe en segments : str "…", sheet '…', brack […], brace {…}, code.
     Chaque segment porte sa position de départ (s) dans la formule. */
  function tokenize(f) {
    var out = [], i = 0, n = f.length, buf = '', bufStart = 0;
    function flush() { if (buf) { out.push({ t: 'code', v: buf, s: bufStart }); buf = ''; } }
    function push(t, end) { flush(); out.push({ t: t, v: f.slice(i, end), s: i }); i = end; }
    while (i < n) {
      var c = f[i];
      if (c === '"') {
        var j = i + 1;
        while (j < n) { if (f[j] === '"') { if (f[j + 1] === '"') { j += 2; continue; } break; } j++; }
        push('str', Math.min(j + 1, n)); continue;
      }
      if (c === "'") {
        var k = i + 1;
        while (k < n) { if (f[k] === "'") { if (f[k + 1] === "'") { k += 2; continue; } break; } k++; }
        push('sheet', Math.min(k + 1, n)); continue;
      }
      if (c === '[') {
        var depth = 0, m = i;
        for (; m < n; m++) { if (f[m] === '[') depth++; else if (f[m] === ']') { depth--; if (depth === 0) break; } }
        push('brack', Math.min(m + 1, n)); continue;
      }
      if (c === '{') {
        var e = f.indexOf('}', i); if (e < 0) e = n - 1;
        push('brace', e + 1); continue;
      }
      if (!buf) bufStart = i;
      buf += c; i++;
    }
    flush();
    return out;
  }

  var ID_START = /[A-Za-z_\\À-ſ]/;
  var ID_CHAR = /[A-Za-z0-9_.$À-ſ]/;
  var DIGIT = /[0-9]/;

  /* Parcourt un segment de code et appelle les callbacks pour chaque élément */
  function scanCode(code, src, cb) {
    var i = 0, n = code.length;
    while (i < n) {
      var c = code[i];
      if (c === '$' || ID_START.test(c)) {
        var j = i + 1;
        while (j < n && ID_CHAR.test(code[j])) j++;
        var id = code.slice(i, j), k = j;
        while (k < n && code[k] === ' ') k++;
        cb.ident(id, code[k] === '(');
        i = j; continue;
      }
      var decSep = src === 'fr' ? ',' : '.';
      if (DIGIT.test(c) || (c === decSep && DIGIT.test(code[i + 1] || ''))) {
        var p = i;
        while (p < n && DIGIT.test(code[p])) p++;
        if (code[p] === decSep && DIGIT.test(code[p + 1] || '')) { p++; while (p < n && DIGIT.test(code[p])) p++; }
        else if (code[p] === decSep && p === i) { p++; }
        if ((code[p] === 'E' || code[p] === 'e') && /[+\-0-9]/.test(code[p + 1] || '')) {
          p += 2; while (p < n && DIGIT.test(code[p])) p++;
        }
        // un nombre suivi de lettres = référence de cellule/ligne (ex. 1:1) => laisser tel quel
        cb.number(code.slice(i, p));
        i = p; continue;
      }
      cb.other(c);
      i++;
    }
  }

  /** Détecte la langue probable d'une formule : 'fr' | 'en' */
  function detect(f) {
    var m = getMaps(), fr = 0, en = 0;
    tokenize(f).forEach(function (s) {
      if (s.t !== 'code') return;
      if (s.v.indexOf(';') >= 0) fr += 2;
      scanCode(s.v, 'en', {
        ident: function (id, isFn) {
          var u = id.toUpperCase();
          if (!isFn && !m.bool.fr2en[u] && !m.bool.en2fr[u]) return;
          var inFr = !!(m.fr2en[u] || m.bool.fr2en[u]), inEn = !!(m.en2fr[u] || m.bool.en2fr[u]);
          if (inFr && !inEn) fr += 3; else if (inEn && !inFr) en += 3;
        },
        number: function () {}, other: function (c) { if (c === ',') en += 1; }
      });
    });
    return fr >= en ? 'fr' : 'en';
  }

  /**
   * Traduit une formule.
   * @param {string} formula
   * @param {'fr2en'|'en2fr'|'auto'} dir
   * @returns {{result:string, dir:string, warnings:string[], unknown:string[]}}
   */
  function translate(formula, dir) {
    var m = getMaps();
    if (!dir || dir === 'auto') dir = detect(formula) === 'fr' ? 'fr2en' : 'en2fr';
    var src = dir === 'fr2en' ? 'fr' : 'en';
    var names = dir === 'fr2en' ? m.fr2en : m.en2fr;
    var bools = dir === 'fr2en' ? m.bool.fr2en : m.bool.en2fr;
    var warnings = [], unknown = [], out = '', sawBrace = false, sawFormatText = false;

    tokenize(formula).forEach(function (s) {
      if (s.t === 'brace') { sawBrace = true; out += s.v; return; }
      if (s.t === 'str') {
        if (/(aaaa|jj|yyyy|dd)/i.test(s.v)) sawFormatText = true;
        out += s.v; return;
      }
      if (s.t !== 'code') { out += s.v; return; }
      scanCode(s.v, src, {
        ident: function (id, isFn) {
          var u = id.toUpperCase(), pre = '';
          if (u.indexOf('_XLFN.') === 0) { pre = id.slice(0, 6); u = u.slice(6); }
          if (isFn) {
            if (names[u]) { out += pre + names[u]; return; }
            if (bools[u]) { out += bools[u]; return; }
            var other = dir === 'fr2en' ? m.en2fr[u] : m.fr2en[u];
            if (!other && unknown.indexOf(u) < 0) unknown.push(u);
            out += id; return;
          }
          if (bools[u]) { out += bools[u]; return; }
          out += id;
        },
        number: function (num) {
          out += dir === 'fr2en' ? num.replace(',', '.') : num.replace('.', ',');
        },
        other: function (c) {
          if (dir === 'en2fr' && c === ',') { out += ';'; return; }
          if (dir === 'fr2en' && c === ';') { out += ','; return; }
          out += c;
        }
      });
    });

    if (sawBrace) warnings.push('Constante matricielle { … } recopiée telle quelle : ses séparateurs de lignes/colonnes dépendent de tes paramètres régionaux, vérifie-la.');
    if (sawFormatText) warnings.push('Codes de format dans un texte (ex. TEXTE/TEXT) : ils ne sont pas traduits automatiquement. Français « aaaa / jj » = anglais « yyyy / dd ».');
    if (unknown.length) warnings.push('Fonction(s) non reconnue(s), laissée(s) telle(s) quelle(s) : ' + unknown.join(', ') + '.');
    return { result: out, dir: dir, warnings: warnings, unknown: unknown };
  }

  /** Liste des noms de fonctions (FR) utilisés dans une formule FR */
  function functionsUsed(formula) {
    var used = [];
    tokenize(formula).forEach(function (s) {
      if (s.t !== 'code') return;
      scanCode(s.v, 'fr', {
        ident: function (id, isFn) { var u = id.toUpperCase(); if (isFn && used.indexOf(u) < 0) used.push(u); },
        number: function () {}, other: function () {}
      });
    });
    return used;
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /** Coloration syntaxique ; lang = 'fr' | 'en' */
  function highlight(formula, lang) {
    var m = getMaps(), html = '';
    var known = lang === 'en' ? m.en2fr : m.fr2en;
    tokenize(formula).forEach(function (s) {
      if (s.t === 'str') { html += '<span class="tk-str">' + esc(s.v) + '</span>'; return; }
      if (s.t === 'sheet' || s.t === 'brack') { html += '<span class="tk-ref">' + esc(s.v) + '</span>'; return; }
      if (s.t === 'brace') { html += '<span class="tk-num">' + esc(s.v) + '</span>'; return; }
      scanCode(s.v, lang === 'en' ? 'en' : 'fr', {
        ident: function (id, isFn) {
          var u = id.toUpperCase();
          var frName = isFn && known[u] ? (lang === 'en' ? known[u] : u) : '';
          if (frName && m.fiche[frName]) {
            html += '<a class="tk-fn" href="#/f/' + encodeURIComponent(frName) + '" data-fn="' + esc(frName) + '">' + esc(id) + '</a>';
          } else if (frName) {
            html += '<span class="tk-fn">' + esc(id) + '</span>';
          } else if (isFn) {
            html += '<span class="tk-fn tk-fn-x">' + esc(id) + '</span>';
          } else if (m.bool.fr2en[u] || m.bool.en2fr[u]) {
            html += '<span class="tk-bool">' + esc(id) + '</span>';
          } else {
            html += '<span class="tk-ref">' + esc(id) + '</span>';
          }
        },
        number: function (num) { html += '<span class="tk-num">' + esc(num) + '</span>'; },
        other: function (c) {
          if (c === ';' || c === ',') html += '<span class="tk-sep">' + esc(c) + '</span>';
          else if ('()'.indexOf(c) >= 0) html += '<span class="tk-par">' + c + '</span>';
          else if ('=+-*/^&<>%:'.indexOf(c) >= 0) html += '<span class="tk-op">' + esc(c) + '</span>';
          else html += esc(c);
        }
      });
    });
    return html;
  }

  /* ------------------------------------------------------------------------
   * Références de cellules (A1, $B$2, A2:C10) dans les segments de code.
   * Les références qualifiées par une feuille (Feuil1!A1), les colonnes
   * entières (A:A) et les références structurées (T[Col]) sont ignorées.
   * ---------------------------------------------------------------------- */
  var REF_RE = /(?<![A-Za-z0-9_.$!])(\$?)([A-Z]{1,3})(\$?)([1-9][0-9]*)(?::(\$?)([A-Z]{1,3})(\$?)([1-9][0-9]*))?(?![A-Za-z0-9_(.])/g;

  function colNum(letters) {
    var n = 0;
    for (var i = 0; i < letters.length; i++) n = n * 26 + (letters.charCodeAt(i) - 64);
    return n;
  }
  function colLetters(n) {
    var s = '';
    while (n > 0) { var r = (n - 1) % 26; s = String.fromCharCode(65 + r) + s; n = Math.floor((n - 1) / 26); }
    return s;
  }

  /** Liste des références : [{ text, start, end, c1, r1, c2, r2 }] (positions dans la formule). */
  function refs(formula) {
    var out = [];
    tokenize(formula).forEach(function (seg) {
      if (seg.t !== 'code') return;
      REF_RE.lastIndex = 0;
      var m;
      while ((m = REF_RE.exec(seg.v))) {
        var c1 = colNum(m[2]), r1 = +m[4];
        var c2 = m[6] ? colNum(m[6]) : c1, r2 = m[8] ? +m[8] : r1;
        out.push({
          text: m[0], start: seg.s + m.index, end: seg.s + m.index + m[0].length,
          c1: Math.min(c1, c2), r1: Math.min(r1, r2), c2: Math.max(c1, c2), r2: Math.max(r1, r2)
        });
      }
    });
    return out;
  }

  /** Recopie vers le bas : décale de « delta » lignes les numéros de ligne non bloqués par $. */
  function shiftRows(formula, delta) {
    var out = '';
    tokenize(formula).forEach(function (seg) {
      if (seg.t !== 'code') { out += seg.v; return; }
      out += seg.v.replace(REF_RE, function (all, a1, c1, a2, r1, b1, c2, b2, r2) {
        var first = a1 + c1 + a2 + (a2 ? r1 : +r1 + delta);
        if (!c2) return first;
        return first + ':' + b1 + c2 + b2 + (b2 ? r2 : +r2 + delta);
      });
    });
    return out;
  }

  /**
   * Si la formule est exactement « =NOM(arg1; arg2; …) », renvoie
   * { name, args: [{ text, start, end }] } (positions dans la formule), sinon null.
   */
  function splitCall(formula) {
    var m = /^=\s*([A-Za-z_][A-Za-z0-9_.]*)\(/.exec(formula);
    if (!m) return null;
    var body = m[0].length, depth = 1, args = [], start = body, i;
    var segs = tokenize(formula);
    for (var s = 0; s < segs.length && depth > 0; s++) {
      var seg = segs[s];
      if (seg.t !== 'code') continue;
      for (i = 0; i < seg.v.length; i++) {
        var pos = seg.s + i;
        if (pos < body) continue;
        var c = seg.v[i];
        if (c === '(') depth++;
        else if (c === ')') {
          depth--;
          if (depth === 0) {
            if (formula.slice(pos + 1).trim()) return null; // quelque chose après la parenthèse finale
            if (pos > start || args.length) args.push({ text: formula.slice(start, pos), start: start, end: pos });
            return { name: m[1].toUpperCase(), args: args };
          }
        } else if (c === ';' && depth === 1) {
          args.push({ text: formula.slice(start, pos), start: start, end: pos });
          start = pos + 1;
        }
      }
    }
    return null;
  }

  /**
   * Coloration syntaxique avec zones surlignées : spans = [{ start, end, cls }]
   * triés et sans chevauchement. Les zones ne coupent jamais une chaîne de texte.
   */
  function highlightSpans(formula, lang, spans) {
    var html = '', pos = 0;
    (spans || []).forEach(function (sp) {
      if (sp.start > pos) html += highlight(formula.slice(pos, sp.start), lang);
      html += '<span class="' + sp.cls + '">' + highlight(formula.slice(sp.start, sp.end), lang) + '</span>';
      pos = sp.end;
    });
    if (pos < formula.length) html += highlight(formula.slice(pos), lang);
    return html;
  }

  XL.formula = {
    tokenize: tokenize, translate: translate, detect: detect, highlight: highlight, functionsUsed: functionsUsed, esc: esc,
    refs: refs, shiftRows: shiftRows, splitCall: splitCall, highlightSpans: highlightSpans, colLetters: colLetters, colNum: colNum
  };
})(typeof window !== 'undefined' ? window : globalThis);
