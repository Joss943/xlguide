/* XLGuide — interface */
(function (XL) {
  'use strict';

  var APP_VERSION = '1.0.0';
  var REPO = 'https://github.com/Joss943/xlguide';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = XL.formula.esc;
  var hl = XL.formula.highlight;

  /* ------------------------------- stockage ------------------------------- */
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem('xlguide.' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('xlguide.' + k, JSON.stringify(v)); } catch (e) { /* stockage indisponible */ } }
  };

  /* ------------------------------ préparation ----------------------------- */
  function slug(s) {
    return XL.search.norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
  }
  var catById = {}, rcatById = {}, fnByName = {}, rxById = {}, usedIn = {};
  XL.categories.forEach(function (c) { catById[c.id] = c; });
  XL.recipeCategories.forEach(function (c) { rcatById[c.id] = c; });
  XL.functions.forEach(function (f) { fnByName[f.fr] = f; f.key = 'f:' + f.fr; });
  XL.recipes.forEach(function (r) {
    r.id = slug(r.title); r.key = 'r:' + r.id; rxById[r.id] = r;
    var used = [];
    r.steps.forEach(function (s) {
      XL.formula.functionsUsed(s[0]).forEach(function (n) { if (fnByName[n] && used.indexOf(n) < 0) used.push(n); });
    });
    r.fns = used;
    used.forEach(function (n) { (usedIn[n] = usedIn[n] || []).push(r); });
  });
  XL.errors.forEach(function (e, i) { e.id = String(i); e.key = 'e:' + i; });

  var VRANK = { '': 0, '2010': 1, '2013': 2, '2016': 3, '2019': 4, '2021': 5, '2024': 6, '365': 7 };
  var VLABEL = { '': 'Toutes versions', '2010': 'Excel 2010 et +', '2013': 'Excel 2013 et +', '2016': 'Excel 2016 et +',
    '2019': 'Excel 2019 et +', '2021': 'Excel 2021 et +', '2024': 'Excel 2024 / 365', '365': 'Microsoft 365' };

  var state = {
    tab: 'home', q: '', cat: '', sel: null,
    ver: store.get('ver', '365'),
    favs: store.get('favs', []),
    active: -1
  };

  function available(f) { return VRANK[f.since || ''] <= VRANK[state.ver]; }

  /* ------------------------------- utilitaires ----------------------------- */
  var toastTimer;
  function toast(msg) {
    var t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove('show'); }, 1600);
  }
  function copy(text, label) {
    function ok() { toast((label || 'Copié') + ' ✓'); }
    if (navigator.clipboard && window.isSecureContext !== false) {
      navigator.clipboard.writeText(text).then(ok, fallback);
    } else fallback();
    function fallback() {
      var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', '');
      ta.className = 'offscreen'; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); ok(); } catch (e) { toast('Copie impossible'); }
      document.body.removeChild(ta);
    }
  }
  function fmtExpected(v) {
    if (v === true) return 'VRAI';
    if (v === false) return 'FAUX';
    if (typeof v === 'number') {
      var s = Math.abs(v) >= 1000 ? v.toLocaleString('fr-FR', { maximumFractionDigits: 6 }) : String(v).replace('.', ',');
      return s;
    }
    if (typeof v === 'string' && v.indexOf('d:') === 0) { var p = v.slice(2).split('-'); return p[2] + '/' + p[1] + '/' + p[0]; }
    return '« ' + v + ' »';
  }
  function isFav(key) { return state.favs.indexOf(key) >= 0; }
  function toggleFav(key) {
    var i = state.favs.indexOf(key);
    if (i >= 0) state.favs.splice(i, 1); else state.favs.unshift(key);
    store.set('favs', state.favs); updateCounts(); lastSig = '';
    toast(i >= 0 ? 'Retiré des favoris' : 'Ajouté aux favoris');
  }
  function resolve(key) {
    var t = key.slice(0, 2), id = key.slice(2);
    if (t === 'f:') return fnByName[id] ? { type: 'fn', item: fnByName[id] } : null;
    if (t === 'r:') return rxById[id] ? { type: 'rx', item: rxById[id] } : null;
    if (t === 'e:') return XL.errors[+id] ? { type: 'err', item: XL.errors[+id] } : null;
    return null;
  }
  function hrefOf(type, item) {
    if (type === 'fn') return '#/f/' + encodeURIComponent(item.fr);
    if (type === 'rx') return '#/r/' + item.id;
    return '#/e/' + item.id;
  }

  /* --------------------------------- rendu --------------------------------- */
  function badge(f) {
    if (!f.since) return '';
    var cls = available(f) ? 'badge' : 'badge badge-no';
    var txt = f.since === '365' ? '365' : f.since + '+';
    return '<span class="' + cls + '" title="' + esc(VLABEL[f.since]) + (available(f) ? '' : ' — indisponible dans ta version') + '">' + txt + '</span>';
  }

  function itemHTML(r) {
    var it = r.item, star = isFav(it.key) ? '<span class="star on" aria-label="favori">★</span>' : '';
    if (r.type === 'fn') {
      return '<a class="item' + (available(it) ? '' : ' item-na') + '" href="' + hrefOf('fn', it) + '" data-key="' + esc(it.key) + '">' +
        '<div class="item-h"><span class="nm mono">' + esc(it.fr) + '</span><span class="en mono">' + esc(it.en) + '</span>' + badge(it) + star + '</div>' +
        '<div class="ds">' + esc(it.desc) + '</div>' +
        '<div class="meta"><span class="tag">' + catById[it.cat].icon + ' ' + esc(catById[it.cat].label) + '</span></div></a>';
    }
    if (r.type === 'rx') {
      return '<a class="item item-rx" href="' + hrefOf('rx', it) + '" data-key="' + esc(it.key) + '">' +
        '<div class="item-h"><span class="nm">' + esc(it.title) + '</span>' + star + '</div>' +
        '<div class="ds">' + esc(it.desc) + '</div>' +
        '<div class="meta"><span class="tag tag-rx">' + rcatById[it.cat].icon + ' Recette · ' + esc(rcatById[it.cat].label) + '</span>' +
        it.fns.slice(0, 4).map(function (n) { return '<span class="chip-mini mono">' + esc(n) + '</span>'; }).join('') + '</div></a>';
    }
    return '<a class="item item-err" href="' + hrefOf('err', it) + '" data-key="' + esc(it.key) + '">' +
      '<div class="item-h"><span class="nm mono">' + esc(it.fr) + '</span><span class="en mono">' + esc(it.en) + '</span>' + star + '</div>' +
      '<div class="ds">' + esc(it.cause) + '</div><div class="meta"><span class="tag tag-err">⚠ Erreur</span></div></a>';
  }

  function sideHTML() {
    var html = '';
    if (state.tab === 'fn' || state.tab === 'rx' || state.tab === 'home') {
      var isRx = state.tab === 'rx';
      var cats = isRx ? XL.recipeCategories : XL.categories;
      var all = isRx ? XL.recipes : XL.functions;
      html += '<div class="side-h">' + (isRx ? 'Thèmes' : 'Catégories') + '</div>';
      html += '<button class="cat' + (!state.cat ? ' on' : '') + '" data-cat="">Tout <small>' + all.length + '</small></button>';
      cats.forEach(function (c) {
        var n = all.filter(function (x) { return x.cat === c.id; }).length;
        html += '<button class="cat' + (state.cat === c.id ? ' on' : '') + '" data-cat="' + c.id + '"><span>' + c.icon + '</span> ' + esc(c.label) + ' <small>' + n + '</small></button>';
      });
    }
    html += '<div class="side-foot">' +
      '<div class="side-h">Astuce</div><p>Tape une phrase comme tu la dirais : « compter les factures impayées », « dernier jour du mois »…</p>' +
      '<p class="muted">Raccourcis : <kbd>/</kbd> chercher · <kbd>↑</kbd><kbd>↓</kbd> naviguer · <kbd>Échap</kbd> effacer</p>' +
      '<p class="muted small">XLGuide v' + APP_VERSION + ' · <a href="' + REPO + '" target="_blank" rel="noopener">GitHub</a> · <a href="' + REPO + '/releases/latest" target="_blank" rel="noopener">Mises à jour</a></p></div>';
    return html;
  }

  function listResults() {
    var q = state.q.trim(), tab = state.tab, res;
    if (tab === 'fav') {
      res = state.favs.map(resolve).filter(Boolean);
      if (q) {
        var keys = {}; XL.search.search(q, { limit: 400 }).forEach(function (r) { keys[r.item.key] = 1; });
        res = res.filter(function (r) { return keys[r.item.key]; });
      }
      return res;
    }
    var types = tab === 'fn' ? ['fn'] : tab === 'rx' ? ['rx'] : tab === 'err' ? ['err'] : null;
    if (q) {
      res = XL.search.search(q, { types: types, limit: 80 });
    } else if (tab === 'fn') {
      res = XL.functions.slice().sort(function (a, b) { return a.fr.localeCompare(b.fr, 'fr'); }).map(function (f) { return { type: 'fn', item: f }; });
    } else if (tab === 'rx') {
      res = XL.recipes.map(function (r) { return { type: 'rx', item: r }; });
    } else if (tab === 'err') {
      res = XL.errors.map(function (e) { return { type: 'err', item: e }; });
    } else res = [];
    if (state.cat && (tab === 'fn' || tab === 'rx' || tab === 'home')) {
      res = res.filter(function (r) { return r.item.cat === state.cat; });
    }
    return res;
  }

  var HOME_FNS = ['SOMME.SI.ENS', 'RECHERCHEX', 'SI', 'SIERREUR', 'ARRONDI', 'FIN.MOIS', 'NB.SI', 'SOMMEPROD', 'TEXTE', 'FILTRE', 'VPM', 'NB.JOURS.OUVRES'];
  var QUICK = ['additionner si plusieurs conditions', 'chercher une valeur dans un tableau', 'calculer le TTC', 'mensualité d’emprunt',
    'échéance 30 jours fin de mois', 'balance âgée', 'rapprochement bancaire', 'doublons', 'texte en nombre', 'jours ouvrés', 'amortissement', '#N/A'];

  function homeHTML() {
    var h = '<div class="home">' +
      '<h1>Que veux-tu faire dans Excel ?</h1>' +
      '<p class="lead">Décris ton besoin avec tes mots : XLGuide trouve la fonction, t’explique ses arguments et te donne des formules prêtes à copier, en français.</p>' +
      '<div class="quick">' + QUICK.map(function (q) { return '<button class="chip" data-q="' + esc(q) + '">' + esc(q) + '</button>'; }).join('') + '</div>' +
      '<div class="stats"><div><b>' + XL.functions.length + '</b><span>fonctions détaillées</span></div><div><b>' + XL.recipes.length + '</b><span>recettes compta</span></div>' +
      '<div><b>' + (XL.functions.reduce(function (n, f) { return n + f.ex.length; }, 0) + XL.recipes.reduce(function (n, r) { return n + r.steps.length; }, 0)) +
      '</b><span>formules d’exemple</span></div><div><b>FR ⇄ EN</b><span>traducteur intégré</span></div></div>' +
      '<h2>Recettes de comptabilité</h2><div class="grid">' +
      XL.recipeCategories.map(function (c) {
        var rs = XL.recipes.filter(function (r) { return r.cat === c.id; });
        return '<div class="card"><div class="card-h">' + c.icon + ' ' + esc(c.label) + '</div><ul>' +
          rs.slice(0, 4).map(function (r) { return '<li><a href="#/r/' + r.id + '">' + esc(r.title) + '</a></li>'; }).join('') +
          (rs.length > 4 ? '<li><a class="more" href="#/rx" data-cat="' + c.id + '">+ ' + (rs.length - 4) + ' autres…</a></li>' : '') + '</ul></div>';
      }).join('') + '</div>' +
      '<h2>Les fonctions à connaître</h2><div class="fn-grid">' +
      HOME_FNS.map(function (n) { var f = fnByName[n]; return '<a class="fn-tile" href="#/f/' + encodeURIComponent(n) + '"><span class="mono">' + esc(n) + '</span><small>' + esc(f.desc.split('.')[0]) + '</small></a>'; }).join('') +
      '</div></div>';
    return h;
  }

  function syntaxHTML(f) {
    var m = f.syntax.match(/^([^(]+)\((.*)\)$/);
    if (!m) return esc(f.syntax);
    var args = m[2] ? m[2].split(';').map(function (a) {
      a = a.trim(); var opt = /^\[.*\]$/.test(a);
      return '<span class="arg' + (opt ? ' opt' : '') + '">' + esc(a) + '</span>';
    }) : [];
    return '<span class="tk-fn">' + esc(m[1]) + '</span>(' + args.join('<span class="tk-sep">; </span>') + ')';
  }

  function exampleHTML(ex, idx) {
    var f = ex[0], isFormula = f.charAt(0) === '=';
    var en = isFormula ? XL.formula.translate(f, 'fr2en').result : '';
    return '<div class="ex">' +
      '<div class="ex-f"><code class="formula">' + (isFormula ? hl(f, 'fr') : esc(f)) + '</code>' +
      (isFormula ? '<div class="ex-btns"><button class="btn-s" data-copy="' + esc(f) + '" title="Copier la formule (Excel en français)">Copier</button>' +
        '<button class="btn-s ghost" data-toggle-en="' + idx + '" title="Voir la version Excel en anglais">EN</button></div>' : '') + '</div>' +
      (isFormula ? '<div class="ex-en" id="en-' + idx + '" hidden><code class="formula">' + hl(en, 'en') + '</code><button class="btn-s ghost" data-copy="' + esc(en) + '">Copier EN</button></div>' : '') +
      '<div class="ex-d">' + esc(ex[1]) + (ex.length > 2 ? ' <span class="res">→ ' + esc(fmtExpected(ex[2])) + '</span>' : '') + '</div></div>';
  }

  function tipsHTML(tips) {
    return tips && tips.length ? '<div class="tips">' + tips.map(function (t) { return '<div class="tip"><span>💡</span><p>' + esc(t) + '</p></div>'; }).join('') + '</div>' : '';
  }

  function detailFn(f) {
    var cat = catById[f.cat], av = available(f);
    var h = '<div class="d-top"><button class="back" data-back title="Retour">←</button><span class="tag">' + cat.icon + ' ' + esc(cat.label) + '</span>' +
      '<button class="fav-btn' + (isFav(f.key) ? ' on' : '') + '" data-fav="' + esc(f.key) + '" title="Favori">★</button></div>' +
      '<h2 class="d-title mono">' + esc(f.fr) + '<button class="btn-s ghost" data-copy="' + esc(f.fr) + '">Copier</button></h2>' +
      '<div class="d-sub">Anglais : <span class="mono">' + esc(f.en) + '</span> · <span class="' + (av ? 'ok' : 'ko') + '">' +
      (f.since ? esc(VLABEL[f.since]) : 'Toutes versions') + (av ? '' : ' — absente de ta version (' + esc(state.ver) + ')') + '</span></div>' +
      '<p class="d-desc">' + esc(f.desc) + '</p>' +
      '<h3>Syntaxe</h3><div class="syntax mono">' + syntaxHTML(f) + '</div>';
    if (f.args.length) {
      h += '<table class="args"><tbody>' + f.args.map(function (a) {
        var opt = /^\[/.test(a[0]) || /facultatif/i.test(a[1]);
        return '<tr><th class="mono">' + esc(a[0].replace(/^\[|\]$/g, '')) + (opt ? ' <em>facultatif</em>' : '') + '</th><td>' + esc(a[1]) + '</td></tr>';
      }).join('') + '</tbody></table>';
    }
    h += '<h3>Exemples</h3>' + f.ex.map(exampleHTML).join('');
    if (f.tips.length) h += '<h3>Bon à savoir</h3>' + tipsHTML(f.tips);
    var see = f.see.filter(function (n) { return fnByName[n]; });
    if (see.length) h += '<h3>Voir aussi</h3><div class="chips">' + see.map(function (n) { return '<a class="chip mono" href="#/f/' + encodeURIComponent(n) + '">' + esc(n) + '</a>'; }).join('') + '</div>';
    var rx = usedIn[f.fr] || [];
    if (rx.length) h += '<h3>Utilisée dans les recettes</h3><ul class="links">' + rx.map(function (r) { return '<li><a href="#/r/' + r.id + '">' + esc(r.title) + '</a></li>'; }).join('') + '</ul>';
    return h;
  }

  function detailRx(r) {
    var cat = rcatById[r.cat];
    var h = '<div class="d-top"><button class="back" data-back title="Retour">←</button><span class="tag tag-rx">' + cat.icon + ' ' + esc(cat.label) + '</span>' +
      '<button class="fav-btn' + (isFav(r.key) ? ' on' : '') + '" data-fav="' + esc(r.key) + '" title="Favori">★</button></div>' +
      '<h2 class="d-title">' + esc(r.title) + '</h2><p class="d-desc">' + esc(r.desc) + '</p>' +
      '<h3>Formules</h3>' + r.steps.map(exampleHTML).join('');
    if (r.tips.length) h += '<h3>Bon à savoir</h3>' + tipsHTML(r.tips);
    if (r.fns.length) h += '<h3>Fonctions utilisées</h3><div class="chips">' + r.fns.map(function (n) {
      return '<a class="chip mono' + (available(fnByName[n]) ? '' : ' chip-na') + '" href="#/f/' + encodeURIComponent(n) + '">' + esc(n) + badge(fnByName[n]) + '</a>';
    }).join('') + '</div>';
    return h;
  }

  function detailErr(e) {
    return '<div class="d-top"><button class="back" data-back title="Retour">←</button><span class="tag tag-err">⚠ Erreur Excel</span>' +
      '<button class="fav-btn' + (isFav(e.key) ? ' on' : '') + '" data-fav="' + esc(e.key) + '" title="Favori">★</button></div>' +
      '<h2 class="d-title mono">' + esc(e.fr) + '</h2><div class="d-sub">Excel en anglais : <span class="mono">' + esc(e.en) + '</span></div>' +
      '<h3>Cause</h3><p class="d-desc">' + esc(e.cause) + '</p><h3>Solutions</h3><ol class="fixes">' +
      e.fixes.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol>';
  }

  /* ------------------------------ traducteur ------------------------------ */
  var TR_SAMPLES = [
    '=IFERROR(VLOOKUP(A2,Sheet2!$A:$C,3,FALSE),"Not found")',
    '=SUMIFS(D:D,A:A,"607*",B:B,">="&DATE(2026,1,1))',
    '=SOMMEPROD((GAUCHE(A2:A500;1)="6")*D2:D500)',
    '=XLOOKUP(A2,Accounts[Code],Accounts[Label],"Unknown")'
  ];
  function translatorHTML() {
    return '<div class="tr">' +
      '<h1>Traducteur de formules FR ⇄ EN</h1>' +
      '<p class="lead">Colle une formule trouvée dans un tuto anglais : elle est convertie pour Excel en français (noms de fonctions, « , » → « ; », décimales, VRAI/FAUX). Ça marche aussi dans l’autre sens.</p>' +
      '<div class="tr-grid">' +
      '<div class="tr-pane"><div class="tr-h"><b>🇫🇷 Excel en français</b><button class="btn-s" id="trCopyFr">Copier</button></div>' +
      '<textarea id="trFr" class="mono" spellcheck="false" placeholder="=SOMME.SI(A2:A100;&quot;Payé&quot;;C2:C100)"></textarea></div>' +
      '<div class="tr-mid"><span id="trDir">⇄</span></div>' +
      '<div class="tr-pane"><div class="tr-h"><b>🇬🇧 Excel en anglais</b><button class="btn-s" id="trCopyEn">Copier</button></div>' +
      '<textarea id="trEn" class="mono" spellcheck="false" placeholder="=SUMIF(A2:A100,&quot;Paid&quot;,C2:C100)"></textarea></div>' +
      '</div><div id="trWarn" class="tr-warn"></div><div id="trFns" class="chips"></div>' +
      '<div class="tr-samples"><span class="muted">Essayer :</span>' + TR_SAMPLES.map(function (s) { return '<button class="chip mono" data-sample="' + esc(s) + '">' + esc(s.length > 48 ? s.slice(0, 46) + '…' : s) + '</button>'; }).join('') + '</div>' +
      '</div>';
  }
  function bindTranslator() {
    var fr = $('#trFr'), en = $('#trEn'), warn = $('#trWarn'), fns = $('#trFns'), dir = $('#trDir');
    var saved = store.get('tr', '');
    function run(from) {
      var src = from === 'fr' ? fr.value : en.value;
      var r = XL.formula.translate(src, from === 'fr' ? 'fr2en' : 'en2fr');
      (from === 'fr' ? en : fr).value = r.result;
      dir.textContent = from === 'fr' ? '→' : '←';
      warn.innerHTML = r.warnings.map(function (w) { return '<div class="tip warn"><span>⚠</span><p>' + esc(w) + '</p></div>'; }).join('');
      var used = XL.formula.functionsUsed(fr.value).filter(function (n) { return fnByName[n]; });
      fns.innerHTML = used.length ? '<span class="muted">Fonctions :</span>' + used.map(function (n) { return '<a class="chip mono" href="#/f/' + encodeURIComponent(n) + '">' + esc(n) + badge(fnByName[n]) + '</a>'; }).join('') : '';
      store.set('tr', fr.value);
    }
    fr.addEventListener('input', function () { run('fr'); });
    en.addEventListener('input', function () { run('en'); });
    $('#trCopyFr').addEventListener('click', function () { copy(fr.value, 'Formule FR copiée'); });
    $('#trCopyEn').addEventListener('click', function () { copy(en.value, 'Formule EN copiée'); });
    document.querySelectorAll('[data-sample]').forEach(function (b) {
      b.addEventListener('click', function () {
        var s = b.getAttribute('data-sample'), lang = XL.formula.detect(s);
        if (lang === 'fr') { fr.value = s; run('fr'); } else { en.value = s; run('en'); }
      });
    });
    if (state.q && /^=/.test(state.q.trim())) {
      var s = state.q.trim(); if (XL.formula.detect(s) === 'fr') { fr.value = s; run('fr'); } else { en.value = s; run('en'); }
    } else if (saved) { fr.value = saved; run('fr'); }
    fr.focus();
  }

  /* ------------------------------ raccourcis ------------------------------ */
  function shortcutsHTML() {
    var q = XL.search.norm(state.q), groups = {};
    XL.shortcuts.forEach(function (k) {
      if (q && XL.search.norm(k.keys + ' ' + k.action + ' ' + k.cat).indexOf(q) < 0) return;
      (groups[k.cat] = groups[k.cat] || []).push(k);
    });
    var names = Object.keys(groups);
    return '<div class="kb"><h1>Raccourcis clavier</h1><p class="lead">Excel pour Windows, clavier français (AZERTY). Filtre avec la barre de recherche.</p>' +
      (names.length ? names.map(function (g) {
        return '<h2>' + esc(g) + '</h2><table class="kb-t"><tbody>' + groups[g].map(function (k) {
          return '<tr><td class="keys">' + k.keys.split(' / ').map(function (combo) {
            return combo.split(' + ').map(function (x) { return '<kbd>' + esc(x) + '</kbd>'; }).join('<i>+</i>');
          }).join(' <span class="muted">ou</span> ') + '</td><td>' + esc(k.action) + '</td></tr>';
        }).join('') + '</tbody></table>';
      }).join('') : '<p class="empty">Aucun raccourci ne correspond.</p>') + '</div>';
  }

  /* ------------------------------ rendu global ----------------------------- */
  var layout, side, list, detail, lastSig = '';
  function render(force) {
    var sig = [state.tab, state.q.trim(), state.cat, state.ver, state.favs.length, state.tab === 'home' && !state.q.trim() ? !!state.sel : ''].join('|');
    if (!force && sig === lastSig && state.tab !== 'tr' && state.tab !== 'kb') {
      layout.classList.toggle('has-detail', !!state.sel);
      renderDetail(); return;
    }
    lastSig = sig;
    var tab = state.tab, full = tab === 'tr' || tab === 'kb' || (tab === 'home' && !state.q.trim() && !state.sel);
    document.querySelectorAll('#tabs a').forEach(function (a) { a.classList.toggle('on', a.getAttribute('data-tab') === tab); });
    layout.className = 'layout' + (full ? ' full' : '') + (state.sel ? ' has-detail' : '') + (tab === 'tr' || tab === 'kb' ? ' no-side' : '');
    side.innerHTML = sideHTML();

    if (tab === 'tr') { list.innerHTML = translatorHTML(); detail.innerHTML = ''; bindTranslator(); return; }
    if (tab === 'kb') { list.innerHTML = shortcutsHTML(); detail.innerHTML = ''; return; }

    if (tab === 'home' && !state.q.trim()) {
      list.innerHTML = state.sel ? '' : homeHTML();
    } else {
      var res = listResults();
      var head = '';
      if (state.q.trim()) head = '<div class="list-h">' + res.length + ' résultat' + (res.length > 1 ? 's' : '') + ' pour « ' + esc(state.q.trim()) + ' »</div>';
      else if (tab === 'fav') head = '<div class="list-h">' + res.length + ' favori' + (res.length > 1 ? 's' : '') + '</div>';
      var empty = tab === 'fav' && !state.favs.length
        ? '<p class="empty">Aucun favori pour l’instant. Clique sur ★ dans une fiche pour la retrouver ici.</p>'
        : '<p class="empty">Rien trouvé. Essaie d’autres mots (« total », « chercher », « date »…) ou le nom de la fonction en anglais.</p>';
      list.innerHTML = head + (res.length ? res.map(itemHTML).join('') : empty);
    }
    renderDetail();
  }

  function renderDetail() {
    var r = state.sel ? resolve(state.sel) : null;
    if (!r) { detail.innerHTML = state.tab === 'home' ? '' : '<div class="d-empty"><div>ƒx</div><p>Choisis une fonction ou une recette pour voir sa fiche.</p></div>'; markActive(); return; }
    detail.innerHTML = r.type === 'fn' ? detailFn(r.item) : r.type === 'rx' ? detailRx(r.item) : detailErr(r.item);
    detail.scrollTop = 0;
    markActive();
    document.title = (r.type === 'fn' ? r.item.fr : r.type === 'rx' ? r.item.title : r.item.fr) + ' — XLGuide';
  }

  function markActive() {
    list.querySelectorAll('.item').forEach(function (el) { el.classList.toggle('sel', el.getAttribute('data-key') === state.sel); });
  }

  function updateCounts() {
    $('#cFn').textContent = XL.functions.length;
    $('#cRx').textContent = XL.recipes.length;
    $('#cFav').textContent = state.favs.length || '';
  }

  /* -------------------------------- routage -------------------------------- */
  function route() {
    var h = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
    var parts = h.split('/'), p0 = parts[0], rest = parts.slice(1).join('/');
    state.sel = null;
    if (p0 === 'f' && fnByName[rest]) { state.sel = 'f:' + rest; if (state.tab === 'tr' || state.tab === 'kb') state.tab = 'fn'; }
    else if (p0 === 'r' && rxById[rest]) { state.sel = 'r:' + rest; if (state.tab === 'tr' || state.tab === 'kb') state.tab = 'rx'; }
    else if (p0 === 'e' && XL.errors[+rest]) { state.sel = 'e:' + rest; if (state.tab === 'tr' || state.tab === 'kb') state.tab = 'err'; }
    else if (['fn', 'rx', 'tr', 'err', 'kb', 'fav'].indexOf(p0) >= 0) { if (state.tab !== p0) state.cat = state.pendingCat || ''; state.tab = p0; }
    else { state.tab = 'home'; state.cat = ''; }
    state.pendingCat = '';
    if (state.sel && state.tab === 'home' && !state.q.trim()) {
      state.tab = state.sel.charAt(0) === 'f' ? 'fn' : state.sel.charAt(0) === 'r' ? 'rx' : 'err';
    }
    render();
  }

  /* ------------------------------ événements ------------------------------ */
  function bind() {
    var q = $('#q'), timer;
    q.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        state.q = q.value; state.active = -1;
        if (state.tab === 'tr') {
          if (/^=/.test(state.q.trim())) { render(); return; }
          location.hash = '#/';
          return;
        }
        if (state.tab === 'kb') { list.innerHTML = shortcutsHTML(); return; }
        render();
      }, 70);
    });
    q.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var first = list.querySelector('.item.kb-active') || list.querySelector('.item');
        if (first) { location.hash = first.getAttribute('href'); }
      }
    });

    document.addEventListener('keydown', function (e) {
      var tag = (e.target.tagName || '').toLowerCase(), typing = tag === 'input' || tag === 'textarea' || tag === 'select';
      if ((e.key === '/' && !typing) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault(); q.focus(); q.select(); return;
      }
      if (e.key === 'Escape') {
        if (q.value) { q.value = ''; state.q = ''; if (state.tab === 'kb') { list.innerHTML = shortcutsHTML(); } else render(); q.focus(); }
        else if (state.sel) { closeDetail(); }
        return;
      }
      if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && (!typing || e.target === q)) {
        var items = list.querySelectorAll('.item'); if (!items.length) return;
        e.preventDefault();
        state.active = Math.max(0, Math.min(items.length - 1, state.active + (e.key === 'ArrowDown' ? 1 : -1)));
        items.forEach(function (el, i) { el.classList.toggle('kb-active', i === state.active); });
        items[state.active].scrollIntoView({ block: 'nearest' });
        var key = items[state.active].getAttribute('data-key');
        history.replaceState(null, '', items[state.active].getAttribute('href'));
        state.sel = key; renderDetail();
      }
    });

    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-copy],[data-fav],[data-cat],[data-q],[data-toggle-en],[data-back]');
      if (!t) return;
      if (t.hasAttribute('data-back')) { e.preventDefault(); closeDetail(); return; }
      if (t.hasAttribute('data-copy')) { e.preventDefault(); copy(t.getAttribute('data-copy'), 'Formule copiée'); return; }
      if (t.hasAttribute('data-fav')) { e.preventDefault(); toggleFav(t.getAttribute('data-fav')); t.classList.toggle('on'); markFavInList(); return; }
      if (t.hasAttribute('data-toggle-en')) { var el = $('#en-' + t.getAttribute('data-toggle-en')); if (el) { el.hidden = !el.hidden; t.classList.toggle('on', !el.hidden); } return; }
      if (t.hasAttribute('data-q')) { e.preventDefault(); q.value = t.getAttribute('data-q'); state.q = q.value; if (state.tab !== 'home') location.hash = '#/'; else render(); q.focus(); return; }
      if (t.hasAttribute('data-cat')) {
        e.preventDefault(); state.cat = t.getAttribute('data-cat');
        var href = t.getAttribute('href');
        if (href && location.hash !== href) { state.pendingCat = state.cat; location.hash = href; } else render();
      }
    });

    $('#ver').value = state.ver;
    $('#ver').addEventListener('change', function () { state.ver = this.value; store.set('ver', state.ver); render(true); toast('Version : Excel ' + state.ver); });

    var theme = store.get('theme', 'auto');
    document.documentElement.setAttribute('data-theme', theme);
    $('#theme').addEventListener('click', function () {
      var cur = document.documentElement.getAttribute('data-theme');
      var dark = cur === 'dark' || (cur === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      var next = dark ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next); store.set('theme', next);
    });

    window.addEventListener('hashchange', route);
  }

  function closeDetail() {
    var base = { fn: '#/fn', rx: '#/rx', err: '#/err', fav: '#/fav' }[state.tab] || '#/';
    location.hash = base;
  }

  function markFavInList() { if (state.tab === 'fav') render(); }

  /* ---------------------------- environnement ---------------------------- */
  function setupEnv() {
    var isDesktop = !!window.xlguideDesktop;
    var standalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
    if (!isDesktop && !standalone && location.protocol.indexOf('http') === 0) $('#install').hidden = false;
    if (isDesktop) document.documentElement.classList.add('desktop');
    if ('serviceWorker' in navigator && location.protocol === 'https:' && !isDesktop) {
      navigator.serviceWorker.register('sw.js').catch(function () { /* hors-ligne indisponible */ });
    }
    if (/Mac/.test(navigator.platform || '')) $('#kbdHint').textContent = '/';
  }

  /* --------------------------------- init --------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    layout = $('#layout'); side = $('#side'); list = $('#list'); detail = $('#detail');
    updateCounts(); bind(); setupEnv(); route();
    if (!location.hash || location.hash === '#/' || location.hash === '#') $('#q').focus();
  });

  XL.app = { version: APP_VERSION };
})(window.XL);
