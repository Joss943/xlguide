/*
 * Parcours pédagogique : 4 activités × 3 niveaux.
 * - Les fonctions et recettes placées ici forment le parcours principal (ordre = ordre d'affichage).
 * - Les fonctions non placées restent consultables dans l'index A→Z et la recherche (« référence »).
 * - Les recettes non placées sont des cas pratiques métier (compta, informatique), dans Outils.
 */
(function (XL) {
  'use strict';

  XL.levelDefs = [
    { id: 'base', label: 'Les bases', step: 1 },
    { id: 'approfondir', label: 'Approfondir', step: 2 },
    { id: 'expert', label: 'Expert', step: 3 }
  ];

  XL.activities = [
    {
      id: 'calculer', label: 'Calculer', icon: 'calculator',
      desc: 'Écrire des formules, bloquer une cellule avec $, calculer des pourcentages, additionner, compter et décider avec SI.',
      levels: {
        base: 'Les réflexes indispensables : écrire une formule, la recopier, utiliser les pourcentages et les fonctions de base.',
        approfondir: 'Calculer selon des conditions et arrondir correctement.',
        expert: 'Calculer sur des plages entières et nommer ses calculs.'
      }
    },
    {
      id: 'rechercher', label: 'Rechercher & croiser', icon: 'search',
      desc: 'Aller chercher une information dans un autre tableau, gérer l’introuvable, comparer deux listes.',
      levels: {
        base: 'Retrouver une valeur dans un tableau et gérer les cas où elle n’existe pas.',
        approfondir: 'Chercher dans tous les sens, comparer des listes et repérer les doublons.',
        expert: 'Plusieurs critères, barèmes par tranches et références dynamiques.'
      }
    },
    {
      id: 'texte', label: 'Texte & dates', icon: 'typography',
      desc: 'Comprendre les formats, découper et nettoyer du texte, calculer avec les dates et les heures.',
      levels: {
        base: 'Texte, nombre ou date ? Assembler, découper, nettoyer et compter des jours.',
        approfondir: 'Convertir des données importées, mettre en forme, échéances, jours ouvrés et heures.',
        expert: 'Extraire des morceaux de texte complexes et fiabiliser des imports.'
      }
    },
    {
      id: 'analyser', label: 'Analyser & présenter', icon: 'chart-bar',
      desc: 'Organiser ses données en tableau, trier, filtrer, synthétiser avec un TCD et mettre en valeur.',
      levels: {
        base: 'Structurer un tableau, trier, filtrer, colorer automatiquement et repérer les extrêmes.',
        approfondir: 'Tableaux croisés dynamiques, synthèses par catégorie et fonctions FILTRE, TRIER, UNIQUE.',
        expert: 'Statistiques, prévisions et tableaux construits entièrement par formule.'
      }
    }
  ];

  var P = XL.place;
  function f(names) { return names.map(function (n) { return 'f:' + n; }); }
  function r(titles) { return titles.map(function (t) { return 'r:' + t; }); }

  /* --------------------------------- CALCULER --------------------------------- */
  P('calculer', 'base', f(['SOMME', 'MOYENNE', 'MIN', 'MAX', 'NB', 'NBVAL', 'ARRONDI', 'SI']));
  P('calculer', 'approfondir', f(['SOMME.SI', 'SOMME.SI.ENS', 'NB.SI', 'NB.SI.ENS', 'MOYENNE.SI', 'MOYENNE.SI.ENS', 'NB.VIDE',
    'ET', 'OU', 'NON', 'SI.CONDITIONS', 'ARRONDI.SUP', 'ARRONDI.INF', 'ARRONDI.AU.MULTIPLE', 'ENT', 'MOD', 'ABS', 'SOUS.TOTAL']));
  P('calculer', 'expert', f(['SOMMEPROD', 'AGREGAT', 'MAX.SI.ENS', 'MIN.SI.ENS', 'SI.MULTIPLE', 'LET', 'LAMBDA', 'BYROW', 'VPM', 'ALEA.ENTRE.BORNES']));
  P('calculer', 'base', r(['Passer du HT au TTC', 'Passer du TTC au HT', 'Extraire le montant de TVA d’un TTC',
    'Variation N / N-1 en %', 'Part de chaque ligne dans le total']));
  P('calculer', 'approfondir', r(['Taux de marge et taux de marque', 'Prix de vente à partir d’un taux de marque visé',
    'Remises en cascade', 'Arrondis commerciaux', 'Solde progressif d’un compte', 'Comparer deux montants avec tolérance']));
  P('calculer', 'expert', r(['Calculer une mensualité d’emprunt', 'Épargne : combien j’aurai ?']));

  /* ---------------------------- RECHERCHER & CROISER ---------------------------- */
  P('rechercher', 'base', f(['RECHERCHEV', 'RECHERCHEX', 'SIERREUR']));
  P('rechercher', 'approfondir', f(['INDEX', 'EQUIV', 'SI.NON.DISP', 'ESTNA', 'EQUIVX', 'CHOISIR']));
  P('rechercher', 'expert', f(['DECALER', 'INDIRECT', 'RECHERCHE', 'LIGNE', 'LIGNES', 'COLONNE', 'COLONNES']));
  P('rechercher', 'base', r(['TVA multi-taux selon un code']));
  // Les comparaisons de bases (AD, RH, CMDB…) restent dans Outils › Cas pratiques ; la notion « Comparer deux listes » couvre la méthode.

  /* -------------------------------- TEXTE & DATES -------------------------------- */
  P('texte', 'base', f(['CONCATENER', 'GAUCHE', 'DROITE', 'STXT', 'NBCAR', 'MAJUSCULE', 'SUPPRESPACE',
    'AUJOURDHUI', 'DATE', 'ANNEE', 'MOIS', 'JOUR']));
  P('texte', 'approfondir', f(['TROUVE', 'CHERCHE', 'SUBSTITUE', 'TEXTE', 'CNUM', 'MINUSCULE', 'NOMPROPRE', 'JOINDRE.TEXTE',
    'ESTTEXTE', 'ESTNUM', 'ESTVIDE', 'FIN.MOIS', 'MOIS.DECALER', 'JOURSEM', 'NB.JOURS.OUVRES', 'DATEDIF', 'MAINTENANT',
    'HEURE', 'MINUTE', 'TEMPS']));
  P('texte', 'expert', f(['TEXTE.AVANT', 'TEXTE.APRES', 'FRACTIONNER.TEXTE', 'REMPLACER', 'EPURAGE', 'VALEURNOMBRE',
    'CONCAT', 'REPT', 'CAR', 'SERIE.JOUR.OUVRE', 'NB.JOURS.OUVRES.INTL', 'JOURS', 'NO.SEMAINE.ISO', 'FRACTION.ANNEE', 'DATEVAL']));
  P('texte', 'base', r(['Séparer nom et prénom', 'Nettoyer un libellé']));
  P('texte', 'approfondir', r(['Convertir un montant texte en nombre (« 1 234,56 € »)', 'Convertir une date texte (AAAAMMJJ, JJ.MM.AAAA…)',
    'Date d’échéance d’une facture', 'Retard de paiement en jours', 'Premier et dernier jour du mois', 'Trimestre et semestre d’une date',
    'Âge ou ancienneté', 'Nombre de mois entre deux dates', 'Jours ouvrés du mois (fériés inclus)', 'Heures travaillées (y compris de nuit)',
    'Convertir heures décimales ⇄ hh:mm']));
  P('texte', 'expert', r(['Montants au format anglais (1,234.56)', 'Numéro de facture automatique', 'Jours fériés français (dont Pâques)']));

  /* ---------------------------- ANALYSER & PRÉSENTER ---------------------------- */
  P('analyser', 'base', f(['MEDIANE', 'GRANDE.VALEUR', 'PETITE.VALEUR', 'EQUATION.RANG']));
  P('analyser', 'approfondir', f(['TRIER', 'FILTRE', 'UNIQUE', 'TRIERPAR', 'MODE.SIMPLE', 'ECARTYPE.STANDARD', 'CENTILE.INCLURE', 'QUARTILE.INCLURE']));
  P('analyser', 'expert', f(['PIVOTER.PAR', 'LIREDONNEESTABCROISDYNAMIQUE', 'PRENDRE', 'EXCLURE', 'ASSEMB.V', 'ASSEMB.H',
    'CHOISIRCOLS', 'CHOISIRLIGNES', 'SEQUENCE', 'TRANSPOSE', 'PREVISION.LINEAIRE', 'TENDANCE', 'PENTE', 'FREQUENCE']));
  P('analyser', 'approfondir', r(['Total par mois (et par compte)', 'Budget vs réel']));
  P('analyser', 'expert', r(['Top N clients par chiffre d’affaires', 'Cumul depuis le début de l’année (YTD)', 'Taux de croissance annuel moyen (TCAM)']));
})(window.XL);
