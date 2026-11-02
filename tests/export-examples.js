/* Exporte en JSON les exemples dont le résultat attendu est renseigné (pour verify_libreoffice.py). */
'use strict';
const XL = require('./load')();
const since = {};
XL.functions.forEach((f) => { since[f.en] = f.since; });
const rows = [];
function add(where, ex) {
  if (ex.length < 3 || !ex[0].startsWith('=')) return;
  const en = XL.formula.translate(ex[0], 'fr2en').result;
  // Les fonctions apparues après Excel 2007 sont stockées avec le préfixe _xlfn. dans un .xlsx
  const file = en.replace(/\b([A-Z][A-Z0-9.]*)\(/g, (m, n) => (since[n] ? '_xlfn.' + n + '(' : m));
  rows.push({ where, fr: ex[0], en, file, expected: ex[2], since: XL.formula.functionsUsed(ex[0]).map((n) => (XL.functions.find((f) => f.fr === n) || {}).since || '') });
}
XL.functions.forEach((f) => f.ex.forEach((e) => add(f.fr, e)));
XL.recipes.forEach((r) => r.steps.forEach((e) => add(r.title, e)));
process.stdout.write(JSON.stringify(rows, null, 1));
