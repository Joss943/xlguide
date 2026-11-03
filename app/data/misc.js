/* Erreurs Excel, raccourcis clavier, noms supplémentaires pour le traducteur */
(function (XL) {
  'use strict';
  var E = XL.E, K = XL.K;

  /* ================================ ERREURS ================================ */
  E('#N/A', '#N/A',
    'La valeur cherchée est introuvable (RECHERCHEV, RECHERCHEX…).',
    ['Vérifie que la valeur existe vraiment : espaces en trop (SUPPRESPACE), nombre stocké en texte d’un côté et nombre de l’autre.',
     'Uniformise les types : =RECHERCHEV(A2&"";…) si la table contient du texte, ou CNUM(A2) si elle contient des nombres.',
     'RECHERCHEV : 4e argument à FAUX pour une recherche exacte.',
     'Pour afficher un message : SI.NON.DISP(formule;"Introuvable").'],
    'introuvable recherchev na non disponible');

  E('#DIV/0!', '#DIV/0!',
    'Division par zéro ou par une cellule vide.',
    ['Protège la division : =SI(B2=0;"";A2/B2) ou =SIERREUR(A2/B2;0).',
     'MOYENNE d’une plage sans aucun nombre renvoie aussi cette erreur.'],
    'division zero diviser vide');

  E('#VALEUR!', '#VALUE!',
    'Type de donnée incorrect : du texte là où un nombre est attendu, une date texte non reconnue…',
    ['Repère le texte : =ESTTEXTE(A2). Un espace invisible suffit à transformer un nombre en texte.',
     'Convertis avec CNUM(A2), ou sans formule : Données > Convertir > Terminer.',
     'Dans SOMME.SI.ENS, des plages de tailles différentes provoquent aussi #VALEUR!.'],
    'type texte nombre incorrect valeur');

  E('#REF!', '#REF!',
    'La formule pointe vers une cellule qui n’existe plus (ligne, colonne ou feuille supprimée).',
    ['Annule (Ctrl+Z) la suppression si possible.',
     'Sinon, corrige la référence à la main dans la formule.',
     'Prévention : travaille avec des tableaux structurés (Ctrl+L) et RECHERCHEX au lieu de numéros de colonnes.'],
    'reference supprimee cellule supprimee lien casse');

  E('#NOM?', '#NAME?',
    'Excel ne reconnaît pas un nom : faute de frappe dans la fonction, nom défini inexistant, texte sans guillemets, ou fonction absente de ta version.',
    ['Vérifie l’orthographe (en Excel français : SOMME et non SUM).',
     'Le texte doit être entre guillemets : =SI(A2="Payé";…).',
     'Fonction récente (RECHERCHEX, FILTRE…) dans une ancienne version : voir le badge de version dans XLGuide.',
     'Formule copiée d’un tutoriel anglais : passe-la dans l’onglet Traducteur.'],
    'nom inconnu fonction inconnue orthographe version anglais');

  E('#NOMBRE!', '#NUM!',
    'Calcul numérique impossible : nombre trop grand, racine d’un nombre négatif, DATEDIF avec des dates inversées…',
    ['DATEDIF : la date de début doit être antérieure à la date de fin.',
     'Cherche la valeur en cause : un nombre négatif là où il faut un positif (racine carrée…), ou un résultat trop grand.'],
    'nombre calcul impossible num negatif');

  E('#NUL!', '#NULL!',
    'Intersection vide entre deux plages, souvent un espace à la place de « : » ou « ; ».',
    ['Remplace =SOMME(A1 A10) par =SOMME(A1:A10).'],
    'intersection espace plage');

  E('#PROPAGATION!', '#SPILL!',
    'Une formule à résultat dynamique (FILTRE, TRIER, UNIQUE…) ne peut pas « déborder » : des cellules de destination ne sont pas vides, ou elle est dans un tableau structuré.',
    ['Vide la zone sous/à droite de la formule.',
     'Les formules dynamiques ne fonctionnent pas à l’intérieur d’un tableau structuré : place-les à côté.',
     'Si tu ne veux qu’une valeur, préfixe la plage avec @ (intersection implicite).'],
    'spill propagation debordement filtre trier unique dynamique');

  E('#CALC!', '#CALC!',
    'Le moteur de calcul ne peut pas produire le résultat, le plus souvent un FILTRE qui ne trouve aucune ligne et n’a pas de 3e argument.',
    ['FILTRE : ajoute le 3e argument =FILTRE(…;…;"Aucun résultat").'],
    'calc filtre vide aucun resultat');

  E('######', '######',
    'Pas une vraie erreur : la colonne est trop étroite, ou une date/heure est négative.',
    ['Double-clique sur la bordure de l’en-tête de colonne pour l’élargir.',
     'Date négative : vérifie l’ordre de la soustraction (fin - début).'],
    'diese colonne etroite largeur date negative');

  E('Référence circulaire', 'Circular reference',
    'Une formule fait référence (directement ou non) à sa propre cellule.',
    ['Formules > Vérification des erreurs > Références circulaires pour localiser la cellule.',
     'Classique : un total qui inclut sa propre ligne (=SOMME(D2:D50) écrit en D50).'],
    'reference circulaire boucle calcul');

  E('Formule affichée en texte', 'Formula shown as text',
    'La cellule affiche « =SOMME(A1:A5) » au lieu du résultat : elle est au format Texte, ou l’affichage des formules est activé.',
    ['Mets la cellule au format Standard puis F2 + Entrée.',
     'Onglet Formules > désactive « Afficher les formules ».'],
    'formule ne calcule pas affiche formule texte');

  E('Nombre stocké sous forme de texte', 'Number stored as text',
    'Triangle vert dans le coin : le nombre est du texte, il est ignoré par SOMME et fait échouer les recherches.',
    ['Sélectionne la plage > losange jaune > Convertir en nombre.',
     'Ou Données > Convertir > Terminer.',
     'En formule : =CNUM(A2).'],
    'triangle vert nombre texte somme ne marche pas ignore');

  E('Calcul manuel', 'Manual calculation',
    'Les formules ne se mettent plus à jour : le classeur est passé en mode de calcul manuel.',
    ['Formules > Options de calcul > Automatique.', 'F9 force un recalcul.'],
    'ne se met pas a jour recalcul manuel automatique');

  /* ============================== RACCOURCIS =============================== */
  // Excel pour Windows, clavier français AZERTY.
  K('Saisie', 'F2', 'Modifier la cellule active');
  K('Saisie', 'F4', 'Pendant la saisie d’une référence : bascule A1 → $A$1 → A$1 → $A1');
  K('Saisie', 'Alt + Entrée', 'Retour à la ligne dans une cellule');
  K('Saisie', 'Ctrl + Entrée', 'Remplir toutes les cellules sélectionnées avec la saisie');
  K('Saisie', 'Ctrl + ;', 'Insérer la date du jour (fixe)');
  K('Saisie', 'Ctrl + :', 'Insérer l’heure actuelle (fixe)');
  K('Saisie', 'Alt + =', 'Somme automatique');
  K('Saisie', 'Ctrl + B', 'Recopier vers le bas');
  K('Saisie', 'Ctrl + D', 'Recopier vers la droite');
  K('Saisie', 'Ctrl + Z / Ctrl + Y', 'Annuler / Rétablir');
  K('Formules', 'F9 (dans la barre de formule)', 'Évaluer la partie sélectionnée d’une formule (Échap pour annuler)');
  K('Formules', 'F9', 'Recalculer le classeur');
  K('Formules', 'Maj + F3', 'Assistant Insérer une fonction');
  K('Formules', 'Ctrl + F3', 'Gestionnaire de noms');
  K('Formules', 'F3', 'Coller un nom défini dans la formule');
  K('Formules', 'Ctrl + Maj + U', 'Agrandir / réduire la barre de formule');
  K('Navigation', 'Ctrl + Flèche', 'Aller au bout de la zone de données');
  K('Navigation', 'Ctrl + Maj + Flèche', 'Sélectionner jusqu’au bout de la zone');
  K('Navigation', 'Ctrl + Origine / Ctrl + Fin', 'Aller en A1 / à la dernière cellule utilisée');
  K('Navigation', 'Ctrl + Pg.Suiv / Pg.Préc', 'Feuille suivante / précédente');
  K('Navigation', 'F5', 'Atteindre (puis « Cellules… » pour sélectionner vides, formules, constantes)');
  K('Navigation', 'Ctrl + Espace', 'Sélectionner la colonne');
  K('Navigation', 'Maj + Espace', 'Sélectionner la ligne');
  K('Navigation', 'Ctrl + A', 'Sélectionner la zone puis toute la feuille');
  K('Mise en forme', 'Ctrl + 1', 'Format de cellule');
  K('Mise en forme', 'Ctrl + G / Ctrl + I / Ctrl + U', 'Gras / Italique / Souligné');
  K('Mise en forme', 'Ctrl + L', 'Mettre sous forme de tableau structuré');
  K('Données', 'Ctrl + Maj + L', 'Activer / désactiver les filtres');
  K('Données', 'Ctrl + F / Ctrl + H', 'Rechercher / Remplacer');
  K('Données', 'Ctrl + + / Ctrl + -', 'Insérer / supprimer des cellules, lignes ou colonnes');
  K('Données', 'Alt + F1 / F11', 'Créer un graphique (sur la feuille / sur une nouvelle feuille)');
  K('Classeur', 'Maj + F11', 'Insérer une nouvelle feuille');
  K('Classeur', 'F12', 'Enregistrer sous');
  K('Classeur', 'Alt', 'Afficher les touches d’accès du ruban (navigation 100 % clavier)');

  /* =================== NOMS SUPPLÉMENTAIRES (traducteur) =================== */
  // Fonctions sans fiche, reconnues par le traducteur FR ⇄ EN.
  var extra = {
    'PLANCHER': 'FLOOR', 'PLAFOND': 'CEILING', 'RANG': 'RANK', 'PREVISION': 'FORECAST',
    'PREVISION.ETS': 'FORECAST.ETS', 'CROISSANCE': 'GROWTH', 'MAXA': 'MAXA', 'MINA': 'MINA',
    'SOMME.CARRES': 'SUMSQ', 'ESTREF': 'ISREF', 'ZONES': 'AREAS', 'TYPE': 'TYPE', 'T': 'T',
    'ECARTYPE': 'STDEV', 'MODE': 'MODE', 'CENTILE': 'PERCENTILE', 'QUARTILE': 'QUARTILE',
    'SIN': 'SIN', 'COS': 'COS', 'TAN': 'TAN', 'LOG10': 'LOG10', 'FACT': 'FACT', 'COMBIN': 'COMBIN',
    'PAIR': 'EVEN', 'IMPAIR': 'ODD', 'ARRONDI.AU.MULTIPLE': 'MROUND', 'TABLEAUENTEXTE': 'ARRAYTOTEXT',
    'LOI.NORMALE.N': 'NORM.DIST', 'LOI.NORMALE.INVERSE.N': 'NORM.INV', 'NBVAL': 'COUNTA',
    'MOYENNE.RANG': 'RANK.AVG', 'COVARIANCE.STANDARD': 'COVARIANCE.S', 'COEFFICIENT.DETERMINATION': 'RSQ',
    // Fonctions spécialisées retirées des fiches en 1.3.0 (finance, statistiques, ingénierie…)
    'ADRESSE': 'ADDRESS', 'AGREGAT': 'AGGREGATE', 'ALEA': 'RAND', 'ALEA.ENTRE.BORNES': 'RANDBETWEEN',
    'AMORDEGRC': 'AMORDEGRC', 'AMORLIN': 'SLN', 'AMORLINC': 'AMORLINC', 'ASSEMB.H': 'HSTACK', 'ASSEMB.V': 'VSTACK',
    'BASE': 'BASE', 'BDLIRE': 'DGET', 'BDMAX': 'DMAX', 'BDMIN': 'DMIN', 'BDMOYENNE': 'DAVERAGE', 'BDNB': 'DCOUNT',
    'BDNBVAL': 'DCOUNTA', 'BDSOMME': 'DSUM', 'BINDEC': 'BIN2DEC', 'BITET': 'BITAND', 'BITOU': 'BITOR',
    'BYCOL': 'BYCOL', 'BYROW': 'BYROW', 'CAR': 'CHAR', 'CELLULE': 'CELL', 'CENTILE.INCLURE': 'PERCENTILE.INC',
    'CHOISIR': 'CHOOSE', 'CHOISIRCOLS': 'CHOOSECOLS', 'CHOISIRLIGNES': 'CHOOSEROWS', 'CODE': 'CODE',
    'COEFFICIENT.CORRELATION': 'CORREL', 'COLONNE': 'COLUMN', 'COLONNES': 'COLUMNS', 'CONCAT': 'CONCAT',
    'CONVERT': 'CONVERT', 'CTXT': 'FIXED', 'CUMUL.INTER': 'CUMIPMT', 'CUMUL.PRINCPER': 'CUMPRINC', 'DANSCOL': 'TOCOL',
    'DANSLIGNE': 'TOROW', 'DATEVAL': 'DATEVALUE', 'DB': 'DB', 'DDB': 'DDB', 'DECALER': 'OFFSET', 'DECBIN': 'DEC2BIN',
    'DECHEX': 'DEC2HEX', 'DECIMAL': 'DECIMAL', 'DEVISE': 'DOLLAR', 'ECARTYPE.PEARSON': 'STDEV.P',
    'ECARTYPE.STANDARD': 'STDEV.S', 'EPURAGE': 'CLEAN', 'EQUIV': 'MATCH', 'EQUIVX': 'XMATCH', 'EST.IMPAIR': 'ISODD',
    'EST.PAIR': 'ISEVEN', 'ESTERR': 'ISERR', 'ESTERREUR': 'ISERROR', 'ESTFORMULE': 'ISFORMULA',
    'ESTLOGIQUE': 'ISLOGICAL', 'ESTNA': 'ISNA', 'EXACT': 'EXACT', 'EXCLURE': 'DROP', 'EXP': 'EXP', 'FEUILLE': 'SHEET',
    'FORMULETEXTE': 'FORMULATEXT', 'FRACTION.ANNEE': 'YEARFRAC', 'FRACTIONNER.TEXTE': 'TEXTSPLIT',
    'FREQUENCE': 'FREQUENCY', 'HEXDEC': 'HEX2DEC', 'INDEX': 'INDEX', 'INDIRECT': 'INDIRECT', 'INTPER': 'IPMT',
    'JOURS': 'DAYS', 'JOURS360': 'DAYS360', 'LAMBDA': 'LAMBDA', 'LET': 'LET', 'LIEN_HYPERTEXTE': 'HYPERLINK',
    'LIGNE': 'ROW', 'LIGNES': 'ROWS', 'LIREDONNEESTABCROISDYNAMIQUE': 'GETPIVOTDATA', 'LN': 'LN', 'LOG': 'LOG',
    'MAX.SI.ENS': 'MAXIFS', 'MIN.SI.ENS': 'MINIFS', 'MODE.SIMPLE': 'MODE.SNGL', 'MOYENNE.GEOMETRIQUE': 'GEOMEAN',
    'MOYENNE.REDUITE': 'TRIMMEAN', 'N': 'N', 'NA': 'NA', 'NB.JOURS.OUVRES.INTL': 'NETWORKDAYS.INTL',
    'NO.SEMAINE': 'WEEKNUM', 'NO.SEMAINE.ISO': 'ISOWEEKNUM', 'NPM': 'NPER', 'ORDONNEE.ORIGINE': 'INTERCEPT',
    'ORGA.COLS': 'WRAPCOLS', 'ORGA.LIGNES': 'WRAPROWS', 'OUX': 'XOR', 'PDUREE': 'PDURATION', 'PENTE': 'SLOPE',
    'PGCD': 'GCD', 'PI': 'PI', 'PIVOTER.PAR': 'PIVOTBY', 'PLAFOND.MATH': 'CEILING.MATH', 'PLANCHER.MATH': 'FLOOR.MATH',
    'PPCM': 'LCM', 'PRENDRE': 'TAKE', 'PREVISION.LINEAIRE': 'FORECAST.LINEAR', 'PRINCPER': 'PPMT',
    'PRODUIT': 'PRODUCT', 'PUISSANCE': 'POWER', 'QUARTILE.INCLURE': 'QUARTILE.INC', 'QUOTIENT': 'QUOTIENT',
    'RACINE': 'SQRT', 'RECHERCHE': 'LOOKUP', 'RECHERCHEH': 'HLOOKUP', 'REMPLACER': 'REPLACE', 'REPT': 'REPT',
    'ROMAIN': 'ROMAN', 'SECONDE': 'SECOND', 'SEQUENCE': 'SEQUENCE', 'SERIE.JOUR.OUVRE': 'WORKDAY',
    'SERIE.JOUR.OUVRE.INTL': 'WORKDAY.INTL', 'SI.MULTIPLE': 'SWITCH', 'SIGNE': 'SIGN', 'SOMMEPROD': 'SUMPRODUCT',
    'SYD': 'SYD', 'TABLEAU.ALEA': 'RANDARRAY', 'TAUX': 'RATE', 'TAUX.EFFECTIF': 'EFFECT', 'TAUX.INT.EQUIV': 'RRI',
    'TAUX.NOMINAL': 'NOMINAL', 'TEMPSVAL': 'TIMEVALUE', 'TENDANCE': 'TREND', 'TEXTE.APRES': 'TEXTAFTER',
    'TEXTE.AVANT': 'TEXTBEFORE', 'TRANSPOSE': 'TRANSPOSE', 'TRI': 'IRR', 'TRI.PAIEMENTS': 'XIRR', 'TRIERPAR': 'SORTBY',
    'TRIM': 'MIRR', 'TRONQUE': 'TRUNC', 'TYPE.ERREUR': 'ERROR.TYPE', 'UNICAR': 'UNICHAR', 'UNICODE': 'UNICODE',
    'VA': 'PV', 'VALEURNOMBRE': 'NUMBERVALUE', 'VAN': 'NPV', 'VAN.PAIEMENTS': 'XNPV', 'VAR.P.N': 'VAR.P',
    'VAR.S': 'VAR.S', 'VC': 'FV', 'VC.PAIEMENTS': 'FVSCHEDULE', 'VDB': 'VDB', 'VPM': 'PMT'
  };
  Object.keys(extra).forEach(function (k) { XL.extraNames[k] = extra[k]; });
})(window.XL);
