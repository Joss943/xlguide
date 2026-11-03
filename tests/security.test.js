/*
 * Sécurité : processus principal Electron (avec un module « electron » simulé), politiques de sécurité
 * du contenu, contrôle du stockage local, site, scripts d'installation, workflows et fusibles.
 */
'use strict';
const Module = require('module');
const path = require('path');
const vm = require('vm');
const { pathToFileURL } = require('url');
const { ROOT, check, section, read } = require('./lib');

/* ------------------------- Electron : module simulé ------------------------- */
function loadMain() {
  const rec = { app: {}, windows: [], opened: [], session: {} };
  function emitter(store) { return (ev, fn) => { store[ev] = fn; }; }
  function fakeContents() {
    const c = { handlers: {}, windowOpen: null };
    c.on = emitter(c.handlers);
    c.setWindowOpenHandler = (fn) => { c.windowOpen = fn; };
    return c;
  }
  function BrowserWindow(opts) {
    rec.windows.push(opts);
    this.webContents = fakeContents();
    this.once = () => {};
    this.on = () => {};
    this.loadFile = (f) => { rec.loaded = f; };
  }
  BrowserWindow.getAllWindows = () => [];
  const electron = {
    app: {
      on: emitter(rec.app), requestSingleInstanceLock: () => true, quit() {}, setAboutPanelOptions() {},
      getVersion: () => '0.0.0', isPackaged: true, whenReady: () => ({ then(fn) { rec.ready = fn; } })
    },
    BrowserWindow,
    Menu: { setApplicationMenu() {}, buildFromTemplate: (t) => t },
    shell: { openExternal: (u) => { rec.opened.push(u); return Promise.resolve(); } },
    nativeTheme: { shouldUseDarkColors: false },
    session: {
      defaultSession: {
        setPermissionRequestHandler: (fn) => { rec.session.request = fn; },
        setPermissionCheckHandler: (fn) => { rec.session.check = fn; },
        setDevicePermissionHandler: (fn) => { rec.session.device = fn; },
        setSpellCheckerLanguages: (l) => { rec.session.languages = l; },
        setSpellCheckerEnabled: (v) => { rec.session.spellcheck = v; },
        on: (ev, fn) => { rec.session[ev] = fn; }
      }
    }
  };
  const original = Module._load;
  Module._load = function (request) { return request === 'electron' ? electron : original.apply(this, arguments); };
  try {
    const file = require.resolve(path.join(ROOT, 'electron', 'main.js'));
    delete require.cache[file];
    rec.exports = require(file);
  } finally {
    Module._load = original;
  }
  rec.makeContents = fakeContents;
  return rec;
}

