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
let html = fs.readFileSync(path.join(out, 'index.html'), 'utf8');
html = html.replace(/(<b id="nNt">)[^<]*/, '$1' + XL.notions.length)
  .replace(/(<b id="nFn">)[^<]*/, '$1' + XL.functions.length)
  .replace(/(<b id="nEx">)[^<]*/, '$1' + nEx)
  .replace(/(<b id="nCa">)[^<]*/, '$1' + XL.recipes.length)
  // Icônes Tabler intégrées directement dans la page (pas d'attente du JavaScript)
  .replace(/<i data-ic="([a-z0-9-]+)"><\/i>/g, (m, n) => { const svg = XL.icon(n); if (!svg) throw new Error('Icône inconnue : ' + n); return svg; });
fs.writeFileSync(path.join(out, 'index.html'), html);
console.log('Site généré dans _site/ (' + XL.notions.length + ' notions, ' + XL.functions.length + ' fonctions, ' + XL.recipes.length + ' cas pratiques, ' + nEx + ' formules)');
