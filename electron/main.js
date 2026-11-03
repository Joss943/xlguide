/* XLGuide — processus principal Electron (Windows & Linux)
 *
 * Sécurité (liste de contrôle Electron) :
 *  - rendu isolé, sans Node, en bac à sable (contextIsolation, sandbox, nodeIntegration false) ;
 *  - aucune navigation hors de app/index.html, aucune nouvelle fenêtre, aucune <webview> ;
 *  - liens externes ouverts dans le navigateur seulement en https et vers une liste fermée de sites ;
 *  - permissions web refusées, sauf l'écriture dans le presse-papiers (boutons « Copier ») ;
 *  - téléchargements bloqués, correcteur orthographique coupé (aucune connexion au démarrage).
 *  Les fusibles Electron sont réglés dans package.json (build.electronFuses).
 */
'use strict';
const { app, BrowserWindow, Menu, shell, nativeTheme, session } = require('electron');
const path = require('path');
const { pathToFileURL } = require('url');
// Liens publics : même source que l'interface (vérifiée contre package.json par npm test).
const { repoUrl: REPO, siteUrl: SITE } = require('../app/js/config.js');

const INDEX = path.join(__dirname, '..', 'app', 'index.html');
const INDEX_URL = pathToFileURL(INDEX).href;
// Sites que l'application peut ouvrir dans le navigateur : dépôt, site, crédits des icônes.
const EXTERNAL_HOSTS = new Set([new URL(REPO).host, new URL(SITE).host, 'tabler.io']);
const ALLOWED_PERMISSIONS = new Set(['clipboard-sanitized-write']);
let win = null;

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (!win) return;
    if (win.isMinimized()) win.restore();
    win.focus();
  });
}

/** Page de l'application elle-même (le #fragment, qui porte la route, est ignoré). */
function isAppUrl(url) {
  try {
    const u = new URL(url);
    u.hash = '';
    return u.href === INDEX_URL;
  } catch (e) {
    return false;
  }
}

/** Ouvre un lien dans le navigateur par défaut, seulement s'il est sûr (https, site connu, sans identifiants). */
function openExternal(url) {
  let u;
  try { u = new URL(url); } catch (e) { return false; }
  if (u.protocol !== 'https:' || !EXTERNAL_HOSTS.has(u.host) || u.username || u.password) return false;
  shell.openExternal(u.href).catch(() => { /* aucun navigateur disponible */ });
  return true;
}

/** Règles appliquées à tout contenu web créé par l'application. */
function lockWebContents(contents) {
  contents.setWindowOpenHandler(({ url }) => { openExternal(url); return { action: 'deny' }; });
  const stayInApp = (event, url) => {
    const target = (event && event.url) || url;
    if (isAppUrl(target)) return;
    event.preventDefault();
    openExternal(target);
  };
  contents.on('will-navigate', stayInApp);
  contents.on('will-frame-navigate', (event, url) => { if (!isAppUrl((event && event.url) || url)) event.preventDefault(); });
  contents.on('will-redirect', (event, url) => { if (!isAppUrl((event && event.url) || url)) event.preventDefault(); });
  contents.on('will-attach-webview', (event) => event.preventDefault());
}

/** Permissions web : tout est refusé, sauf l'écriture dans le presse-papiers. Aucune connexion réseau implicite. */
function lockSession(ses) {
  // Sans liste de langues, le correcteur orthographique ne télécharge pas de dictionnaire chez Google
  // au démarrage (constaté dans le journal réseau d'Electron 45) ; il est de toute façon inutile ici.
  ses.setSpellCheckerLanguages([]);
  ses.setSpellCheckerEnabled(false);
  ses.setPermissionRequestHandler((contents, permission, callback) => callback(ALLOWED_PERMISSIONS.has(permission)));
  ses.setPermissionCheckHandler((contents, permission) => ALLOWED_PERMISSIONS.has(permission));
  ses.setDevicePermissionHandler(() => false);
  ses.on('will-download', (event) => event.preventDefault());
}

app.on('web-contents-created', (event, contents) => lockWebContents(contents));

function createWindow() {
  win = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 720,
    minHeight: 500,
    title: 'XLGuide',
    icon: path.join(__dirname, '..', 'app', 'icons', 'icon-512.png'),
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#1f2321' : '#ffffff',
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      nodeIntegrationInSubFrames: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      webviewTag: false,
      navigateOnDragDrop: false,
      safeDialogs: true,
      devTools: !app.isPackaged,
      spellcheck: false
    }
  });

  win.once('ready-to-show', () => win.show());
  win.loadFile(INDEX);
  win.on('closed', () => { win = null; });
}

function buildMenu() {
  const template = [
    { label: 'Fichier', submenu: [{ role: 'quit', label: 'Quitter' }] },
    {
      label: 'Édition',
      submenu: [
        { role: 'undo', label: 'Annuler' }, { role: 'redo', label: 'Rétablir' }, { type: 'separator' },
        { role: 'cut', label: 'Couper' }, { role: 'copy', label: 'Copier' }, { role: 'paste', label: 'Coller' },
        { role: 'selectAll', label: 'Tout sélectionner' }
      ]
    },
    {
      label: 'Affichage',
      submenu: [
        { role: 'reload', label: 'Recharger' }, { type: 'separator' },
        { role: 'resetZoom', label: 'Taille réelle' }, { role: 'zoomIn', label: 'Zoom avant' }, { role: 'zoomOut', label: 'Zoom arrière' },
        { type: 'separator' }, { role: 'togglefullscreen', label: 'Plein écran' }
      ]
    },
    {
      label: 'Aide',
      submenu: [
        { label: 'Site web de XLGuide', click: () => openExternal(SITE) },
        { label: 'Code source (GitHub)', click: () => openExternal(REPO) },
        { label: 'Vérifier les mises à jour', click: () => openExternal(REPO + '/releases/latest') },
        { label: 'Signaler un problème', click: () => openExternal(REPO + '/issues/new') },
        { type: 'separator' },
        { role: 'about', label: 'À propos de XLGuide' }
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.setAboutPanelOptions({
  applicationName: 'XLGuide',
  applicationVersion: app.getVersion(),
  copyright: 'Licence MIT',
  website: SITE
});

app.whenReady().then(() => {
  lockSession(session.defaultSession);
  buildMenu();
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

// Exposé pour les tests (tests/security.test.js), sans effet dans l'application.
module.exports = { isAppUrl, openExternal, EXTERNAL_HOSTS, ALLOWED_PERMISSIONS };