function electronChecks() {
  section('Sécurité : application de bureau (Electron)');
  const rec = loadMain();
  check(typeof rec.ready === 'function', 'main.js : démarrage attendu dans app.whenReady()');
  rec.ready();
  const win = rec.windows[0] || {};
  const wp = win.webPreferences || {};
  check(wp.contextIsolation === true && wp.sandbox === true && wp.nodeIntegration === false, 'fenêtre : contextIsolation, sandbox et nodeIntegration: false obligatoires');
  check(wp.webSecurity !== false && !wp.allowRunningInsecureContent && wp.webviewTag === false && !wp.experimentalFeatures && !wp.enableBlinkFeatures,
    'fenêtre : webSecurity actif, contenu non sécurisé, webview et fonctions expérimentales interdits');
  check(wp.nodeIntegrationInSubFrames === false && wp.navigateOnDragDrop === false, 'fenêtre : pas de Node dans les cadres, pas de navigation par glisser-déposer');
  check(wp.devTools === false, 'fenêtre : outils de développement fermés dans l’application empaquetée');
  const index = path.join(ROOT, 'app', 'index.html');
  check(rec.loaded === index, 'fenêtre : charge app/index.html');

  // Tout contenu web créé reçoit les mêmes règles
  check(typeof rec.app['web-contents-created'] === 'function', 'règles appliquées à tout contenu web (web-contents-created)');
  const c = rec.makeContents();
  rec.app['web-contents-created']({}, c);
  const INDEX_URL = pathToFileURL(index).href;
  function nav(event, url) {
    let prevented = false;
    rec.handlers = c.handlers;
    c.handlers[event]({ url, preventDefault() { prevented = true; } }, url);
    return prevented;
  }
  check(!nav('will-navigate', INDEX_URL + '#/a/calculer/expert'), 'navigation interne (#…) autorisée');
  check(nav('will-navigate', 'file:///etc/passwd'), 'navigation vers un autre fichier local bloquée');
  check(nav('will-navigate', 'https://github.com/Joss943/xlguide'), 'navigation vers le web bloquée dans la fenêtre');
  check(nav('will-frame-navigate', 'https://exemple.fr/'), 'navigation d’un cadre vers le web bloquée');
  check(nav('will-redirect', 'https://exemple.fr/'), 'redirection hors de l’application bloquée');
  check(nav('will-attach-webview', ''), '<webview> refusée');

  // Nouvelles fenêtres : toujours refusées ; liens sûrs ouverts dans le navigateur, les autres ignorés
  rec.opened.length = 0;
  const urls = ['https://github.com/Joss943/xlguide/releases/latest', 'https://joss943.github.io/xlguide/', 'https://tabler.io/icons',
    'http://github.com/Joss943/xlguide', 'https://exemple.fr/', 'file:///etc/passwd', 'javascript:alert(1)', 'https://user:mdp@github.com/',
    'https://github.com.exemple.fr/', 'smb://serveur/partage'];
  const denied = urls.every((url) => c.windowOpen({ url }).action === 'deny');
  check(denied, 'window.open : toujours refusé (aucune nouvelle fenêtre Electron)');
  check(rec.opened.join(' ') === urls.slice(0, 3).join(' '), 'liens externes : seuls les sites autorisés en https sont ouverts (' + rec.opened.join(', ') + ')');

  // Permissions et téléchargements
  const s = rec.session;
  const ask = (p) => { let r; s.request({}, p, (v) => { r = v; }); return r; };
  check(['media', 'geolocation', 'notifications', 'midi', 'openExternal', 'pointerLock', 'fullscreen', 'clipboard-read'].every((p) => ask(p) === false),
    'permissions web refusées (caméra, micro, géolocalisation, notifications…)');
  check(ask('clipboard-sanitized-write') === true && s.check({}, 'clipboard-sanitized-write') === true, 'écriture dans le presse-papiers autorisée (boutons « Copier »)');
  check(s.check({}, 'geolocation') === false && s.device({ deviceType: 'usb' }) === false, 'vérifications de permission et périphériques refusées');
  let dl = false;
  s['will-download']({ preventDefault() { dl = true; } });
  check(dl, 'téléchargements bloqués');
  check(Array.isArray(s.languages) && s.languages.length === 0 && s.spellcheck === false, 'aucune connexion au démarrage : pas de dictionnaire orthographique téléchargé');

  const preload = read('electron/preload.js');
  check(/exposeInMainWorld\('xlguideDesktop', \{ platform: process\.platform \}\)/.test(preload) && !/ipcRenderer|require\('(fs|child_process|path)'\)|shell/.test(preload),
    'preload : n’expose qu’un marqueur, ni IPC ni module Node');

  const fuses = (require(path.join(ROOT, 'package.json')).build || {}).electronFuses || {};
  check(fuses.runAsNode === false && fuses.enableNodeOptionsEnvironmentVariable === false && fuses.enableNodeCliInspectArguments === false &&
    fuses.onlyLoadAppFromAsar === true, 'fusibles Electron : RunAsNode, NODE_OPTIONS, --inspect désactivés ; code chargé seulement depuis app.asar');
}

