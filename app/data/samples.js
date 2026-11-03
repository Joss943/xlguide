/*
 * Mini-tableaux d'exemple des fonctions et méthodes du parcours.
 * Chaque résultat est recalculé par LibreOffice dans les tests (tests/verify_libreoffice.py).
 * Quand la formule appelle directement la fonction de la fiche, ses arguments sont colorés
 * de la même couleur que dans la syntaxe et que les cellules qu'ils désignent.
 */
(function (XL) {
  'use strict';
  var S = XL.S;

  // Jeux de données réutilisés
  var VENTES = { cols: ['Vendeur', 'Région', 'Ventes'], rows: [['Alice', 'Nord', 1200], ['Bruno', 'Sud', 850], ['Chloé', 'Nord', 1430], ['David', 'Est', 990], ['Emma', 'Sud', 1100]] };
  var PRODUITS = { cols: ['Code', 'Produit', 'Prix'], rows: [['P01', 'Stylo', 1.5], ['P02', 'Cahier', 3.2], ['P03', 'Classeur', 5.9], ['P04', 'Agenda', 12]], fmt: [null, null, '0.00'] };
  var CA = { cols: ['Commercial', 'CA'], rows: [['Alice', 1200], ['Bruno', 850], ['Chloé', 1430], ['David', 990], ['Emma', 5000]] };
  var REFS = { cols: ['Référence'], rows: [['FR-2026-001'], ['BE-2025-042'], ['DE-2026-117']] };
  var DATES = { cols: ['Date'], rows: [['d:2025-03-15'], ['d:2026-07-04'], ['d:2027-11-30']] };
  var MONTANTS = { cols: ['Montant'], rows: [[120], ['n.c.'], [80], [''], [45]] };

  function on(data, extra) {
    var s = { cols: data.cols, rows: data.rows, fmt: data.fmt };
    Object.keys(extra).forEach(function (k) { s[k] = extra[k]; });
    return s;
  }

  /* ------------------------------- Calculer ------------------------------- */
  S('f:SOMME', on(VENTES, { calc: [['Total des ventes', '=SOMME(C2:C6)', 5570]] }));
  S('f:MOYENNE', on(VENTES, { calc: [['Vente moyenne', '=MOYENNE(C2:C6)', 1114]] }));
  S('f:MIN', on(VENTES, { calc: [['Plus petite vente', '=MIN(C2:C6)', 850]] }));
  S('f:MAX', on(VENTES, { calc: [['Plus grosse vente', '=MAX(C2:C6)', 1430]] }));
  S('f:NB', on(MONTANTS, { calc: [['Cellules contenant un nombre', '=NB(A2:A6)', 3]] }));
  S('f:NBVAL', on(MONTANTS, { calc: [['Cellules non vides', '=NBVAL(A2:A6)', 4]] }));
  S('f:ARRONDI', { cols: ['Montant HT'], rows: [[19.99], [7.45], [103.2]], fmt: ['0.00'],
    fill: { header: 'TVA 20 % arrondie', formula: '=ARRONDI(A2*20%;2)', results: [4, 1.49, 20.64], fmt: '0.00' } });
  S('f:SI', { cols: ['Facture', 'Montant'], rows: [['F-101', 250], ['F-102', 1300], ['F-103', 90]],
    fill: { header: 'Catégorie', formula: '=SI(B2>=1000;"Gros montant";"Normal")', results: ['Normal', 'Gros montant', 'Normal'] } });
  S('f:SOMME.SI', on(VENTES, { calc: [['Ventes de la région Nord', '=SOMME.SI(B2:B6;"Nord";C2:C6)', 2630]] }));
  S('f:SOMME.SI.ENS', on(VENTES, { calc: [['Ventes du Sud d’au moins 1 000', '=SOMME.SI.ENS(C2:C6;B2:B6;"Sud";C2:C6;">=1000")', 1100]] }));
  S('f:NB.SI', on(VENTES, { calc: [['Nombre de ventes du Nord', '=NB.SI(B2:B6;"Nord")', 2]] }));
  S('f:NB.SI.ENS', on(VENTES, { calc: [['Ventes du Sud d’au moins 1 000', '=NB.SI.ENS(B2:B6;"Sud";C2:C6;">=1000")', 1]] }));
  S('f:MOYENNE.SI', on(VENTES, { calc: [['Moyenne des ventes du Sud', '=MOYENNE.SI(B2:B6;"Sud";C2:C6)', 975]] }));
  S('f:ET', { cols: ['Client', 'CA', 'Fidèle'], rows: [['Martin', 12000, 'Oui'], ['Durand', 6500, 'Non'], ['Petit', 8000, 'Oui']],
    fill: { header: 'Remise possible ?', formula: '=ET(B2>=5000;C2="Oui")', results: [true, false, true] } });
  S('f:OU', { cols: ['Commande', 'Statut'], rows: [['C-1', 'Annulé'], ['C-2', 'Livré'], ['C-3', 'Avoir']],
    fill: { header: 'À exclure ?', formula: '=OU(B2="Annulé";B2="Avoir")', results: [true, false, true] } });
  S('f:SI.CONDITIONS', { cols: ['Retard (jours)'], rows: [[0], [12], [45], [120]],
    fill: { header: 'Tranche', formula: '=SI.CONDITIONS(A2<=0;"Non échu";A2<=30;"0-30 j";A2<=90;"31-90 j";VRAI;"> 90 j")',
      results: ['Non échu', '0-30 j', '31-90 j', '> 90 j'] } });
  S('f:SOUS.TOTAL', on(VENTES, { calc: [['Total des lignes visibles', '=SOUS.TOTAL(109;C2:C6)', 5570]],
    note: 'Sans filtre, le résultat égale la somme ; avec un filtre sur « Nord », il ne reste que 2 630.' }));

  /* --------------------------- Calculer : recherche --------------------------- */
  S('f:RECHERCHEV', on(PRODUITS, { calc: [['Prix du produit P03', '=RECHERCHEV("P03";A2:C5;3;FAUX)', 5.9, '0.00']] }));
  S('f:RECHERCHEX', on(PRODUITS, { calc: [['Code de « Cahier »', '=RECHERCHEX("Cahier";B2:B5;A2:A5;"Introuvable")', 'P02']] }));
  S('f:SIERREUR', on(PRODUITS, { calc: [['Prix du code P09 (inexistant)', '=SIERREUR(RECHERCHEV("P09";A2:C5;3;FAUX);"Introuvable")', 'Introuvable']] }));

  /* ------------------------ Calculer : texte et dates ------------------------ */
  S('f:CONCATENER', { cols: ['Prénom', 'Nom'], rows: [['Jean', 'Dupont'], ['Marie', 'Martin']],
    fill: { header: 'Nom complet', formula: '=CONCATENER(A2;" ";B2)', results: ['Jean Dupont', 'Marie Martin'] } });
  S('f:GAUCHE', on(REFS, { fill: { header: 'Pays', formula: '=GAUCHE(A2;2)', results: ['FR', 'BE', 'DE'] } }));
  S('f:DROITE', on(REFS, { fill: { header: 'Numéro', formula: '=DROITE(A2;3)', results: ['001', '042', '117'] } }));
  S('f:STXT', on(REFS, { fill: { header: 'Année', formula: '=STXT(A2;4;4)', results: ['2026', '2025', '2026'] } }));
  S('f:NBCAR', { cols: ['Code postal'], rows: [['94000'], ['7500'], ['13001']],
    fill: { header: 'Longueur', formula: '=NBCAR(A2)', results: [5, 4, 5] }, note: 'Le 2e code est incomplet : 4 caractères au lieu de 5.' });
  S('f:MAJUSCULE', { cols: ['Ville'], rows: [['Paris'], ['nantes'], ['Lyon']],
    fill: { header: 'En majuscules', formula: '=MAJUSCULE(A2)', results: ['PARIS', 'NANTES', 'LYON'] } });
  S('f:SUPPRESPACE', { cols: ['Saisie'], rows: [['  Dupont  '], ['Jean   Martin'], [' SARL  Durand ']],
    fill: { header: 'Nettoyé', formula: '=SUPPRESPACE(A2)', results: ['Dupont', 'Jean Martin', 'SARL Durand'] } });
  S('f:DATE', { cols: ['Année', 'Mois', 'Jour'], rows: [[2026, 3, 15], [2026, 13, 1], [2026, 3, 0]],
    fill: { header: 'Date', formula: '=DATE(A2;B2;C2)', results: ['d:2026-03-15', 'd:2027-01-01', 'd:2026-02-28'] },
    note: 'Le mois 13 devient janvier de l’année suivante ; le jour 0 donne le dernier jour du mois précédent.' });
  S('f:ANNEE', on(DATES, { fill: { header: 'Année', formula: '=ANNEE(A2)', results: [2025, 2026, 2027] } }));
  S('f:MOIS', on(DATES, { fill: { header: 'Mois', formula: '=MOIS(A2)', results: [3, 7, 11] } }));
  S('f:JOUR', on(DATES, { fill: { header: 'Jour', formula: '=JOUR(A2)', results: [15, 4, 30] } }));
  S('f:TROUVE', { cols: ['E-mail'], rows: [['jean.dupont@exemple.fr'], ['m.martin@exemple.com']],
    fill: { header: 'Position du @', formula: '=TROUVE("@";A2)', results: [12, 9] } });
  S('f:SUBSTITUE', { cols: ['Montant (texte)'], rows: [['1.234,56'], ['12.500,00']],
    fill: { header: 'Sans point', formula: '=SUBSTITUE(A2;".";"")', results: ['1234,56', '12500,00'] } });
  S('f:TEXTE', { cols: ['N°'], rows: [[7], [42], [315]],
    fill: { header: 'Sur 4 chiffres', formula: '=TEXTE(A2;"0000")', results: ['0007', '0042', '0315'] } });
  S('f:CNUM', { cols: ['Saisie (texte)'], rows: [['1234'], ['56'], ['007']],
    fill: { header: 'Nombre', formula: '=CNUM(A2)', results: [1234, 56, 7] } });
  S('f:FIN.MOIS', { cols: ['Date'], rows: [['d:2026-01-15'], ['d:2026-02-10'], ['d:2026-12-03']],
    fill: { header: 'Fin du mois', formula: '=FIN.MOIS(A2;0)', results: ['d:2026-01-31', 'd:2026-02-28', 'd:2026-12-31'] } });
  S('f:MOIS.DECALER', { cols: ['Début du contrat'], rows: [['d:2026-01-31'], ['d:2026-04-15']],
    fill: { header: 'Un mois plus tard', formula: '=MOIS.DECALER(A2;1)', results: ['d:2026-02-28', 'd:2026-05-15'] } });
  S('f:JOURSEM', { cols: ['Date'], rows: [['d:2026-11-02'], ['d:2026-11-07'], ['d:2026-11-08']],
    fill: { header: 'Jour (1 = lundi)', formula: '=JOURSEM(A2;2)', results: [1, 6, 7] } });
  S('f:NB.JOURS.OUVRES', { cols: ['Début', 'Fin'], rows: [['d:2026-11-02', 'd:2026-11-06'], ['d:2026-11-02', 'd:2026-11-13']],
    fill: { header: 'Jours ouvrés', formula: '=NB.JOURS.OUVRES(A2;B2)', results: [5, 10] } });
  S('f:DATEDIF', { cols: ['Entrée', 'Aujourd’hui'], rows: [['d:2019-09-01', 'd:2026-11-02'], ['d:2024-03-15', 'd:2026-11-02']],
    fill: { header: 'Ancienneté (ans)', formula: '=DATEDIF(A2;B2;"y")', results: [7, 2] } });

  /* -------------------------- Analyser & présenter -------------------------- */
  S('f:MEDIANE', on(CA, { calc: [['Médiane', '=MEDIANE(B2:B6)', 1200]] }));
  S('f:GRANDE.VALEUR', on(CA, { calc: [['2e plus gros CA', '=GRANDE.VALEUR(B2:B6;2)', 1430]] }));
  S('f:PETITE.VALEUR', on(CA, { calc: [['2e plus petit CA', '=PETITE.VALEUR(B2:B6;2)', 990]] }));
  S('f:EQUATION.RANG', on(CA, { fill: { header: 'Rang', formula: '=EQUATION.RANG(B2;$B$2:$B$6)', results: [3, 5, 2, 4, 1] } }));

  /* ------------------------------- Méthodes ------------------------------- */
  S('r:Passer du HT au TTC', { cols: ['Produit', 'Prix HT', 'Taux TVA'], rows: [['Stylo', 10, 0.2], ['Livre', 30, 0.055], ['Repas', 18, 0.1]],
    fmt: [null, '0.00', '%'], fill: { header: 'Prix TTC', formula: '=ARRONDI(B2*(1+C2);2)', results: [12, 31.65, 19.8], fmt: '0.00' },
    note: 'Ici chaque produit a son propre taux (C2, C3…). Avec un taux unique, place-le dans une seule cellule et bloque-la avec $ : voir la méthode ci-dessous.' });
  S('r:Passer du TTC au HT', { cols: ['Prix TTC', 'Taux TVA'], rows: [[120, 0.2], [52.75, 0.055]],
    fmt: ['0.00', '%'], fill: { header: 'Prix HT', formula: '=ARRONDI(A2/(1+B2);2)', results: [100, 50], fmt: '0.00' } });
  S('r:Variation N / N-1 en %', { cols: ['Poste', '2025', '2026'], rows: [['Ventes', 100000, 120000], ['Achats', 40000, 38000], ['Frais', 0, 500]],
    fill: { header: 'Variation', formula: '=SIERREUR((C2-B2)/ABS(B2);"")', results: [0.2, -0.05, ''], fmt: '%' } });
  S('r:Solde progressif d’un compte', { cols: ['Opération', 'Entrée', 'Sortie'],
    rows: [['Solde initial', 1000, 0], ['Salaire', 500, 0], ['Loyer', 0, 800], ['Courses', 0, 120]],
    fill: { header: 'Solde', formula: '=SOMME($B$2:B2)-SOMME($C$2:C2)', results: [1000, 1500, 700, 580] } });
  S('r:Convertir une date texte (AAAAMMJJ, JJ.MM.AAAA…)', { cols: ['Date (texte)'], rows: [['20260131'], ['20261102']],
    fill: { header: 'Date', formula: '=DATE(GAUCHE(A2;4);STXT(A2;5;2);DROITE(A2;2))', results: ['d:2026-01-31', 'd:2026-11-02'] } });
  S('r:Séparer nom et prénom', { cols: ['Nom complet'], rows: [['Dupont Jean'], ['Martin Marie']],
    fill: { header: 'Nom', formula: '=GAUCHE(A2;TROUVE(" ";A2)-1)', results: ['Dupont', 'Martin'] } });
  S('r:Trimestre et semestre d’une date', { cols: ['Date'], rows: [['d:2026-02-10'], ['d:2026-08-10'], ['d:2026-11-02']],
    fill: { header: 'Trimestre', formula: '="T"&ARRONDI.SUP(MOIS(A2)/3;0)', results: ['T1', 'T3', 'T4'] } });
  S('r:Budget vs réel', { cols: ['Poste', 'Budget', 'Réel'], rows: [['Achats', 10000, 11200], ['Frais', 3000, 2400]],
    fill: { header: 'Taux de réalisation', formula: '=SIERREUR(C2/B2;"")', results: [1.12, 0.8], fmt: '%' } });
})(window.XL);
