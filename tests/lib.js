/* XLGuide — mini-outillage de test commun (aucune dépendance). */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const counts = { passed: 0, failed: 0 };

function check(cond, msg) {
  if (cond) counts.passed++;
  else { counts.failed++; console.error('  ✗ ' + msg); }
}
function section(title) { console.log('\n▶ ' + title); }
function read(rel) { return fs.readFileSync(path.join(ROOT, rel), 'utf8'); }
function exists(rel) { return fs.existsSync(path.join(ROOT, rel)); }

/** Parenthèses et guillemets équilibrés dans une formule (hors chaînes). */
function balancedFormula(f) {
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

/** Balises HTML équilibrées (éléments vides exclus). Renvoie '' ou la description du premier problème. */
const VOID = new Set(['br', 'hr', 'img', 'input', 'meta', 'link', 'source', 'col', 'wbr', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse']);
function htmlProblem(html) {
  const stack = [];
  const re = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*?(\/?)>/g;
  let m;
  while ((m = re.exec(html))) {
    const name = m[2].toLowerCase();
    if (m[3] === '/' || VOID.has(name)) continue;
    if (!m[1]) { stack.push(name); continue; }
    const open = stack.pop();
    if (open !== name) return 'fermeture </' + name + '> inattendue (ouvert : <' + open + '>) vers « …' + html.slice(Math.max(0, m.index - 60), m.index + 10) + '… »';
  }
  return stack.length ? 'balise(s) non fermée(s) : ' + stack.join(', ') : '';
}

module.exports = { ROOT, counts, check, section, read, exists, balancedFormula, htmlProblem };
