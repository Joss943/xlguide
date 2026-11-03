/* Recherche en langage naturel : la bonne fiche doit sortir dans les premiers résultats. */
'use strict';
const { check, section } = require('./lib');

module.exports = function (XL) {
  const top = (q, n) => XL.search.search(q, { limit: n }).map((r) => r.item.title || r.item.fr);
  function expectIn(map, n, label) {
    Object.entries(map).forEach(([q, want]) => {
      const got = top(q, n);
      check(got.includes(want), 'recherche « ' + q + ' » → ' + label + ' « ' + want + ' » attendu(e) dans le top ' + n + ', obtenu : ' + got.join(' | '));
    });
  }

  section('Recherche : fonctions');
  expectIn({
    'somme si': 'SOMME.SI', 'sumifs': 'SOMME.SI.ENS', 'additionner avec plusieurs conditions': 'SOMME.SI.ENS',
    'trouver une valeur dans un autre tableau': 'RECHERCHEX', 'nb si': 'NB.SI', 'vlookup': 'RECHERCHEV',
    'date du jour': 'AUJOURDHUI', 'dernier jour du mois': 'FIN.MOIS', 'jours ouvrés': 'NB.JOURS.OUVRES',
    'enlever les espaces': 'SUPPRESPACE', 'mettre en majuscules': 'MAJUSCULE', 'arrondir': 'ARRONDI',
    'iferror': 'SIERREUR', '=somme.si(': 'SOMME.SI'
  }, 3, 'fonction');

  section('Recherche : notions du parcours');
  expectIn({
    'figer la première ligne': 'Figer les volets',
    'liste déroulante': 'Créer une liste déroulante',
    'créer un graphique': 'Créer un graphique',
    'camembert': 'Créer un graphique',
    'imprimer sur une page': 'Mettre en page et imprimer',
    'collage spécial': 'Copier-coller : le collage spécial',
    'poignée de recopie': 'Recopier et créer des séries avec la poignée',
    'référence absolue': 'Bloquer une cellule avec $ (références absolues)',
    'pourcentage': 'Calculer des pourcentages',
    'tableau croisé dynamique': 'Le tableau croisé dynamique (TCD)',
    'doublons': 'Repérer et supprimer les doublons',
    'heures': 'Calculer avec les heures',
    'rechercher remplacer': 'Rechercher et remplacer'
  }, 3, 'notion');

  section('Recherche : méthodes');
  expectIn({
    'calculer le ttc': 'Passer du HT au TTC', 'échéance 30 jours fin de mois': 'Date d’échéance d’une facture',
    'âge': 'Âge ou ancienneté', 'séparer nom prénom': 'Séparer nom et prénom', 'budget réalisé': 'Budget vs réel'
  }, 3, 'méthode');

  section('Recherche : cas limites');
  check(XL.search.search('', {}).length === 0 && XL.search.search('   ', {}).length === 0, 'requête vide → aucun résultat');
  check(XL.search.search('zzqxw', {}).length === 0, 'mot inconnu → aucun résultat');
};
