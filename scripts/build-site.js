/* Assemble le site GitHub Pages dans _site/ : page d'accueil + application web (/app) + scripts d'installation. */
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const out = path.join(root, '_site');
fs.rmSync(out, { recursive: true, force: true });
fs.cpSync(path.join(root, 'site'), out, { recursive: true });
fs.cpSync(path.join(root, 'app'), path.join(out, 'app'), { recursive: true });
fs.writeFileSync(path.join(out, '.nojekyll'), '');
// Chiffres à jour sur la page d'accueil
const XL = require(path.join(root, 'tests', 'load.js'))();
const sampleFormulas = (s) => (s ? (s.fill ? 1 : 0) + (s.calc || []).length : 0);
const nEx = XL.functions.reduce((n, f) => n + f.ex.length, 0) + XL.recipes.reduce((n, r) => n + r.steps.length, 0) +
  XL.notions.reduce((n, x) => n + x.examples.length + sampleFormulas(x.sample), 0) +
  Object.keys(XL.samples).reduce((n, k) => n + sampleFormulas(XL.samples[k]), 0);
// Tableau du parcours : pour chaque activité et chaque niveau, les notions dans l'ordre de lecture
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const rows = XL.activities.map((a) => '<tr><th scope="row">' + esc(a.label) + '</th>' + XL.levelDefs.map((l) => {
  const ns = XL.notions.filter((n) => n.activity === a.id && n.level === l.id);
  return '<td data-level="' + esc(l.label) + '"><ol>' + ns.map((n) => '<li>' + esc(n.title) + '</li>').join('') + '</ol></td>';
}).join('') + '</tr>').join('\n');
let html = fs.readFileSync(path.join(out, 'index.html'), 'utf8');
if (!/<tbody id="parcours-rows">[\s\S]*?<\/tbody>/.test(html)) throw new Error('site/index.html : tableau du parcours introuvable');
html = html.replace(/(<tbody id="parcours-rows">)[\s\S]*?(<\/tbody>)/, '$1\n' + rows + '\n$2')
  .replace(/(<b id="nAc">)[^<]*/, '$1' + XL.activities.length)
  .replace(/(<b id="nNt">)[^<]*/, '$1' + XL.notions.length)
  .replace(/(<b id="nFn">)[^<]*/, '$1' + XL.functions.length)
  .replace(/(<b id="nEx">)[^<]*/, '$1' + nEx)
  // Icônes Tabler intégrées directement dans la page (pas d'attente du JavaScript)
  .replace(/<i data-ic="([a-z0-9-]+)"><\/i>/g, (m, n) => { const svg = XL.icon(n); if (!svg) throw new Error('Icône inconnue : ' + n); return svg; });
fs.writeFileSync(path.join(out, 'index.html'), html);
console.log('Site généré dans _site/ (' + XL.notions.length + ' notions, ' + XL.functions.length + ' fonctions, ' + XL.recipes.length + ' méthodes, ' + nEx + ' formules)');
