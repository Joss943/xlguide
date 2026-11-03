/*
 * Configuration : version et liens publics, en un seul endroit.
 * Utilisée par l'interface (script classique) et par Electron (require) ;
 * les tests vérifient qu'elle correspond à package.json (version, homepage, repository).
 */
(function (g) {
  'use strict';
  var XL = (g.XL = g.XL || {});
  XL.config = {
    version: '1.5.0',
    repoUrl: 'https://github.com/Joss943/xlguide',
    siteUrl: 'https://joss943.github.io/xlguide/'
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = XL.config;
})(typeof window !== 'undefined' ? window : globalThis);
