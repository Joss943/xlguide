/*
 * XLGuide — base de données
 * --------------------------------------------------------------
 * Chaque fichier de /app/data alimente l'objet global XL.
 * Format compact pour rester lisible et facile à enrichir.
 *
 * F(fr, en, cat, since, desc, syntaxe, args, exemples, astuces, motsCles, voirAussi)
 *   args      : [['nom', 'description'], ...]   (optionnel => nom entre [crochets])
 *   exemples  : [['=FORMULE', 'explication', attendu?], ...]
 *               attendu (optionnel) = valeur vérifiée par les tests automatiques :
 *               nombre, booléen, texte, ou 'd:AAAA-MM-JJ' pour une date.
 *   since     : '' (toutes versions) | '2010' | '2013' | '2016' | '2019' | '2021' | '2024' | '365'
 *
 * Syntaxe des formules : Excel en français (séparateur « ; », décimale « , »).
 */
(function (g) {
  'use strict';
  var XL = (g.XL = g.XL || {});
  XL.functions = XL.functions || [];
  XL.recipes = XL.recipes || [];
  XL.errors = XL.errors || [];
  XL.shortcuts = XL.shortcuts || [];
  XL.extraNames = XL.extraNames || {};

  // icon = nom d'icône Tabler Icons (voir scripts/build-icons.js)
  XL.categories = [
    { id: 'logique', label: 'Logique', icon: 'arrows-split-2' },
    { id: 'recherche', label: 'Recherche & références', icon: 'search' },
    { id: 'tableaux', label: 'Tableaux dynamiques', icon: 'table' },
    { id: 'math', label: 'Maths & arrondis', icon: 'calculator' },
    { id: 'stats', label: 'Statistiques & comptage', icon: 'chart-bar' },
    { id: 'texte', label: 'Texte', icon: 'typography' },
    { id: 'date', label: 'Dates & heures', icon: 'calendar' },
    { id: 'info', label: 'Information', icon: 'info-circle' }
  ];

  XL.F = function (fr, en, cat, since, desc, syntax, args, ex, tips, kw, see) {
    XL.functions.push({
      fr: fr, en: en, cat: cat, since: since || '', desc: desc, syntax: syntax,
      args: args || [], ex: ex || [], tips: tips || [], kw: kw || '',
      see: see ? see.split(/\s+/).filter(Boolean) : []
    });
  };

  XL.R = function (title, desc, steps, tips, kw) {
    XL.recipes.push({ title: title, desc: desc, steps: steps || [], tips: tips || [], kw: kw || '' });
  };

  XL.E = function (fr, en, cause, fixes, kw) {
    XL.errors.push({ fr: fr, en: en, cause: cause, fixes: fixes || [], kw: kw || '' });
  };

  XL.K = function (cat, keys, action) {
    XL.shortcuts.push({ cat: cat, keys: keys, action: action });
  };

  /* ---------------------------- Parcours pédagogique ---------------------------- */
  XL.notions = XL.notions || [];
  XL.samples = XL.samples || {};
  XL.placement = XL.placement || {};
  XL.dataErrors = XL.dataErrors || []; // doublons de saisie : signalés par les tests, ignorés à l'exécution

  /**
   * Notion = leçon d'utilisation d'Excel (lue dans l'ordre de déclaration).
   * { activity, level, title, intro, steps?: [étapes « Comment faire »], points: [« À retenir »],
   *   examples?: [[formule, explication, attendu?]], tips?: [], kw, sample? }
   */
  XL.N = function (n) {
    XL.notions.push({
      activity: n.activity, level: n.level, title: n.title, intro: n.intro, steps: n.steps || [],
      points: n.points || [], examples: n.examples || [], tips: n.tips || [], kw: n.kw || '', sample: n.sample || null
    });
  };

  /**
   * Mini-tableau d'exemple attaché à une fonction ('f:NOM') ou une méthode ('r:Titre exact').
   * spec = { cols: [en-têtes], rows: [[valeurs]], fill?: { header, formula, results, fmt? }, calc?: [[libellé, formule, résultat, fmt?]],
   *          fmt?: [format par colonne], select?: 'A1:C4' (plage à sélectionner pour une manipulation sans formule), note? }
   * Valeurs : nombre, texte, booléen, 'd:AAAA-MM-JJ' (date), 't:HH:MM' (heure), '' (vide).
   */
  XL.S = function (target, spec) {
    if (XL.samples[target]) { XL.dataErrors.push('Mini-tableau en double : ' + target); return; }
    XL.samples[target] = spec;
  };

  /** Place des fonctions ('f:NOM') ou méthodes ('r:Titre exact') dans une activité et un niveau, dans l'ordre donné. */
  XL.place = function (activity, level, keys) {
    keys.forEach(function (k, i) {
      if (XL.placement[k]) { XL.dataErrors.push('Placement en double : ' + k); return; }
      XL.placement[k] = { activity: activity, level: level, order: i };
    });
  };
})(typeof window !== 'undefined' ? window : globalThis);
