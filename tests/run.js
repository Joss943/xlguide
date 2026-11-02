/* XLGuide — tests (node tests/run.js). Aucune dépendance. */
'use strict';
const XL = require('./load')();
const fs = require('fs');
const path = require('path');

let failed = 0, passed = 0;
function check(cond, msg) { if (cond) passed++; else { failed++; console.error('  ✗ ' + msg); } }
function section(t) { console.log('\n▶ ' + t); }

const fnByName = {};
XL.functions.forEach((f) => { fnByName[f.fr] = f; });
const known = (n) => !!(fnByName[n] || XL.extraNames[n] || XL.userFunctions[n]);
const CATS = XL.categories.map((c) => c.id);
const RCATS = XL.recipeCategories.map((c) => c.id);
XL.recipeCategories.forEach((c) => {
  check(['compta', 'it'].includes(c.domain), 'thème ' + c.id + ' : domaine inconnu');
  check(!!XL.icon(c.icon), 'thème ' + c.id + ' : icône Tabler absente du lot (' + c.icon + ')');
});
XL.categories.forEach((c) => check(!!XL.icon(c.icon), 'catégorie ' + c.id + ' : icône Tabler absente du lot (' + c.icon + ')'));
check(XL.recipes.filter((r) => XL.recipeCategories.find((c) => c.id === r.cat).domain === 'it').length >= 40, 'volet informatique : au moins 40 recettes');
const VERS = ['', '2010', '2013', '2016', '2019', '2021', '2024', '365'];

/* Parenthèses et guillemets équilibrés (hors chaînes) */
function balanced(f) {
  let depth = 0, inStr = false;
  for (let i = 0; i < f.length; i++) {
    const c = f[i];
    if (c === '"') { if (inStr && f[i + 1] === '"') { i++; continue; } inStr = !inStr; continue; }
    if (inStr) continue;
    if (c === '(') depth++;
    if (c === ')') { depth--; if (depth < 0) return false; }
  }
  return depth === 0 && !inStr;
}
const allFormulas = [];

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
  f.ex.forEach((e) => { if (e[0].startsWith('=')) allFormulas.push({ where: id, f: e[0], expected: e[2] }); });
});

section('Recettes');
const slugs = new Set();
XL.recipes.forEach((r) => {
  check(RCATS.includes(r.cat), r.title + ' : thème inconnu');
  check(r.steps.length >= 1, r.title + ' : aucune formule');
  check(r.desc && r.kw, r.title + ' : description ou mots-clés manquants');
  const s = XL.search.norm(r.title).replace(/[^a-z0-9]+/g, '-');
  check(!slugs.has(s), r.title + ' : titre en double'); slugs.add(s);
  r.steps.forEach((e) => { check(e[0].startsWith('='), r.title + ' : formule sans « = » : ' + e[0]); allFormulas.push({ where: r.title, f: e[0], expected: e[2] }); });
});

section('Erreurs & raccourcis');
XL.errors.forEach((e) => check(e.fr && e.en && e.cause && e.fixes.length, 'Erreur incomplète ' + e.fr));
XL.shortcuts.forEach((k) => check(k.keys && k.action && k.cat, 'Raccourci incomplet'));

