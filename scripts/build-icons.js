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
  'search', 'moon', 'sun', 'star', 'filled:star', 'copy', 'arrow-left', 'bulb', 'alert-triangle', 'alert-circle', 'download',
  'brand-github', 'keyboard', 'arrows-left-right', 'home', 'math-function', 'book', 'clipboard-list', 'x', 'check',
  'external-link', 'refresh', 'world', 'package', 'terminal-2', 'shield-check', 'bolt', 'language', 'tag', 'chevron-right',
  // catégories de fonctions
  'arrows-split-2', 'table', 'calculator', 'chart-bar', 'typography', 'calendar', 'coin-euro', 'info-circle', 'database',
  'binary', 'list-search',
  // recettes compta
  'receipt-tax', 'building-bank', 'building-factory-2', 'file-invoice', 'credit-card', 'checklist', 'chart-line',
  'file-import', 'calendar-event', 'clock-hour-4',
  // volet informatique
  'network', 'server', 'server-2', 'device-desktop', 'devices-pc', 'users', 'user-check', 'activity-heartbeat',
  'git-compare', 'router', 'device-floppy', 'id-badge-2', 'topology-star-3', 'cpu',
  // systèmes
  'brand-windows', 'brand-ubuntu', 'brand-debian', 'brand-redhat', 'brand-apple'
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