/* ------------------------------ politiques CSP ------------------------------ */
function csp(html) {
  const m = html.match(/<meta http-equiv="Content-Security-Policy" content="([^"]+)">/);
  const d = {};
  if (m) m[1].split(';').forEach((part) => { const t = part.trim().split(/\s+/); if (t[0]) d[t[0]] = t.slice(1); });
  return d;
}
function cspChecks(file, extra) {
  const d = csp(read(file));
  check(Object.keys(d).length > 0, file + ' : politique de sécurité du contenu absente');
  const all = Object.values(d).flat();
  check(!all.some((v) => /unsafe-|^\*$|^https?:$|^data:$|^blob:$/.test(v.replace(/'/g, ''))), file + ' : CSP sans unsafe-*, joker, data: ni blob:');
  check(String(d['default-src']) === "'self'" && String(d['script-src']) === "'self'" && String(d['style-src']) === "'self'", file + ' : scripts et styles du site uniquement');
  check(String(d['object-src']) === "'none'" && String(d['frame-src']) === "'none'" && String(d['base-uri']) === "'none'" && String(d['form-action']) === "'none'",
    file + ' : ni plugin, ni cadre, ni <base>, ni envoi de formulaire');
  if (extra) extra(d);
}

/* ------------------------------ stockage local ------------------------------ */
function storeChecks() {
  section('Sécurité : version web et site');
  cspChecks('app/index.html', (d) => check(String(d['connect-src']) === "'self'", 'app/index.html : aucune connexion vers un autre site'));
  cspChecks('site/index.html', (d) => check(String(d['connect-src']) === 'https://api.github.com', 'site/index.html : seule l’API GitHub est appelée'));
  check(/<meta name="referrer" content="no-referrer">/.test(read('app/index.html')), 'app/index.html : aucun référent transmis aux sites externes');

  const data = {};
  const ctx = { localStorage: { getItem: (k) => (k in data ? data[k] : null), setItem: (k, v) => { data[k] = String(v); } } };
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(read('app/js/core/store.js'), ctx);
  const S = ctx.XL.store;
  data['xlguide.favs'] = '"pas une liste"';
  data['xlguide.done'] = '[1,2]';
  data['xlguide.big'] = '"oui"';
  data['xlguide.theme'] = '"<img src=x>"';
  data['xlguide.tr'] = JSON.stringify('x'.repeat(9000));
  data['xlguide.last'] = '{';
  check(S.get('favs', [], S.isKeyList).length === 0 && S.get('done', [], S.isKeyList).length === 0, 'stockage : une liste corrompue est ignorée');
  check(S.get('big', false, S.isBool) === false && S.get('theme', 'auto', S.isOneOf(['auto', 'light', 'dark'])) === 'auto', 'stockage : un réglage d’un mauvais type est ignoré');
  check(S.get('tr', '', S.isText) === '' && S.get('last', '', S.isText) === '', 'stockage : texte trop long ou JSON illisible ignoré');
  S.set('favs', ['f:SOMME', 'n:figer-les-volets']);
  check(S.get('favs', [], S.isKeyList).length === 2, 'stockage : une valeur valide est relue');

  const app = read('app/js/app.js');
  check(/function hashPath\(\)[\s\S]*?try \{ return decodeURIComponent/.test(app), 'routage : une adresse mal encodée ne bloque pas l’application');
  check(!/XL\.store\.get\(/.test(app), 'app.js : toute valeur relue du stockage passe par un contrôle de type');
  const site = read('site/site.js');
  check(!/\.innerHTML\s*=/.test(site) && /textContent/.test(site), 'site.js : la réponse de l’API GitHub est insérée en texte, jamais en HTML');
  check(/r\.ok && r\.type === 'basic'/.test(read('app/sw.js')), 'service worker : seules les réponses réussies du site sont mises en cache');
}

/* ------------------------ installation et chaîne CI/CD ------------------------ */
function supplyChainChecks() {
  section('Sécurité : installation et chaîne de publication');
  const sh = read('site/install.sh');
  check(/set -euo pipefail/.test(sh) && /\nmain "\$@"\n?$/.test(sh), 'install.sh : arrêt à la première erreur, exécuté seulement une fois lu en entier');
  check(/--proto '=https'/.test(sh) && /--https-only/.test(sh), 'install.sh : téléchargements en https uniquement, redirections comprises');
  check(/fetch_verified/.test(sh) && /SHA256SUMS\.txt/.test(sh) && (sh.match(/fetch_verified "/g) || []).length >= 5, 'install.sh : chaque paquet vérifié (SHA-256) avant installation');
  check(/mktemp -d/.test(sh) && !/\/tmp\/xlguide/.test(sh), 'install.sh : dossier temporaire privé, aucun chemin prévisible');
  const ps = read('site/install.ps1');
  check(/Get-FileHash/.test(ps) && /SHA256SUMS\.txt/.test(ps) && /NewGuid/.test(ps) && /finally/.test(ps), 'install.ps1 : somme SHA-256 vérifiée, fichier temporaire unique, nettoyage garanti');
  // Les deux scripts sont exécutés avec des téléchargements simulés (tests/install-*.test.*) avant chaque publication du site
  const ciWf = read('.github/workflows/ci.yml'), pagesWf = read('.github/workflows/pages.yml');
  check([ciWf, pagesWf].every((y) => y.includes('bash tests/install-sh.test.sh') && y.includes('pwsh -NoProfile -File tests/install-ps1.test.ps1')) &&
    ciWf.includes('powershell -NoProfile -ExecutionPolicy Bypass -File tests/install-ps1.test.ps1'),
    'CI et site : vérification SHA-256 des scripts d’installation exécutée (bash, PowerShell 7 et 5.1)');
  const pages = [read('site/index.html'), read('README.md')].join('\n');
  check(!/\/tmp\/xlguide|sudo dnf install -y https:/.test(pages) && (pages.match(/sha256sum -c --ignore-missing/g) || []).length >= 8,
    'commandes manuelles (site et README) : somme vérifiée, aucun chemin prévisible');

  const wf = ['ci.yml', 'release.yml', 'pages.yml'].map((f) => [f, read('.github/workflows/' + f)]);
  wf.forEach(([f, y]) => {
    const uses = [...y.matchAll(/uses:\s*([^\s#]+)/g)].map((m) => m[1]);
    check(uses.length > 0 && uses.every((u) => /@[0-9a-f]{40}$/.test(u)), f + ' : actions épinglées par empreinte de commit');
    check(/^permissions:\n {2}contents: read$/m.test(y), f + ' : jeton en lecture seule par défaut');
    const checkouts = (y.match(/uses: actions\/checkout@/g) || []).length;
    check(checkouts === (y.match(/persist-credentials: false/g) || []).length, f + ' : jeton jamais laissé dans le dépôt cloné (persist-credentials: false)');
    check(!/\$\{\{\s*github\.event\.(head_commit|pull_request|issue|comment)/.test(y), f + ' : aucune donnée d’événement injectée dans un script');
  });
  const rel = read('.github/workflows/release.yml');
  const publish = rel.slice(rel.indexOf('  publish:'));
  check((rel.match(/contents: write/g) || []).length === 1 && /contents: write/.test(publish), 'release.yml : seul le job de publication peut écrire');
  check(/id-token: write/.test(publish) && /attestations: write/.test(publish) && /uses: actions\/attest@/.test(publish), 'release.yml : attestation de provenance signée des fichiers publiés');
  check(/\^\[0-9\]\+\\\.\[0-9\]\+\\\.\[0-9\]\+\$/.test(rel), 'release.yml : numéro de version contrôlé avant usage');
  check(/package-ecosystem: npm/.test(read('.github/dependabot.yml')) && /package-ecosystem: github-actions/.test(read('.github/dependabot.yml')),
    'Dependabot : dépendances npm et actions suivies');
}

module.exports = function () {
  electronChecks();
  storeChecks();
  supplyChainChecks();
};
