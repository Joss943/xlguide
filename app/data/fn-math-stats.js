/* Fonctions : Maths & arrondis, Statistiques & comptage */
(function (XL) {
  'use strict';
  var F = XL.F;

  /* ========================= MATHS & ARRONDIS ========================== */
  F('SOMME', 'SUM', 'math', '',
    'Additionne des nombres, des cellules ou des plages.',
    'SOMME(nombre1; [nombre2]; …)',
    [['nombre1…', 'Valeurs, cellules ou plages (jusqu’à 255).']],
    [['=SOMME(10;20;30)', 'Additionne trois valeurs.', 60],
     ['=SOMME(C2:C500)', 'Total d’une colonne de montants.'],
     ['=SOMME(Janvier:Décembre!C50)', 'Somme 3D : la cellule C50 de toutes les feuilles de Janvier à Décembre.']],
    ['Raccourci : Alt+= insère une somme automatique.',
     'Les nombres stockés en texte (alignés à gauche, triangle vert) sont IGNORÉS : contrôle avec NB() vs NBVAL().'],
    'additionner total somme cumul ajouter addition totaliser',
    'SOMME.SI SOMME.SI.ENS SOUS.TOTAL SOMMEPROD');

  F('SOMME.SI', 'SUMIF', 'math', '',
    'Additionne les valeurs qui répondent à UN critère.',
    'SOMME.SI(plage; critère; [somme_plage])',
    [['plage', 'Cellules testées par le critère.'],
     ['critère', 'Condition : "Fournisseur A", ">1000", "<>0", "6*" (commence par 6), ">="&E1…'],
     ['somme_plage', 'Cellules à additionner (si différente de plage).']],
    [['=SOMME.SI(B2:B500;"Fournisseur A";D2:D500)', 'Total des achats chez un fournisseur.'],
     ['=SOMME.SI(D2:D500;">0")', 'Somme des montants positifs uniquement.'],
     ['=SOMME.SI(A2:A500;"<"&AUJOURDHUI();D2:D500)', 'Total des échéances dépassées (critère construit avec &).']],
    ['Les caractères génériques * et ? ne marchent QUE sur du texte : si tes comptes sont des nombres, "6*" ne trouvera rien → utilise SOMMEPROD((GAUCHE(A2:A500;1)="6")*D2:D500).',
     'Critère avec opérateur + cellule : ">="&E1 (l’opérateur entre guillemets, puis &).'],
    'additionner si condition total par critere somme conditionnelle sous total par fournisseur client compte',
    'SOMME.SI.ENS SOMMEPROD NB.SI MOYENNE.SI');

  F('SOMME.SI.ENS', 'SUMIFS', 'math', '',
    'Additionne les valeurs qui répondent à PLUSIEURS critères (tous vrais en même temps). La fonction reine du reporting comptable.',
    'SOMME.SI.ENS(somme_plage; plage_critères1; critère1; [plage_critères2; critère2]; …)',
    [['somme_plage', 'Montants à additionner (EN PREMIER, contrairement à SOMME.SI).'],
     ['plage_critères1', 'Première colonne testée.'], ['critère1', 'Premier critère.'],
     ['plage_critères2…', 'Autres paires plage/critère (jusqu’à 127).']],
    [['=SOMME.SI.ENS(D:D;A:A;"607*";B:B;">="&DATE(2026;1;1);B:B;"<="&DATE(2026;3;31))', 'Achats de marchandises du 1er trimestre 2026 (comptes texte).'],
     ['=SOMME.SI.ENS(Ventes[HT];Ventes[Client];$A2;Ventes[Mois];B$1)', 'Tableau Client × Mois (références mixtes $A2 / B$1 pour recopier).'],
     ['=SOMME.SI.ENS(Factures[TTC];Factures[Statut];"Impayé";Factures[Échéance];"<"&AUJOURDHUI())', 'Encours échu.']],
    ['Toutes les plages doivent avoir exactement la même taille.',
     'Pour un OU (compte 601 OU 607), additionne deux SOMME.SI.ENS, ou utilise SOMMEPROD.'],
    'additionner plusieurs conditions criteres somme multi criteres total par mois et par compte periode entre deux dates reporting',
    'SOMME.SI SOMMEPROD NB.SI.ENS MOYENNE.SI.ENS');

  F('SOMMEPROD', 'SUMPRODUCT', 'math', '',
    'Multiplie des plages terme à terme puis additionne. En pratique : le couteau suisse des sommes conditionnelles complexes (OU, tests sur des parties de cellules, nombres…).',
    'SOMMEPROD(tableau1; [tableau2]; …)',
    [['tableau1…', 'Plages de même taille ; les conditions (A2:A9="x") valent 1 ou 0.']],
    [['=SOMMEPROD(B2:B10;C2:C10)', 'Quantités × prix unitaires = total facture.'],
     ['=SOMMEPROD((GAUCHE(A2:A500;1)="6")*D2:D500)', 'Total des charges (classe 6) même si les comptes sont des NOMBRES.'],
     ['=SOMMEPROD(((B2:B500="601")+(B2:B500="607")>0)*D2:D500)', 'Somme avec condition OU.'],
     ['=SOMMEPROD((MOIS(A2:A500)=3)*D2:D500)', 'Total du mois de mars, toutes années confondues.']],
    ['Évite les colonnes entières (A:A) : SOMMEPROD calcule chaque cellule, c’est très lent.',
     'Multiplier (*) = ET, additionner (+) = OU.'],
    'multiplier additionner produit quantite prix somme conditionnelle complexe ou plusieurs conditions moyenne ponderee',
    'SOMME.SI.ENS SOMME');

  F('SOUS.TOTAL', 'SUBTOTAL', 'math', '',
    'Calcule une somme/moyenne/nombre… en IGNORANT les lignes masquées par un filtre. Idéal en bas d’une liste filtrée.',
    'SOUS.TOTAL(no_fonction; réf1; [réf2]; …)',
    [['no_fonction', '9 = SOMME, 1 = MOYENNE, 2 = NB, 3 = NBVAL, 4 = MAX, 5 = MIN. Ajoute 100 (109, 101…) pour ignorer aussi les lignes masquées à la main.'],
     ['réf1…', 'Plages.']],
    [['=SOUS.TOTAL(109;D2:D500)', 'Total des seules lignes visibles après filtre.'],
     ['=SOUS.TOTAL(103;A2:A500)', 'Nombre de lignes visibles.']],
    ['Les SOUS.TOTAL imbriqués dans la plage sont ignorés : pas de double comptage dans les totaux de groupes.'],
    'total filtre lignes visibles filtrees masquees somme visible',
    'AGREGAT SOMME');

  F('AGREGAT', 'AGGREGATE', 'math', '2010',
    'Comme SOUS.TOTAL mais peut aussi ignorer les ERREURS. Parfait pour sommer une colonne qui contient des #N/A.',
    'AGREGAT(no_fonction; options; réf1; [k])',
    [['no_fonction', '9 = SOMME, 1 = MOYENNE, 2 = NB, 4 = MAX, 5 = MIN, 14 = GRANDE.VALEUR, 15 = PETITE.VALEUR…'],
     ['options', '6 = ignorer les erreurs ; 5 = ignorer lignes masquées ; 7 = les deux ; 3 = tout ignorer (masqué, erreurs, sous-totaux).'],
     ['réf1', 'Plage.'], ['k', 'Rang pour 14/15.']],
    [['=AGREGAT(9;6;D2:D500)', 'Somme qui ignore les #N/A et #DIV/0!.'],
     ['=AGREGAT(14;6;D2:D500;1)', 'Plus grande valeur en ignorant les erreurs.']],
    [], 'somme ignorer erreurs na total malgre erreur filtre',
    'SOUS.TOTAL SIERREUR');

  F('ARRONDI', 'ROUND', 'math', '',
    'Arrondit au nombre de décimales voulu (arrondi « commercial » : 0,5 → au-dessus). Indispensable en compta pour éviter les écarts de centimes.',
    'ARRONDI(nombre; no_chiffres)',
    [['nombre', 'Valeur à arrondir.'], ['no_chiffres', '2 = au centime ; 0 = à l’unité ; -2 = à la centaine.']],
    [['=ARRONDI(2,345;2)', 'Au centime.', 2.35],
     ['=ARRONDI(1234,5678;-2)', 'À la centaine.', 1200],
     ['=ARRONDI(B2*20%;2)', 'TVA arrondie au centime ligne par ligne.']],
    ['Le FORMAT (bouton ,00) ne fait qu’afficher : la valeur reste avec toutes ses décimales et les totaux ne tombent pas juste. Arrondis dans la formule.',
     'Compare toujours des montants calculés avec ARRONDI(A1-B1;2)=0 plutôt que A1=B1 (erreurs de virgule flottante).'],
    'arrondir centime decimales arrondi 2 chiffres ecart arrondi round',
    'ARRONDI.SUP ARRONDI.INF ARRONDI.AU.MULTIPLE TRONQUE');

  F('ARRONDI.SUP', 'ROUNDUP', 'math', '',
    'Arrondit toujours vers le HAUT (en s’éloignant de zéro).',
    'ARRONDI.SUP(nombre; no_chiffres)',
    [['nombre', 'Valeur.'], ['no_chiffres', 'Décimales.']],
    [['=ARRONDI.SUP(2,001;2)', 'Toujours au-dessus.', 2.01], ['=ARRONDI.SUP(17/5;0)', 'Nombre de cartons nécessaires.', 4]],
    [], 'arrondir au dessus superieur exces plafond',
    'ARRONDI ARRONDI.INF PLAFOND.MATH');

  F('ARRONDI.INF', 'ROUNDDOWN', 'math', '',
    'Arrondit toujours vers le BAS (vers zéro).',
    'ARRONDI.INF(nombre; no_chiffres)',
    [['nombre', 'Valeur.'], ['no_chiffres', 'Décimales.']],
    [['=ARRONDI.INF(2,999;2)', 'Toujours en dessous.', 2.99]],
    [], 'arrondir en dessous inferieur defaut tronquer',
    'ARRONDI ARRONDI.SUP TRONQUE');

  F('ARRONDI.AU.MULTIPLE', 'MROUND', 'math', '',
    'Arrondit au multiple le plus proche (0,05 €, 5 minutes, 10 €…).',
    'ARRONDI.AU.MULTIPLE(nombre; multiple)',
    [['nombre', 'Valeur.'], ['multiple', 'Pas d’arrondi.']],
    [['=ARRONDI.AU.MULTIPLE(12,37;0,05)', 'Aux 5 centimes.', 12.35],
     ['=ARRONDI.AU.MULTIPLE(A2;TEMPS(0;15;0))', 'Heure arrondie au quart d’heure.']],
    ['Nombre et multiple doivent avoir le même signe, sinon #NOMBRE!.'],
    'arrondir multiple 5 centimes quart heure pas',
    'PLAFOND.MATH PLANCHER.MATH ARRONDI');

  F('PLAFOND.MATH', 'CEILING.MATH', 'math', '2013',
    'Arrondit au multiple SUPÉRIEUR (1 par défaut).',
    'PLAFOND.MATH(nombre; [précision]; [mode])',
    [['nombre', 'Valeur.'], ['précision', 'Multiple (1 par défaut).'], ['mode', 'Pour les négatifs : 0 vers zéro, autre valeur loin de zéro.']],
    [['=PLAFOND.MATH(12,37)', 'Entier supérieur.', 13], ['=PLAFOND.MATH(12,37;0,5)', 'Demi-unité supérieure.', 12.5],
     ['=PLAFOND.MATH(12,37)-0,01', 'Prix psychologique en ,99.', 12.99]],
    [], 'arrondir multiple superieur plafond prix psychologique',
    'PLANCHER.MATH ARRONDI.SUP');

  F('PLANCHER.MATH', 'FLOOR.MATH', 'math', '2013',
    'Arrondit au multiple INFÉRIEUR (1 par défaut).',
    'PLANCHER.MATH(nombre; [précision]; [mode])',
    [['nombre', 'Valeur.'], ['précision', 'Multiple.'], ['mode', 'Pour les négatifs.']],
    [['=PLANCHER.MATH(12,87;0,5)', 'Demi-unité inférieure.', 12.5]],
    [], 'arrondir multiple inferieur plancher',
    'PLAFOND.MATH ARRONDI.INF');

  F('ENT', 'INT', 'math', '',
    'Partie entière, arrondie vers le bas (attention aux négatifs : -2,5 → -3).',
    'ENT(nombre)',
    [['nombre', 'Valeur.']],
    [['=ENT(7,9)', 'Partie entière.', 7], ['=ENT(-2,5)', 'Vers le bas, donc -3.', -3],
     ['=ENT(A2)', 'Extrait la date d’une date-heure (supprime l’heure).']],
    [], 'entier partie entiere enlever decimales supprimer heure',
    'TRONQUE ARRONDI.INF');

  F('TRONQUE', 'TRUNC', 'math', '',
    'Coupe les décimales sans arrondir (vers zéro).',
    'TRONQUE(nombre; [no_chiffres])',
    [['nombre', 'Valeur.'], ['no_chiffres', 'Décimales conservées (0 par défaut).']],
    [['=TRONQUE(-2,5)', 'Vers zéro.', -2], ['=TRONQUE(3,14159;2)', 'Garde 2 décimales.', 3.14]],
    [], 'couper decimales tronquer sans arrondir',
    'ENT ARRONDI.INF');

  F('MOD', 'MOD', 'math', '',
    'Reste d’une division. Sert aussi à calculer des durées qui passent minuit.',
    'MOD(nombre; diviseur)',
    [['nombre', 'Dividende.'], ['diviseur', 'Diviseur.']],
    [['=MOD(17;5)', 'Reste de 17 ÷ 5.', 2], ['=MOD(-7;3)', 'Le résultat a le signe du diviseur.', 2],
     ['=MOD(B2-A2;1)', 'Durée entre 22:00 et 06:00 (passage de minuit).'],
     ['=MOD(LIGNE();2)=0', 'Lignes paires (mise en forme une ligne sur deux).']],
    [], 'reste division modulo pair impair minuit',
    'QUOTIENT EST.PAIR');

  F('QUOTIENT', 'QUOTIENT', 'math', '',
    'Partie entière d’une division.',
    'QUOTIENT(numérateur; dénominateur)',
    [['numérateur', 'Dividende.'], ['dénominateur', 'Diviseur.']],
    [['=QUOTIENT(17;5)', 'Combien de fois 5 dans 17.', 3]],
    [], 'division entiere combien de fois',
    'MOD ENT');

  F('ABS', 'ABS', 'math', '',
    'Valeur absolue (supprime le signe).',
    'ABS(nombre)',
    [['nombre', 'Valeur.']],
    [['=ABS(-150)', 'Valeur absolue.', 150], ['=ABS(B2-C2)<=0,01', 'Écart toléré d’un centime entre deux montants.']],
    [], 'valeur absolue sans signe positif ecart',
    'SIGNE');

  F('SIGNE', 'SIGN', 'math', '',
    'Renvoie 1 si positif, -1 si négatif, 0 si nul.',
    'SIGNE(nombre)',
    [['nombre', 'Valeur.']],
    [['=SIGNE(-42)', 'Négatif.', -1], ['=SI(SIGNE(A2)=1;"Crédit";"Débit")', 'Sens d’un montant signé.']],
    [], 'signe positif negatif sens',
    'ABS');

  F('PUISSANCE', 'POWER', 'math', '',
    'Élève un nombre à une puissance (équivalent de ^).',
    'PUISSANCE(nombre; puissance)',
    [['nombre', 'Base.'], ['puissance', 'Exposant.']],
    [['=PUISSANCE(1,05;3)', 'Capitalisation de 5 % sur 3 ans.', 1.157625], ['=1000*(1+3%)^10', 'Même logique avec l’opérateur ^.']],
    [], 'puissance exposant capitalisation interets composes carre',
    'RACINE EXP');

  F('RACINE', 'SQRT', 'math', '',
    'Racine carrée d’un nombre positif (équivaut à nombre^(1/2)).',
    'RACINE(nombre)',
    [['nombre', 'Valeur positive.']],
    [['=RACINE(144)', 'Racine carrée.', 12]],
    [], 'racine carree',
    'PUISSANCE');

  F('PRODUIT', 'PRODUCT', 'math', '',
    'Multiplie tous les nombres fournis.',
    'PRODUIT(nombre1; [nombre2]; …)',
    [['nombre1…', 'Valeurs ou plages.']],
    [['=PRODUIT(2;3;4)', 'Produit.', 24], ['=PRODUIT(1+B2:B13)-1', 'Taux cumulé de 12 taux mensuels.']],
    [], 'multiplier produit',
    'SOMMEPROD');

  F('ALEA', 'RAND', 'math', '',
    'Nombre aléatoire entre 0 et 1 (recalculé à chaque modification).',
    'ALEA()', [],
    [['=ALEA()', 'Nombre aléatoire.']],
    ['Volatile : copie/colle en valeurs pour figer.'],
    'aleatoire hasard random', 'ALEA.ENTRE.BORNES TABLEAU.ALEA');

  F('ALEA.ENTRE.BORNES', 'RANDBETWEEN', 'math', '',
    'Entier aléatoire entre deux bornes.',
    'ALEA.ENTRE.BORNES(min; max)',
    [['min', 'Borne basse.'], ['max', 'Borne haute.']],
    [['=ALEA.ENTRE.BORNES(1;500)', 'Ligne au hasard pour un contrôle par sondage.']],
    [], 'aleatoire entier hasard sondage tirage', 'ALEA TABLEAU.ALEA');

  F('PGCD', 'GCD', 'math', '',
    'Plus grand commun diviseur.',
    'PGCD(nombre1; [nombre2]; …)',
    [['nombre1…', 'Entiers.']],
    [['=PGCD(24;36)', 'PGCD.', 12]],
    [], 'plus grand commun diviseur', 'PPCM');

  F('PPCM', 'LCM', 'math', '',
    'Plus petit commun multiple.',
    'PPCM(nombre1; [nombre2]; …)',
    [['nombre1…', 'Entiers.']],
    [['=PPCM(4;6)', 'PPCM.', 12]],
    [], 'plus petit commun multiple', 'PGCD');

  F('LOG', 'LOG', 'math', '',
    'Logarithme dans la base voulue (10 par défaut).',
    'LOG(nombre; [base])',
    [['nombre', 'Valeur positive.'], ['base', '10 par défaut.']],
    [['=LOG(1000)', 'Log base 10.', 3], ['=LOG(2;1,05)', 'Années pour doubler un capital à 5 %.']],
    [], 'logarithme log', 'LN EXP');

  F('LN', 'LN', 'math', '',
    'Logarithme népérien.',
    'LN(nombre)', [['nombre', 'Valeur positive.']],
    [['=LN(EXP(1))', 'ln(e) = 1.', 1]],
    [], 'logarithme neperien naturel', 'EXP LOG');

  F('EXP', 'EXP', 'math', '',
    'e élevé à la puissance indiquée (intérêts continus).',
    'EXP(nombre)', [['nombre', 'Exposant.']],
    [['=EXP(0)', 'e^0.', 1]],
    [], 'exponentielle e puissance', 'LN PUISSANCE');

  F('PI', 'PI', 'math', '',
    'Renvoie π (3,14159…).',
    'PI()', [],
    [['=ARRONDI(PI();4)', 'π arrondi.', 3.1416]],
    [], 'pi cercle', '');

  F('ROMAIN', 'ROMAN', 'math', '',
    'Convertit un nombre en chiffres romains (texte).',
    'ROMAIN(nombre; [type])',
    [['nombre', 'Entier de 1 à 3999.'], ['type', '0 = classique.']],
    [['=ROMAIN(2026)', 'Chiffres romains.', 'MMXXVI']],
    [], 'chiffres romains', '');

  /* ======================= STATISTIQUES & COMPTAGE ===================== */
  F('MOYENNE', 'AVERAGE', 'stats', '',
    'Moyenne arithmétique (les cellules vides et le texte sont ignorés, les zéros comptent).',
    'MOYENNE(nombre1; [nombre2]; …)',
    [['nombre1…', 'Valeurs ou plages.']],
    [['=MOYENNE(10;20;30;40)', 'Moyenne.', 25], ['=MOYENNE(B2:M2)', 'Charge mensuelle moyenne.']],
    ['Pour une moyenne pondérée : =SOMMEPROD(valeurs;poids)/SOMME(poids).'],
    'moyenne moyen average', 'MOYENNE.SI MOYENNE.SI.ENS MEDIANE SOMMEPROD');

  F('MOYENNE.SI', 'AVERAGEIF', 'stats', '',
    'Moyenne des valeurs qui répondent à un critère.',
    'MOYENNE.SI(plage; critère; [plage_moyenne])',
    [['plage', 'Cellules testées.'], ['critère', 'Condition.'], ['plage_moyenne', 'Valeurs à moyenner.']],
    [['=MOYENNE.SI(B2:B500;"Client X";D2:D500)', 'Panier moyen d’un client.'], ['=MOYENNE.SI(D2:D500;"<>0")', 'Moyenne sans les zéros.']],
    [], 'moyenne si condition moyenne conditionnelle panier moyen', 'MOYENNE.SI.ENS SOMME.SI');

  F('MOYENNE.SI.ENS', 'AVERAGEIFS', 'stats', '',
    'Moyenne des valeurs qui répondent à plusieurs critères.',
    'MOYENNE.SI.ENS(plage_moyenne; plage_critères1; critère1; [plage_critères2; critère2]; …)',
    [['plage_moyenne', 'Valeurs à moyenner (en premier).'], ['plage_critères1; critère1', 'Paires de critères.']],
    [['=MOYENNE.SI.ENS(Factures[Délai];Factures[Client];A2;Factures[Année];2026)', 'Délai moyen de paiement d’un client en 2026.']],
    [], 'moyenne plusieurs criteres delai moyen', 'MOYENNE.SI SOMME.SI.ENS');

  F('MEDIANE', 'MEDIAN', 'stats', '',
    'Valeur du milieu d’une série : moins sensible que la moyenne aux valeurs extrêmes.',
    'MEDIANE(nombre1; [nombre2]; …)',
    [['nombre1…', 'Valeurs.']],
    [['=MEDIANE(1;3;5;100)', 'Médiane (la valeur 100 n’écrase pas le résultat).', 4]],
    [], 'mediane milieu valeur centrale', 'MOYENNE MODE.SIMPLE');

  F('MODE.SIMPLE', 'MODE.SNGL', 'stats', '2010',
    'Valeur la plus fréquente d’une série de nombres.',
    'MODE.SIMPLE(nombre1; [nombre2]; …)',
    [['nombre1…', 'Valeurs.']],
    [['=MODE.SIMPLE(3;5;5;8)', 'La plus fréquente.', 5]],
    [], 'valeur plus frequente mode', 'MEDIANE NB.SI');

  F('NB', 'COUNT', 'stats', '',
    'Compte les cellules qui contiennent des NOMBRES (dates comprises).',
    'NB(valeur1; [valeur2]; …)',
    [['valeur1…', 'Plages.']],
    [['=NB(D2:D500)', 'Nombre de montants numériques.'], ['=NBVAL(D2:D500)-NB(D2:D500)', 'Détecte les montants saisis en TEXTE (import bancaire).']],
    [], 'compter nombres combien de chiffres', 'NBVAL NB.SI NB.VIDE');

  F('NBVAL', 'COUNTA', 'stats', '',
    'Compte les cellules NON VIDES (texte, nombres, erreurs…).',
    'NBVAL(valeur1; [valeur2]; …)',
    [['valeur1…', 'Plages.']],
    [['=NBVAL(A2:A500)', 'Nombre de lignes saisies.']],
    ['Une formule qui renvoie "" est comptée comme non vide.'],
    'compter non vides remplies nombre de lignes saisies', 'NB NB.VIDE LIGNES');

  F('NB.VIDE', 'COUNTBLANK', 'stats', '',
    'Compte les cellules vides d’une plage.',
    'NB.VIDE(plage)', [['plage', 'Plage à examiner.']],
    [['=NB.VIDE(E2:E500)', 'Nombre de dates de règlement non renseignées.']],
    [], 'compter vides cellules vides manquantes a completer', 'NBVAL ESTVIDE');

  F('NB.SI', 'COUNTIF', 'stats', '',
    'Compte les cellules qui répondent à un critère.',
    'NB.SI(plage; critère)',
    [['plage', 'Cellules à tester.'], ['critère', 'Condition : "Payé", ">1000", "*SNCF*", A2…']],
    [['=NB.SI(F2:F500;"Impayé")', 'Nombre de factures impayées.'],
     ['=NB.SI($B$2:$B$500;B2)>1', 'VRAI si le n° de facture apparaît plusieurs fois (doublon).'],
     ['=NB.SI(C2:C500;"*loyer*")', 'Libellés contenant « loyer ».']],
    ['Limite : NB.SI ne compare que les 15 premiers chiffres d’un nombre. Pour des IBAN ou n° longs, utilise SOMMEPROD(--(A2:A500=A2)).'],
    'compter si condition nombre de fois doublon occurrences existe combien',
    'NB.SI.ENS SOMME.SI UNIQUE');

  F('NB.SI.ENS', 'COUNTIFS', 'stats', '',
    'Compte les lignes qui répondent à plusieurs critères.',
    'NB.SI.ENS(plage_critères1; critère1; [plage_critères2; critère2]; …)',
    [['plage_critères1; critère1', 'Paires plage/critère (jusqu’à 127).']],
    [['=NB.SI.ENS(Fact[Fournisseur];A2;Fact[N°];B2)>1', 'Doublon de facture : même fournisseur ET même numéro.'],
     ['=NB.SI.ENS(Fact[Échéance];">="&DATE(2026;1;1);Fact[Échéance];"<"&DATE(2026;2;1))', 'Nombre d’échéances en janvier 2026.']],
    [], 'compter plusieurs criteres doublons multi conditions', 'NB.SI SOMME.SI.ENS');

  F('MAX', 'MAX', 'stats', '',
    'Plus grande valeur.',
    'MAX(nombre1; [nombre2]; …)', [['nombre1…', 'Valeurs.']],
    [['=MAX(12;45;7)', 'Maximum.', 45], ['=MAX(0;A2-B2)', 'Écart positif ou zéro (jamais négatif).']],
    [], 'maximum plus grand plus haute valeur', 'MIN GRANDE.VALEUR MAX.SI.ENS');

  F('MIN', 'MIN', 'stats', '',
    'Plus petite valeur.',
    'MIN(nombre1; [nombre2]; …)', [['nombre1…', 'Valeurs.']],
    [['=MIN(12;45;7)', 'Minimum.', 7], ['=MIN(B2;Plafond)', 'Plafonne une valeur.']],
    [], 'minimum plus petit plafonner', 'MAX PETITE.VALEUR MIN.SI.ENS');

  F('MAX.SI.ENS', 'MAXIFS', 'stats', '2019',
    'Plus grande valeur parmi les lignes qui répondent à des critères.',
    'MAX.SI.ENS(plage_max; plage_critères1; critère1; …)',
    [['plage_max', 'Valeurs.'], ['plage_critères1; critère1', 'Critères.']],
    [['=MAX.SI.ENS(Ventes[Date];Ventes[Client];A2)', 'Date de la dernière commande d’un client.']],
    [], 'maximum si condition derniere date plus grande facture', 'MIN.SI.ENS MAX');

  F('MIN.SI.ENS', 'MINIFS', 'stats', '2019',
    'Plus petite valeur parmi les lignes qui répondent à des critères.',
    'MIN.SI.ENS(plage_min; plage_critères1; critère1; …)',
    [['plage_min', 'Valeurs.'], ['plage_critères1; critère1', 'Critères.']],
    [['=MIN.SI.ENS(Fact[Échéance];Fact[Statut];"Impayé")', 'Plus ancienne échéance impayée.']],
    [], 'minimum si condition premiere date plus ancienne', 'MAX.SI.ENS MIN');

  F('GRANDE.VALEUR', 'LARGE', 'stats', '',
    'k-ième plus grande valeur (1 = la plus grande, 2 = la deuxième…).',
    'GRANDE.VALEUR(tableau; k)', [['tableau', 'Plage.'], ['k', 'Rang.']],
    [['=GRANDE.VALEUR(D2:D500;3)', '3e plus gros montant.']],
    [], 'top plus grandes valeurs classement deuxieme troisieme', 'PETITE.VALEUR MAX EQUATION.RANG');

  F('PETITE.VALEUR', 'SMALL', 'stats', '',
    'k-ième plus petite valeur.',
    'PETITE.VALEUR(tableau; k)', [['tableau', 'Plage.'], ['k', 'Rang.']],
    [['=PETITE.VALEUR(E2:E500;1)', 'Plus petite valeur (= MIN).']],
    [], 'plus petites valeurs classement', 'GRANDE.VALEUR MIN');

  F('EQUATION.RANG', 'RANK.EQ', 'stats', '2010',
    'Rang d’une valeur dans une liste (1 = la plus grande par défaut).',
    'EQUATION.RANG(nombre; référence; [ordre])',
    [['nombre', 'Valeur à classer.'], ['référence', 'Liste (en $ absolus).'], ['ordre', '0 = décroissant (défaut), 1 = croissant.']],
    [['=EQUATION.RANG(C2;$C$2:$C$50)', 'Classement d’un client par CA.']],
    ['Ex-aequo = même rang. Ancienne version : RANG().'],
    'rang classement position classer', 'GRANDE.VALEUR TRIERPAR');

  F('ECARTYPE.STANDARD', 'STDEV.S', 'stats', '2010',
    'Écart-type d’un échantillon (dispersion autour de la moyenne).',
    'ECARTYPE.STANDARD(nombre1; [nombre2]; …)', [['nombre1…', 'Valeurs.']],
    [['=ECARTYPE.STANDARD(B2:B13)', 'Volatilité des ventes mensuelles.']],
    ['Pour une population complète : ECARTYPE.PEARSON.'],
    'ecart type dispersion volatilite variabilite', 'ECARTYPE.PEARSON VAR.S MOYENNE');

  F('ECARTYPE.PEARSON', 'STDEV.P', 'stats', '2010',
    'Écart-type d’une population entière.',
    'ECARTYPE.PEARSON(nombre1; [nombre2]; …)', [['nombre1…', 'Valeurs.']],
    [['=ECARTYPE.PEARSON(B2:B13)', 'Écart-type de toute la série.']],
    [], 'ecart type population', 'ECARTYPE.STANDARD');

  F('VAR.S', 'VAR.S', 'stats', '2010',
    'Variance d’un échantillon.',
    'VAR.S(nombre1; [nombre2]; …)', [['nombre1…', 'Valeurs.']],
    [['=VAR.S(B2:B13)', 'Variance.']],
    [], 'variance echantillon', 'VAR.P.N ECARTYPE.STANDARD');

  F('VAR.P.N', 'VAR.P', 'stats', '2010',
    'Variance d’une population entière.',
    'VAR.P.N(nombre1; [nombre2]; …)', [['nombre1…', 'Valeurs.']],
    [['=VAR.P.N(B2:B13)', 'Variance population.']],
    [], 'variance population', 'VAR.S');

  F('CENTILE.INCLURE', 'PERCENTILE.INC', 'stats', '2010',
    'Valeur sous laquelle se trouve un pourcentage donné des données.',
    'CENTILE.INCLURE(tableau; k)', [['tableau', 'Plage.'], ['k', 'Entre 0 et 1 (0,9 = 90e centile).']],
    [['=CENTILE.INCLURE(D2:D500;0,9)', 'Montant au-dessus duquel se trouvent les 10 % plus grosses factures.']],
    [], 'centile percentile seuil pourcentage', 'QUARTILE.INCLURE MEDIANE');

  F('QUARTILE.INCLURE', 'QUARTILE.INC', 'stats', '2010',
    'Quartile d’une série (1 = 25 %, 2 = médiane, 3 = 75 %).',
    'QUARTILE.INCLURE(tableau; quart)', [['tableau', 'Plage.'], ['quart', '0 à 4.']],
    [['=QUARTILE.INCLURE(D2:D500;3)', '3e quartile.']],
    [], 'quartile repartition', 'CENTILE.INCLURE');

  F('PREVISION.LINEAIRE', 'FORECAST.LINEAR', 'stats', '2016',
    'Prévoit une valeur future par régression linéaire (tendance en ligne droite).',
    'PREVISION.LINEAIRE(x; y_connus; x_connus)',
    [['x', 'Point à prévoir (ex. mois 13).'], ['y_connus', 'Valeurs historiques (ex. CA).'], ['x_connus', 'Repères historiques (ex. 1 à 12).']],
    [['=PREVISION.LINEAIRE(13;B2:B13;A2:A13)', 'CA prévu pour le mois 13 à partir des 12 derniers.']],
    ['Ancien nom : PREVISION. Pour de la saisonnalité, regarde PREVISION.ETS.'],
    'prevision prevoir tendance futur budget projection regression', 'TENDANCE PENTE');

  F('TENDANCE', 'TREND', 'stats', '',
    'Prolonge une tendance linéaire sur plusieurs points.',
    'TENDANCE(y_connus; [x_connus]; [x_nouveaux]; [constante])',
    [['y_connus', 'Valeurs historiques.'], ['x_connus', 'Repères.'], ['x_nouveaux', 'Points à prévoir.'], ['constante', 'VRAI par défaut.']],
    [['=TENDANCE(B2:B13;A2:A13;A14:A16)', 'Projection des 3 prochains mois.']],
    [], 'tendance projection lineaire prevision', 'PREVISION.LINEAIRE PENTE');

  F('PENTE', 'SLOPE', 'stats', '',
    'Pente de la droite de régression (évolution moyenne par période).',
    'PENTE(y_connus; x_connus)', [['y_connus', 'Valeurs.'], ['x_connus', 'Repères.']],
    [['=PENTE(B2:B13;A2:A13)', 'Hausse moyenne du CA par mois.']],
    [], 'pente evolution moyenne regression', 'ORDONNEE.ORIGINE PREVISION.LINEAIRE');

  F('ORDONNEE.ORIGINE', 'INTERCEPT', 'stats', '',
    'Ordonnée à l’origine de la droite de régression (ex. part fixe d’un coût semi-variable).',
    'ORDONNEE.ORIGINE(y_connus; x_connus)', [['y_connus', 'Coûts.'], ['x_connus', 'Volumes.']],
    [['=ORDONNEE.ORIGINE(Coûts;Volumes)', 'Estimation des charges fixes.']],
    [], 'charges fixes regression origine', 'PENTE');

  F('COEFFICIENT.CORRELATION', 'CORREL', 'stats', '',
    'Coefficient de corrélation entre deux séries (-1 à 1).',
    'COEFFICIENT.CORRELATION(tableau1; tableau2)', [['tableau1', 'Série 1.'], ['tableau2', 'Série 2.']],
    [['=COEFFICIENT.CORRELATION(Pub;Ventes)', 'Lien entre dépenses de pub et ventes.']],
    [], 'correlation lien relation', 'PENTE');

  F('FREQUENCE', 'FREQUENCY', 'stats', '',
    'Compte combien de valeurs tombent dans chaque intervalle (histogramme).',
    'FREQUENCE(tableau_données; matrice_intervalles)',
    [['tableau_données', 'Valeurs.'], ['matrice_intervalles', 'Bornes hautes des tranches.']],
    [['=FREQUENCE(D2:D500;G2:G5)', 'Nombre de factures par tranche de montant.']],
    [], 'histogramme tranches repartition intervalles', 'NB.SI.ENS');

  F('MOYENNE.REDUITE', 'TRIMMEAN', 'stats', '',
    'Moyenne qui exclut un pourcentage de valeurs extrêmes.',
    'MOYENNE.REDUITE(tableau; pourcentage)', [['tableau', 'Valeurs.'], ['pourcentage', 'Part exclue (0,1 = 10 %, réparti haut/bas).']],
    [['=MOYENNE.REDUITE(D2:D500;0,1)', 'Moyenne sans les 5 % les plus hauts et 5 % les plus bas.']],
    [], 'moyenne sans extremes valeurs aberrantes', 'MOYENNE MEDIANE');

  F('MOYENNE.GEOMETRIQUE', 'GEOMEAN', 'stats', '',
    'Moyenne géométrique (taux de croissance moyens).',
    'MOYENNE.GEOMETRIQUE(nombre1; [nombre2]; …)', [['nombre1…', 'Valeurs positives.']],
    [['=MOYENNE.GEOMETRIQUE(1,05;1,1;0,98)-1', 'Taux de croissance moyen sur 3 ans.']],
    [], 'moyenne geometrique croissance moyenne', 'TAUX.INT.EQUIV');
})(window.XL);
