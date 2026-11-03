/*
 * Vues : chaque page et chaque fiche est rendue (sans navigateur) puis contrôlée :
 * HTML équilibré, aucune valeur « undefined »/NaN, liens internes valides, rien d'interdit par la CSP.
 */
'use strict';
const { check, section, htmlProblem } = require('./lib');

module.exports = function (XL) {
  const m = XL.buildModel();
  const V = XL.views;
  function ctx(s) {
    let n = 0;
    return { m, s: Object.assign({ favs: [], ver: '365', q: '', type: '', cat: '' }, s), cfg: XL.config, uid: () => ++n };
  }

  const LIST_ROUTES = new Set(['', 'outils', 'fn', 'err', 'tr', 'kb', 'fav']);
  const routeParts = (href) => decodeURIComponent(href.replace(/&amp;/g, '&').replace(/^#\/?/, '')).split('/');
  /** Élément visé par un lien de fiche (#/f/…, #/r/…, #/n/…, #/e/…), sinon null. */
  function target(href) {
    const parts = routeParts(href);
    return /^[frne]$/.test(parts[0]) ? m.resolve(parts[0] + ':' + parts.slice(1).join('/')) : null;
  }
  function validHref(href) {
    const parts = routeParts(href);
    if (/^[frne]$/.test(parts[0])) return !!target(href);
    if (parts[0] === 'a') return !!m.actById[parts[1]] && (parts.length === 2 || (parts.length === 3 && !!m.levelById[parts[2]]));
    return parts.length === 1 && LIST_ROUTES.has(parts[0]);
  }

  let pages = 0;
  /** Contrôles communs à tout fragment HTML produit par une vue. */
  function inspect(where, html) {
    pages++;
    check(typeof html === 'string' && html.length > 0, where + ' : rendu vide');
    const problem = htmlProblem(html);
    check(!problem, where + ' : ' + problem);
    const text = html.replace(/<[^>]*>/g, ' ');
    check(!/\bundefined\b|\bNaN\b|\[object Object\]/.test(text) && !/="undefined"|="null"/.test(html), where + ' : valeur indéfinie affichée');
    check(!/\sstyle=|\son[a-z]+=|javascript:/i.test(html), where + ' : style ou script en ligne (bloqué par la CSP)');
    for (const a of html.matchAll(/href="([^"]*)"/g)) {
      const href = a[1];
      if (href.startsWith('#')) check(validHref(href), where + ' : lien interne invalide ' + href);
      else check(/^https:\/\//.test(href), where + ' : lien externe non https ' + href);
    }
    for (const a of html.matchAll(/<a [^>]*target="_blank"[^>]*>/g)) check(/rel="noopener"/.test(a[0]), where + ' : target=_blank sans rel=noopener');
    for (const a of html.matchAll(/data-fav="([^"]*)"/g)) check(!!m.resolve(a[1].replace(/&amp;/g, '&')), where + ' : favori inconnu ' + a[1]);
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((x) => x[1]);
    check(new Set(ids).size === ids.length, where + ' : identifiants en double');
    for (const a of html.matchAll(/data-toggle-en="([^"]+)"/g)) check(ids.includes(a[1]), where + ' : bouton EN sans cible ' + a[1]);
  }
  function inspectPage(where, p) {
    if (p.full !== undefined) { inspect(where, p); return; }
    inspect(where + ' (colonne)', p.side);
    inspect(where + ' (liste)', p.list);
    check(Array.isArray(p.items), where + ' : items manquants');
  }

  section('Pages');
  inspect('accueil', V.home(ctx()));
  inspect('outils', V.toolsHub(ctx()));
  inspect('traducteur', V.translator(ctx()));
  inspect('raccourcis', V.shortcuts(ctx()));
  inspect('raccourcis filtrés', V.shortcuts(ctx({ q: 'copier' })));
  m.activities.forEach((a) => m.levels.forEach((l) => {
    const p = V.activity(ctx(), a.id, l.id), pl = m.place(a.id, l.id);
    inspectPage(a.id + '/' + l.id, p);
    check(p.items.length === pl.notions.length + pl.functions.length + pl.recipes.length, a.id + '/' + l.id + ' : nombre d’éléments incohérent');
  }));
  inspectPage('index A→Z', V.functionIndex(ctx()));
  XL.categories.forEach((c) => inspectPage('index · ' + c.id, V.functionIndex(ctx({ cat: c.id }))));
  inspectPage('erreurs', V.errors(ctx()));
  inspectPage('favoris (vide)', V.favorites(ctx()));
  const someFavs = ['f:SOMME', 'r:' + XL.recipes[0].id, 'n:' + XL.notions[0].id, 'e:0', 'f:FONCTION.DISPARUE'];
  const favPage = V.favorites(ctx({ favs: someFavs }));
  inspectPage('favoris', favPage);
  check(favPage.items.length === 4, 'favoris : une clé inconnue doit être ignorée sans erreur');
  ['somme', 'référence absolue', 'doublons', 'figer', 'graphique', 'zzqxw', '=SI('].forEach((q) => {
    ['', 'nt', 'fn', 'rx', 'err'].forEach((type) => inspectPage('recherche « ' + q + ' » [' + type + ']', V.search(ctx({ q, type }))));
  });

  section('Fiches');
  const all = XL.functions.concat(XL.recipes, XL.notions, XL.errors);
  all.forEach((item) => {
    const ref = m.resolve(item.key);
    check(!!ref && ref.item === item, item.key + ' : clé non résolue');
    const t = target(m.hrefOf(item));
    check(!!t && t.item === item, item.key + ' : le lien de la fiche ne mène pas à elle (' + m.hrefOf(item) + ')');
    inspect('fiche ' + item.key, V.sheet(ctx({ favs: [item.key] }), ref));
  });
  XL.functions.filter((f) => f.since).forEach((f) => inspect('fiche ' + f.key + ' (Excel 2010)', V.sheet(ctx({ ver: '2010' }), m.resolve(f.key))));
  inspect('fiche vide', V.emptySheet(ctx()));
  inspect('fiche vide (départ)', V.emptySheet(ctx(), XL.notions[0]));

  section('Modèle : parcours et compatibilité des favoris');
  const placed = XL.functions.concat(XL.recipes).filter((x) => x.place);
  check(placed.every((x) => { const pl = m.place(x.place.activity, x.place.level); return pl.functions.includes(x) || pl.recipes.includes(x); }),
    'chaque fonction ou méthode placée apparaît dans son niveau');
  XL.notions.forEach((n) => {
    const nb = m.neighbors(n);
    check(nb.total === m.place(n.activity, n.level).notions.length && n.step >= 1 && n.step <= nb.total, n.title + ' : position dans le niveau');
    if (nb.next) check(m.neighbors(nb.next).prev === n, n.title + ' : notion suivante / précédente incohérentes');
  });
  // Clés des favoris enregistrés par les versions 1.0/1.1 : elles doivent toujours se résoudre.
  check(m.resolve('f:SOMME.SI') && m.resolve('e:0') && m.resolve('r:passer-du-ht-au-ttc'), 'anciennes clés de favoris toujours valides');
  const keys = all.map((x) => x.key);
  check(new Set(keys).size === keys.length, 'clés uniques entre fonctions, recettes, notions et erreurs');

  return pages + ' rendus contrôlés';
};
