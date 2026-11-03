/* XLGuide — processus principal Electron (Windows & Linux) */
'use strict';
const { app, BrowserWindow, Menu, shell, nativeTheme } = require('electron');
const path = require('path');
// Liens publics : même source que l'interface (vérifiée contre package.json par npm test).
const { repoUrl: REPO, siteUrl: SITE } = require('../app/js/config.js');
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

function openExternal(url) {
  if (/^https:\/\//i.test(url)) shell.openExternal(url);
}

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
      sandbox: true,
      spellcheck: false
    }
  });

  win.once('ready-to-show', () => win.show());
  win.loadFile(path.join(__dirname, '..', 'app', 'index.html'));

  // Liens externes => navigateur par défaut ; aucune navigation hors de l'application.
  win.webContents.setWindowOpenHandler(({ url }) => { openExternal(url); return { action: 'deny' }; });
  win.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('file://')) { event.preventDefault(); openExternal(url); }
  });
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
  buildMenu();
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
