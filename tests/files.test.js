/* Fichiers : ressources chargées, cache hors-ligne, versions et liens cohérents, icônes, règles CSP. */
'use strict';
const fs = require('fs');
const path = require('path');
const { ROOT, check, section, read, exists } = require('./lib');

module.exports = function (XL) {
  const pkg = require(path.join(ROOT, 'package.json'));
  const html = read('app/index.html');
  const sw = read('app/sw.js');

  section('Ressources de index.html et cache hors-ligne');
  const assets = [...html.matchAll(/(?:src|href)="((?:data|js|css|icons)\/[^"]+)"/g)].map((x) => x[1]);
  check(assets.length > 20, 'index.html : ressources introuvables');
  assets.forEach((a) => {
    check(exists('app/' + a), 'fichier manquant : ' + a);
    check(sw.includes("'" + a + "'"), 'fichier absent du cache hors-ligne (sw.js) : ' + a);
  });
  // Ressources appelées par les feuilles de style (polices) : présentes et disponibles hors-ligne
  ['css/app.css', 'css/parcours.css'].forEach((css) => {
    for (const x of read('app/' + css).matchAll(/url\("?\.\.\/([^")]+)"?\)/g)) {
      check(exists('app/' + x[1]), css + ' : fichier manquant ' + x[1]);
      check(sw.includes("'" + x[1] + "'"), css + ' : ' + x[1] + ' absent du cache hors-ligne (sw.js)');
    }
  });
  check(exists('app/fonts/OFL.txt'), 'licence des polices (app/fonts/OFL.txt) manquante');
  const cached = [...sw.match(/var FILES = \[([^\]]*)\]/)[1].matchAll(/'([^']+)'/g)].map((x) => x[1]).filter((f) => f !== './');
  cached.forEach((f) => check(exists('app/' + f), 'sw.js met en cache un fichier inexistant : ' + f));
  check(!/<script>|<style>|\sstyle=|\son[a-z]+=/i.test(html), 'index.html : script ou style en ligne (bloqué par la CSP)');
  const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((x) => x[1]);
  check(scripts[scripts.length - 1] === 'js/app.js' && scripts.indexOf('js/core/model.js') > scripts.indexOf('js/search.js') &&
    scripts.indexOf('js/config.js') < scripts.indexOf('js/views/ui.js'), 'index.html : ordre de chargement (config et recherche avant le modèle, contrôleur en dernier)');

  section('Versions et liens');
  check(sw.includes("'xlguide-v" + pkg.version + "'"), 'version du cache sw.js ≠ package.json (' + pkg.version + ')');
  check(XL.config.version === pkg.version, 'js/config.js : version ≠ package.json');
  const lock = require(path.join(ROOT, 'package-lock.json'));
  check(lock.version === pkg.version && lock.packages[''].version === pkg.version, 'package-lock.json : version ≠ package.json (npm install --package-lock-only)');
  check(XL.config.siteUrl === pkg.homepage, 'js/config.js : siteUrl ≠ homepage de package.json');
  check(XL.config.repoUrl + '.git' === pkg.repository.url, 'js/config.js : repoUrl ≠ repository de package.json');
  const main = read('electron/main.js');
  check(main.includes("require('../app/js/config.js')") && !/['"`]https?:\/\//.test(main), 'electron/main.js : liens à lire dans app/js/config.js, pas en dur');

  section('Icônes');
  const sources = ['app/index.html', 'app/js/app.js'].concat(fs.readdirSync(path.join(ROOT, 'app/js/views')).map((f) => 'app/js/views/' + f));
  sources.forEach((file) => {
    const src = read(file);
    for (const x of src.matchAll(/data-ic="([a-z0-9-]+)"|\bic\('([a-z0-9-]+)'/g)) {
      const name = x[1] || x[2];
      check(!!XL.icon(name), 'icône inconnue dans ' + file + ' : ' + name);
    }
  });
};
