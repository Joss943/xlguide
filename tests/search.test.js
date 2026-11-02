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
    'supprimer les doublons': 'UNIQUE', 'enlever les espaces': 'SUPPRESPACE', 'mensualité': 'VPM',
    'mettre en majuscules': 'MAJUSCULE', 'arrondir': 'ARRONDI', 'iferror': 'SIERREUR', '=somme.si(': 'SOMME.SI'
  }, 3, 'fonction');

  section('Recherche : notions du parcours');
  expectIn({
    'référence absolue': 'Bloquer une cellule avec $ (références absolues)',
    'pourcentage': 'Calculer des pourcentages',
    'tableau croisé dynamique': 'Le tableau croisé dynamique (TCD)',
    'doublons': 'Repérer et supprimer les doublons',
    'heures': 'Calculer avec les heures',
    'recopier une formule': 'Recopier une formule (références relatives)'
  }, 3, 'notion');

  section('Recherche : méthodes et cas pratiques');
  expectIn({
    'calculer le ttc': 'Passer du HT au TTC', 'rapprochement bancaire': 'Rapprochement bancaire (pointage)',
    'balance agee': 'Balance âgée (tranches de retard)', 'échéance 30 jours fin de mois': 'Date d’échéance d’une facture',
    'comptes orphelins': 'Comptes orphelins : présents dans l’AD, absents de la liste RH',
    'masque de sous-réseau': 'Masque de sous-réseau à partir du préfixe CIDR', 'adresse mac': 'Normaliser une adresse MAC',
    'lastlogontimestamp': 'Convertir lastLogonTimestamp / pwdLastSet (Active Directory) en date',
    'comparer deux listes': 'Rapprocher deux listes : dans les deux, seulement A, seulement B',
    'inventaire materiel cmdb': 'Inventaire physique ↔ CMDB (GLPI, Intune, SCCM…)',
    'timestamp unix': 'Convertir un timestamp Unix (epoch) en date', 'capacite raid': 'Capacité utile d’une grappe RAID'
  }, 3, 'recette');

  section('Recherche : cas limites');
  check(XL.search.search('', {}).length === 0 && XL.search.search('   ', {}).length === 0, 'requête vide → aucun résultat');
  check(XL.search.search('zzqxw', {}).length === 0, 'mot inconnu → aucun résultat');
};
