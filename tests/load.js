/* Charge la base XLGuide dans un contexte Node isolé (même ordre que index.html). */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

module.exports = function load() {
  const root = path.join(__dirname, '..', 'app');
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1]).filter((s) => !/app\.js$/.test(s));
  const ctx = { console };
  ctx.window = ctx;
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  for (const s of scripts) vm.runInContext(fs.readFileSync(path.join(root, s), 'utf8'), ctx, { filename: s });
  return ctx.XL;
};
