/* Expose uniquement un marqueur « version bureau » à l'interface (aucun accès Node). */
'use strict';
const { contextBridge } = require('electron');
contextBridge.exposeInMainWorld('xlguideDesktop', { platform: process.platform });
