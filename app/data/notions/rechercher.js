/* Notions — activité « Rechercher & croiser ». */
(function (XL) {
  'use strict';
  var N = XL.N;
  var PRODUITS = {
    cols: ['Code', 'Produit', 'Prix'],
    rows: [['P01', 'Stylo', 1.5], ['P02', 'Cahier', 3.2], ['P03', 'Classeur', 5.9], ['P04', 'Agenda', 12]],
    fmt: [null, null, '0.00']
  };
  function produits(calc) { return { cols: PRODUITS.cols, rows: PRODUITS.rows, fmt: PRODUITS.fmt, calc: calc }; }

  /* ------------------------------- LES BASES ------------------------------- */
  N({
    activity: 'rechercher', level: 'base', title: 'Chercher une valeur avec RECHERCHEV',
    intro: 'RECHERCHEV cherche une valeur dans la première colonne d’un tableau et renvoie l’information située plus à droite sur la même ligne.',
    points: [
      '=RECHERCHEV(valeur cherchée ; tableau ; n° de la colonne à renvoyer ; FAUX).',
      'Mets toujours FAUX en dernier argument pour une correspondance exacte.',
      'Bloque le tableau avec des $ ($A$2:$C$50) avant de recopier la formule.',
      'Limite : la valeur cherchée doit se trouver dans la PREMIÈRE colonne du tableau.'
    ],
    sample: produits([
      ['Prix du code P03', '=RECHERCHEV("P03";A2:C5;3;FAUX)', 5.9, '0.00'],
      ['Produit du code P02', '=RECHERCHEV("P02";A2:C5;2;FAUX)', 'Cahier']
    ]),
    examples: [['=RECHERCHEV(A2;Produits!$A$2:$C$500;3;FAUX)', 'Va chercher le prix dans la feuille « Produits ».']],
    tips: ['#N/A signifie « introuvable » : vérifie les espaces en trop et que la valeur est du même type des deux côtés (texte ou nombre).'],
    kw: 'recherchev chercher valeur tableau aller chercher information autre feuille correspondance vlookup'
  });

  N({
    activity: 'rechercher', level: 'base', title: 'RECHERCHEX, la recherche moderne',
    intro: 'Dans Excel 2021 et plus, RECHERCHEX remplace RECHERCHEV : on désigne la colonne où chercher et celle à renvoyer, dans n’importe quel ordre.',
    points: [
      '=RECHERCHEX(valeur cherchée ; colonne où chercher ; colonne à renvoyer ; "message si introuvable").',
      'Elle fonctionne aussi vers la gauche, et insérer une colonne ne casse pas la formule.',
      'La correspondance est exacte par défaut.'
    ],
    sample: produits([
      ['Code du produit « Classeur »', '=RECHERCHEX("Classeur";B2:B5;A2:A5;"Introuvable")', 'P03'],
      ['Code du produit « Gomme »', '=RECHERCHEX("Gomme";B2:B5;A2:A5;"Introuvable")', 'Introuvable']
    ]),
    tips: ['Si Excel affiche #NOM?, RECHERCHEX n’existe pas dans ta version : utilise RECHERCHEV ou INDEX + EQUIV.'],
    kw: 'recherchex xlookup recherche moderne gauche droite introuvable'
  });

  N({
    activity: 'rechercher', level: 'base', title: 'Gérer l’introuvable : #N/A et SIERREUR',
    intro: 'Quand une recherche ne trouve rien, Excel affiche #N/A. SIERREUR remplace l’erreur par un message ou une valeur de ton choix.',
    points: [
      '=SIERREUR(formule ; valeur si erreur).',
      'SI.NON.DISP ne remplace que #N/A et laisse voir les autres erreurs : plus sûr pour contrôler un fichier.',
      'Avant de masquer une erreur, comprends-la : un #N/A révèle parfois une donnée mal saisie.'
    ],
    sample: produits([
      ['Prix du code P09 (absent)', '=SIERREUR(RECHERCHEV("P09";A2:C5;3;FAUX);"Introuvable")', 'Introuvable'],
      ['Prix du code P01', '=SIERREUR(RECHERCHEV("P01";A2:C5;3;FAUX);"Introuvable")', 1.5, '0.00']
    ]),
    kw: 'erreur na #n/a sierreur introuvable masquer erreur si non disp'
  });

  /* ------------------------------ APPROFONDIR ------------------------------ */
  N({
    activity: 'rechercher', level: 'approfondir', title: 'INDEX + EQUIV : chercher dans tous les sens',
    intro: 'EQUIV trouve la position d’une valeur dans une colonne ; INDEX renvoie la valeur située à cette position. Ensemble, ils remplacent RECHERCHEV dans toutes les versions, même vers la gauche.',
    points: [
      '=EQUIV(valeur ; colonne ; 0) renvoie un numéro de ligne (0 = correspondance exacte).',
      '=INDEX(colonne à renvoyer ; numéro) renvoie la valeur de cette ligne.',
      'Combinés : =INDEX(A2:A5;EQUIV("Cahier";B2:B5;0)).',
      'Avec deux EQUIV (un pour la ligne, un pour la colonne), on lit un tableau à double entrée.'
    ],
    sample: produits([
      ['Position de « Cahier »', '=EQUIV("Cahier";B2:B5;0)', 2],
      ['Code de « Cahier » (vers la gauche)', '=INDEX(A2:A5;EQUIV("Cahier";B2:B5;0))', 'P02']
    ]),
    kw: 'index equiv recherche gauche position double entree index match'
  });

  N({
    activity: 'rechercher', level: 'approfondir', title: 'Comparer deux listes',
    intro: 'Pour savoir si chaque élément d’une liste existe dans une autre, on teste sa présence avec EQUIV ou NB.SI.',
    points: [
      '=ESTNUM(EQUIV(A2;$B$2:$B$5;0)) renvoie VRAI si A2 est présent dans la liste B.',
      '=NB.SI($B$2:$B$5;A2) compte le nombre de fois où A2 apparaît dans B (0 = absent).',
      'Fais la comparaison dans les deux sens pour trouver les absents de chaque côté.',
      'Nettoie d’abord les deux listes (espaces, majuscules) : sinon des éléments identiques semblent différents.'
    ],
    sample: {
      cols: ['Liste A', 'Liste B'],
      rows: [['Dupont', 'Martin'], ['Martin', 'Leroy'], ['Bernard', 'Dupont'], ['Petit', 'Moreau']],
      fill: { header: 'A présent dans B ?', formula: '=SI(ESTNUM(EQUIV(A2;$B$2:$B$5;0));"Oui";"Non")', results: ['Oui', 'Oui', 'Non', 'Non'] }
    },
    examples: [['=FILTRE(A2:A100;ESTNA(EQUIV(A2:A100;C2:C80;0));"Aucun")', 'Liste des éléments de A absents de C (Excel 2021+).']],
    kw: 'comparer deux listes present absent existe dans liste rapprocher difference correspondance'
  });

  N({
    activity: 'rechercher', level: 'approfondir', title: 'Repérer et supprimer les doublons',
    intro: 'NB.SI repère les valeurs présentes plusieurs fois ; Excel sait aussi les supprimer sans formule.',
    points: [
      '=NB.SI($A$2:$A$7;A2)>1 renvoie VRAI pour toutes les occurrences d’un doublon.',
      '=NB.SI($A$2:A2;A2)>1 ne signale que les répétitions (la plage s’agrandit à chaque ligne).',
      'Sans formule : Données > Supprimer les doublons (garde une copie des données avant).',
      'Avec Excel 2021+ : =UNIQUE(A2:A100) renvoie la liste sans doublon.'
    ],
    sample: {
      cols: ['N° facture'],
      rows: [['F-101'], ['F-102'], ['F-101'], ['F-103'], ['F-102'], ['F-104']],
      fill: { header: 'Déjà vu plus haut ?', formula: '=NB.SI($A$2:A2;A2)>1', results: [false, false, true, false, true, false] }
    },
    examples: [['=NB.SI($A$2:$A$500;A2)>1', 'Toutes les occurrences en double (idéal en mise en forme conditionnelle).']],
    kw: 'doublons double supprimer les doublons reperer valeurs en double unique occurrences'
  });

  /* -------------------------------- EXPERT -------------------------------- */
  N({
    activity: 'rechercher', level: 'expert', title: 'Chercher avec plusieurs critères',
    intro: 'Quand une ligne se reconnaît à la combinaison de plusieurs colonnes (produit + mois, nom + prénom), on cherche sur tous les critères à la fois.',
    points: [
      'Pour récupérer un NOMBRE quand la combinaison est unique, SOMME.SI.ENS suffit.',
      'Pour récupérer du texte (Excel 2021+) : =RECHERCHEX(1;(A2:A10=x)*(B2:B10=y);C2:C10).',
      'Toutes versions : =INDEX(C2:C10;EQUIV(1;INDEX((A2:A10=x)*(B2:B10=y);0);0)).',
      'Autre méthode : une colonne clé =A2&"|"&B2 dans chaque tableau, puis une recherche simple.'
    ],
    sample: {
      cols: ['Produit', 'Mois', 'Ventes'],
      rows: [['Stylo', 'Janv', 120], ['Stylo', 'Févr', 95], ['Cahier', 'Janv', 60], ['Cahier', 'Févr', 80]],
      calc: [['Ventes de Cahier en Févr', '=SOMME.SI.ENS(C2:C5;A2:A5;"Cahier";B2:B5;"Févr")', 80]]
    },
    examples: [['=RECHERCHEX(1;(A2:A5="Cahier")*(B2:B5="Févr");C2:C5)', 'Même résultat avec RECHERCHEX (2021+).']],
    kw: 'plusieurs criteres recherche multi criteres deux colonnes combinaison cle composite'
  });

  N({
    activity: 'rechercher', level: 'expert', title: 'Barèmes et tranches',
    intro: 'Pour appliquer un taux selon des tranches (commissions, remises), on cherche le seuil immédiatement inférieur dans une table triée.',
    points: [
      'La table contient le seuil bas de chaque tranche, triée par ordre croissant.',
      '=RECHERCHEV(montant ; table ; 2 ; VRAI) : VRAI = correspondance approchée.',
      'Avec RECHERCHEX : mode de correspondance -1 (exacte ou inférieure).'
    ],
    sample: {
      cols: ['Seuil', 'Taux'],
      rows: [[0, 0], [1000, 0.02], [5000, 0.05], [10000, 0.08]],
      fmt: [null, '%'],
      calc: [['Taux pour 7 200 €', '=RECHERCHEV(7200;A2:B5;2;VRAI)', 0.05, '%'], ['Taux pour 999 €', '=RECHERCHEV(999;A2:B5;2;VRAI)', 0, '%']]
    },
    kw: 'bareme tranches seuil commission taux par tranche approchee recherchev vrai'
  });

  N({
    activity: 'rechercher', level: 'expert', title: 'Références dynamiques : DECALER et INDIRECT',
    intro: 'DECALER construit une plage à partir d’un point de départ et d’une taille ; INDIRECT transforme un texte en adresse. Utile pour des cumuls variables ou une feuille choisie dans une liste.',
    points: [
      '=SOMME(DECALER(B2;0;0;3;1)) : somme des 3 cellules à partir de B2.',
      '=INDIRECT(A1&"!B10") : la cellule B10 de la feuille dont le nom est écrit en A1.',
      'Ces fonctions sont « volatiles » : recalculées à chaque modification, elles ralentissent les gros fichiers.'
    ],
    sample: {
      cols: ['Mois', 'Ventes'],
      rows: [['Janv', 100], ['Févr', 120], ['Mars', 90], ['Avr', 140]],
      calc: [['Cumul des 3 premiers mois', '=SOMME(DECALER(B2;0;0;3;1))', 310]]
    },
    kw: 'decaler indirect plage dynamique cumul variable feuille variable reference texte'
  });
})(window.XL);
