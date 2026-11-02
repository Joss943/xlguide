/*
 * Modèle : indexe les contenus (fonctions, recettes, notions, erreurs) et les relie au parcours
 * « 4 activités × 3 niveaux ». Pur : aucune dépendance au DOM ni au stockage (testé en Node).
 *
 * Clés stables (favoris, liens) : 'f:NOM', 'r:<slug du titre>', 'n:<slug du titre>', 'e:<index>'.
 */
(function (g) {
  'use strict';
  var XL = (g.XL = g.XL || {});

  var VRANK = { '': 0, '2010': 1, '2013': 2, '2016': 3, '2019': 4, '2021': 5, '2024': 6, '365': 7 };
  var VLABEL = {
    '': 'Toutes versions', '2010': 'Excel 2010 et +', '2013': 'Excel 2013 et +', '2016': 'Excel 2016 et +',
    '2019': 'Excel 2019 et +', '2021': 'Excel 2021 et +', '2024': 'Excel 2024 / 365', '365': 'Microsoft 365'
  };
  var TYPE_LABEL = { nt: 'Notion', fn: 'Fonction', rx: 'Méthode', err: 'Erreur' };

  function slug(s) {
    return XL.search.norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
  }
  function placeKey(activity, level) { return activity + '|' + level; }
  function byOrder(a, b) { return a.place.order - b.place.order; }

  /** Fonctions (noms FR) utilisées par une liste de formules, limitées à celles de la base. */
  function functionsIn(formulas, fnByName) {
    var used = [];
    formulas.forEach(function (f) {
      if (typeof f !== 'string' || f.charAt(0) !== '=') return;
      XL.formula.functionsUsed(f).forEach(function (n) { if (fnByName[n] && used.indexOf(n) < 0) used.push(n); });
    });
    return used;
  }
  function sampleFormulas(s) {
    if (!s) return [];
    return (s.fill ? [s.fill.formula] : []).concat((s.calc || []).map(function (c) { return c[1]; }));
  }

  XL.buildModel = function () {
    var m = {
      activities: XL.activities, levels: XL.levelDefs,
      actById: {}, levelById: {}, catById: {}, rcatById: {},
      fnByName: {}, rxById: {}, ntById: {}, errById: {},
      usedIn: {}, byPlace: {}
    };
    m.activities.forEach(function (a) {
      m.actById[a.id] = a;
      m.levels.forEach(function (l) { m.byPlace[placeKey(a.id, l.id)] = { notions: [], functions: [], recipes: [] }; });
    });
    m.levels.forEach(function (l) { m.levelById[l.id] = l; });
    XL.categories.forEach(function (c) { m.catById[c.id] = c; });
    XL.recipeCategories.forEach(function (c) { m.rcatById[c.id] = c; });

    XL.functions.forEach(function (f) {
      f.key = 'f:' + f.fr;
      f.place = XL.placement[f.key] || null;
      f.sample = XL.samples[f.key] || null;
      m.fnByName[f.fr] = f;
      if (f.place) m.byPlace[placeKey(f.place.activity, f.place.level)].functions.push(f);
    });

    XL.recipes.forEach(function (r) {
      r.id = slug(r.title);
      r.key = 'r:' + r.id;
      r.domain = m.rcatById[r.cat].domain;
      r.place = XL.placement['r:' + r.title] || null;
      r.sample = XL.samples['r:' + r.title] || null;
      r.fns = functionsIn(r.steps.map(function (s) { return s[0]; }).concat(sampleFormulas(r.sample)), m.fnByName);
      r.fns.forEach(function (n) { (m.usedIn[n] = m.usedIn[n] || []).push(r); });
      m.rxById[r.id] = r;
      if (r.place) m.byPlace[placeKey(r.place.activity, r.place.level)].recipes.push(r);
    });

    XL.notions.forEach(function (n, i) {
      n.id = slug(n.title);
      n.key = 'n:' + n.id;
      n.place = { activity: n.activity, level: n.level, order: i };
      n.fns = functionsIn(n.examples.map(function (e) { return e[0]; }).concat(sampleFormulas(n.sample)), m.fnByName);
      m.ntById[n.id] = n;
      m.byPlace[placeKey(n.activity, n.level)].notions.push(n);
    });

    Object.keys(m.byPlace).forEach(function (k) {
      var p = m.byPlace[k];
      p.functions.sort(byOrder); p.recipes.sort(byOrder); p.notions.sort(byOrder);
      p.notions.forEach(function (n, i) { n.step = i + 1; });
    });

    XL.errors.forEach(function (e, i) { e.id = String(i); e.key = 'e:' + i; m.errById[e.id] = e; });

    /* --------------------------------- requêtes --------------------------------- */
    m.place = function (activity, level) { return m.byPlace[placeKey(activity, level)] || { notions: [], functions: [], recipes: [] }; };
    m.recipesOfDomain = function (domain) { return XL.recipes.filter(function (r) { return r.domain === domain; }); };
    m.neighbors = function (n) {
      var list = m.place(n.activity, n.level).notions, i = list.indexOf(n);
      return { prev: list[i - 1] || null, next: list[i + 1] || null, total: list.length };
    };
    m.available = function (f, ver) { return VRANK[f.since || ''] <= VRANK[ver]; };
    m.versionLabel = function (since) { return VLABEL[since || '']; };
    m.typeLabel = function (type) { return TYPE_LABEL[type]; };
    m.typeOf = function (item) { return { f: 'fn', r: 'rx', n: 'nt', e: 'err' }[item.key.charAt(0)]; };

    m.resolve = function (key) {
      if (!key || key.charAt(1) !== ':') return null;
      var t = key.charAt(0), id = key.slice(2);
      var item = t === 'f' ? m.fnByName[id] : t === 'r' ? m.rxById[id] : t === 'n' ? m.ntById[id] : t === 'e' ? m.errById[id] : null;
      return item ? { type: m.typeOf(item), item: item } : null;
    };
    m.hrefOf = function (item) {
      var t = item.key.charAt(0);
      if (t === 'f') return '#/f/' + encodeURIComponent(item.fr);
      return '#/' + t + '/' + item.id;
    };
    /** Libellé d'emplacement : « Calculer › Les bases », « Cas pratique · Comptabilité » ou « Index A→Z ». */
    m.placeLabel = function (item) {
      if (item.place) return m.actById[item.place.activity].label + ' › ' + m.levelById[item.place.level].label;
      if (item.domain) return 'Cas pratique · ' + (item.domain === 'it' ? 'Informatique' : 'Comptabilité');
      if (item.fr && item.cat && m.catById[item.cat]) return 'Index A→Z · ' + m.catById[item.cat].label;
      return '';
    };
    return m;
  };
})(typeof window !== 'undefined' ? window : globalThis);
