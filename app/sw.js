/* XLGuide — service worker : fonctionnement hors-ligne de la version web */
var CACHE = 'xlguide-v1.5.1';
// Doit lister tout ce que charge index.html, polices des feuilles de style comprises (vérifié par npm test).
var FILES = ['./', 'index.html', 'css/app.css', 'css/parcours.css', 'manifest.webmanifest', 'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png',
  'fonts/atkinson-hyperlegible-next.woff2', 'fonts/atkinson-hyperlegible-mono.woff2',
  'data/core.js', 'data/fn-logique-recherche.js', 'data/fn-math-stats.js', 'data/fn-texte-date.js',
  'data/recipes.js', 'data/misc.js', 'data/parcours.js',
  'data/notions/saisir.js', 'data/notions/calculer.js', 'data/notions/organiser.js', 'data/notions/presenter.js', 'data/samples.js',
  'js/config.js', 'js/icons.js', 'js/formula.js', 'js/search.js', 'js/core/store.js', 'js/core/model.js', 'js/core/progress.js',
  'js/views/ui.js', 'js/views/home.js', 'js/views/lists.js', 'js/views/sheets.js', 'js/views/tools.js', 'js/app.js'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
// Réseau d'abord (contenu toujours à jour), cache en secours hors-ligne
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(function (r) {
    if (r.ok && r.type === 'basic') { var copy = r.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, copy); }); }
    return r;
  }).catch(function () { return caches.match(e.request, { ignoreSearch: true }).then(function (m) { return m || caches.match('index.html'); }); }));
});
