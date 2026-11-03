/* Fonctions : Maths & arrondis, Statistiques & comptage */
(function (XL) {
  'use strict';
  var F = XL.F;

  /* ========================= MATHS & ARRONDIS ========================= */
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
    'SOMME.SI SOMME.SI.ENS SOUS.TOTAL');

  F('SOMME.SI', 'SUMIF', 'math', '',
    'Additionne les valeurs qui répondent à UN critère.',
    'SOMME.SI(plage; critère; [somme_plage])',
    [['plage', 'Cellules testées par le critère.'],
     ['critère', 'Condition : "Fournisseur A", ">1000", "<>0", "Dup*" (commence par Dup), ">="&E1…'],
     ['somme_plage', 'Cellules à additionner (si différente de plage).']],
    [['=SOMME.SI(B2:B500;"Fournisseur A";D2:D500)', 'Total des achats chez un fournisseur.'],
     ['=SOMME.SI(D2:D500;">0")', 'Somme des montants positifs uniquement.'],
     ['=SOMME.SI(A2:A500;"<"&AUJOURDHUI();D2:D500)', 'Total des échéances dépassées (critère construit avec &).']],
    ['Les caractères génériques * et ? ne marchent que sur du texte : "Dup*" trouve « Dupont » et « Dupuis », mais "6*" ne trouve pas les nombres qui commencent par 6.',
     'Critère avec opérateur + cellule : ">="&E1 (l’opérateur entre guillemets, puis &).'],
    'additionner si condition total par critere somme conditionnelle sous total par fournisseur client categorie',
    'SOMME.SI.ENS NB.SI MOYENNE.SI');

  F('SOMME.SI.ENS', 'SUMIFS', 'math', '',
    'Additionne les valeurs qui répondent à PLUSIEURS critères (tous vrais en même temps). La fonction la plus utile pour les tableaux de synthèse.',
    'SOMME.SI.ENS(somme_plage; plage_critères1; critère1; [plage_critères2; critère2]; …)',
    [['somme_plage', 'Montants à additionner (EN PREMIER, contrairement à SOMME.SI).'],
     ['plage_critères1', 'Première colonne testée.'], ['critère1', 'Premier critère.'],
     ['plage_critères2…', 'Autres paires plage/critère (jusqu’à 127).']],
    [['=SOMME.SI.ENS(D:D;A:A;"Nord";B:B;">="&DATE(2026;1;1);B:B;"<="&DATE(2026;3;31))', 'Ventes de la région Nord au 1er trimestre 2026.'],
     ['=SOMME.SI.ENS(Ventes[HT];Ventes[Client];$A2;Ventes[Mois];B$1)', 'Tableau Client × Mois (références mixtes $A2 / B$1 pour recopier).'],
     ['=SOMME.SI.ENS(Factures[TTC];Factures[Statut];"Impayé";Factures[Échéance];"<"&AUJOURDHUI())', 'Total des factures impayées dont l’échéance est passée.']],
    ['Toutes les plages doivent avoir exactement la même taille.',
     'Pour un OU (région Nord OU Sud), additionne deux SOMME.SI.ENS.'],
    'additionner plusieurs conditions criteres somme multi criteres total par mois et par categorie periode entre deux dates synthese',
    'SOMME.SI NB.SI.ENS MOYENNE.SI.ENS');

  F('SOUS.TOTAL', 'SUBTOTAL', 'math', '',
    'Calcule une somme/moyenne/nombre… en IGNORANT les lignes masquées par un filtre. Idéal en bas d’une liste filtrée.',
    'SOUS.TOTAL(no_fonction; réf1; [réf2]; …)',
    [['no_fonction', '9 = SOMME, 1 = MOYENNE, 2 = NB, 3 = NBVAL, 4 = MAX, 5 = MIN. Ajoute 100 (109, 101…) pour ignorer aussi les lignes masquées à la main.'],
     ['réf1…', 'Plages.']],
    [['=SOUS.TOTAL(109;D2:D500)', 'Total des seules lignes visibles après filtre.'],
     ['=SOUS.TOTAL(103;A2:A500)', 'Nombre de lignes visibles.']],
    ['Les SOUS.TOTAL imbriqués dans la plage sont ignorés : pas de double comptage dans les totaux de groupes.'],
    'total filtre lignes visibles filtrees masquees somme visible',
    'SOMME');

  F('ARRONDI', 'ROUND', 'math', '',
    'Arrondit au nombre de décimales voulu (arrondi « commercial » : 0,5 → au-dessus). Indispensable pour éviter les écarts de centimes dans les totaux.',
    'ARRONDI(nombre; no_chiffres)',
    [['nombre', 'Valeur à arrondir.'], ['no_chiffres', '2 = au centime ; 0 = à l’unité ; -2 = à la centaine.']],
    [['=ARRONDI(2,345;2)', 'Au centime.', 2.35],
     ['=ARRONDI(1234,5678;-2)', 'À la centaine.', 1200],
     ['=ARRONDI(B2*20%;2)', 'TVA arrondie au centime ligne par ligne.']],
    ['Le FORMAT (bouton ,00) ne fait qu’afficher : la valeur reste avec toutes ses décimales et les totaux ne tombent pas juste. Arrondis dans la formule.',
     'Compare toujours des montants calculés avec ARRONDI(A1-B1;2)=0 plutôt que A1=B1 (erreurs de virgule flottante).'],
    'arrondir centime decimales arrondi 2 chiffres ecart arrondi round',
    'ARRONDI.SUP ARRONDI.INF ARRONDI.AU.MULTIPLE');

  F('ARRONDI.SUP', 'ROUNDUP', 'math', '',
    'Arrondit toujours vers le HAUT (en s’éloignant de zéro).',
    'ARRONDI.SUP(nombre; no_chiffres)',
    [['nombre', 'Valeur.'], ['no_chiffres', 'Décimales.']],
    [['=ARRONDI.SUP(2,001;2)', 'Toujours au-dessus.', 2.01], ['=ARRONDI.SUP(17/5;0)', 'Nombre de cartons nécessaires.', 4]],
    [], 'arrondir au dessus superieur exces plafond',
    'ARRONDI ARRONDI.INF');

  F('ARRONDI.INF', 'ROUNDDOWN', 'math', '',
    'Arrondit toujours vers le BAS (vers zéro).',
    'ARRONDI.INF(nombre; no_chiffres)',
    [['nombre', 'Valeur.'], ['no_chiffres', 'Décimales.']],
    [['=ARRONDI.INF(2,999;2)', 'Toujours en dessous.', 2.99]],
    [], 'arrondir en dessous inferieur defaut tronquer',
    'ARRONDI ARRONDI.SUP');

  F('ARRONDI.AU.MULTIPLE', 'MROUND', 'math', '',
    'Arrondit au multiple le plus proche (0,05 €, 5 minutes, 10 €…).',
    'ARRONDI.AU.MULTIPLE(nombre; multiple)',
    [['nombre', 'Valeur.'], ['multiple', 'Pas d’arrondi.']],
    [['=ARRONDI.AU.MULTIPLE(12,37;0,05)', 'Aux 5 centimes.', 12.35],
     ['=ARRONDI.AU.MULTIPLE(A2;TEMPS(0;15;0))', 'Heure arrondie au quart d’heure.']],
    ['Nombre et multiple doivent avoir le même signe, sinon #NOMBRE!.'],
    'arrondir multiple 5 centimes quart heure pas',
    'ARRONDI');

  F('ENT', 'INT', 'math', '',
    'Partie entière, arrondie vers le bas (attention aux négatifs : -2,5 → -3).',
    'ENT(nombre)',
    [['nombre', 'Valeur.']],
    [['=ENT(7,9)', 'Partie entière.', 7], ['=ENT(-2,5)', 'Vers le bas, donc -3.', -3],
     ['=ENT(A2)', 'Extrait la date d’une date-heure (supprime l’heure).']],
    [], 'entier partie entiere enlever decimales supprimer heure',
    'ARRONDI.INF');

  F('MOD', 'MOD', 'math', '',
    'Reste d’une division. Sert aussi à calculer des durées qui passent minuit.',
    'MOD(nombre; diviseur)',
    [['nombre', 'Dividende.'], ['diviseur', 'Diviseur.']],
    [['=MOD(17;5)', 'Reste de 17 ÷ 5.', 2], ['=MOD(-7;3)', 'Le résultat a le signe du diviseur.', 2],
     ['=MOD(B2-A2;1)', 'Durée entre 22:00 et 06:00 (passage de minuit).']],
    [], 'reste division modulo pair impair minuit',
    '');

  F('ABS', 'ABS', 'math', '',
    'Valeur absolue (supprime le signe).',
    'ABS(nombre)',
    [['nombre', 'Valeur.']],
    [['=ABS(-150)', 'Valeur absolue.', 150], ['=ABS(B2-C2)<=0,01', 'Écart toléré d’un centime entre deux montants.']],
    [], 'valeur absolue sans signe positif ecart',
    '');

  F('SOMMEPROD', 'SUMPRODUCT', 'math', '',
    'Multiplie des plages ligne à ligne puis additionne. Avec des conditions, elle fait des sommes que SOMME.SI.ENS ne sait pas faire.',
    'SOMMEPROD(tableau1; [tableau2]; …)',
    [['tableau1…', 'Plages de même taille ; une condition comme (A2:A9="x") vaut 1 ou 0.']],
    [['=SOMMEPROD(B2:B10;C2:C10)', 'Quantités × prix unitaires : le montant total d’une commande.'],
     ['=SOMMEPROD((MOIS(A2:A500)=3)*D2:D500)', 'Total du mois de mars, toutes années confondues.'],
     ['=SOMMEPROD(((B2:B500="Nord")+(B2:B500="Sud")>0)*D2:D500)', 'Somme avec une condition OU : régions Nord ou Sud.']],
    ['Évite les colonnes entières (A:A) : SOMMEPROD calcule chaque cellule, c’est très lent.',
     'Multiplier des conditions (*) = ET ; les additionner (+) = OU.'],
    'multiplier additionner quantite prix somme conditionnelle complexe ou plusieurs conditions moyenne ponderee',
    'SOMME.SI.ENS SOMME');

  F('AGREGAT', 'AGGREGATE', 'math', '2010',
    'Comme SOUS.TOTAL, mais peut aussi ignorer les erreurs : pratique pour additionner une colonne qui contient des #N/A.',
    'AGREGAT(no_fonction; options; réf1; [k])',
    [['no_fonction', '9 = SOMME, 1 = MOYENNE, 2 = NB, 4 = MAX, 5 = MIN, 14 = GRANDE.VALEUR, 15 = PETITE.VALEUR…'],
     ['options', '6 = ignorer les erreurs ; 5 = ignorer les lignes masquées ; 7 = les deux.'],
     ['réf1', 'Plage.'], ['k', 'Rang, pour 14 et 15.']],
    [['=AGREGAT(9;6;D2:D500)', 'Somme qui ignore les #N/A et les #DIV/0!.'],
     ['=AGREGAT(14;6;D2:D500;1)', 'Plus grande valeur, erreurs ignorées.']],
    [], 'somme en ignorant les erreurs na total malgre erreur lignes masquees',
    'SOUS.TOTAL SIERREUR');

  /* ===================== STATISTIQUES & COMPTAGE ===================== */
  F('MOYENNE', 'AVERAGE', 'stats', '',
    'Moyenne arithmétique (les cellules vides et le texte sont ignorés, les zéros comptent).',
    'MOYENNE(nombre1; [nombre2]; …)',
    [['nombre1…', 'Valeurs ou plages.']],
    [['=MOYENNE(10;20;30;40)', 'Moyenne.', 25], ['=MOYENNE(B2:M2)', 'Charge mensuelle moyenne.']],
    [],
    'moyenne moyen average', 'MOYENNE.SI MOYENNE.SI.ENS MEDIANE');

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
    [], 'mediane milieu valeur centrale', 'MOYENNE');

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
    'compter non vides remplies nombre de lignes saisies', 'NB NB.VIDE');

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
    ['Pour compter selon plusieurs critères à la fois, utilise NB.SI.ENS.'],
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
    [], 'maximum plus grand plus haute valeur', 'MIN GRANDE.VALEUR');

  F('MIN', 'MIN', 'stats', '',
    'Plus petite valeur.',
    'MIN(nombre1; [nombre2]; …)', [['nombre1…', 'Valeurs.']],
    [['=MIN(12;45;7)', 'Minimum.', 7], ['=MIN(B2;Plafond)', 'Plafonne une valeur.']],
    [], 'minimum plus petit plafonner', 'MAX PETITE.VALEUR');

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
    'rang classement position classer', 'GRANDE.VALEUR');
  F('MAX.SI.ENS', 'MAXIFS', 'stats', '2019',
    'Plus grande valeur parmi les lignes qui répondent à un ou plusieurs critères.',
    'MAX.SI.ENS(plage_max; plage_critères1; critère1; …)',
    [['plage_max', 'Valeurs parmi lesquelles chercher le maximum.'], ['plage_critères1; critère1', 'Où tester et quoi tester.']],
    [['=MAX.SI.ENS(C2:C500;A2:A500;"Martin")', 'Date de la dernière commande du client Martin (dates en colonne C).']],
    [], 'maximum avec condition derniere date plus grande valeur si', 'MIN.SI.ENS MAX');

  F('MIN.SI.ENS', 'MINIFS', 'stats', '2019',
    'Plus petite valeur parmi les lignes qui répondent à un ou plusieurs critères.',
    'MIN.SI.ENS(plage_min; plage_critères1; critère1; …)',
    [['plage_min', 'Valeurs parmi lesquelles chercher le minimum.'], ['plage_critères1; critère1', 'Où tester et quoi tester.']],
    [['=MIN.SI.ENS(C2:C500;D2:D500;"En attente")', 'Date la plus ancienne parmi les commandes « En attente ».']],
    [], 'minimum avec condition premiere date plus ancienne plus petite valeur si', 'MAX.SI.ENS MIN');

  F('ECARTYPE.STANDARD', 'STDEV.S', 'stats', '2010',
    'Écart-type d’un échantillon : il mesure à quel point les valeurs s’éloignent de la moyenne.',
    'ECARTYPE.STANDARD(nombre1; [nombre2]; …)', [['nombre1…', 'Valeurs.']],
    [['=ECARTYPE.STANDARD(B2:B13)', 'Variabilité des ventes mensuelles : plus le résultat est grand, plus elles varient.']],
    ['Pour une population complète (toutes les valeurs, pas un échantillon) : ECARTYPE.PEARSON.'],
    'ecart type dispersion variabilite statistiques', 'MOYENNE MEDIANE');

  F('QUARTILE.INCLURE', 'QUARTILE.INC', 'stats', '2010',
    'Quartile d’une série : 1 = 25 % des valeurs sont en dessous, 2 = la médiane, 3 = 75 %.',
    'QUARTILE.INCLURE(tableau; quart)', [['tableau', 'Plage de nombres.'], ['quart', '0 = minimum, 1, 2, 3, 4 = maximum.']],
    [['=QUARTILE.INCLURE(B2:B500;3)', '3e quartile : 75 % des valeurs sont inférieures ou égales.']],
    [], 'quartile repartition statistiques', 'MEDIANE');

  F('PREVISION.LINEAIRE', 'FORECAST.LINEAR', 'stats', '2016',
    'Prévoit une valeur future en prolongeant la tendance en ligne droite.',
    'PREVISION.LINEAIRE(x; y_connus; x_connus)',
    [['x', 'Point à prévoir (par exemple le mois 13).'], ['y_connus', 'Valeurs connues (par exemple le chiffre d’affaires).'], ['x_connus', 'Repères connus (par exemple les mois 1 à 12).']],
    [['=PREVISION.LINEAIRE(13;B2:B13;A2:A13)', 'Chiffre d’affaires prévu pour le mois 13, à partir des 12 mois connus.']],
    ['Ancien nom : PREVISION. Une droite ignore la saisonnalité : c’est un ordre de grandeur.'],
    'prevision prevoir tendance futur projection estimation', 'MOYENNE');

})(window.XL);
