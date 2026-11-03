/*
 * Stockage local (favoris, progression, version d'Excel, thème, dernière formule traduite).
 * Les clés « xlguide.* » sont conservées d'une version à l'autre : ne pas les renommer.
 * Toute erreur (navigation privée, stockage plein, file://) est ignorée.
 * Une valeur lue n'est utilisée que si elle passe son contrôle de type : le stockage est partagé
 * avec les autres pages du même domaine (joss943.github.io) et peut être corrompu.
 */
(function (g) {
  'use strict';
  var XL = (g.XL = g.XL || {});
  var PREFIX = 'xlguide.';
  var MAX_ITEMS = 2000, MAX_TEXT = 8192; // 8192 : longueur maximale d'une formule Excel
  function isText(v) { return typeof v === 'string' && v.length <= MAX_TEXT; }
  XL.store = {
    /** Valeur enregistrée, ou fallback si elle est absente, illisible ou refusée par valid(v). */
    get: function (key, fallback, valid) {
      try {
        var raw = g.localStorage.getItem(PREFIX + key);
        if (raw === null) return fallback;
        var v = JSON.parse(raw);
        return !valid || valid(v) ? v : fallback;
      } catch (e) { return fallback; }
    },
    set: function (key, value) {
      try { g.localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch (e) { /* stockage indisponible */ }
    },
    /* Contrôles de type courants */
    isBool: function (v) { return typeof v === 'boolean'; },
    isText: isText,
    isKeyList: function (v) {
      return Array.isArray(v) && v.length <= MAX_ITEMS && v.every(function (k) { return typeof k === 'string' && k.length <= 200; });
    },
    isOneOf: function (list) { return function (v) { return list.indexOf(v) >= 0; }; }
  };
})(typeof window !== 'undefined' ? window : globalThis);
