/*
 * Pages de liste (colonne centrale + colonne latérale) :
 * activité (parcours), résultats de recherche, index A→Z, cas pratiques, erreurs, favoris.
 * Chaque vue renvoie { side, list } (HTML) ; « items » donne l'ordre pour la navigation au clavier.
 */
(function (g) {
  'use strict';
  var XL = (g.XL = g.XL || {});
  var ui = XL.ui, esc = ui.esc, ic = ui.ic;
  var views = (XL.views = XL.views || {});

  function isFav(ctx, item) { return ctx.s.favs.indexOf(item.key) >= 0; }
  function cards(ctx, items, opts) {
    return items.map(function (it, i) {
      return ui.card(ctx.m, it, {
        ver: ctx.s.ver, fav: isFav(ctx, it), step: opts && opts.numbered ? i + 1 : 0,
        showType: opts && opts.showType, showPlace: opts && opts.showPlace
      });
    }).join('');
  }
  function group(title, hint, body) {
    return body ? '<section class="group"><h3>' + title + (hint ? ' <small>' + hint + '</small>' : '') + '</h3>' + body + '</section>' : '';
  }
  function empty(text) { return '<p class="empty">' + text + '</p>'; }

  /* -------------------------------- activité -------------------------------- */
  function activitySide(ctx, act, levelId) {
    var m = ctx.m;
    return '<div class="side-h">' + ic(act.icon) + esc(act.label) + '</div>' +
      '<p class="side-desc">' + esc(act.desc) + '</p>' +
      '<nav class="levels" aria-label="Niveaux">' + m.levels.map(function (l) {
        var p = m.place(act.id, l.id);
        var detail = [p.notions.length && p.notions.length + ' notion' + (p.notions.length > 1 ? 's' : ''),
          p.functions.length && p.functions.length + ' fonction' + (p.functions.length > 1 ? 's' : ''),
          p.recipes.length && p.recipes.length + ' méthode' + (p.recipes.length > 1 ? 's' : '')].filter(Boolean).join(' · ');
        return '<a class="lvl-link lvl-' + l.id + (l.id === levelId ? ' on' : '') + '" href="#/a/' + act.id + '/' + l.id + '">' +
          '<span class="n">' + l.step + '</span><span><b>' + esc(l.label) + '</b><small>' + detail + '</small></span></a>';
      }).join('') + '</nav>' +
      '<div class="side-h">Autres activités</div>' + m.activities.filter(function (a) { return a.id !== act.id; }).map(function (a) {
        return '<a class="cat" href="#/a/' + a.id + '">' + ic(a.icon) + '<span>' + esc(a.label) + '</span></a>';
      }).join('') + ui.sideFooter(ctx.cfg);
  }

  views.activity = function (ctx, actId, levelId) {
    var m = ctx.m, act = m.actById[actId], lvl = m.levelById[levelId];
    var p = m.place(actId, levelId);
    var next = m.levels[m.levels.indexOf(lvl) + 1];
    // .seg : sélecteur de niveau affiché seulement sur petit écran (la colonne latérale y est masquée)
    var seg = '<nav class="seg" aria-label="Niveaux">' + m.levels.map(function (l) {
      return '<a class="' + (l.id === levelId ? 'on' : '') + '" href="#/a/' + act.id + '/' + l.id + '">' + l.step + '. ' + esc(l.label) + '</a>';
    }).join('') + '</nav>';
    var list = '<header class="list-head"><div class="eyebrow">' + ic(act.icon) + esc(act.label) + '</div>' +
      '<h2><span class="lvl lvl-' + lvl.id + '">' + lvl.step + ' · ' + esc(lvl.label) + '</span></h2>' +
      '<p>' + esc(act.levels[levelId]) + '</p>' + seg + '</header>' +
      group('Notions', 'à lire dans l’ordre', cards(ctx, p.notions, { numbered: true })) +
      group('Fonctions', '', cards(ctx, p.functions)) +
      group('Méthodes', 'des cas concrets', cards(ctx, p.recipes)) +
      (next ? '<a class="next-level" href="#/a/' + actId + '/' + next.id + '">Niveau suivant : <b>' + esc(next.label) + '</b>' + ic('chevron-right') + '</a>' : '');
    return { side: activitySide(ctx, act, levelId), list: list, items: p.notions.concat(p.functions, p.recipes) };
  };

  /* -------------------------------- recherche -------------------------------- */
  var TYPE_FILTERS = [['', 'Tout'], ['nt', 'Notions'], ['fn', 'Fonctions'], ['rx', 'Méthodes et cas pratiques'], ['err', 'Erreurs']];

  views.search = function (ctx) {
    var q = ctx.s.q.trim(), type = ctx.s.type || '';
    var all = XL.search.search(q, { limit: 120 });
    var counts = {};
    all.forEach(function (r) { counts[r.type] = (counts[r.type] || 0) + 1; });
    var res = type ? all.filter(function (r) { return r.type === type; }) : all;
    var items = res.map(function (r) { return r.item; });
    var side = '<div class="side-h">' + ic('search') + 'Filtrer les résultats</div>' + TYPE_FILTERS.map(function (f) {
      var n = f[0] ? (counts[f[0]] || 0) : all.length;
      return '<button class="cat' + (type === f[0] ? ' on' : '') + '" data-type="' + f[0] + '"><span>' + f[1] + '</span><small>' + n + '</small></button>';
    }).join('') + ui.sideFooter(ctx.cfg);
    var list = '<div class="list-h">' + items.length + ' résultat' + (items.length > 1 ? 's' : '') + ' pour « ' + esc(q) + ' »</div>' +
      (items.length ? cards(ctx, items, { showType: true, showPlace: true }) :
        empty('Rien trouvé. Essaie d’autres mots (« total », « chercher », « date »…) ou le nom anglais d’une fonction.'));
    return { side: side, list: list, items: items };
  };

  /* ------------------------------- outils (listes) ------------------------------- */
  function catSide(ctx, title, cats, all, route) {
    return views.toolsNav(ctx, route) + '<div class="side-h">' + esc(title) + '</div>' +
      '<button class="cat' + (!ctx.s.cat ? ' on' : '') + '" data-cat=""><span>Tout</span><small>' + all.length + '</small></button>' +
      cats.map(function (c) {
        var n = all.filter(function (x) { return x.cat === c.id; }).length;
        return n ? '<button class="cat' + (ctx.s.cat === c.id ? ' on' : '') + '" data-cat="' + c.id + '">' + ic(c.icon) + '<span>' + esc(c.label) + '</span><small>' + n + '</small></button>' : '';
      }).join('') + ui.sideFooter(ctx.cfg);
  }
  function byCat(ctx, list) { return ctx.s.cat ? list.filter(function (x) { return x.cat === ctx.s.cat; }) : list; }

  views.functionIndex = function (ctx) {
    var all = XL.functions.slice().sort(function (a, b) { return a.fr.localeCompare(b.fr, 'fr'); });
    var items = byCat(ctx, all);
    var list = '<header class="list-head"><div class="eyebrow">' + ic('book') + 'Outils</div><h2>Index des fonctions A→Z</h2>' +
      '<p>Toutes les fonctions, y compris les plus spécialisées (finance, statistiques, conversions) qui ne font pas partie du parcours.</p></header>' +
      items.map(function (f) { return ui.card(ctx.m, f, { ver: ctx.s.ver, fav: isFav(ctx, f), showPlace: true }); }).join('');
    return { side: catSide(ctx, 'Catégories', XL.categories, all, 'fn'), list: list, items: items };
  };

  views.cases = function (ctx, domain) {
    var all = ctx.m.recipesOfDomain(domain), items = byCat(ctx, all);
    var cats = XL.recipeCategories.filter(function (c) { return c.domain === domain; });
    var it = domain === 'it';
    var list = '<header class="list-head"><div class="eyebrow">' + ic(it ? 'network' : 'receipt-tax') + 'Outils · Cas pratiques</div>' +
      '<h2>' + (it ? 'Informatique, système et réseau' : 'Comptabilité et gestion') + '</h2>' +
      '<p>' + (it ? 'Formules pour l’administration : adresses IP, Active Directory, parc, supervision, comparaison de bases.' :
        'Formules métier : TVA, emprunts, amortissements, factures, trésorerie, contrôles.') + '</p></header>' +
      cards(ctx, items, { showPlace: true });
    return { side: catSide(ctx, 'Thèmes', cats, all, it ? 'it' : 'rx'), list: list, items: items };
  };

  views.errors = function (ctx) {
    var items = XL.errors;
    var list = '<header class="list-head"><div class="eyebrow">' + ic('alert-circle') + 'Outils</div><h2>Erreurs Excel</h2>' +
      '<p>Ce que signifie chaque erreur et comment la corriger.</p></header>' + cards(ctx, items);
    return { side: views.toolsNav(ctx, 'err') + ui.sideFooter(ctx.cfg), list: list, items: items };
  };

  views.favorites = function (ctx) {
    var items = ctx.s.favs.map(function (k) { var r = ctx.m.resolve(k); return r && r.item; }).filter(Boolean);
    var list = '<header class="list-head"><div class="eyebrow">' + ic('star') + 'Favoris</div><h2>Mes favoris</h2></header>' +
      (items.length ? cards(ctx, items, { showType: true, showPlace: true }) :
        empty('Aucun favori pour l’instant. Clique sur l’étoile ' + ic('star') + ' d’une fiche pour la retrouver ici.'));
    var side = '<div class="side-h">Parcours</div>' + ctx.m.activities.map(function (a) {
      return '<a class="cat" href="#/a/' + a.id + '">' + ic(a.icon) + '<span>' + esc(a.label) + '</span></a>';
    }).join('') + ui.sideFooter(ctx.cfg);
    return { side: side, list: list, items: items };
  };
})(typeof window !== 'undefined' ? window : globalThis);