section('Formules (' + allFormulas.length + ')');
allFormulas.forEach(({ where, f }) => {
  check(balanced(f), where + ' : parenthèses/guillemets déséquilibrés : ' + f);
  XL.formula.functionsUsed(f).forEach((n) => check(known(n), where + ' : fonction inconnue « ' + n + ' » dans ' + f));
  check(!/[^;]\s;|;\s{2,}/.test(f.replace(/"[^"]*"/g, '""')), where + ' : espaces suspects autour de « ; » : ' + f);
  check(!/,(?=\s*\D)/.test(f.replace(/"([^"]|"")*"/g, '""').replace(/\{[^}]*\}/g, '{}')), where + ' : virgule hors nombre (séparateur anglais ?) : ' + f);
});

section('Traducteur FR → EN → FR (aller-retour)');
allFormulas.forEach(({ where, f }) => {
  const en = XL.formula.translate(f, 'fr2en');
  const back = XL.formula.translate(en.result, 'en2fr');
  check(back.result === f, where + ' : aller-retour différent\n     FR : ' + f + '\n     EN : ' + en.result + '\n     FR : ' + back.result);
  check(!en.result.includes(';') || /"[^"]*;[^"]*"/.test(f), where + ' : « ; » restant en anglais : ' + en.result);
});
const T = (f, d) => XL.formula.translate(f, d).result;
check(T('=SIERREUR(RECHERCHEV(A2;$F$2:$H$9;3;FAUX);"x;y")', 'fr2en') === '=IFERROR(VLOOKUP(A2,$F$2:$H$9,3,FALSE),"x;y")', 'traduction SIERREUR/RECHERCHEV');
check(T('=IF(AND(A1>0.5,B1<>"a,b"),SUM(A1:A3),0)', 'en2fr') === '=SI(ET(A1>0,5;B1<>"a,b");SOMME(A1:A3);0)', 'traduction IF/AND + décimale');
check(T('=XLOOKUP(A2,T[Code],T[Label],"?")', 'en2fr') === '=RECHERCHEX(A2;T[Code];T[Label];"?")', 'références structurées conservées');
check(T("='My Sheet'!A1+SUM('Sheet, 2'!B1:B3)", 'en2fr') === "='My Sheet'!A1+SOMME('Sheet, 2'!B1:B3)", 'noms de feuilles conservés');
check(XL.formula.detect('=SOMME(A1;2,5)') === 'fr' && XL.formula.detect('=SUM(A1,2.5)') === 'en', 'détection de la langue');
check(XL.formula.translate('=FOO(1;2)', 'fr2en').unknown[0] === 'FOO', 'fonction inconnue signalée');

section('Recherche en langage naturel');
const expectTop = {
  'somme si': 'SOMME.SI', 'sumifs': 'SOMME.SI.ENS', 'additionner avec plusieurs conditions': 'SOMME.SI.ENS',
  'trouver une valeur dans un autre tableau': 'RECHERCHEX', 'nb si': 'NB.SI', 'vlookup': 'RECHERCHEV',
  'date du jour': 'AUJOURDHUI', 'dernier jour du mois': 'FIN.MOIS', 'jours ouvrés': 'NB.JOURS.OUVRES',
  'supprimer les doublons': 'UNIQUE', 'enlever les espaces': 'SUPPRESPACE', 'mensualité': 'VPM',
  'mettre en majuscules': 'MAJUSCULE', 'arrondir': 'ARRONDI', 'iferror': 'SIERREUR'
};
Object.entries(expectTop).forEach(([q, want]) => {
  const top = XL.search.search(q, { limit: 3 }).map((r) => r.item.fr || r.item.title);
  check(top.includes(want), 'recherche « ' + q + ' » → attendu ' + want + ' dans le top 3, obtenu : ' + top.join(', '));
});
const expectRecipe = { 'calculer le ttc': 'Passer du HT au TTC', 'rapprochement bancaire': 'Rapprochement bancaire (pointage)', 'balance agee': 'Balance âgée (tranches de retard)', 'échéance 30 jours fin de mois': 'Date d’échéance d’une facture',
  'comptes orphelins': 'Comptes orphelins : présents dans l’AD, absents de la liste RH', 'masque de sous-réseau': 'Masque de sous-réseau à partir du préfixe CIDR',
  'adresse mac': 'Normaliser une adresse MAC', 'lastlogontimestamp': 'Convertir lastLogonTimestamp / pwdLastSet (Active Directory) en date',
  'comparer deux listes': 'Rapprocher deux listes : dans les deux, seulement A, seulement B', 'inventaire materiel cmdb': 'Inventaire physique ↔ CMDB (GLPI, Intune, SCCM…)',
  'timestamp unix': 'Convertir un timestamp Unix (epoch) en date', 'capacite raid': 'Capacité utile d’une grappe RAID' };
Object.entries(expectRecipe).forEach(([q, want]) => {
  const top = XL.search.search(q, { limit: 3 }).map((r) => r.item.title || r.item.fr);
  check(top.includes(want), 'recherche « ' + q + ' » → recette attendue « ' + want + ' », obtenu : ' + top.join(' | '));
});

section('Fichiers de l’application');
const sw = fs.readFileSync(path.join(__dirname, '..', 'app', 'sw.js'), 'utf8');
const html = fs.readFileSync(path.join(__dirname, '..', 'app', 'index.html'), 'utf8');
[...html.matchAll(/data-ic="([^"]+)"/g)].forEach((m) => check(!!XL.icon(m[1]), 'icône inconnue dans index.html : ' + m[1]));
const appJs = fs.readFileSync(path.join(__dirname, '..', 'app', 'js', 'app.js'), 'utf8');
[...appJs.matchAll(/ic\('([a-z0-9-]+)'\)/g)].forEach((m) => check(!!XL.icon(m[1]), 'icône inconnue dans app.js : ' + m[1]));
[...html.matchAll(/(?:src|href)="((?:data|js|css|icons)\/[^"]+)"/g)].forEach((m) => {
  check(fs.existsSync(path.join(__dirname, '..', 'app', m[1])), 'fichier manquant : ' + m[1]);
  check(sw.includes("'" + m[1] + "'"), 'fichier absent du cache hors-ligne (sw.js) : ' + m[1]);
});
const pkg = require('../package.json');
check(sw.includes('xlguide-v' + pkg.version), 'version du cache sw.js ≠ package.json (' + pkg.version + ')');
check(fs.readFileSync(path.join(__dirname, '..', 'app', 'js', 'app.js'), 'utf8').includes("APP_VERSION = '" + pkg.version + "'"), 'APP_VERSION ≠ package.json');

console.log('\n' + XL.functions.length + ' fonctions · ' + XL.recipes.length + ' recettes · ' + allFormulas.length + ' formules · ' + XL.errors.length + ' erreurs · ' + XL.shortcuts.length + ' raccourcis');
console.log(failed ? '\n✗ ' + failed + ' échec(s), ' + passed + ' réussite(s)' : '\n✓ ' + passed + ' vérifications réussies');
process.exit(failed ? 1 : 0);
