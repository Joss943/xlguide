/*
 * XLGuide — recherche en langage naturel
 * « je veux additionner si la date est en mars » → SOMME.SI.ENS, méthode « Total par mois »…
 * Index en mémoire, tolérant aux accents, pluriels, fautes de frappe légères.
 */
(function (g) {
  'use strict';
  var XL = (g.XL = g.XL || {});

  var STOP = ('a au aux avec ce ces cela comme comment dans de des du d elle en est et etre faire fait il ils je j la le les l leur lui ma mais me mes mon ne nous on ou par pas pour qu que qui sa se ses si son sur ta te tes ton tu un une vos votre vous y ' +
    'veux voudrais souhaite besoin dois faut peux puis cellule cellules colonne excel formule formules fonction fonctions avoir quel quelle quels quelles mettre obtenir calculer calcul donner donne').split(' ');
  var STOPSET = {};
  STOP.forEach(function (w) { STOPSET[w] = 1; });
  // « si » et « ou » sont des mots-outils mais aussi des fonctions : on les garde si la requête est très courte
  var KEEP_SHORT = { si: 1, ou: 1, et: 1, nb: 1, na: 1, n: 1, t: 1 };

  var SYN = {
    additionner: 'somme', addition: 'somme', additionne: 'somme', totaliser: 'somme', total: 'somme', sommer: 'somme', cumuler: 'somme',
    compter: 'nb', denombrer: 'nb', combien: 'nb', nombre: 'nb',
    chercher: 'recherche', rechercher: 'recherche', trouver: 'recherche', retrouver: 'recherche', correspondance: 'recherche', vlookup: 'recherchev', xlookup: 'recherchex',
    arrondir: 'arrondi', arrondis: 'arrondi',
    coller: 'concatener', fusionner: 'concatener', assembler: 'concatener', joindre: 'concatener',
    aujourdhui: 'aujourdhui', today: 'aujourdhui',
    doublon: 'doublons', duplicate: 'doublons',
    graphe: 'graphique', diagramme: 'graphique', chart: 'graphique', camembert: 'secteurs',
    erreur: 'erreur', bug: 'erreur'
  };

  function norm(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’']/g, ' ');
  }
  function key(s) { return norm(s).replace(/[^a-z0-9#\/]/g, ''); }
  function stem(w) {
    if (w.length > 4 && /[sx]$/.test(w)) w = w.slice(0, -1);
    return w;
  }
  function tokens(s, keepStop) {
    return norm(s).split(/[^a-z0-9]+/).filter(function (w) { return w && (keepStop || !STOPSET[w]); }).map(stem);
  }

  function lev(a, b) {
    if (Math.abs(a.length - b.length) > 1) return 9;
    var prev = [], cur = [], i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      cur = [i];
      for (j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      prev = cur;
    }
    return prev[b.length];
  }

  /* Similarité entre un mot de la requête et un mot indexé (0 = rien) */
  function sim(q, w) {
    if (q === w) return 3;
    var lq = q.length, lw = w.length;
    if (lq >= 4 && lw >= 4 && (w.indexOf(q) === 0 || q.indexOf(w) === 0)) return 2;
    if (lq >= 5 && lw >= 5) {
      var p = 0; while (p < lq && p < lw && q[p] === w[p]) p++;
      if (p >= 5 && p >= Math.min(lq, lw) * 0.7) return 2;
      if (lev(q, w) <= 1) return 1.5;
    }
    return 0;
  }

  var index = null;
  function addDoc(list, type, item, title, en, primary, secondary) {
    var tset = {}, pset = {}, sset = {};
    tokens(title + ' ' + (en || ''), true).forEach(function (w) { tset[w] = 1; });
    tokens(primary).forEach(function (w) { pset[w] = 1; });
    tokens(secondary).forEach(function (w) { sset[w] = 1; });
    list.push({
      type: type, item: item,
      name: norm(title), en: norm(en || ''),
      key: key(title), enKey: key(en || ''),
      phrase: ' ' + norm(primary + ' ' + title).replace(/[^a-z0-9]+/g, ' ') + ' ',
      t: Object.keys(tset), p: Object.keys(pset), s: Object.keys(sset)
    });
  }

  function build() {
    var docs = [];
    (XL.functions || []).forEach(function (f) {
      addDoc(docs, 'fn', f, f.fr, f.en, f.kw, f.desc + ' ' + f.args.map(function (a) { return a[0]; }).join(' '));
    });
    (XL.recipes || []).forEach(function (r) {
      addDoc(docs, 'rx', r, r.title, '', r.kw + ' ' + r.title, r.desc);
    });
    (XL.notions || []).forEach(function (n) {
      addDoc(docs, 'nt', n, n.title, '', n.kw + ' ' + n.title, n.intro + ' ' + n.points.join(' ') + ' ' + n.steps.join(' '));
    });
    (XL.errors || []).forEach(function (e) {
      addDoc(docs, 'err', e, e.fr, e.en, e.kw + ' erreur', e.cause);
    });
    index = docs;
    return docs;
  }
  XL.resetSearch = function () { index = null; };

  function bestSim(q, arr) {
    var best = 0;
    for (var i = 0; i < arr.length && best < 3; i++) { var s = sim(q, arr[i]); if (s > best) best = s; }
    return best;
  }

  /**
   * @param {string} query
   * @param {{types?:string[], limit?:number}} opts
   * @returns {Array<{type:string,item:object,score:number}>}
   */
  function search(query, opts) {
    opts = opts || {};
    var docs = index || build();
    var raw = norm(query).trim().replace(/^=/, '').replace(/\(.*$/, '').trim();
    if (!raw) return [];
    var rk = key(raw);
    var qt = tokens(raw);
    if (!qt.length) qt = tokens(raw, true).filter(function (w) { return KEEP_SHORT[w]; });
    var expanded = qt.map(function (w) { return SYN[w] ? [w, SYN[w]] : [w]; });

    var res = [];
    for (var d = 0; d < docs.length; d++) {
      var doc = docs[d];
      if (opts.types && opts.types.indexOf(doc.type) < 0) continue;
      var score = 0;

      // Correspondance directe sur le nom (ex. "somme.si", "sumifs", "#n/a")
      if (rk && doc.type !== 'rx' && doc.type !== 'nt') {
        if (doc.key === rk) score += 1000;
        else if (doc.enKey && doc.enKey === rk) score += 900;
        else if (rk.length >= 2 && doc.key.indexOf(rk) === 0) score += 300 - Math.min(100, doc.key.length * 4);
        else if (rk.length >= 3 && doc.enKey && doc.enKey.indexOf(rk) === 0) score += 220;
        else if (rk.length >= 3 && doc.key.indexOf(rk) > 0) score += 80;
      }

      var rp = ' ' + raw.replace(/[^a-z0-9]+/g, ' ').trim() + ' ';
      if (rp.length >= 8 && doc.phrase.indexOf(rp) >= 0) score += 30;

      var matched = 0;
      for (var i = 0; i < expanded.length; i++) {
        var best = 0;
        for (var v = 0; v < expanded[i].length; v++) {
          var w = expanded[i][v];
          var st = bestSim(w, doc.t) * 7;
          var sp = bestSim(w, doc.p) * 4;
          var ss = bestSim(w, doc.s) * 1.2;
          var b = Math.max(st, sp, ss) + (st && sp ? 2 : 0);
          if (v > 0) b *= 0.85; // synonyme : un peu moins fort que le mot exact
          if (b > best) best = b;
        }
        if (best > 0) matched++;
        score += best;
      }
      if (expanded.length) {
        var cover = matched / expanded.length;
        if (matched === 0 && score < 80) continue;
        score += cover * 18;
        if (cover === 1 && expanded.length > 1) score += 10;
      }
      // Priorité pédagogique : les notions d'abord, puis les méthodes pour les requêtes de plusieurs mots
      if (doc.type === 'nt') score *= 1.15;
      else if (doc.type === 'rx' && expanded.length >= 2) score *= 1.08;
      if (score > 0) res.push({ type: doc.type, item: doc.item, score: score });
    }
    res.sort(function (a, b) { return b.score - a.score; });
    return res.slice(0, opts.limit || 60);
  }

  XL.search = { search: search, norm: norm, tokens: tokens, build: build };
})(typeof window !== 'undefined' ? window : globalThis);
