/* Fonctions : Logique, Recherche & références, Tableaux dynamiques */
(function (XL) {
  'use strict';
  var F = XL.F;

  /* ============================== LOGIQUE ============================== */
  F('SI', 'IF', 'logique', '',
    'Renvoie une valeur si une condition est vraie, une autre si elle est fausse. La brique de base de toute décision dans une feuille.',
    'SI(test_logique; [valeur_si_vrai]; [valeur_si_faux])',
    [['test_logique', 'Condition à évaluer (ex. B2>1000, A2="Payé").'],
     ['valeur_si_vrai', 'Résultat si la condition est VRAIE.'],
     ['valeur_si_faux', 'Résultat si la condition est FAUSSE (FAUX par défaut).']],
    [['=SI(1500>1000;"Grosse facture";"Normale")', 'Teste un montant et renvoie un libellé.', 'Grosse facture'],
     ['=SI(C2>=0;C2;"")', 'Affiche le montant seulement s’il est positif (sinon cellule vide).'],
     ['=SI(ET(D2="Impayé";E2<AUJOURDHUI());"RELANCER";"")', 'Combine deux conditions pour signaler une relance.']],
    ['Au-delà de 3 SI imbriqués, préfère SI.CONDITIONS ou une table de correspondance + RECHERCHEX : plus lisible et moins d’erreurs.',
     'Le texte se met entre guillemets "…", les nombres non.'],
    'si condition alors sinon tester test vrai faux choix decision cas selon',
    'SI.CONDITIONS SI.MULTIPLE ET OU SIERREUR');

  F('SI.CONDITIONS', 'IFS', 'logique', '2019',
    'Teste plusieurs conditions dans l’ordre et renvoie la valeur de la première condition VRAIE. Remplace les SI imbriqués.',
    'SI.CONDITIONS(test1; valeur1; [test2; valeur2]; …)',
    [['test1', 'Première condition.'], ['valeur1', 'Résultat si test1 est VRAI.'],
     ['test2; valeur2…', 'Paires condition/résultat suivantes (jusqu’à 127).']],
    [['=SI.CONDITIONS(45<=30;"0-30 j";45<=60;"31-60 j";VRAI;"> 60 j")', 'Classe un retard de 45 jours dans une tranche (balance âgée).', '31-60 j'],
     ['=SI.CONDITIONS(B2>=10000;5%;B2>=5000;3%;VRAI;0)', 'Taux de remise selon le chiffre d’affaires.']],
    ['Il n’y a pas de valeur « sinon » : termine par VRAI;"valeur par défaut", sinon tu obtiens #N/A quand rien ne correspond.'],
    'plusieurs conditions si imbrique multiple tranche palier bareme classer categorie',
    'SI SI.MULTIPLE RECHERCHEX');

  F('SI.MULTIPLE', 'SWITCH', 'logique', '2019',
    'Compare une valeur à une liste de cas et renvoie le résultat du cas correspondant (équivalent d’un « switch/case »).',
    'SI.MULTIPLE(expression; valeur1; résultat1; [valeur2; résultat2]; …; [défaut])',
    [['expression', 'Valeur à comparer.'], ['valeur1; résultat1', 'Cas et résultat associé.'],
     ['défaut', 'Résultat si aucun cas ne correspond (facultatif, dernier argument isolé).']],
    [['=SI.MULTIPLE(3;1;"Janv";2;"Févr";3;"Mars";"?")', 'Traduit un numéro de mois en libellé.', 'Mars'],
     ['=SI.MULTIPLE(GAUCHE(A2;1);"6";"Charge";"7";"Produit";"Bilan")', 'Nature d’un compte selon son premier chiffre.']],
    ['Ne gère que l’égalité stricte. Pour des intervalles (>, <), utilise SI.CONDITIONS.'],
    'switch case selon valeur correspondance cas liste remplacer code libelle',
    'SI.CONDITIONS CHOISIR');

  F('SIERREUR', 'IFERROR', 'logique', '',
    'Renvoie une valeur de remplacement si la formule produit une erreur (#N/A, #DIV/0!, #VALEUR!…), sinon le résultat normal.',
    'SIERREUR(valeur; valeur_si_erreur)',
    [['valeur', 'Formule à surveiller.'], ['valeur_si_erreur', 'Ce qu’on affiche à la place de l’erreur.']],
    [['=SIERREUR(10/0;0)', 'Évite #DIV/0! : renvoie 0.', 0],
     ['=SIERREUR(RECHERCHEV(A2;Clients;2;FAUX);"Client inconnu")', 'Message propre quand la recherche échoue.']],
    ['Masque TOUTES les erreurs, y compris tes fautes de frappe. Pour ne cibler que « introuvable », préfère SI.NON.DISP.'],
    'erreur masquer cacher remplacer na div0 si erreur eviter',
    'SI.NON.DISP ESTERREUR TYPE.ERREUR');

  F('SI.NON.DISP', 'IFNA', 'logique', '2013',
    'Comme SIERREUR mais n’intercepte QUE l’erreur #N/A (valeur introuvable). Les autres erreurs restent visibles.',
    'SI.NON.DISP(valeur; valeur_si_na)',
    [['valeur', 'Formule (souvent une recherche).'], ['valeur_si_na', 'Valeur si #N/A.']],
    [['=SI.NON.DISP(RECHERCHEV(A2;PCG;2;FAUX);"Compte absent du PCG")', 'Signale un compte inconnu sans cacher les vraies erreurs.']],
    ['Bonne pratique d’audit : on voit encore les #REF! ou #VALEUR! qui révèlent un problème de structure.'],
    'na introuvable non disponible recherche echec erreur',
    'SIERREUR ESTNA');

  F('ET', 'AND', 'logique', '',
    'Renvoie VRAI si TOUTES les conditions sont vraies.',
    'ET(logique1; [logique2]; …)',
    [['logique1…', 'Conditions à tester (jusqu’à 255).']],
    [['=ET(5>3;2<4)', 'Les deux conditions sont vraies.', true],
     ['=SI(ET(B2>=DATE(2026;1;1);B2<=DATE(2026;12;31));"Exercice 2026";"")', 'Vérifie qu’une date est dans l’exercice.']],
    ['Dans les calculs matriciels (SOMMEPROD, FILTRE), ET ne fonctionne pas ligne par ligne : multiplie les conditions (cond1)*(cond2).'],
    'et toutes conditions les deux a la fois cumul',
    'OU NON OUX SI');

  F('OU', 'OR', 'logique', '',
    'Renvoie VRAI si AU MOINS UNE des conditions est vraie.',
    'OU(logique1; [logique2]; …)',
    [['logique1…', 'Conditions à tester.']],
    [['=OU(1>5;3=3)', 'Une seule condition vraie suffit.', true],
     ['=SI(OU(C2="Annulé";C2="Avoir");0;D2)', 'Neutralise les lignes annulées ou les avoirs.']],
    ['En logique matricielle, additionne les conditions : (cond1)+(cond2)>0.'],
    'ou au moins une condition l une ou l autre',
    'ET NON OUX');

  F('NON', 'NOT', 'logique', '',
    'Inverse une valeur logique : VRAI devient FAUX et inversement.',
    'NON(logique)',
    [['logique', 'Condition à inverser.']],
    [['=NON(5>3)', 'Inverse VRAI.', false], ['=SI(NON(ESTVIDE(A2));"Saisi";"À compléter")', 'Teste qu’une cellule n’est pas vide.']],
    [], 'non inverser contraire negation pas',
    'ET OU');

  F('OUX', 'XOR', 'logique', '2013',
    'OU exclusif : VRAI si un nombre IMPAIR de conditions sont vraies (pour deux conditions : une seule des deux).',
    'OUX(logique1; [logique2]; …)',
    [['logique1…', 'Conditions.']],
    [['=OUX(VRAI;FAUX)', 'Une seule vraie.', true], ['=OUX(VRAI;VRAI)', 'Les deux vraies.', false]],
    ['Utile en contrôle : une écriture doit avoir un débit OU un crédit, pas les deux : =OUX(C2>0;D2>0).'],
    'ou exclusif un seul xor debit credit',
    'OU ET');

  F('LET', 'LET', 'logique', '2021',
    'Donne des noms à des calculs intermédiaires dans une formule. Rend les formules longues lisibles et plus rapides (chaque calcul n’est fait qu’une fois).',
    'LET(nom1; valeur1; [nom2; valeur2]; …; calcul)',
    [['nom1', 'Nom de variable (commence par une lettre).'], ['valeur1', 'Valeur ou calcul associé.'],
     ['calcul', 'Dernier argument : le résultat final, qui utilise les noms.']],
    [['=LET(ht;100;tva;20%;ht*(1+tva))', 'Calcule un TTC avec des variables nommées.', 120],
     ['=LET(j;AUJOURDHUI()-E2;SI(j<=0;"Non échu";j&" j de retard"))', 'Calcule le retard une seule fois et le réutilise.']],
    ['Idéal avec FILTRE/TRIER : on nomme chaque étape comme dans un script.'],
    'variable nommer intermediaire lisible simplifier formule longue',
    'LAMBDA');

  F('LAMBDA', 'LAMBDA', 'logique', '2024',
    'Crée ta propre fonction réutilisable. Enregistrée dans le Gestionnaire de noms, elle s’appelle comme une fonction native.',
    'LAMBDA([paramètre1; paramètre2; …]; calcul)',
    [['paramètre…', 'Noms des entrées de la fonction.'], ['calcul', 'Formule qui utilise les paramètres.']],
    [['=LAMBDA(ht;taux;ht*(1+taux))(100;20%)', 'Fonction anonyme appelée directement.', 120],
     ['Nom « TTC » = LAMBDA(ht;taux;ARRONDI(ht*(1+taux);2))  puis  =TTC(B2;20%)', 'Crée une fonction TTC() maison via Formules > Gestionnaire de noms.']],
    ['Teste d’abord ta LAMBDA dans une cellule en ajoutant les valeurs entre parenthèses à la fin, puis enregistre-la comme nom.'],
    'fonction personnalisee perso creer ma propre fonction reutilisable',
    'LET BYROW BYCOL');

  F('BYROW', 'BYROW', 'logique', '2024',
    'Applique une LAMBDA à chaque LIGNE d’un tableau et renvoie un résultat par ligne.',
    'BYROW(tableau; LAMBDA(ligne; calcul))',
    [['tableau', 'Plage à parcourir ligne par ligne.'], ['LAMBDA', 'Calcul appliqué à chaque ligne.']],
    [['=BYROW(B2:M20;LAMBDA(l;SOMME(l)))', 'Total annuel de chaque compte (colonnes = 12 mois).'],
     ['=BYROW(B2:D20;LAMBDA(l;MAX(l)))', 'Maximum de chaque ligne.']],
    [], 'chaque ligne par ligne total ligne boucle',
    'BYCOL LAMBDA');

  F('BYCOL', 'BYCOL', 'logique', '2024',
    'Applique une LAMBDA à chaque COLONNE d’un tableau et renvoie un résultat par colonne.',
    'BYCOL(tableau; LAMBDA(colonne; calcul))',
    [['tableau', 'Plage à parcourir colonne par colonne.'], ['LAMBDA', 'Calcul appliqué à chaque colonne.']],
    [['=BYCOL(B2:M20;LAMBDA(c;SOMME(c)))', 'Total de chaque mois.']],
    [], 'chaque colonne par colonne total colonne',
    'BYROW LAMBDA');

  /* ======================= RECHERCHE & RÉFÉRENCES ====================== */
  F('RECHERCHEX', 'XLOOKUP', 'recherche', '2021',
    'LA fonction de recherche moderne : cherche une valeur dans une colonne et renvoie la valeur correspondante d’une autre colonne, à gauche ou à droite, avec message si introuvable.',
    'RECHERCHEX(valeur_cherchée; tableau_recherche; tableau_renvoyé; [si_non_trouvé]; [mode_correspondance]; [mode_recherche])',
    [['valeur_cherchée', 'Ce que tu cherches (ex. un n° de compte).'],
     ['tableau_recherche', 'Colonne où chercher.'],
     ['tableau_renvoyé', 'Colonne (ou plusieurs) à renvoyer.'],
     ['si_non_trouvé', 'Texte/valeur si rien n’est trouvé (évite #N/A).'],
     ['mode_correspondance', '0 = exacte (défaut) ; -1 = exacte ou inférieure ; 1 = exacte ou supérieure ; 2 = caractères génériques * ?'],
     ['mode_recherche', '1 = du début (défaut) ; -1 = depuis la fin (dernière occurrence) ; 2/-2 = dichotomique sur liste triée.']],
    [['=RECHERCHEX(A2;PCG[Compte];PCG[Libellé];"Compte inconnu")', 'Libellé d’un compte à partir de son numéro.'],
     ['=RECHERCHEX(B2;Bareme[Seuil];Bareme[Taux];;-1)', 'Barème par tranches : prend le seuil immédiatement inférieur (commissions, remises).'],
     ['=RECHERCHEX(A2;Ventes[Client];Ventes[Date];;0;-1)', 'Date de la DERNIÈRE vente d’un client.']],
    ['Remplace RECHERCHEV, RECHERCHEH et INDEX/EQUIV. Pas besoin de compter les colonnes, et insérer une colonne ne casse rien.',
     'Si le tableau renvoyé contient plusieurs colonnes, le résultat « déborde » sur plusieurs cellules.'],
    'rechercher trouver valeur correspondante chercher recuperer libelle tableau correspondance recherchev xlookup aller chercher info autre feuille',
    'RECHERCHEV INDEX EQUIV EQUIVX FILTRE');

  F('RECHERCHEV', 'VLOOKUP', 'recherche', '',
    'Cherche une valeur dans la PREMIÈRE colonne d’un tableau et renvoie la valeur d’une colonne située à droite (n° de colonne).',
    'RECHERCHEV(valeur_cherchée; table_matrice; no_index_col; [valeur_proche])',
    [['valeur_cherchée', 'Valeur à trouver dans la 1re colonne de la table.'],
     ['table_matrice', 'Tableau complet (bloque-le avec $ : $A$2:$D$500).'],
     ['no_index_col', 'Numéro de la colonne à renvoyer (1 = première colonne de la table).'],
     ['valeur_proche', 'FAUX = correspondance EXACTE (à mettre presque toujours). VRAI = approchée sur liste triée (barèmes).']],
    [['=RECHERCHEV(A2;$F$2:$H$500;3;FAUX)', 'Renvoie la 3e colonne de la ligne où se trouve A2.'],
     ['=RECHERCHEV(B2;$K$2:$L$6;2;VRAI)', 'Barème : la table doit être triée par ordre croissant.']],
    ['Oublier FAUX en 4e argument est LA source d’erreurs n°1 : sans lui, Excel renvoie une valeur approchée fausse sans prévenir.',
     'Ne sait pas chercher vers la gauche : utilise RECHERCHEX ou INDEX/EQUIV.',
     'Si les n° de compte sont du texte d’un côté et des nombres de l’autre → #N/A. Uniformise avec CNUM ou &"".'],
    'rechercher trouver valeur colonne vlookup recherche verticale correspondance aller chercher autre feuille',
    'RECHERCHEX RECHERCHEH INDEX EQUIV');

  F('RECHERCHEH', 'HLOOKUP', 'recherche', '',
    'Version horizontale de RECHERCHEV : cherche dans la première LIGNE et renvoie la valeur d’une ligne en dessous.',
    'RECHERCHEH(valeur_cherchée; table_matrice; no_index_lig; [valeur_proche])',
    [['valeur_cherchée', 'Valeur à trouver dans la 1re ligne.'], ['table_matrice', 'Tableau.'],
     ['no_index_lig', 'Numéro de ligne à renvoyer.'], ['valeur_proche', 'FAUX = exacte.']],
    [['=RECHERCHEH("Mars";$B$1:$M$20;5;FAUX)', 'Valeur de la 5e ligne dans la colonne « Mars ».']],
    ['RECHERCHEX fait la même chose dans les deux sens.'],
    'recherche horizontale ligne en tete mois hlookup',
    'RECHERCHEX RECHERCHEV');

  F('INDEX', 'INDEX', 'recherche', '',
    'Renvoie la valeur située à une ligne (et colonne) donnée d’une plage. Combinée à EQUIV, c’est la recherche universelle compatible toutes versions.',
    'INDEX(tableau; no_lig; [no_col])',
    [['tableau', 'Plage de cellules.'], ['no_lig', 'Position de la ligne dans la plage.'], ['no_col', 'Position de la colonne (si plusieurs colonnes).']],
    [['=INDEX(C2:C500;EQUIV(A2;A2:A500;0))', 'Recherche classique INDEX/EQUIV (fonctionne vers la gauche).'],
     ['=INDEX($B$2:$M$50;EQUIV(P2;$A$2:$A$50;0);EQUIV(Q2;$B$1:$M$1;0))', 'Recherche à double entrée : compte × mois.']],
    ['INDEX/EQUIV est plus robuste que RECHERCHEV : insérer des colonnes ne casse pas la formule.'],
    'position ligne colonne recuperer cellule double entree croisement index equiv',
    'EQUIV RECHERCHEX DECALER');

  F('EQUIV', 'MATCH', 'recherche', '',
    'Renvoie la POSITION d’une valeur dans une ligne ou une colonne (1, 2, 3…).',
    'EQUIV(valeur_cherchée; tableau_recherche; [type])',
    [['valeur_cherchée', 'Valeur à localiser.'], ['tableau_recherche', 'Une seule ligne ou colonne.'],
     ['type', '0 = exacte (recommandé) ; 1 = plus grande valeur ≤ (liste croissante, défaut) ; -1 = plus petite valeur ≥ (liste décroissante).']],
    [['=EQUIV("Mars";B1:M1;0)', 'Position de la colonne « Mars ».'],
     ['=ESTNUM(EQUIV(A2;Banque!C:C;0))', 'VRAI si la valeur existe dans l’autre liste (rapprochement).']],
    ['Le type par défaut est 1 (approché) : mets toujours 0 pour une recherche exacte.'],
    'position rang trouver ou se trouve numero ligne existe dans liste',
    'INDEX EQUIVX RECHERCHEX');

  F('EQUIVX', 'XMATCH', 'recherche', '2021',
    'Version moderne d’EQUIV : correspondance exacte par défaut, recherche depuis la fin possible.',
    'EQUIVX(valeur_cherchée; tableau_recherche; [mode_correspondance]; [mode_recherche])',
    [['valeur_cherchée', 'Valeur à localiser.'], ['tableau_recherche', 'Ligne ou colonne.'],
     ['mode_correspondance', '0 exacte (défaut), -1 inférieure, 1 supérieure, 2 génériques.'],
     ['mode_recherche', '1 depuis le début, -1 depuis la fin.']],
    [['=EQUIVX(A2;Journal[Pièce];0;-1)', 'Position de la dernière écriture d’une pièce.']],
    [], 'position derniere occurrence equiv moderne',
    'EQUIV INDEX RECHERCHEX');

  F('RECHERCHE', 'LOOKUP', 'recherche', '',
    'Recherche approchée dans un vecteur trié et renvoie la valeur correspondante d’un autre vecteur. Surtout utile pour l’astuce « dernière valeur non vide ».',
    'RECHERCHE(valeur_cherchée; vecteur_recherche; [vecteur_résultat])',
    [['valeur_cherchée', 'Valeur cherchée.'], ['vecteur_recherche', 'Ligne/colonne triée croissante.'], ['vecteur_résultat', 'Valeurs à renvoyer.']],
    [['=RECHERCHE(2;1/(B2:B1000<>"");B2:B1000)', 'Renvoie la DERNIÈRE valeur saisie d’une colonne (ex. dernier solde).']],
    ['Pour une recherche normale, préfère RECHERCHEX ou INDEX/EQUIV.'],
    'derniere valeur non vide dernier solde derniere ligne remplie',
    'RECHERCHEX INDEX');

  F('DECALER', 'OFFSET', 'recherche', '',
    'Renvoie une plage décalée d’un certain nombre de lignes/colonnes par rapport à une cellule de départ, avec une taille au choix.',
    'DECALER(réf; lignes; colonnes; [hauteur]; [largeur])',
    [['réf', 'Cellule de départ.'], ['lignes', 'Décalage vertical (+ vers le bas).'], ['colonnes', 'Décalage horizontal (+ vers la droite).'],
     ['hauteur', 'Nombre de lignes de la plage renvoyée.'], ['largeur', 'Nombre de colonnes.']],
    [['=SOMME(DECALER(B2;0;0;1;3))', 'Somme des 3 premiers mois.'],
     ['=SOMME(DECALER($B2;0;0;1;$P$1))', 'Cumul à fin de mois N (N saisi en P1).']],
    ['Fonction VOLATILE : recalculée à chaque modification, elle ralentit les gros classeurs. Préfère INDEX(…):INDEX(…) ou PRENDRE.'],
    'decaler plage dynamique glissante cumul mois variable',
    'INDEX PRENDRE INDIRECT');

  F('INDIRECT', 'INDIRECT', 'recherche', '',
    'Transforme un texte en référence de cellule. Permet par exemple de viser la feuille dont le nom est écrit dans une cellule.',
    'INDIRECT(réf_texte; [a1])',
    [['réf_texte', 'Adresse sous forme de texte (ex. "Janvier!B5").'], ['a1', 'VRAI (défaut) = style A1 ; FAUX = style L1C1.']],
    [['=INDIRECT(A1&"!B10")', 'Va chercher B10 dans la feuille dont le nom est en A1 (ex. un mois).'],
     ['=SOMME(INDIRECT("B2:B"&C1))', 'Somme de B2 jusqu’à la ligne indiquée en C1.']],
    ['Volatile et invisible pour l’audit (les flèches d’antécédents ne la suivent pas). Si le nom de feuille contient des espaces : "\'"&A1&"\'!B10".'],
    'reference texte nom feuille variable dynamique consolider feuilles',
    'DECALER ADRESSE');

  F('CHOISIR', 'CHOOSE', 'recherche', '',
    'Renvoie l’élément n° X d’une liste de valeurs.',
    'CHOISIR(no_index; valeur1; [valeur2]; …)',
    [['no_index', 'Numéro de 1 à 254.'], ['valeur1…', 'Liste de choix.']],
    [['=CHOISIR(2;"T1";"T2";"T3";"T4")', 'Renvoie le 2e élément.', 'T2'],
     ['=CHOISIR(JOURSEM(A2;2);"Lun";"Mar";"Mer";"Jeu";"Ven";"Sam";"Dim")', 'Jour de la semaine en toutes lettres.']],
    [], 'choisir element liste numero option scenario',
    'SI.MULTIPLE INDEX');

  F('LIGNE', 'ROW', 'recherche', '',
    'Renvoie le numéro de ligne d’une cellule (ou de la cellule de la formule).',
    'LIGNE([réf])',
    [['réf', 'Cellule (facultatif).']],
    [['=LIGNE(A10)', 'Numéro de ligne.', 10], ['=LIGNE()-1', 'Numéro d’ordre automatique (en ligne 2 → 1).']],
    [], 'numero ligne numerotation automatique compteur',
    'LIGNES COLONNE SEQUENCE');

  F('LIGNES', 'ROWS', 'recherche', '',
    'Renvoie le nombre de lignes d’une plage.',
    'LIGNES(tableau)',
    [['tableau', 'Plage ou tableau.']],
    [['=LIGNES(A2:A51)', 'Nombre de lignes.', 50]],
    [], 'nombre de lignes taille hauteur',
    'COLONNES LIGNE NBVAL');

  F('COLONNE', 'COLUMN', 'recherche', '',
    'Renvoie le numéro de colonne d’une cellule (A=1, B=2…).',
    'COLONNE([réf])',
    [['réf', 'Cellule (facultatif).']],
    [['=COLONNE(D1)', 'D est la 4e colonne.', 4]],
    [], 'numero colonne lettre',
    'COLONNES LIGNE');

  F('COLONNES', 'COLUMNS', 'recherche', '',
    'Renvoie le nombre de colonnes d’une plage.',
    'COLONNES(tableau)',
    [['tableau', 'Plage.']],
    [['=COLONNES(B1:M1)', '12 colonnes (12 mois).', 12]],
    [], 'nombre colonnes largeur',
    'LIGNES COLONNE');

  F('ADRESSE', 'ADDRESS', 'recherche', '',
    'Construit une adresse de cellule sous forme de texte à partir d’un n° de ligne et de colonne.',
    'ADRESSE(no_lig; no_col; [no_abs]; [a1]; [feuille_texte])',
    [['no_lig', 'Ligne.'], ['no_col', 'Colonne.'], ['no_abs', '1 = $A$1 (défaut), 2 = A$1, 3 = $A1, 4 = A1.'],
     ['a1', 'VRAI = style A1.'], ['feuille_texte', 'Nom de feuille à inclure.']],
    [['=ADRESSE(5;3;4)', 'Adresse relative.', 'C5']],
    [], 'adresse cellule texte reference construire',
    'INDIRECT CELLULE');

  F('LIEN_HYPERTEXTE', 'HYPERLINK', 'recherche', '',
    'Crée un lien cliquable vers un fichier, une page web ou une cellule du classeur.',
    'LIEN_HYPERTEXTE(emplacement_lien; [nom_convivial])',
    [['emplacement_lien', 'Chemin, URL, ou "#Feuille!A1" pour une cellule interne.'], ['nom_convivial', 'Texte affiché.']],
    [['=LIEN_HYPERTEXTE("#Synthèse!A1";"↩ Retour synthèse")', 'Bouton de navigation interne.'],
     ['=LIEN_HYPERTEXTE("C:\\Factures\\"&A2&".pdf";"Voir PDF")', 'Ouvre la facture PDF correspondant au n° en A2.']],
    [], 'lien hypertexte url cliquable ouvrir fichier pdf navigation sommaire',
    'INDIRECT');

  F('TRANSPOSE', 'TRANSPOSE', 'recherche', '',
    'Inverse lignes et colonnes d’une plage.',
    'TRANSPOSE(tableau)',
    [['tableau', 'Plage à pivoter.']],
    [['=TRANSPOSE(A1:A12)', 'Met une colonne de 12 mois en ligne.']],
    ['Dans les versions sans tableaux dynamiques, sélectionne la zone de destination puis valide par Ctrl+Maj+Entrée.'],
    'pivoter inverser lignes colonnes horizontal vertical',
    'DANSLIGNE DANSCOL');

  F('FORMULETEXTE', 'FORMULATEXT', 'recherche', '2013',
    'Affiche la formule d’une cellule sous forme de texte. Pratique pour documenter un modèle.',
    'FORMULETEXTE(réf)',
    [['réf', 'Cellule contenant une formule.']],
    [['=FORMULETEXTE(D2)', 'Affiche la formule de D2 à côté pour l’expliquer.']],
    [], 'afficher formule texte documenter audit',
    'ESTFORMULE');

  F('LIREDONNEESTABCROISDYNAMIQUE', 'GETPIVOTDATA', 'recherche', '',
    'Extrait une valeur d’un tableau croisé dynamique de façon robuste (ne dépend pas de la position de la cellule).',
    'LIREDONNEESTABCROISDYNAMIQUE(champ_données; tableau_croisé_dyn; [champ1; élément1]; …)',
    [['champ_données', 'Nom du champ de valeurs (ex. "Montant").'], ['tableau_croisé_dyn', 'Une cellule du TCD.'],
     ['champ; élément', 'Paires filtre/valeur.']],
    [['=LIREDONNEESTABCROISDYNAMIQUE("Montant";$A$3;"Compte";"607000";"Mois";"Mars")', 'Montant du compte 607000 en mars.']],
    ['S’écrit automatiquement quand tu tapes « = » puis cliques dans un TCD.'],
    'tcd tableau croise dynamique extraire valeur pivot',
    'PIVOTER.PAR SOMME.SI.ENS');

  /* ========================= TABLEAUX DYNAMIQUES ======================= */
  F('FILTRE', 'FILTER', 'tableaux', '2021',
    'Extrait toutes les lignes qui répondent à un ou plusieurs critères. Le résultat se met à jour tout seul.',
    'FILTRE(tableau; inclure; [si_vide])',
    [['tableau', 'Données à filtrer.'], ['inclure', 'Condition(s) : (col1="x")*(col2>0) pour ET, +(…) pour OU.'],
     ['si_vide', 'Valeur affichée si aucun résultat.']],
    [['=FILTRE(Factures;Factures[Statut]="Impayé";"Aucune")', 'Liste de toutes les factures impayées.'],
     ['=FILTRE(Factures;(Factures[Statut]="Impayé")*(Factures[Échéance]<AUJOURDHUI());"Rien d’échu")', 'Impayées ET échues (relances).'],
     ['=FILTRE(Journal;(Journal[Compte]>=600000)*(Journal[Compte]<700000))', 'Toutes les écritures de charges (classe 6).']],
    ['Laisse de la place vide sous la formule, sinon erreur #PROPAGATION!.',
     'Combine avec TRIER : =TRIER(FILTRE(…);3;-1).'],
    'filtrer extraire lignes criteres liste conditionnelle sous tableau impayees',
    'TRIER UNIQUE TRIERPAR');

  F('TRIER', 'SORT', 'tableaux', '2021',
    'Trie une plage par une colonne, en croissant ou décroissant, sans toucher aux données sources.',
    'TRIER(tableau; [index_tri]; [ordre_tri]; [par_col])',
    [['tableau', 'Données à trier.'], ['index_tri', 'N° de la colonne de tri (1 par défaut).'],
     ['ordre_tri', '1 = croissant (défaut) ; -1 = décroissant.'], ['par_col', 'VRAI pour trier des colonnes.']],
    [['=TRIER(A2:C100;3;-1)', 'Trie par la 3e colonne (montant) du plus grand au plus petit.'],
     ['=TRIER(UNIQUE(Journal[Fournisseur]))', 'Liste alphabétique des fournisseurs sans doublon.']],
    [], 'trier classer ordre croissant decroissant alphabetique tri',
    'TRIERPAR FILTRE UNIQUE');

  F('TRIERPAR', 'SORTBY', 'tableaux', '2021',
    'Trie un tableau selon une ou plusieurs autres colonnes (même non affichées).',
    'TRIERPAR(tableau; par_tableau1; [ordre_tri1]; [par_tableau2; ordre_tri2]; …)',
    [['tableau', 'Données à renvoyer.'], ['par_tableau1', 'Colonne servant au tri.'], ['ordre_tri1', '1 croissant, -1 décroissant.']],
    [['=TRIERPAR(Clients[Nom];Clients[CA];-1)', 'Noms des clients classés par CA décroissant.'],
     ['=TRIERPAR(Journal;Journal[Date];1;Journal[Pièce];1)', 'Tri par date puis par n° de pièce.']],
    [], 'trier selon autre colonne classement multi criteres',
    'TRIER PRENDRE');

  F('UNIQUE', 'UNIQUE', 'tableaux', '2021',
    'Renvoie la liste des valeurs distinctes (supprime les doublons) d’une plage.',
    'UNIQUE(tableau; [par_col]; [exactement_une_fois])',
    [['tableau', 'Plage source.'], ['par_col', 'VRAI pour comparer des colonnes.'],
     ['exactement_une_fois', 'VRAI = ne garder que les valeurs présentes une seule fois.']],
    [['=UNIQUE(Journal[Compte])', 'Liste des comptes mouvementés.'],
     ['=LIGNES(UNIQUE(Ventes[Client]))', 'Nombre de clients distincts.'],
     ['=UNIQUE(A2:A500;;VRAI)', 'Valeurs qui n’apparaissent qu’une fois (ex. écritures non lettrées).']],
    [], 'doublons supprimer distinct sans doublon liste unique valeurs differentes',
    'TRIER FILTRE NB.SI');

  F('SEQUENCE', 'SEQUENCE', 'tableaux', '2021',
    'Génère une suite de nombres (1, 2, 3… ou avec un pas) sur plusieurs lignes/colonnes.',
    'SEQUENCE(lignes; [colonnes]; [début]; [pas])',
    [['lignes', 'Nombre de lignes.'], ['colonnes', 'Nombre de colonnes (1 par défaut).'], ['début', 'Premier nombre (1).'], ['pas', 'Incrément (1).']],
    [['=SEQUENCE(12)', 'Numéros de 1 à 12 (périodes d’un échéancier).'],
     ['=FIN.MOIS(DATE(2026;1;1);SEQUENCE(12)-1)', 'Les 12 fins de mois de 2026.'],
     ['=SOMME(SEQUENCE(10))', 'Somme de 1 à 10.', 55]],
    [], 'suite nombres numerotation serie generer periodes 1 a n',
    'LIGNE TABLEAU.ALEA');

  F('TABLEAU.ALEA', 'RANDARRAY', 'tableaux', '2021',
    'Génère un tableau de nombres aléatoires (données de test, échantillonnage d’audit).',
    'TABLEAU.ALEA([lignes]; [colonnes]; [min]; [max]; [nombre_entier])',
    [['lignes', 'Nombre de lignes.'], ['colonnes', 'Nombre de colonnes.'], ['min', 'Minimum.'], ['max', 'Maximum.'], ['nombre_entier', 'VRAI = entiers.']],
    [['=TABLEAU.ALEA(10;1;1;500;VRAI)', '10 numéros de ligne au hasard entre 1 et 500 (échantillon à contrôler).']],
    ['Volatile : copie puis colle en valeurs pour figer le tirage.'],
    'aleatoire hasard echantillon test random tirage',
    'ALEA ALEA.ENTRE.BORNES');

  F('ASSEMB.V', 'VSTACK', 'tableaux', '2024',
    'Empile plusieurs plages les unes SOUS les autres (consolidation verticale).',
    'ASSEMB.V(tableau1; [tableau2]; …)',
    [['tableau1…', 'Plages à empiler (même nombre de colonnes idéalement).']],
    [['=ASSEMB.V(Janvier!A2:D100;Février!A2:D100;Mars!A2:D100)', 'Consolide les journaux de 3 mois en un seul tableau.'],
     ['=ASSEMB.V(Janvier:Décembre!A2:D100)', 'Référence 3D : empile la même plage de toutes les feuilles entre Janvier et Décembre.']],
    ['Les lignes vides des plages sont reprises : filtre-les ensuite avec FILTRE(…;COLONNE1<>"").'],
    'empiler consolider fusionner feuilles concatener tableaux vertical',
    'ASSEMB.H FILTRE DANSCOL');

  F('ASSEMB.H', 'HSTACK', 'tableaux', '2024',
    'Assemble plusieurs plages côte à côte (horizontalement).',
    'ASSEMB.H(tableau1; [tableau2]; …)',
    [['tableau1…', 'Plages à juxtaposer.']],
    [['=ASSEMB.H(UNIQUE(A2:A100);SOMME.SI(A2:A100;UNIQUE(A2:A100);C2:C100))', 'Mini-TCD : chaque compte avec son total.']],
    [], 'cote a cote juxtaposer assembler colonnes',
    'ASSEMB.V CHOISIRCOLS');

  F('CHOISIRCOLS', 'CHOOSECOLS', 'tableaux', '2024',
    'Renvoie seulement certaines colonnes d’un tableau, dans l’ordre voulu.',
    'CHOISIRCOLS(tableau; col_num1; [col_num2]; …)',
    [['tableau', 'Plage source.'], ['col_num…', 'Numéros de colonnes (négatif = depuis la fin).']],
    [['=CHOISIRCOLS(Journal;1;3;5)', 'Garde Date, Compte et Montant uniquement.']],
    [], 'selectionner colonnes extraire certaines colonnes reorganiser',
    'CHOISIRLIGNES PRENDRE');

  F('CHOISIRLIGNES', 'CHOOSEROWS', 'tableaux', '2024',
    'Renvoie seulement certaines lignes d’un tableau.',
    'CHOISIRLIGNES(tableau; ligne_num1; [ligne_num2]; …)',
    [['tableau', 'Plage source.'], ['ligne_num…', 'Numéros de lignes (négatif = depuis la fin).']],
    [['=CHOISIRLIGNES(A2:D100;-1)', 'Dernière ligne du tableau.']],
    [], 'selectionner lignes derniere ligne extraire',
    'CHOISIRCOLS PRENDRE');

  F('PRENDRE', 'TAKE', 'tableaux', '2024',
    'Garde les N premières (ou dernières si négatif) lignes/colonnes d’un tableau.',
    'PRENDRE(tableau; lignes; [colonnes])',
    [['tableau', 'Plage source.'], ['lignes', 'Nombre de lignes (négatif = depuis la fin).'], ['colonnes', 'Nombre de colonnes.']],
    [['=PRENDRE(TRIERPAR(Clients;Clients[CA];-1);5)', 'Top 5 clients par CA.'],
     ['=PRENDRE(Journal;-10)', 'Les 10 dernières écritures.']],
    [], 'top premiers derniers n lignes classement meilleurs',
    'EXCLURE TRIERPAR GRANDE.VALEUR');

  F('EXCLURE', 'DROP', 'tableaux', '2024',
    'Retire les N premières (ou dernières) lignes/colonnes d’un tableau.',
    'EXCLURE(tableau; lignes; [colonnes])',
    [['tableau', 'Plage source.'], ['lignes', 'Lignes à retirer (négatif = à la fin).'], ['colonnes', 'Colonnes à retirer.']],
    [['=EXCLURE(A1:D100;1)', 'Retire la ligne d’en-tête.'], ['=EXCLURE(Export;-1)', 'Retire la ligne de total d’un export.']],
    [], 'enlever retirer supprimer premieres lignes en tete total',
    'PRENDRE');

  F('DANSCOL', 'TOCOL', 'tableaux', '2024',
    'Met tout un tableau en une seule colonne, en ignorant éventuellement vides et erreurs.',
    'DANSCOL(tableau; [ignorer]; [scan_par_colonne])',
    [['tableau', 'Plage source.'], ['ignorer', '0 = tout garder ; 1 = ignorer vides ; 2 = ignorer erreurs ; 3 = les deux.'],
     ['scan_par_colonne', 'VRAI = lire colonne par colonne.']],
    [['=UNIQUE(DANSCOL(B2:M50;1))', 'Liste unique de toutes les valeurs d’une grille.']],
    [], 'une colonne aplatir liste grille empiler',
    'DANSLIGNE ASSEMB.V');

  F('DANSLIGNE', 'TOROW', 'tableaux', '2024',
    'Met tout un tableau en une seule ligne.',
    'DANSLIGNE(tableau; [ignorer]; [scan_par_colonne])',
    [['tableau', 'Plage source.'], ['ignorer', '0, 1 (vides), 2 (erreurs), 3 (les deux).'], ['scan_par_colonne', 'VRAI = par colonne.']],
    [['=DANSLIGNE(A2:A13)', 'Transforme une colonne en ligne.']],
    [], 'une ligne aplatir horizontal',
    'DANSCOL TRANSPOSE');

  F('ORGA.COLS', 'WRAPCOLS', 'tableaux', '2024',
    'Répartit une liste en colonnes de N éléments.',
    'ORGA.COLS(vecteur; nombre_wrap; [remplir_avec])',
    [['vecteur', 'Liste source.'], ['nombre_wrap', 'Nombre d’éléments par colonne.'], ['remplir_avec', 'Valeur pour compléter.']],
    [['=ORGA.COLS(A2:A25;12)', '24 mois répartis en 2 colonnes de 12.']],
    [], 'repartir colonnes decouper liste',
    'ORGA.LIGNES');

  F('ORGA.LIGNES', 'WRAPROWS', 'tableaux', '2024',
    'Répartit une liste en lignes de N éléments.',
    'ORGA.LIGNES(vecteur; nombre_wrap; [remplir_avec])',
    [['vecteur', 'Liste source.'], ['nombre_wrap', 'Éléments par ligne.'], ['remplir_avec', 'Valeur de complément.']],
    [['=ORGA.LIGNES(A2:A13;3;"")', '12 mois → 4 lignes de 3 (trimestres).']],
    [], 'repartir lignes trimestres decouper',
    'ORGA.COLS');

  F('PIVOTER.PAR', 'PIVOTBY', 'tableaux', '365',
    'Tableau croisé dynamique en une formule : regroupe en lignes ET en colonnes et agrège (somme, moyenne…).',
    'PIVOTER.PAR(champs_lignes; champs_colonnes; valeurs; fonction; [en_têtes]; [profondeur_total_lignes]; [ordre_tri_lignes]; [profondeur_total_colonnes]; [ordre_tri_colonnes]; [filtre]; [relatif_à])',
    [['champs_lignes', 'Colonne(s) en lignes (ex. Compte).'], ['champs_colonnes', 'Colonne(s) en colonnes (ex. Mois).'],
     ['valeurs', 'Montants à agréger.'], ['fonction', 'SOMME, MOYENNE, NB… (nom seul, sans parenthèses) ou LAMBDA.'],
     ['autres', 'Totaux, tris, filtre : facultatifs.']],
    [['=PIVOTER.PAR(Journal[Compte];Journal[Mois];Journal[Montant];SOMME)', 'Balance mensuelle par compte, totaux inclus.']],
    ['Pas de bouton « Actualiser » : le résultat suit les données en direct.'],
    'tableau croise dynamique tcd formule regrouper agreger synthese par mois par compte',
    'LIREDONNEESTABCROISDYNAMIQUE SOMME.SI.ENS');
})(window.XL);
