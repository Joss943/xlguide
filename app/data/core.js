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

  XL.categories = [
    { id: 'logique', label: 'Logique', icon: '⚖️' },
    { id: 'recherche', label: 'Recherche & références', icon: '🔎' },
    { id: 'tableaux', label: 'Tableaux dynamiques', icon: '🧮' },
    { id: 'math', label: 'Maths & arrondis', icon: '➗' },
    { id: 'stats', label: 'Statistiques & comptage', icon: '📊' },
    { id: 'texte', label: 'Texte', icon: '🔤' },
    { id: 'date', label: 'Dates & heures', icon: '📅' },
    { id: 'finance', label: 'Finance & amortissements', icon: '💶' },
    { id: 'info', label: 'Information & erreurs', icon: 'ℹ️' },
    { id: 'bdd', label: 'Base de données', icon: '🗃️' },
    { id: 'conv', label: 'Conversion & ingénierie', icon: '🔧' }
  ];

  XL.recipeCategories = [
    { id: 'tva', label: 'TVA, prix & marges', icon: '🧾' },
    { id: 'emprunt', label: 'Emprunts & placements', icon: '🏦' },
    { id: 'immo', label: 'Immobilisations', icon: '🏭' },
    { id: 'factures', label: 'Factures & échéances', icon: '📨' },
    { id: 'treso', label: 'Trésorerie & banque', icon: '💳' },
    { id: 'controle', label: 'Contrôles & audit', icon: '✅' },
    { id: 'analyse', label: 'Analyse & reporting', icon: '📈' },
    { id: 'import', label: 'Nettoyage d’imports', icon: '🧹' },
    { id: 'periodes', label: 'Dates & périodes', icon: '🗓️' },
    { id: 'rh', label: 'Paie & temps de travail', icon: '⏱️' }
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
})(typeof window !== 'undefined' ? window : globalThis);
