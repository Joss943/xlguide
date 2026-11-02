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
const nEx = XL.functions.reduce((n, f) => n + f.ex.length, 0) + XL.recipes.reduce((n, r) => n + r.steps.length, 0);
let html = fs.readFileSync(path.join(out, 'index.html'), 'utf8');
const dom = {};
XL.recipeCategories.forEach((c) => { dom[c.id] = c.domain; });
const nRx = XL.recipes.filter((r) => dom[r.cat] === 'compta').length;
const nIt = XL.recipes.filter((r) => dom[r.cat] === 'it').length;
html = html.replace(/(<b id="nFn">)[^<]*/, '$1' + XL.functions.length)
  .replace(/(<b id="nRx">)[^<]*/, '$1' + nRx)
  .replace(/(<b id="nIt">)[^<]*/, '$1' + nIt)
  .replace(/(<b id="nEx">)[^<]*/, '$1' + nEx)
  // Icônes Tabler intégrées directement dans la page (pas d'attente du JavaScript)
  .replace(/<i data-ic="([a-z0-9-]+)"><\/i>/g, (m, n) => { const svg = XL.icon(n); if (!svg) throw new Error('Icône inconnue : ' + n); return svg; });
fs.writeFileSync(path.join(out, 'index.html'), html);
console.log('Site généré dans _site/ (' + XL.functions.length + ' fonctions, ' + XL.recipes.length + ' recettes, ' + nEx + ' formules)');
