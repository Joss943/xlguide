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
  // Fonctions personnalisées (LAMBDA) proposées dans les recettes : reconnues par le traducteur et les tests.
  XL.userFunctions = XL.userFunctions || {};

  // icon = nom d'icône Tabler Icons (voir scripts/build-icons.js)
  XL.categories = [
    { id: 'logique', label: 'Logique', icon: 'arrows-split-2' },
    { id: 'recherche', label: 'Recherche & références', icon: 'search' },
    { id: 'tableaux', label: 'Tableaux dynamiques', icon: 'table' },
    { id: 'math', label: 'Maths & arrondis', icon: 'calculator' },
    { id: 'stats', label: 'Statistiques & comptage', icon: 'chart-bar' },
    { id: 'texte', label: 'Texte', icon: 'typography' },
    { id: 'date', label: 'Dates & heures', icon: 'calendar' },
    { id: 'finance', label: 'Finance & amortissements', icon: 'coin-euro' },
    { id: 'info', label: 'Information & erreurs', icon: 'info-circle' },
    { id: 'bdd', label: 'Base de données', icon: 'database' },
    { id: 'conv', label: 'Conversion, bits & ingénierie', icon: 'binary' }
  ];

  // domain : 'compta' (onglet Recettes compta) ou 'it' (onglet Informatique & réseau)
  XL.recipeCategories = [
    { id: 'tva', label: 'TVA, prix & marges', icon: 'receipt-tax', domain: 'compta' },
    { id: 'emprunt', label: 'Emprunts & placements', icon: 'building-bank', domain: 'compta' },
    { id: 'immo', label: 'Immobilisations', icon: 'building-factory-2', domain: 'compta' },
    { id: 'factures', label: 'Factures & échéances', icon: 'file-invoice', domain: 'compta' },
    { id: 'treso', label: 'Trésorerie & banque', icon: 'credit-card', domain: 'compta' },
    { id: 'controle', label: 'Contrôles & audit', icon: 'checklist', domain: 'compta' },
    { id: 'analyse', label: 'Analyse & reporting', icon: 'chart-line', domain: 'compta' },
    { id: 'import', label: 'Nettoyage d’imports', icon: 'file-import', domain: 'compta' },
    { id: 'periodes', label: 'Dates & périodes', icon: 'calendar-event', domain: 'compta' },
    { id: 'rh', label: 'Paie & temps de travail', icon: 'clock-hour-4', domain: 'compta' },
    { id: 'comparaison', label: 'Comparer des bases (utilisateurs & matériel)', icon: 'git-compare', domain: 'it' },
    { id: 'reseau', label: 'Adresses IP & sous-réseaux', icon: 'network', domain: 'it' },
    { id: 'hote', label: 'MAC, hôtes & identifiants', icon: 'router', domain: 'it' },
    { id: 'comptes', label: 'Comptes & Active Directory', icon: 'users', domain: 'it' },
    { id: 'parc', label: 'Parc matériel & licences', icon: 'devices-pc', domain: 'it' },
    { id: 'supervision', label: 'Supervision, logs & SLA', icon: 'activity-heartbeat', domain: 'it' },
    { id: 'stockage', label: 'Stockage & débit', icon: 'server-2', domain: 'it' }
  ];

  XL.versions = [
    { id: '', label: 'Toutes versions', rank: 0 },
    { id: '2010', label: 'Excel 2010+', rank: 1 },
    { id: '2013', label: 'Excel 2013+', rank: 2 },
    { id: '2016', label: 'Excel 2016+', rank: 3 },
    { id: '2019', label: 'Excel 2019+', rank: 4 },
    { id: '2021', label: 'Excel 2021+', rank: 5 },
    { id: '2024', label: 'Excel 2024 / 365', rank: 6 },
    { id: '365', label: 'Microsoft 365 uniquement', rank: 7 }
  ];

  XL.F = function (fr, en, cat, since, desc, syntax, args, ex, tips, kw, see) {
    XL.functions.push({
      fr: fr, en: en, cat: cat, since: since || '', desc: desc, syntax: syntax,
      args: args || [], ex: ex || [], tips: tips || [], kw: kw || '',
      see: see ? see.split(/\s+/).filter(Boolean) : []
    });
  };

  XL.R = function (cat, title, desc, steps, tips, kw) {
    XL.recipes.push({ cat: cat, title: title, desc: desc, steps: steps || [], tips: tips || [], kw: kw || '' });
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
   * { activity, level, title, intro, points: [], examples: [[formule, explication, attendu?]], tips: [], kw, sample? }
   */
  XL.N = function (n) {
    XL.notions.push({
      activity: n.activity, level: n.level, title: n.title, intro: n.intro,
      points: n.points || [], examples: n.examples || [], tips: n.tips || [], kw: n.kw || '', sample: n.sample || null
    });
  };

  /**
   * Mini-tableau d'exemple attaché à une fonction ('f:NOM') ou une recette ('r:Titre exact').
   * spec = { cols: [en-têtes], rows: [[valeurs]], fill?: { header, formula, results, fmt? }, calc?: [[libellé, formule, résultat, fmt?]], fmt?: [format par colonne] }
   * Valeurs : nombre, texte, booléen, 'd:AAAA-MM-JJ' (date), 't:HH:MM' (heure), '' (vide).
   */
  XL.S = function (target, spec) {
    if (XL.samples[target]) { XL.dataErrors.push('Mini-tableau en double : ' + target); return; }
    XL.samples[target] = spec;
  };

  /** Place des fonctions ('f:NOM') ou recettes ('r:Titre exact') dans une activité et un niveau, dans l'ordre donné. */
  XL.place = function (activity, level, keys) {
    keys.forEach(function (k, i) {
      if (XL.placement[k]) { XL.dataErrors.push('Placement en double : ' + k); return; }
      XL.placement[k] = { activity: activity, level: level, order: i };
    });
  };
})(typeof window !== 'undefined' ? window : globalThis);
