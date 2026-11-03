/*
 * Parcours : 4 activités d'utilisation d'Excel × 2 niveaux (Les bases, Intermédiaire).
 * Chaque fonction et chaque méthode de la base a sa place ici (vérifié par npm test) ;
 * l'ordre des listes est l'ordre d'affichage. Les notions sont dans data/notions/.
 */
(function (XL) {
  'use strict';

  XL.levelDefs = [
    { id: 'base', label: 'Les bases', step: 1 },
    { id: 'intermediaire', label: 'Intermédiaire', step: 2 }
  ];

  XL.activities = [
    {
      id: 'saisir', label: 'Saisir & mettre en forme', icon: 'pencil',
      desc: 'Se repérer, saisir et recopier des données, choisir le bon format, figer les en-têtes, créer des listes déroulantes.',
      levels: {
        base: 'Prendre Excel en main : se repérer, saisir, sélectionner, recopier avec la poignée et choisir le bon format.',
        intermediaire: 'Des tableaux propres et faciles à remplir : mise en forme, volets figés, listes déroulantes, formats personnalisés, collage spécial.'
      }
    },
    {
      id: 'calculer', label: 'Calculer', icon: 'calculator',
      desc: 'Écrire des formules, bloquer une cellule avec $, additionner selon des conditions, chercher une valeur, calculer avec les dates et le texte.',
      levels: {
        base: 'Les réflexes indispensables : écrire une formule, la recopier, bloquer une cellule avec $, les pourcentages, les fonctions de base et SI.',
        intermediaire: 'Calculer selon des conditions, chercher une valeur dans un autre tableau, calculer avec les dates, les heures et le texte.'
      }
    },
    {
      id: 'organiser', label: 'Organiser & analyser', icon: 'filter',
      desc: 'Mettre ses données sous forme de tableau, trier, filtrer, repérer les doublons, colorer automatiquement et synthétiser avec un TCD.',
      levels: {
        base: 'Ranger ses données pour les exploiter : tableau, tri, filtre, rechercher-remplacer, doublons.',
        intermediaire: 'Faire parler les données : mise en forme conditionnelle, classements, comparaison de listes, tableau croisé dynamique, synthèses.'
      }
    },
    {
      id: 'presenter', label: 'Présenter', icon: 'chart-bar',
      desc: 'Créer et soigner un graphique, choisir le bon type, mettre en page et imprimer proprement.',
      levels: {
        base: 'Créer un graphique, le rendre lisible, mettre en page et imprimer.',
        intermediaire: 'Choisir le bon graphique, combiner deux séries, ajouter des sparklines, imprimer un grand tableau.'
      }
    }
  ];

  // Adresses de la version 1.2.0 (#/a/rechercher/approfondir…) redirigées vers le parcours actuel.
  XL.routeAliases = { rechercher: 'calculer', texte: 'calculer', analyser: 'organiser', approfondir: 'intermediaire', expert: 'intermediaire' };

  var P = XL.place;
  function f(names) { return names.map(function (n) { return 'f:' + n; }); }
  function r(titles) { return titles.map(function (t) { return 'r:' + t; }); }

  /* ------------------------------ SAISIR & METTRE EN FORME ------------------------------ */
  P('saisir', 'intermediaire', f(['ESTNUM', 'ESTTEXTE', 'ESTVIDE']));

  /* ---------------------------------------- CALCULER ---------------------------------------- */
  P('calculer', 'base', f(['SOMME', 'MOYENNE', 'MIN', 'MAX', 'NB', 'NBVAL', 'ARRONDI', 'SI']));
  P('calculer', 'intermediaire', f([
    'SOMME.SI', 'SOMME.SI.ENS', 'NB.SI', 'NB.SI.ENS', 'MOYENNE.SI', 'MOYENNE.SI.ENS', 'NB.VIDE',
    'ET', 'OU', 'NON', 'SI.CONDITIONS', 'SIERREUR', 'SI.NON.DISP',
    'ARRONDI.SUP', 'ARRONDI.INF', 'ARRONDI.AU.MULTIPLE', 'ENT', 'MOD', 'ABS',
    'RECHERCHEV', 'RECHERCHEX',
    'AUJOURDHUI', 'MAINTENANT', 'DATE', 'ANNEE', 'MOIS', 'JOUR', 'JOURSEM', 'FIN.MOIS', 'MOIS.DECALER', 'NB.JOURS.OUVRES', 'DATEDIF',
    'HEURE', 'MINUTE', 'TEMPS',
    'CONCATENER', 'JOINDRE.TEXTE', 'GAUCHE', 'DROITE', 'STXT', 'NBCAR', 'TROUVE', 'CHERCHE', 'SUBSTITUE', 'SUPPRESPACE',
    'MAJUSCULE', 'MINUSCULE', 'NOMPROPRE', 'TEXTE', 'CNUM'
  ]));
  P('calculer', 'base', r(['Passer du HT au TTC', 'Passer du TTC au HT', 'Variation N / N-1 en %', 'Part de chaque ligne dans le total']));
  P('calculer', 'intermediaire', r(['Solde progressif d’un compte', 'Comparer deux montants avec tolérance',
    'Date d’échéance d’une facture', 'Premier et dernier jour du mois', 'Trimestre et semestre d’une date', 'Âge ou ancienneté',
    'Nombre de mois entre deux dates', 'Jours ouvrés du mois (fériés inclus)', 'Heures travaillées (y compris de nuit)',
    'Convertir heures décimales ⇄ hh:mm', 'Séparer nom et prénom', 'Nettoyer un libellé', 'Convertir une date texte (AAAAMMJJ, JJ.MM.AAAA…)']));

  /* ---------------------------------- ORGANISER & ANALYSER ---------------------------------- */
  P('organiser', 'base', f(['SOUS.TOTAL']));
  P('organiser', 'intermediaire', f(['EQUATION.RANG', 'GRANDE.VALEUR', 'PETITE.VALEUR', 'MEDIANE', 'FILTRE', 'TRIER', 'UNIQUE']));
  P('organiser', 'intermediaire', r(['Total par mois (et par client)', 'Budget vs réel']));
})(window.XL);
