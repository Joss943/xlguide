/* Notions — activité « Calculer » (ordre = ordre de lecture conseillé). */
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

  /* ------------------------------- INTERMÉDIAIRE ------------------------------- */
  N({
    activity: 'calculer', level: 'intermediaire', title: 'Additionner et compter selon des conditions',
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
    activity: 'calculer', level: 'intermediaire', title: 'Combiner des conditions : ET, OU, SI.CONDITIONS',
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
    activity: 'calculer', level: 'intermediaire', title: 'Arrondir juste : format ou ARRONDI ?',
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

  N({
    activity: 'calculer', level: 'intermediaire', title: 'Chercher une valeur avec RECHERCHEV',
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
    activity: 'calculer', level: 'intermediaire', title: 'RECHERCHEX, la recherche moderne',
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
    tips: ['Si Excel affiche #NOM?, RECHERCHEX n’existe pas dans ta version : utilise RECHERCHEV.'],
    kw: 'recherchex xlookup recherche moderne gauche droite introuvable'
  });

  N({
    activity: 'calculer', level: 'intermediaire', title: 'Gérer l’introuvable : #N/A et SIERREUR',
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

  N({
    activity: 'calculer', level: 'intermediaire', title: 'Barèmes et tranches',
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
    activity: 'calculer', level: 'intermediaire', title: 'Calculer avec les dates',
    intro: 'Les dates étant des nombres, on les additionne et on les soustrait directement ; quelques fonctions les construisent et les découpent.',
    points: [
      'Écart en jours : =B2-A2. Date + 30 jours : =A2+30.',
      '=AUJOURDHUI() renvoie la date du jour (mise à jour à chaque ouverture du fichier).',
      '=DATE(2026;3;15) construit une date ; ANNEE, MOIS et JOUR la découpent.',
      'Si le résultat s’affiche comme un grand nombre (46096), applique un format Date.'
    ],
    sample: {
      cols: ['Début', 'Fin'],
      rows: [['d:2026-01-01', 'd:2026-01-31'], ['d:2026-02-10', 'd:2026-03-10'], ['d:2026-11-02', 'd:2026-12-25']],
      fill: { header: 'Jours d’écart', formula: '=B2-A2', results: [30, 28, 53] }
    },
    examples: [['=AUJOURDHUI()-A2', 'Nombre de jours écoulés depuis la date en A2.'], ['=ANNEE(A2)', 'Année de la date.']],
    kw: 'dates calculer difference entre deux dates ajouter jours aujourdhui date nombre de jours'
  });

  N({
    activity: 'calculer', level: 'intermediaire', title: 'Échéances, fins de mois et jours ouvrés',
    intro: 'FIN.MOIS, MOIS.DECALER et NB.JOURS.OUVRES couvrent la plupart des calculs d’échéances et de délais.',
    points: [
      '=FIN.MOIS(A2;0) : dernier jour du mois de A2 ; =FIN.MOIS(A2;-1)+1 : premier jour.',
      '=MOIS.DECALER(A2;3) : même jour, 3 mois plus tard.',
      '=NB.JOURS.OUVRES(début;fin;fériés) : jours du lundi au vendredi, jours fériés exclus.',
      '=JOURSEM(A2;2) : 1 = lundi … 7 = dimanche.'
    ],
    sample: {
      cols: ['Date de facture'],
      rows: [['d:2026-01-15'], ['d:2026-02-20'], ['d:2026-03-31']],
      fill: { header: 'Échéance 30 jours fin de mois', formula: '=FIN.MOIS(A2+30;0)', results: ['d:2026-02-28', 'd:2026-03-31', 'd:2026-04-30'] }
    },
    examples: [['=NB.JOURS.OUVRES(A2;B2;Fériés)', 'Jours ouvrés entre deux dates.'], ['=MOIS.DECALER(A2;12)', 'Date anniversaire.']],
    kw: 'echeance fin de mois jours ouvres delai date limite mois decaler joursem'
  });

  N({
    activity: 'calculer', level: 'intermediaire', title: 'Calculer avec les heures',
    intro: 'Pour Excel, une heure est une fraction de journée : 12:00 vaut 0,5. On peut donc soustraire des heures, à condition de bien les afficher.',
    points: [
      'Durée : =B2-A2 (format hh:mm). Pour un total de plus de 24 h : format [h]:mm.',
      'En heures décimales : =(B2-A2)*24 (7:30 devient 7,5).',
      'Si la fin est après minuit : =MOD(B2-A2;1).',
      '=TEMPS(8;30;0) construit une heure.'
    ],
    sample: {
      cols: ['Arrivée', 'Départ'],
      rows: [['t:08:30', 't:17:00'], ['t:09:15', 't:18:45'], ['t:22:00', 't:06:00']],
      fill: { header: 'Heures (décimal)', formula: '=MOD(B2-A2;1)*24', results: [8.5, 9.5, 8], fmt: '0.00' }
    },
    kw: 'heures duree temps de travail hh mm decimal minuit calculer heures'
  });

  N({
    activity: 'calculer', level: 'intermediaire', title: 'Assembler et découper du texte',
    intro: '& colle des morceaux de texte ; GAUCHE, DROITE et STXT en extraient une partie ; NBCAR compte les caractères.',
    points: [
      '=A2&" "&B2 colle le prénom, une espace et le nom.',
      '=GAUCHE(A2;2) prend les 2 premiers caractères, =DROITE(A2;3) les 3 derniers.',
      '=STXT(A2;4;4) prend 4 caractères à partir du 4e.',
      'Le résultat est du texte : pour obtenir un nombre, convertis-le avec CNUM.'
    ],
    sample: {
      cols: ['Référence'],
      rows: [['FR-2026-001'], ['BE-2025-042'], ['DE-2026-117']],
      fill: { header: 'Année', formula: '=STXT(A2;4;4)', results: ['2026', '2025', '2026'] },
      calc: [['Pays de la 1re référence', '=GAUCHE(A2;2)', 'FR'], ['Numéro de la 1re référence', '=DROITE(A2;3)', '001'], ['Longueur', '=NBCAR(A2)', 11]]
    },
    examples: [['=A2&" "&B2', 'Prénom + espace + nom.'], ['=CONCATENER("FA-";A2)', 'Même principe avec la fonction CONCATENER.']],
    kw: 'assembler concatener coller texte decouper extraire gauche droite stxt nbcar caracteres'
  });

  N({
    activity: 'calculer', level: 'intermediaire', title: 'Nettoyer du texte',
    intro: 'Les données saisies à la main ou importées contiennent souvent des espaces en trop et des majuscules incohérentes.',
    points: [
      'SUPPRESPACE enlève les espaces au début, à la fin et les espaces doublés.',
      'MAJUSCULE, MINUSCULE et NOMPROPRE uniformisent la casse.',
      'SUBSTITUE remplace un caractère par un autre partout (par exemple l’espace insécable CAR(160) des exports web).',
      'Une fois le résultat correct : copie, puis Collage spécial > Valeurs pour remplacer les données d’origine.'
    ],
    sample: {
      cols: ['Saisie brute'],
      rows: [['  jean   DUPONT '], ['MARIE  martin'], [' paul durand']],
      fill: { header: 'Nettoyé', formula: '=NOMPROPRE(SUPPRESPACE(A2))', results: ['Jean Dupont', 'Marie Martin', 'Paul Durand'] }
    },
    kw: 'nettoyer texte espaces en trop majuscules minuscules nompropre supprespace propre'
  });

  N({
    activity: 'calculer', level: 'intermediaire', title: 'Mettre en forme avec TEXTE',
    intro: 'TEXTE transforme un nombre ou une date en texte formaté, pour l’intégrer dans une phrase ou un code.',
    points: [
      '=TEXTE(A2;"0000") complète avec des zéros : 42 devient 0042.',
      '=TEXTE(A2;"jj/mm/aaaa") ou "mmmm aaaa" pour les dates (codes français : j, m, a).',
      '=TEXTE(B2;"# ##0,00 €") pour insérer un montant dans un libellé.',
      'Le résultat est du texte : il ne s’additionne plus.'
    ],
    sample: {
      cols: ['N°'],
      rows: [[7], [42], [315]],
      fill: { header: 'Code facture', formula: '="FA-"&TEXTE(A2;"0000")', results: ['FA-0007', 'FA-0042', 'FA-0315'] }
    },
    examples: [['="Échéance : "&TEXTE(B2;"jj/mm/aaaa")', 'Une date dans une phrase.']],
    tips: ['Les codes de format dépendent de la langue d’Excel : « aaaa » en français, « yyyy » en anglais.'],
    kw: 'texte format nombre zeros devant date en texte libelle mettre en forme'
  });
})(window.XL);
