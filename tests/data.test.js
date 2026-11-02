/* Contenu : fonctions, recettes, erreurs, notions, mini-tableaux, parcours, et toutes les formules d'exemple. */
'use strict';
const { check, section, balancedFormula } = require('./lib');

module.exports = function (XL) {
  const fnByName = {};
  XL.functions.forEach((f) => { fnByName[f.fr] = f; });
  const known = (n) => !!(fnByName[n] || XL.extraNames[n] || XL.userFunctions[n]);
  const CATS = XL.categories.map((c) => c.id);
  const RCATS = XL.recipeCategories.map((c) => c.id);
  const ACTS = XL.activities.map((a) => a.id);
  const LEVELS = XL.levelDefs.map((l) => l.id);
  const VERS = ['', '2010', '2013', '2016', '2019', '2021', '2024', '365'];
  const recipeByTitle = {};
  XL.recipes.forEach((r) => { recipeByTitle[r.title] = r; });
  const domainOf = (r) => XL.recipeCategories.find((c) => c.id === r.cat).domain;
  const formulas = []; // { where, f } : toutes les formules d'exemple, contrôlées plus bas

  section('Catégories et thèmes');
  XL.recipeCategories.forEach((c) => {
    check(['compta', 'it'].includes(c.domain), 'thème ' + c.id + ' : domaine inconnu');
    check(!!XL.icon(c.icon), 'thème ' + c.id + ' : icône Tabler absente du lot (' + c.icon + ')');
  });
  XL.categories.forEach((c) => check(!!XL.icon(c.icon), 'catégorie ' + c.id + ' : icône Tabler absente du lot (' + c.icon + ')'));
  check(XL.recipes.filter((r) => domainOf(r) === 'it').length >= 40, 'volet informatique : au moins 40 recettes');

  section('Fonctions');
  const seenFr = new Set(), seenEn = new Set();
  XL.functions.forEach((f) => {
    const id = f.fr;
    check(!seenFr.has(f.fr), id + ' : nom FR en double'); seenFr.add(f.fr);
    check(!seenEn.has(f.en), id + ' : nom EN en double (' + f.en + ')'); seenEn.add(f.en);
    check(/^[A-Z0-9._]+$/.test(f.fr), id + ' : nom FR invalide');
    check(/^[A-Z0-9._]+$/.test(f.en), id + ' : nom EN invalide');
    check(CATS.includes(f.cat), id + ' : catégorie inconnue ' + f.cat);
    check(VERS.includes(f.since), id + ' : version inconnue ' + f.since);
    check(f.desc && f.desc.length > 15, id + ' : description manquante');
    check(f.syntax.startsWith(f.fr + '('), id + ' : la syntaxe doit commencer par ' + f.fr + '(');
    check(Array.isArray(f.args) && f.args.every((a) => a.length === 2 && a[0] && a[1]), id + ' : arguments mal formés');
    check(f.ex.length >= 1, id + ' : au moins un exemple requis');
    check(f.kw.split(' ').length >= 2, id + ' : mots-clés insuffisants');
    f.see.forEach((s) => check(!!fnByName[s], id + ' : « voir aussi » inconnu ' + s));
    f.ex.forEach((e) => { if (e[0].startsWith('=')) formulas.push({ where: id, f: e[0] }); });
  });

  section('Recettes (méthodes et cas pratiques)');
  const slugs = new Set();
  XL.recipes.forEach((r) => {
    check(RCATS.includes(r.cat), r.title + ' : thème inconnu');
    check(r.steps.length >= 1, r.title + ' : aucune formule');
    check(r.desc && r.kw, r.title + ' : description ou mots-clés manquants');
    const s = XL.search.norm(r.title).replace(/[^a-z0-9]+/g, '-');
    check(!slugs.has(s), r.title + ' : titre en double'); slugs.add(s);
    r.steps.forEach((e) => { check(e[0].startsWith('='), r.title + ' : formule sans « = » : ' + e[0]); formulas.push({ where: r.title, f: e[0] }); });
  });

  section('Erreurs et raccourcis');
  XL.errors.forEach((e) => check(e.fr && e.en && e.cause && e.fixes.length, 'Erreur incomplète ' + e.fr));
  XL.shortcuts.forEach((k) => check(k.keys && k.action && k.cat, 'Raccourci incomplet'));

  section('Parcours : activités, niveaux, placements');
  check(XL.activities.length === 4, '4 activités attendues');
  check(LEVELS.join() === 'base,approfondir,expert', 'niveaux attendus : base, approfondir, expert');
  XL.activities.forEach((a) => {
    check(a.label && a.desc && !!XL.icon(a.icon), a.id + ' : libellé, description ou icône manquant');
    LEVELS.forEach((l) => check(a.levels[l] && a.levels[l].length > 20, a.id + ' : texte d’introduction du niveau ' + l + ' manquant'));
  });
  check(XL.dataErrors.length === 0, 'doublons de déclaration : ' + XL.dataErrors.join(' | '));
  Object.keys(XL.placement).forEach((k) => {
    const p = XL.placement[k];
    check(ACTS.includes(p.activity) && LEVELS.includes(p.level), k + ' : activité ou niveau inconnu');
    if (k.startsWith('f:')) check(!!fnByName[k.slice(2)], 'placement : fonction inconnue ' + k);
    else if (k.startsWith('r:')) {
      const r = recipeByTitle[k.slice(2)];
      check(!!r, 'placement : recette inconnue (titre exact attendu) ' + k);
      // Le parcours porte sur l'usage d'Excel : les cas pratiques informatiques restent dans Outils.
      if (r) check(domainOf(r) !== 'it', 'placement : un cas pratique informatique ne doit pas entrer dans le parcours : ' + k);
    } else check(false, 'placement : clé invalide ' + k);
  });
  ACTS.forEach((a) => LEVELS.forEach((l) => {
    check(XL.notions.some((n) => n.activity === a && n.level === l), a + ' › ' + l + ' : au moins une notion attendue');
  }));

  section('Notions');
  const titles = new Set();
  XL.notions.forEach((n) => {
    const id = n.title;
    check(ACTS.includes(n.activity) && LEVELS.includes(n.level), id + ' : activité ou niveau inconnu');
    check(!titles.has(n.title), id + ' : titre en double'); titles.add(n.title);
    check(n.intro && n.intro.length > 20, id + ' : introduction trop courte');
    check(n.points.length >= 2, id + ' : au moins 2 points « à retenir »');
    check(n.kw && n.kw.split(' ').length >= 2, id + ' : mots-clés insuffisants');
    check(n.sample || n.examples.length, id + ' : ni mini-tableau ni exemple');
    n.examples.forEach((e) => {
      check(e.length >= 2 && e[0].startsWith('=') && e[1], id + ' : exemple mal formé ' + e[0]);
      formulas.push({ where: id, f: e[0] });
    });
  });

  section('Mini-tableaux');
  const samples = Object.keys(XL.samples).map((k) => [k, XL.samples[k]])
    .concat(XL.notions.filter((n) => n.sample).map((n) => ['n:' + n.title, n.sample]));
  samples.forEach(([where, s]) => {
    if (where.startsWith('f:')) check(!!fnByName[where.slice(2)], where + ' : fonction inconnue');
    if (where.startsWith('r:')) check(!!recipeByTitle[where.slice(2)], where + ' : recette inconnue (titre exact attendu)');
    const ncols = s.cols.length, lastRow = s.rows.length + 1;
    check(ncols > 0 && s.rows.length > 0, where + ' : tableau vide');
    check(s.rows.every((r) => r.length === ncols), where + ' : chaque ligne doit avoir ' + ncols + ' valeurs');
    check(!s.fmt || s.fmt.length <= ncols, where + ' : fmt plus long que le nombre de colonnes');
    check(s.fill || (s.calc && s.calc.length), where + ' : ni colonne calculée ni calcul');
    // Les formules ne doivent viser que le tableau (et la colonne calculée pour les calculs).
    const inside = (f, maxCol) => XL.formula.refs(f).every((r) => r.c2 <= maxCol && r.r2 <= lastRow);
    if (s.fill) {
      check(s.fill.header && s.fill.formula.startsWith('=') && s.fill.results.length === s.rows.length, where + ' : colonne calculée mal formée');
      check(inside(s.fill.formula, ncols), where + ' : la formule recopiée vise hors du tableau : ' + s.fill.formula);
      formulas.push({ where, f: s.fill.formula });
    }
    (s.calc || []).forEach((c) => {
      check(c.length >= 3 && c[0] && c[1].startsWith('='), where + ' : calcul mal formé ' + c[1]);
      check(inside(c[1], ncols + (s.fill ? 1 : 0)), where + ' : le calcul vise hors du tableau : ' + c[1]);
      formulas.push({ where, f: c[1] });
    });
  });

  section('Formules d’exemple (' + formulas.length + ')');
  formulas.forEach(({ where, f }) => {
    check(balancedFormula(f), where + ' : parenthèses/guillemets déséquilibrés : ' + f);
    XL.formula.functionsUsed(f).forEach((n) => check(known(n), where + ' : fonction inconnue « ' + n + ' » dans ' + f));
    check(!/[^;]\s;|;\s{2,}/.test(f.replace(/"[^"]*"/g, '""')), where + ' : espaces suspects autour de « ; » : ' + f);
    check(!/,(?=\s*\D)/.test(f.replace(/"([^"]|"")*"/g, '""').replace(/\{[^}]*\}/g, '{}')), where + ' : virgule hors nombre (séparateur anglais ?) : ' + f);
  });

  section('Traducteur : aller-retour FR → EN → FR sur toutes les formules');
  formulas.forEach(({ where, f }) => {
    const en = XL.formula.translate(f, 'fr2en');
    const back = XL.formula.translate(en.result, 'en2fr');
    check(back.result === f, where + ' : aller-retour différent\n     FR : ' + f + '\n     EN : ' + en.result + '\n     FR : ' + back.result);
    check(!en.result.includes(';') || /"[^"]*;[^"]*"/.test(f), where + ' : « ; » restant en anglais : ' + en.result);
  });

  return XL.functions.length + ' fonctions · ' + XL.recipes.length + ' recettes · ' + XL.notions.length + ' notions · ' +
    samples.length + ' mini-tableaux · ' + formulas.length + ' formules · ' + XL.errors.length + ' erreurs · ' + XL.shortcuts.length + ' raccourcis';
};
