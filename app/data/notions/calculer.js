/* Notions — activité « Calculer » (ordre = ordre de lecture conseillé). */
(function (XL) {
  'use strict';
  var N = XL.N;

  /* ------------------------------- LES BASES ------------------------------- */
  N({
    activity: 'calculer', level: 'base', title: 'Écrire une formule',
    intro: 'Une formule commence toujours par = . Elle calcule à partir des cellules et se met à jour toute seule quand les données changent.',
    points: [
      'Clique dans une cellule, tape = puis le calcul et valide avec Entrée : le résultat s’affiche dans la cellule, la formule dans la barre de formule.',
      'Désigne les cellules par leur adresse (B2) plutôt que par leur valeur : si la valeur change, le résultat suit.',
      'Opérateurs : + − * / pour calculer, ^ pour les puissances, & pour coller du texte.',
      'Priorité : ^ d’abord, puis * et /, puis + et −. Les parenthèses passent avant tout.',
      'F2 permet de modifier la formule de la cellule active.'
    ],
    sample: {
      cols: ['Article', 'Quantité', 'Prix unitaire'],
      rows: [['Stylo', 10, 1.5], ['Cahier', 4, 3.2], ['Classeur', 2, 5.9]],
      fmt: [null, null, '0.00'],
      fill: { header: 'Total', formula: '=B2*C2', results: [15, 12.8, 11.8], fmt: '0.00' }
    },
    examples: [
      ['=2+3*4', 'La multiplication passe avant l’addition.', 14],
      ['=(2+3)*4', 'Les parenthèses passent avant tout.', 20],
      ['=10/4', 'Une division.', 2.5],
      ['=2^3', '2 au cube.', 8]
    ],
    tips: ['Si la cellule affiche la formule au lieu du résultat, elle est au format Texte : mets-la au format Standard, puis F2 et Entrée.'],
    kw: 'ecrire formule premiere formule egal operateurs priorite calcul simple multiplier diviser additionner cellule'
  });

  N({
    activity: 'calculer', level: 'base', title: 'Recopier une formule (références relatives)',
    intro: 'Écris la formule une seule fois puis recopie-la : Excel adapte automatiquement les adresses à chaque ligne.',
    points: [
      'Sélectionne la cellule et tire la petite poignée carrée en bas à droite, ou double-clique dessus pour recopier jusqu’au bas du tableau.',
      'Au clavier : sélectionne la zone (formule en haut) puis Ctrl+B pour recopier vers le bas, Ctrl+D vers la droite.',
      'Une adresse comme B2 est relative : recopiée une ligne plus bas, elle devient B3.',
      'Dans un tableau structuré (Ctrl+L), la formule se recopie toute seule sur la colonne.'
    ],
    sample: {
      cols: ['Mois', 'Ventes', 'Coûts'],
      rows: [['Janv', 1200, 800], ['Févr', 950, 700], ['Mars', 1400, 900]],
      fill: { header: 'Marge', formula: '=B2-C2', results: [400, 250, 500] }
    },
    examples: [
      ['=B2-C2', 'Écrite en D2…'],
      ['=B3-C3', '…devient automatiquement celle-ci en D3.']
    ],
    tips: ['Si toutes les lignes affichent le même résultat après recopie, le calcul est peut-être en mode manuel : Formules > Options de calcul > Automatique.'],
    kw: 'recopier formule poignee recopie double clic tirer vers le bas reference relative ctrl b etendre'
  });

  N({
    activity: 'calculer', level: 'base', title: 'Bloquer une cellule avec $ (références absolues)',
    intro: 'Quand une formule doit toujours utiliser la même cellule (un taux, un total), on la bloque avec des $ pour qu’elle ne bouge pas à la recopie.',
    points: [
      '$B$1 : colonne et ligne bloquées. B$1 : seule la ligne est bloquée. $B1 : seule la colonne est bloquée.',
      'Pendant la saisie, appuie sur F4 juste après une adresse pour passer de B1 à $B$1, puis B$1, puis $B1.',
      'Cas typique : un taux ou un total placé dans une seule cellule et utilisé par toute une colonne.',
      'Les références mixtes (B$1, $A2) servent à remplir un tableau à double entrée avec une seule formule.'
    ],
    sample: {
      cols: ['Région', 'Ventes'],
      rows: [['Nord', 300], ['Sud', 500], ['Est', 200]],
      fill: { header: 'Part du total', formula: '=B2/SOMME($B$2:$B$4)', results: [0.3, 0.5, 0.2], fmt: '%' }
    },
    examples: [
      ['=A2*(1+$E$1)', 'Prix TTC avec un taux saisi une seule fois en E1.'],
      ['=$A2*B$1', 'Table de multiplication : colonne A et ligne 1 bloquées.']
    ],
    tips: ['Une formule recopiée qui donne #DIV/0! ou des résultats décalés cache souvent un $ oublié.'],
    kw: 'dollar bloquer cellule reference absolue relative mixte f4 figer cellule fixe taux constante'
  });

  N({
    activity: 'calculer', level: 'base', title: 'Calculer des pourcentages',
    intro: 'Un pourcentage est un nombre comme un autre : 20 % vaut 0,2. Le format % ne fait que changer l’affichage.',
    points: [
      'Part d’un total : partie / total.',
      'Évolution entre deux valeurs : (nouvelle − ancienne) / ancienne.',
      'Hausse de 5 % : valeur × (1 + 5 %). Baisse de 15 % : valeur × (1 − 15 %).',
      'Le bouton % (onglet Accueil) affiche 0,2 sous la forme 20 % sans changer la valeur.'
    ],
    sample: {
      cols: ['Produit', 'Prix 2025', 'Prix 2026'],
      rows: [['Café', 10, 12], ['Thé', 8, 8.4], ['Sucre', 2, 1.8]],
      fmt: [null, '0.00', '0.00'],
      fill: { header: 'Évolution', formula: '=(C2-B2)/B2', results: [0.2, 0.05, -0.1], fmt: '%' }
    },
    examples: [
      ['=50/200', 'Part : 50 sur 200.', 0.25],
      ['=100*(1+20%)', '100 augmenté de 20 %.', 120],
      ['=80*(1-15%)', '80 diminué de 15 %.', 68]
    ],
    tips: ['Une baisse de 50 % suivie d’une hausse de 50 % ne ramène pas au point de départ : 100 × 0,5 × 1,5 = 75.'],
    kw: 'pourcentage pourcent part evolution hausse baisse augmentation remise taux variation %'
  });

  N({
    activity: 'calculer', level: 'base', title: 'Les fonctions de base : SOMME, MOYENNE, MIN, MAX, NB',
    intro: 'Une fonction est un calcul tout prêt : son nom, puis entre parenthèses les cellules à utiliser.',
    points: [
      'Une plage s’écrit avec deux-points : B2:B6 désigne toutes les cellules de B2 à B6.',
      'Alt+= insère une SOMME automatique sur la colonne au-dessus.',
      'NB compte les nombres, NBVAL compte toutes les cellules non vides.',
      'SOMME et MOYENNE ignorent les cellules vides et le texte ; les zéros, eux, comptent dans la moyenne.',
      'La barre d’état, en bas de la fenêtre, affiche la somme et la moyenne de la sélection sans aucune formule.'
    ],
    sample: {
      cols: ['Vendeur', 'Ventes'],
      rows: [['Alice', 1200], ['Bruno', 850], ['Chloé', 1430], ['David', 990], ['Emma', 1100]],
      calc: [['Total', '=SOMME(B2:B6)', 5570], ['Moyenne', '=MOYENNE(B2:B6)', 1114], ['Maximum', '=MAX(B2:B6)', 1430],
        ['Minimum', '=MIN(B2:B6)', 850], ['Nombre de ventes', '=NB(B2:B6)', 5]]
    },
    tips: ['Un nombre stocké en texte (aligné à gauche) est ignoré par SOMME : si NB et NBVAL ne donnent pas le même résultat sur une colonne de montants, cherche le texte.'],
    kw: 'fonctions de base somme moyenne min max nb compter additionner plage somme automatique alt egal'
  });

  N({
    activity: 'calculer', level: 'base', title: 'Décider avec SI',
    intro: 'SI renvoie une valeur ou une autre selon qu’une condition est vraie ou fausse.',
    points: [
      'Structure : =SI(condition ; valeur si vrai ; valeur si faux).',
      'Comparaisons : = égal, <> différent, > supérieur, < inférieur, >= supérieur ou égal, <= inférieur ou égal.',
      'Le texte s’écrit entre guillemets ("Payé"), les nombres non.',
      'Deux guillemets "" renvoient une cellule qui paraît vide.'
    ],
    sample: {
      cols: ['Facture', 'Montant', 'Statut'],
      rows: [['F-101', 250, 'Payé'], ['F-102', 1300, 'Impayé'], ['F-103', 90, 'Impayé']],
      fill: { header: 'À relancer ?', formula: '=SI(C2="Impayé";"Oui";"Non")', results: ['Non', 'Oui', 'Oui'] }
    },
    examples: [
      ['=SI(B2>=1000;"Gros montant";"")', 'Signale les montants d’au moins 1 000.'],
      ['=SI(C2="Payé";0;B2)', 'Reste dû : 0 si payé, sinon le montant.']
    ],
    tips: ['Au-delà de 2 ou 3 SI imbriqués, la formule devient illisible : passe à SI.CONDITIONS ou à une table de correspondance.'],
    kw: 'si condition decider test logique vrai faux alors sinon comparaison'
  });

  /* ------------------------------ APPROFONDIR ------------------------------ */
  N({
    activity: 'calculer', level: 'approfondir', title: 'Additionner et compter selon des conditions',
    intro: 'SOMME.SI et NB.SI n’additionnent ou ne comptent que les lignes qui répondent à un critère ; leurs versions .ENS acceptent plusieurs critères.',
    points: [
      'Critère texte : "Nord". Critère numérique : ">1000", "<>0".',
      'Critère qui dépend d’une cellule : ">="&E1 (l’opérateur entre guillemets, puis & et la cellule).',
      'Jokers pour le texte : "Fact*" (commence par), "*loyer*" (contient), ? remplace un caractère.',
      'Dans SOMME.SI.ENS, la plage à additionner vient EN PREMIER ; toutes les plages doivent avoir la même taille.'
    ],
    sample: {
      cols: ['Date', 'Client', 'Montant'],
      rows: [['d:2026-01-05', 'A', 120], ['d:2026-01-12', 'B', 80], ['d:2026-02-03', 'A', 450], ['d:2026-02-15', 'C', 200], ['d:2026-03-01', 'A', 60]],
      calc: [
        ['Total du client A', '=SOMME.SI(B2:B6;"A";C2:C6)', 630],
        ['Nombre de ventes ≥ 100', '=NB.SI(C2:C6;">=100")', 3],
        ['Client A, ventes ≥ 100', '=SOMME.SI.ENS(C2:C6;B2:B6;"A";C2:C6;">=100")', 570],
        ['Ventes depuis le 01/02/2026', '=SOMME.SI.ENS(C2:C6;A2:A6;">="&DATE(2026;2;1))', 710]
      ]
    },
    examples: [
      ['=NB.SI(D2:D100;"Impayé")', 'Nombre de factures impayées.'],
      ['=SOMME.SI(A2:A100;"*loyer*";C2:C100)', 'Total des lignes dont le libellé contient « loyer ».']
    ],
    tips: ['Les jokers * et ? ne fonctionnent que sur du texte : pour tester le début d’un nombre (comptes 6…), utilise SOMMEPROD.'],
    kw: 'somme si nb si condition critere compter additionner selon somme si ens plusieurs criteres conditionnelle'
  });

  N({
    activity: 'calculer', level: 'approfondir', title: 'Combiner des conditions : ET, OU, SI.CONDITIONS',
    intro: 'ET exige que toutes les conditions soient vraies, OU qu’au moins une le soit ; SI.CONDITIONS enchaîne plusieurs cas sans imbriquer de SI.',
    points: [
      '=SI(ET(B2>=1000;C2="Oui");…) : les deux conditions doivent être remplies.',
      '=SI(OU(C2="Annulé";C2="Avoir");0;B2) : une seule suffit.',
      'SI.CONDITIONS teste les conditions dans l’ordre et s’arrête à la première vraie : termine par VRAI;"autre cas".'
    ],
    sample: {
      cols: ['Client', 'CA', 'Fidèle'],
      rows: [['Martin', 12000, 'Oui'], ['Durand', 6500, 'Oui'], ['Petit', 800, 'Oui'], ['Leroy', 7000, 'Non']],
      fill: { header: 'Remise', formula: '=SI.CONDITIONS(B2>=10000;10%;ET(B2>=5000;C2="Oui");5%;VRAI;0)', results: [0.1, 0.05, 0, 0], fmt: '%' }
    },
    examples: [
      ['=SI(OU(C2="Annulé";C2="Avoir");0;B2)', 'Neutralise les lignes annulées ou les avoirs.']
    ],
    tips: ['Avant Excel 2019, remplace SI.CONDITIONS par des SI imbriqués : =SI(B2>=10000;10%;SI(ET(B2>=5000;C2="Oui");5%;0)).'],
    kw: 'et ou plusieurs conditions si conditions imbriquer combiner tranches remise'
  });

  N({
    activity: 'calculer', level: 'approfondir', title: 'Arrondir juste : format ou ARRONDI ?',
    intro: 'Le nombre de décimales affichées ne change pas la valeur : les totaux peuvent sembler faux. ARRONDI modifie réellement la valeur.',
    points: [
      'Un montant affiché 1,24 peut valoir 1,236 : c’est la valeur complète qui est additionnée.',
      'Pour une TVA, un prix ou une paie, arrondis dans la formule : =ARRONDI(calcul;2).',
      'ARRONDI.SUP arrondit toujours au-dessus, ARRONDI.INF toujours en dessous, ARRONDI.AU.MULTIPLE à un pas (0,05…).',
      'Pour comparer deux montants calculés : =ARRONDI(A1-B1;2)=0.'
    ],
    sample: {
      cols: ['Ligne', 'Montant'],
      rows: [['A', 1.236], ['B', 1.236], ['C', 1.236]],
      fmt: [null, '0.00'],
      calc: [
        ['Somme des valeurs réelles', '=SOMME(B2:B4)', 3.708, '0.00'],
        ['Somme des montants arrondis', '=ARRONDI(B2;2)+ARRONDI(B3;2)+ARRONDI(B4;2)', 3.72, '0.00']
      ],
      note: 'Chaque ligne affiche 1,24 mais vaut 1,236 : le total affiché (3,71) ne correspond pas à 3 × 1,24 (3,72).'
    },
    examples: [['=ARRONDI(2,345;2)', 'Arrondi au centime.', 2.35], ['=ARRONDI.SUP(17/5;0)', 'Arrondi à l’unité supérieure.', 4]],
    tips: ['Les boutons « Ajouter une décimale » et « Réduire les décimales » ne modifient que l’affichage.'],
    kw: 'arrondi arrondir format decimales ecart centime total faux affichage valeur reelle'
  });

  /* -------------------------------- EXPERT -------------------------------- */
  N({
    activity: 'calculer', level: 'expert', title: 'Calculer sur des plages entières avec SOMMEPROD',
    intro: 'SOMMEPROD multiplie des colonnes ligne à ligne puis additionne. Avec des conditions entre parenthèses, elle prend le relais quand SOMME.SI.ENS ne suffit plus.',
    points: [
      '=SOMMEPROD(B2:B4;C2:C4) : somme des quantités × prix.',
      'Une condition comme (A2:A4="X") vaut 1 ou 0 : la multiplier revient à filtrer.',
      'Multiplier des conditions = ET ; les additionner = OU.',
      'Elle accepte des fonctions appliquées aux plages (GAUCHE, MOIS…), ce que SOMME.SI ne permet pas.'
    ],
    sample: {
      cols: ['Produit', 'Quantité', 'Prix'],
      rows: [['A-101', 3, 10], ['B-205', 2, 25], ['A-330', 5, 4]],
      calc: [
        ['Montant total', '=SOMMEPROD(B2:B4;C2:C4)', 100],
        ['Produits commençant par A', '=SOMMEPROD((GAUCHE(A2:A4;1)="A")*B2:B4*C2:C4)', 50]
      ]
    },
    examples: [['=SOMMEPROD((MOIS(A2:A100)=3)*C2:C100)', 'Total des ventes de mars, toutes années confondues.']],
    tips: ['Évite les colonnes entières (A:A) dans SOMMEPROD : le calcul devient très lent.'],
    kw: 'sommeprod somme produit plages entieres conditions complexes ou quantite prix'
  });

  N({
    activity: 'calculer', level: 'expert', title: 'Nommer ses calculs : LET et LAMBDA',
    intro: 'À partir d’Excel 2021, LET donne un nom aux étapes d’une formule ; LAMBDA (Excel 2024 et Microsoft 365) permet de créer ses propres fonctions.',
    points: [
      '=LET(nom; valeur; calcul) : chaque étape n’est calculée qu’une fois et la formule se lit comme une phrase.',
      'Une LAMBDA s’enregistre dans Formules > Gestionnaire de noms, puis s’utilise comme une fonction native.',
      'Pour tester une LAMBDA dans une cellule, ajoute les valeurs entre parenthèses à la fin.'
    ],
    examples: [
      ['=LET(ht;B2;tva;20%;ht*(1+tva))', 'Prix TTC avec des étapes nommées.'],
      ['=LAMBDA(ht;taux;ht*(1+taux))(100;20%)', 'LAMBDA testée directement.', 120]
    ],
    tips: ['Si Excel affiche #NOM?, ces fonctions n’existent pas dans ta version.'],
    kw: 'let lambda nommer variables fonction personnalisee creer sa fonction'
  });
})(window.XL);
