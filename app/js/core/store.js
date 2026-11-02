/*
 * Stockage local (favoris, version d'Excel, thème, dernière formule traduite).
 * Les clés « xlguide.* » sont conservées d'une version à l'autre : ne pas les renommer.
 * Toute erreur (navigation privée, stockage plein, file://) est ignorée.
 */
(function (g) {
  'use strict';
  var XL = (g.XL = g.XL || {});
  var PREFIX = 'xlguide.';
  XL.store = {
    get: function (key, fallback) {
      try {
        var v = g.localStorage.getItem(PREFIX + key);
        return v === null ? fallback : JSON.parse(v);
      } catch (e) { return fallback; }
    },
    set: function (key, value) {
      try { g.localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch (e) { /* stockage indisponible */ }
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
