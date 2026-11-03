/*
 * Génère app/js/icons.js à partir de Tabler Icons (https://tabler.io/icons, licence MIT).
 * Seules les icônes listées ici sont embarquées (l'application reste légère et hors-ligne).
 *   npm run icons
 */
'use strict';
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'node_modules', '@tabler', 'icons', 'icons');
const ICONS = [
  // interface
  'search', 'moon', 'sun', 'star', 'filled:star', 'copy', 'arrow-left', 'chevron-right', 'download', 'home', 'bolt', 'book',
  'keyboard', 'alert-circle', 'arrows-left-right', 'math-function', 'language', 'world', 'info-circle',
  // progression, concentration, lisibilité
  'check', 'clock', 'player-play', 'arrow-right', 'maximize', 'minimize', 'text-size',
  // activités et thèmes de fonctions
  'pencil', 'calculator', 'filter', 'chart-bar', 'arrows-split-2', 'table', 'typography', 'calendar',
  // site : installation
  'brand-github', 'brand-windows', 'brand-ubuntu', 'brand-debian', 'brand-redhat', 'terminal-2', 'package', 'shield-check'
];

const out = {};
for (const spec of ICONS) {
  const [style, name] = spec.includes(':') ? spec.split(':') : ['outline', spec];
  const file = path.join(SRC, style, name + '.svg');
  if (!fs.existsSync(file)) throw new Error('Icône introuvable : ' + spec);
  const svg = fs.readFileSync(file, 'utf8');
  const inner = svg.slice(svg.indexOf('>', svg.indexOf('<svg')) + 1, svg.lastIndexOf('</svg>'))
    .replace(/<path stroke="none" d="M0 0h24v24H0z" fill="none"\s*\/>/g, '')
    .replace(/\s*\n\s*/g, '').trim();
  out[style === 'filled' ? name + '-filled' : name] = { f: style === 'filled' ? 1 : 0, d: inner };
}

const js = `/* Généré par scripts/build-icons.js — icônes Tabler Icons (MIT, © Paweł Kuna, https://tabler.io/icons). Ne pas modifier à la main. */
(function (g) {
  'use strict';
  var XL = (g.XL = g.XL || {});
  var I = ${JSON.stringify(out)};
  XL.iconNames = Object.keys(I);
  /** Renvoie le SVG d'une icône (classe "ic" + classe optionnelle). */
  XL.icon = function (name, cls) {
    var i = I[name];
    if (!i) return '';
    return '<svg class="ic' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false"' +
      (i.f ? ' fill="currentColor"' : ' fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"') +
      '>' + i.d + '</svg>';
  };
})(typeof window !== 'undefined' ? window : globalThis);
`;
fs.writeFileSync(path.join(__dirname, '..', 'app', 'js', 'icons.js'), js);
console.log(Object.keys(out).length + ' icônes écrites dans app/js/icons.js (' + Math.round(js.length / 1024) + ' Ko)');
