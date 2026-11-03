/*
 * Composants HTML réutilisables (fonctions pures : données → chaîne HTML).
 * Toute donnée affichée passe par esc() ; aucun style en ligne (CSP stricte).
 */
(function (g) {
  'use strict';
  var XL = (g.XL = g.XL || {});
  var F = XL.formula, esc = F.esc;
  var ui = (XL.ui = {});
  var PALETTE = 6; // nombre de couleurs d'arguments (classes CSS arg-0 … arg-5)

  ui.esc = esc;
  ui.ic = function (name, cls) { return XL.icon(name, cls); };
  var ic = ui.ic;

  /* --------------------------------- valeurs --------------------------------- */
  function num(v, digits) {
    return v.toLocaleString('fr-FR', digits === undefined ? { maximumFractionDigits: 10 } : { minimumFractionDigits: digits, maximumFractionDigits: digits });
  }
  /** Valeur d'exemple → texte affiché comme Excel en français (fmt : '%', '0.00', '0.000'). */
  ui.fmtValue = function (v, fmt) {
    if (v === true) return 'VRAI';
    if (v === false) return 'FAUX';
    if (v === null || v === undefined || v === '') return '';
    if (typeof v === 'number') {
      if (fmt === '%') return num(v * 100, Math.round(v * 10000) % 100 === 0 ? 0 : 1) + ' %';
      if (fmt === '0.00') return num(v, 2);
      if (fmt === '0.000') return num(v, 3);
      return num(v);
    }
    if (typeof v === 'string' && v.indexOf('d:') === 0) { var p = v.slice(2).split('-'); return p[2] + '/' + p[1] + '/' + p[0]; }
    if (typeof v === 'string' && v.indexOf('t:') === 0) return v.slice(2);
    return String(v);
  };
  function isNumeric(v) { return typeof v === 'number' || (typeof v === 'string' && /^[dt]:/.test(v)); }

  /* ----------------------------- version et niveau ----------------------------- */
  /** Version minimale, en clair ; rien pour les fonctions présentes dans toutes les versions proposées (2010 et plus). */
  ui.versionBadge = function (m, f, ver) {
    if (!f.since || f.since === '2010') return '';
    var ok = m.available(f, ver);
    return '<span class="ver-note' + (ok ? '' : ' no') + '" title="' + esc(m.versionLabel(f.since)) + (ok ? '' : ', absente de ta version') + '">' +
      (f.since === '365' ? 'Microsoft 365' : 'Excel ' + f.since + '+') + '</span>';
  };
  /** Niveau : jauge de trois cases (niveau 2 = deux cases pleines) et son nom. */
  ui.levelMeter = function (l) {
    return '<span class="meter m' + l.step + '" aria-hidden="true"><i></i><i></i><i></i></span>';
  };
  ui.levelBadge = function (m, item) {
    if (!item.place) return '';
    var l = m.levelById[item.place.level];
    return '<span class="lvl">' + ui.levelMeter(l) + esc(l.label) + '</span>';
  };

  /* ------------------------------- fil d'Ariane ------------------------------- */
  ui.crumbs = function (m, item) {
    var parts = [];
    if (item.place) {
      var a = m.actById[item.place.activity], l = m.levelById[item.place.level];
      parts.push('<a href="#/a/' + a.id + '">' + esc(a.label) + '</a>');
      parts.push('<a href="#/a/' + a.id + '/' + l.id + '">' + esc(l.label) + '</a>');
    } else if (item.cause) {
      parts.push('<a href="#/outils">Outils</a>', '<a href="#/err">Erreurs</a>');
    } else {
      parts.push('<a href="#/outils">Outils</a>', '<a href="#/fn">Index des fonctions</a>');
    }
    return '<nav class="crumbs" aria-label="Emplacement">' + parts.join('<span class="sep" aria-hidden="true">›</span>') + '</nav>';
  };

  /* ---------------------------- formules colorées ---------------------------- */
  /**
   * Zones à colorer dans une formule.
   * - Si la formule appelle directement fnName : un argument = une couleur (comme la syntaxe de la fiche).
   * - Sinon : une couleur par référence de cellule distincte.
   * Renvoie { spans, refs } où refs = plages colorées (pour le mini-tableau).
   */
  ui.paint = function (formula, fnName) {
    var spans = [], refs = [], call = fnName ? F.splitCall(formula) : null;
    if (call && call.name === fnName) {
      call.args.forEach(function (a, k) {
        if (!a.text.trim()) return;
        spans.push({ start: a.start, end: a.end, cls: 'arg arg-' + (k % PALETTE) });
        F.refs(a.text).forEach(function (r) { refs.push({ c1: r.c1, r1: r.r1, c2: r.c2, r2: r.r2, k: k % PALETTE }); });
      });
      return { spans: spans, refs: refs };
    }
    var seen = {};
    F.refs(formula).forEach(function (r) {
      var id = r.text.replace(/\$/g, '');
      if (!(id in seen)) seen[id] = Object.keys(seen).length;
      var k = seen[id] % PALETTE;
      spans.push({ start: r.start, end: r.end, cls: 'arg arg-' + k });
      refs.push({ c1: r.c1, r1: r.r1, c2: r.c2, r2: r.r2, k: k });
    });
    return { spans: spans, refs: refs };
  };

  ui.copyButton = function (text, label) {
    return '<button class="btn-s" data-copy="' + esc(text) + '" title="Copier la formule (Excel en français)">' + (label || 'Copier') + '</button>';
  };

  /** Bloc « formule + explication » ; opts : { explain, expected, fnName, uid } */
  ui.formulaBlock = function (formula, opts) {
    opts = opts || {};
    var isFormula = formula.charAt(0) === '=';
    var code = isFormula ? (opts.fnName ? F.highlightSpans(formula, 'fr', ui.paint(formula, opts.fnName).spans) : F.highlight(formula, 'fr')) : esc(formula);
    var html = '<div class="ex"><div class="ex-f"><code class="formula">' + code + '</code>';
    if (isFormula) {
      var en = F.translate(formula, 'fr2en').result, id = 'en-' + opts.uid;
      html += '<div class="ex-btns">' + ui.copyButton(formula) +
        '<button class="btn-s" data-toggle-en="' + id + '" title="Voir la version Excel en anglais">EN</button></div></div>' +
        '<div class="ex-en" id="' + id + '" hidden><code class="formula">' + F.highlight(en, 'en') + '</code>' + ui.copyButton(en, 'Copier EN') + '</div>';
    } else {
      html += '</div>';
    }
    if (opts.explain || opts.expected !== undefined) {
      html += '<div class="ex-d">' + esc(opts.explain || '') +
        (opts.expected !== undefined ? ' <span class="res">Résultat : <b>' + esc(ui.fmtValue(opts.expected)) + '</b></span>' : '') + '</div>';
    }
    return html + '</div>';
  };

  /* ------------------------------- mini-tableau ------------------------------- */
  var FX = '<span class="fx-l" aria-hidden="true">fx</span>';
  function resultHTML(v, fmt) {
    if (Array.isArray(v)) {
      return '<table class="spill">' + v.map(function (row) {
        return '<tr>' + row.map(function (c) { return '<td' + (isNumeric(c) ? ' class="num"' : '') + '>' + esc(ui.fmtValue(c)) + '</td>'; }).join('') + '</tr>';
      }).join('') + '</table>';
    }
    return '<b>' + esc(ui.fmtValue(v, fmt)) + '</b>';
  }

  /**
   * Mini-feuille de calcul : données en A1, colonne recopiée (fill), calculs (calc)
   * ou plage à sélectionner (select) pour une manipulation sans formule.
   * opts.fnName : colore les arguments de cette fonction (fiche fonction).
   */
  ui.sampleSheet = function (s, opts) {
    opts = opts || {};
    var ncols = s.cols.length, fmt = s.fmt || [];
    var primary = s.fill ? s.fill.formula : (s.calc && s.calc.length ? s.calc[0][1] : '');
    var paint = primary ? ui.paint(primary, opts.fnName) : { spans: [], refs: [] };
    if (s.select) {
      paint.refs = F.refs('=' + s.select).map(function (r) { return { c1: r.c1, r1: r.r1, c2: r.c2, r2: r.r2, k: 0 }; });
    }
    function color(r, c) {
      for (var i = 0; i < paint.refs.length; i++) {
        var x = paint.refs[i];
        if (r >= x.r1 && r <= x.r2 && c >= x.c1 && c <= x.c2) return ' ref ref-' + x.k;
      }
      return '';
    }
    var fillCol = F.colLetters(ncols + 1), lastRow = s.rows.length + 1;
    var html = '<figure class="sheet"><div class="sheet-scroll"><table class="grid"><thead><tr><th class="corner"></th>';
    for (var c = 1; c <= ncols; c++) html += '<th>' + F.colLetters(c) + '</th>';
    if (s.fill) html += '<th class="fx">' + fillCol + '</th>';
    html += '</tr></thead><tbody><tr><th>1</th>' + s.cols.map(function (h, i) {
      return '<td class="hd' + color(1, i + 1) + '">' + esc(h) + '</td>';
    }).join('') + (s.fill ? '<td class="hd fx">' + esc(s.fill.header) + '</td>' : '') + '</tr>';
    s.rows.forEach(function (row, i) {
      html += '<tr><th>' + (i + 2) + '</th>' + row.map(function (v, j) {
        return '<td class="' + (isNumeric(v) ? 'num' : '') + color(i + 2, j + 1) + '">' + esc(ui.fmtValue(v, fmt[j])) + '</td>';
      }).join('');
      if (s.fill) {
        var rv = s.fill.results[i];
        html += '<td class="fx' + (isNumeric(rv) || typeof rv === 'boolean' ? ' num' : '') + '" title="' + esc(F.shiftRows(s.fill.formula, i)) + '">' +
          esc(ui.fmtValue(rv, s.fill.fmt)) + '</td>';
      }
      html += '</tr>';
    });
    html += '</tbody></table></div>';

    // Sous le tableau, la barre de formule d'Excel : zone Nom (adresse), « fx », formule.
    if (s.select) {
      html += '<div class="sheet-f sheet-sel"><span class="addr">' + esc(s.select) + '</span><small>' +
        (s.select.indexOf(':') > 0 ? 'Plage sélectionnée' : 'Cellule sélectionnée') + '</small></div>';
    }
    if (s.fill) {
      html += '<div class="sheet-f"><span class="addr">' + fillCol + '2</span>' + FX + '<code class="formula">' +
        F.highlightSpans(s.fill.formula, 'fr', paint.spans) + '</code>' + ui.copyButton(s.fill.formula) +
        '<small>écrite en ' + fillCol + '2, recopiée jusqu’en ' + fillCol + lastRow + '</small></div>';
    }
    if (s.calc && s.calc.length) {
      html += '<ul class="sheet-calc">' + s.calc.map(function (k, i) {
        var code = (!s.fill && i === 0) ? F.highlightSpans(k[1], 'fr', paint.spans) : F.highlight(k[1], 'fr');
        return '<li><span class="lbl">' + esc(k[0]) + '</span>' + FX + '<code class="formula">' + code + '</code>' +
          '<span class="res-v">Résultat : ' + resultHTML(k[2], k[3]) + '</span>' + ui.copyButton(k[1]) + '</li>';
      }).join('') + '</ul>';
    }
    if (s.note) html += '<figcaption class="sheet-note">' + esc(s.note) + '</figcaption>';
    return html + '</figure>';
  };

  /* ------------------------------ divers ------------------------------ */
  ui.tips = function (list, warn) {
    if (!list || !list.length) return '';
    return '<div class="tips">' + list.map(function (t) {
      return '<div class="tip' + (warn ? ' warn' : '') + '"><p>' + esc(t) + '</p></div>';
    }).join('') + '</div>';
  };

  ui.fnChips = function (m, names, ver) {
    if (!names || !names.length) return '';
    return '<div class="chips">' + names.filter(function (n) { return m.fnByName[n]; }).map(function (n) {
      var f = m.fnByName[n];
      return '<a class="chip mono' + (m.available(f, ver) ? '' : ' chip-na') + '" href="' + m.hrefOf(f) + '">' + esc(n) + ui.versionBadge(m, f, ver) + '</a>';
    }).join('') + '</div>';
  };

  /* ------------------------------- progression ------------------------------- */
  /** Barre d'avancement (élément <progress> natif : pas de style en ligne, lisible par les lecteurs d'écran). */
  ui.progress = function (st, label, text) {
    return '<div class="prog-line"><progress class="prog" value="' + st.done + '" max="' + st.total + '" aria-label="' + esc(label) + '">' +
      st.done + ' / ' + st.total + '</progress><span class="prog-n">' + esc(text || st.done + ' / ' + st.total) + '</span></div>';
  };
  /** « 3 sur 6 notions terminées » */
  ui.doneText = function (st) { var pl = st.total > 1 ? 's' : ''; return st.done + ' sur ' + st.total + ' notion' + pl + ' terminée' + pl; };
  ui.minutes = function (n) { return '<span class="mins">≈ ' + n + ' min</span>'; };

  /**
   * Carte de liste. opts : { ver, fav, step, showType, showPlace, done, minutes }
   * (done et minutes ne concernent que les notions)
   */
  ui.card = function (m, item, opts) {
    opts = opts || {};
    var type = m.typeOf(item);
    var title = item.fr && type !== 'rx' && type !== 'nt' ? item.fr : item.title;
    var desc = type === 'fn' ? item.desc : type === 'nt' ? item.intro : type === 'err' ? item.cause : item.desc;
    var na = type === 'fn' && !m.available(item, opts.ver);
    var meta = [];
    if (opts.showType) meta.push('<span class="kind kind-' + type + '">' + esc(m.typeLabel(type)) + '</span>');
    if (opts.showPlace) { var pl = m.placeLabel(item); if (pl) meta.push('<span class="where">' + esc(pl) + '</span>'); }
    if (opts.minutes) meta.push(ui.minutes(opts.minutes));
    // Ligne numérotée : le numéro (ou ✓ quand c'est fait) occupe la colonne d'en-tête, comme un numéro de ligne d'Excel.
    if (opts.done && !opts.step) meta.push('<span class="done-tag">Terminée</span>');
    var step = opts.step ? '<span class="step" aria-hidden="true">' + (opts.done ? ic('check') : opts.step) + '</span>' : '';
    return '<a class="item item-' + type + (opts.step ? ' has-step' : '') + (na ? ' item-na' : '') + (opts.done ? ' done' : '') +
      '" href="' + m.hrefOf(item) + '" data-key="' + esc(item.key) + '">' + step + '<div class="item-b">' +
      '<div class="item-h"><span class="nm' + (type === 'fn' || type === 'err' ? ' mono' : '') + '">' + esc(title) + '</span>' +
      (type === 'fn' ? '<span class="en">' + esc(item.en) + '</span>' + ui.versionBadge(m, item, opts.ver) : '') +
      (opts.done && opts.step ? '<span class="sr">(terminée)</span>' : '') +
      (opts.fav ? '<span class="star" aria-label="favori">' + ic('star-filled') + '</span>' : '') + '</div>' +
      '<div class="ds">' + esc(desc) + '</div>' + (meta.length ? '<div class="meta">' + meta.join('') + '</div>' : '') + '</div></a>';
  };

  /** Pied de colonne : raccourcis clavier, version et liens. */
  ui.sideFooter = function (cfg) {
    var keys = [['<kbd>/</kbd>', 'chercher'], ['<kbd>↑</kbd> <kbd>↓</kbd>', 'parcourir la liste'], ['<kbd>←</kbd> <kbd>→</kbd>', 'notion précédente, suivante'], ['<kbd>Échap</kbd>', 'fermer']];
    return '<div class="side-foot"><dl class="keys">' + keys.map(function (k) { return '<dt>' + k[0] + '</dt><dd>' + k[1] + '</dd>'; }).join('') + '</dl>' +
      '<p>XLGuide ' + esc(cfg.version) + '</p><p class="foot-links"><a href="' + esc(cfg.repoUrl) + '" target="_blank" rel="noopener">Code source</a>' +
      '<a href="' + esc(cfg.repoUrl) + '/releases/latest" target="_blank" rel="noopener">Mises à jour</a></p>' +
      '<p>Icônes <a href="https://tabler.io/icons" target="_blank" rel="noopener">Tabler Icons</a> (MIT), police Atkinson Hyperlegible (OFL)</p></div>';
  };
})(typeof window !== 'undefined' ? window : globalThis);
