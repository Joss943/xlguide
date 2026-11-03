/*
 * Exporte en JSON tout ce qui doit être recalculé par LibreOffice (tests/verify_libreoffice.py) :
 *  - les exemples à résultat attendu (fonctions, recettes, notions) ;
 *  - les mini-tableaux (données + formules recopiées + calculs).
 */
'use strict';
const XL = require('./load')();

const since = {};
XL.functions.forEach((f) => { since[f.en] = f.since; });
const sinceFr = {};
XL.functions.forEach((f) => { sinceFr[f.fr] = f.since; });

function toEn(fr) {
  const en = XL.formula.translate(fr, 'fr2en').result;
  // Les fonctions apparues après Excel 2007 sont stockées avec le préfixe _xlfn. dans un .xlsx
  const file = en.replace(/\b([A-Z][A-Z0-9.]*)\(/g, (m, n) => (since[n] ? '_xlfn.' + n + '(' : m));
  return { en, file };
}
function versionsUsed(fr) { return XL.formula.functionsUsed(fr).map((n) => sinceFr[n] || ''); }

const rows = [];
function addExample(where, ex) {
  if (ex.length < 3 || !ex[0].startsWith('=')) return;
  rows.push(Object.assign({ kind: 'ex', where, fr: ex[0], expected: ex[2], since: versionsUsed(ex[0]) }, toEn(ex[0])));
}
function addSample(where, s) {
  if (!s.fill && !(s.calc || []).length) return; // sélection ou illustration seule : rien à recalculer
  const out = { kind: 'sample', where, cols: s.cols, rows: s.rows, fill: null, calc: [] };
  if (s.fill) {
    out.fill = {
      fr: s.fill.formula,
      cells: s.rows.map((_, i) => {
        const fr = XL.formula.shiftRows(s.fill.formula, i);
        return Object.assign({ fr, expected: s.fill.results[i], since: versionsUsed(fr) }, toEn(fr));
      })
    };
  }
  (s.calc || []).forEach((c) => out.calc.push(Object.assign({ label: c[0], fr: c[1], expected: c[2], since: versionsUsed(c[1]) }, toEn(c[1]))));
  rows.push(out);
}

XL.functions.forEach((f) => f.ex.forEach((e) => addExample(f.fr, e)));
XL.recipes.forEach((r) => r.steps.forEach((e) => addExample(r.title, e)));
XL.notions.forEach((n) => n.examples.forEach((e) => addExample('Notion : ' + n.title, e)));
XL.notions.forEach((n) => { if (n.sample) addSample('Notion : ' + n.title, n.sample); });
Object.keys(XL.samples).forEach((k) => addSample('Mini-tableau ' + k, XL.samples[k]));

process.stdout.write(JSON.stringify(rows, null, 1));
