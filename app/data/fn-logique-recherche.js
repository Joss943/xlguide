/* Fonctions : Logique, Recherche, Tableaux dynamiques, Information */
(function (XL) {
  'use strict';
  var F = XL.F;

  /* ============================= LOGIQUE ============================= */
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
    'SI.CONDITIONS ET OU SIERREUR');

  F('SI.CONDITIONS', 'IFS', 'logique', '2019',
    'Teste plusieurs conditions dans l’ordre et renvoie la valeur de la première condition VRAIE. Remplace les SI imbriqués.',
    'SI.CONDITIONS(test1; valeur1; [test2; valeur2]; …)',
    [['test1', 'Première condition.'], ['valeur1', 'Résultat si test1 est VRAI.'],
     ['test2; valeur2…', 'Paires condition/résultat suivantes (jusqu’à 127).']],
    [['=SI.CONDITIONS(45<=30;"0-30 j";45<=60;"31-60 j";VRAI;"> 60 j")', 'Classe un retard de 45 jours dans une tranche (balance âgée).', '31-60 j'],
     ['=SI.CONDITIONS(B2>=10000;5%;B2>=5000;3%;VRAI;0)', 'Taux de remise selon le chiffre d’affaires.']],
    ['Il n’y a pas de valeur « sinon » : termine par VRAI;"valeur par défaut", sinon tu obtiens #N/A quand rien ne correspond.'],
    'plusieurs conditions si imbrique multiple tranche palier bareme classer categorie',
    'SI RECHERCHEX');

  F('SIERREUR', 'IFERROR', 'logique', '',
    'Renvoie une valeur de remplacement si la formule produit une erreur (#N/A, #DIV/0!, #VALEUR!…), sinon le résultat normal.',
    'SIERREUR(valeur; valeur_si_erreur)',
    [['valeur', 'Formule à surveiller.'], ['valeur_si_erreur', 'Ce qu’on affiche à la place de l’erreur.']],
    [['=SIERREUR(10/0;0)', 'Évite #DIV/0! : renvoie 0.', 0],
     ['=SIERREUR(RECHERCHEV(A2;Clients;2;FAUX);"Client inconnu")', 'Message propre quand la recherche échoue.']],
    ['Masque TOUTES les erreurs, y compris tes fautes de frappe. Pour ne cibler que « introuvable », préfère SI.NON.DISP.'],
    'erreur masquer cacher remplacer na div0 si erreur eviter',
    'SI.NON.DISP');

  F('SI.NON.DISP', 'IFNA', 'logique', '2013',
    'Comme SIERREUR mais n’intercepte QUE l’erreur #N/A (valeur introuvable). Les autres erreurs restent visibles.',
    'SI.NON.DISP(valeur; valeur_si_na)',
    [['valeur', 'Formule (souvent une recherche).'], ['valeur_si_na', 'Valeur si #N/A.']],
    [['=SI.NON.DISP(RECHERCHEV(A2;Produits;2;FAUX);"Code inconnu")', 'Signale un code produit inconnu sans cacher les autres erreurs.']],
    ['Les autres erreurs (#REF!, #VALEUR!) restent visibles : elles signalent un vrai problème dans la formule.'],
    'na introuvable non disponible recherche echec erreur',
    'SIERREUR');

  F('ET', 'AND', 'logique', '',
    'Renvoie VRAI si TOUTES les conditions sont vraies.',
    'ET(logique1; [logique2]; …)',
    [['logique1…', 'Conditions à tester (jusqu’à 255).']],
    [['=ET(5>3;2<4)', 'Les deux conditions sont vraies.', true],
     ['=SI(ET(B2>=DATE(2026;1;1);B2<=DATE(2026;12;31));"Année 2026";"")', 'Vérifie qu’une date tombe en 2026.']],
    ['Dans FILTRE, ET ne fonctionne pas ligne par ligne : multiplie les conditions (cond1)*(cond2).'],
    'et toutes conditions les deux a la fois cumul',
    'OU NON SI');

  F('OU', 'OR', 'logique', '',
    'Renvoie VRAI si AU MOINS UNE des conditions est vraie.',
    'OU(logique1; [logique2]; …)',
    [['logique1…', 'Conditions à tester.']],
    [['=OU(1>5;3=3)', 'Une seule condition vraie suffit.', true],
     ['=SI(OU(C2="Annulé";C2="Remboursé");0;D2)', 'Met à 0 les commandes annulées ou remboursées.']],
    ['En logique matricielle, additionne les conditions : (cond1)+(cond2)>0.'],
    'ou au moins une condition l une ou l autre',
    'ET NON');

  F('NON', 'NOT', 'logique', '',
    'Inverse une valeur logique : VRAI devient FAUX et inversement.',
    'NON(logique)',
    [['logique', 'Condition à inverser.']],
    [['=NON(5>3)', 'Inverse VRAI.', false], ['=SI(NON(ESTVIDE(A2));"Saisi";"À compléter")', 'Teste qu’une cellule n’est pas vide.']],
    [], 'non inverser contraire negation pas',
    'ET OU');

  F('SI.MULTIPLE', 'SWITCH', 'logique', '2019',
    'Compare une valeur à une liste de cas et renvoie le résultat du cas qui correspond.',
    'SI.MULTIPLE(expression; valeur1; résultat1; [valeur2; résultat2]; …; [défaut])',
    [['expression', 'Valeur à comparer.'], ['valeur1; résultat1', 'Un cas et le résultat associé.'],
     ['défaut', 'Résultat si aucun cas ne correspond (facultatif, dernier argument isolé).']],
    [['=SI.MULTIPLE(3;1;"Janv";2;"Févr";3;"Mars";"?")', 'Traduit un numéro de mois en libellé.', 'Mars'],
     ['=SI.MULTIPLE(A2;"N";"Nord";"S";"Sud";"E";"Est";"O";"Ouest";"Inconnu")', 'Remplace un code de région par son nom.']],
    ['Ne teste que l’égalité. Pour des seuils (>, <), utilise SI.CONDITIONS.'],
    'selon valeur correspondance cas liste remplacer code par libelle switch',
    'SI.CONDITIONS CHOISIR');

  F('LET', 'LET', 'logique', '2021',
    'Donne un nom aux étapes d’une formule. Une formule longue devient lisible, et chaque étape n’est calculée qu’une fois.',
    'LET(nom1; valeur1; [nom2; valeur2]; …; calcul)',
    [['nom1', 'Nom de l’étape (commence par une lettre).'], ['valeur1', 'Valeur ou calcul associé.'],
     ['calcul', 'Dernier argument : le résultat final, qui utilise les noms.']],
    [['=LET(ht;100;tva;20%;ht*(1+tva))', 'Prix TTC avec des étapes nommées.', 120],
     ['=LET(j;AUJOURDHUI()-E2;SI(j<=0;"À l’heure";j&" j de retard"))', 'Le retard est calculé une seule fois puis réutilisé.']],
    ['Très utile avec FILTRE et TRIER : chaque étape porte un nom, comme dans une recette.'],
    'nommer etapes variable intermediaire lisible simplifier formule longue',
    'LAMBDA');

  F('LAMBDA', 'LAMBDA', 'logique', '2024',
    'Crée ta propre fonction. Enregistrée dans le Gestionnaire de noms, elle s’utilise comme une fonction d’Excel.',
    'LAMBDA([paramètre1; paramètre2; …]; calcul)',
    [['paramètre…', 'Noms des valeurs d’entrée.'], ['calcul', 'Formule qui utilise les paramètres.']],
    [['=LAMBDA(ht;taux;ht*(1+taux))(100;20%)', 'Fonction testée directement dans une cellule.', 120],
     ['Nom « TTC » = LAMBDA(ht;taux;ARRONDI(ht*(1+taux);2)), puis =TTC(B2;20%)', 'Fonction TTC créée dans Formules > Gestionnaire de noms.']],
    ['Teste la LAMBDA dans une cellule en ajoutant les valeurs entre parenthèses à la fin, puis enregistre-la comme nom.'],
    'creer sa propre fonction personnalisee reutilisable gestionnaire de noms',
    'LET');

  /* ============================ RECHERCHE ============================ */
  F('RECHERCHEX', 'XLOOKUP', 'recherche', '2021',
    'LA fonction de recherche moderne : cherche une valeur dans une colonne et renvoie la valeur correspondante d’une autre colonne, à gauche ou à droite, avec message si introuvable.',
    'RECHERCHEX(valeur_cherchée; tableau_recherche; tableau_renvoyé; [si_non_trouvé]; [mode_correspondance]; [mode_recherche])',
    [['valeur_cherchée', 'Ce que tu cherches (ex. un n° de compte).'],
     ['tableau_recherche', 'Colonne où chercher.'],
     ['tableau_renvoyé', 'Colonne (ou plusieurs) à renvoyer.'],
     ['si_non_trouvé', 'Texte/valeur si rien n’est trouvé (évite #N/A).'],
     ['mode_correspondance', '0 = exacte (défaut) ; -1 = exacte ou inférieure ; 1 = exacte ou supérieure ; 2 = caractères génériques * ?'],
     ['mode_recherche', '1 = du début (défaut) ; -1 = depuis la fin (dernière occurrence) ; 2/-2 = dichotomique sur liste triée.']],
    [['=RECHERCHEX(A2;Produits[Code];Produits[Libellé];"Code inconnu")', 'Libellé d’un produit à partir de son code.'],
     ['=RECHERCHEX(B2;Bareme[Seuil];Bareme[Taux];;-1)', 'Barème par tranches : prend le seuil immédiatement inférieur (commissions, remises).'],
     ['=RECHERCHEX(A2;Ventes[Client];Ventes[Date];;0;-1)', 'Date de la DERNIÈRE vente d’un client.']],
    ['Remplace RECHERCHEV : pas besoin de compter les colonnes, et insérer une colonne ne casse rien.',
     'Si le tableau renvoyé contient plusieurs colonnes, le résultat « déborde » sur plusieurs cellules.'],
    'rechercher trouver valeur correspondante chercher recuperer libelle tableau correspondance recherchev xlookup aller chercher info autre feuille',
    'RECHERCHEV FILTRE');

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
     'Ne sait pas chercher vers la gauche : utilise RECHERCHEX (Excel 2021+).',
     'Si les n° de compte sont du texte d’un côté et des nombres de l’autre → #N/A. Uniformise avec CNUM ou &"".'],
    'rechercher trouver valeur colonne vlookup recherche verticale correspondance aller chercher autre feuille',
    'RECHERCHEX');

  F('INDEX', 'INDEX', 'recherche', '',
    'Renvoie la valeur située à une position donnée d’une plage. Avec EQUIV, elle cherche dans tous les sens, dans toutes les versions d’Excel.',
    'INDEX(tableau; no_lig; [no_col])',
    [['tableau', 'Plage de cellules.'], ['no_lig', 'Position de la ligne dans la plage.'], ['no_col', 'Position de la colonne (si la plage a plusieurs colonnes).']],
    [['=INDEX(C2:C500;EQUIV(A2;B2:B500;0))', 'Valeur de la colonne C sur la ligne où B vaut A2.'],
     ['=INDEX($B$2:$M$50;EQUIV(P2;$A$2:$A$50;0);EQUIV(Q2;$B$1:$M$1;0))', 'Tableau à double entrée : la ligne du produit écrit en P2, la colonne du mois écrit en Q2.']],
    ['Avec INDEX + EQUIV, insérer ou déplacer des colonnes ne casse pas la formule, contrairement au numéro de colonne de RECHERCHEV.'],
    'position ligne colonne recuperer cellule double entree croisement index equiv',
    'EQUIV RECHERCHEX DECALER');

  F('EQUIV', 'MATCH', 'recherche', '',
    'Renvoie la position d’une valeur dans une ligne ou une colonne (1, 2, 3…).',
    'EQUIV(valeur_cherchée; tableau_recherche; [type])',
    [['valeur_cherchée', 'Valeur à trouver.'], ['tableau_recherche', 'Une seule ligne ou une seule colonne.'],
     ['type', '0 = exacte (recommandé) ; 1 = plus grande valeur inférieure ou égale (liste croissante, par défaut) ; -1 = plus petite valeur supérieure ou égale (liste décroissante).']],
    [['=EQUIV("Mars";B1:M1;0)', 'Numéro de la colonne « Mars » dans la ligne des mois.'],
     ['=ESTNUM(EQUIV(A2;Liste2!A:A;0))', 'VRAI si la valeur de A2 existe dans l’autre liste.']],
    ['Le type par défaut est 1 (approché) : mets toujours 0 pour une recherche exacte.'],
    'position rang trouver ou se trouve numero ligne existe dans liste',
    'INDEX EQUIVX RECHERCHEX');

  F('EQUIVX', 'XMATCH', 'recherche', '2021',
    'Version moderne d’EQUIV : correspondance exacte par défaut, recherche depuis la fin possible.',
    'EQUIVX(valeur_cherchée; tableau_recherche; [mode_correspondance]; [mode_recherche])',
    [['valeur_cherchée', 'Valeur à trouver.'], ['tableau_recherche', 'Ligne ou colonne.'],
     ['mode_correspondance', '0 = exacte (par défaut), -1 = exacte ou inférieure, 1 = exacte ou supérieure, 2 = caractères génériques.'],
     ['mode_recherche', '1 = depuis le début, -1 = depuis la fin.']],
    [['=EQUIVX(A2;B2:B500;0;-1)', 'Position de la dernière ligne où B vaut A2.']],
    [], 'position derniere occurrence equiv moderne',
    'EQUIV INDEX RECHERCHEX');

  F('CHOISIR', 'CHOOSE', 'recherche', '',
    'Renvoie l’élément numéro X d’une liste de valeurs.',
    'CHOISIR(no_index; valeur1; [valeur2]; …)',
    [['no_index', 'Numéro de l’élément voulu (de 1 à 254).'], ['valeur1…', 'Liste des choix.']],
    [['=CHOISIR(2;"T1";"T2";"T3";"T4")', 'Renvoie le 2e élément.', 'T2'],
     ['=CHOISIR(JOURSEM(A2;2);"Lun";"Mar";"Mer";"Jeu";"Ven";"Sam";"Dim")', 'Jour de la semaine en toutes lettres.']],
    [], 'choisir element liste numero option scenario',
    'SI.MULTIPLE INDEX');

  F('DECALER', 'OFFSET', 'recherche', '',
    'Renvoie une plage décalée d’un certain nombre de lignes et de colonnes par rapport à une cellule de départ, avec la taille voulue.',
    'DECALER(réf; lignes; colonnes; [hauteur]; [largeur])',
    [['réf', 'Cellule de départ.'], ['lignes', 'Décalage vers le bas (négatif = vers le haut).'], ['colonnes', 'Décalage vers la droite (négatif = vers la gauche).'],
     ['hauteur', 'Nombre de lignes de la plage renvoyée.'], ['largeur', 'Nombre de colonnes de la plage renvoyée.']],
    [['=SOMME(DECALER(B2;0;0;1;3))', 'Somme des 3 cellules à partir de B2, vers la droite.'],
     ['=SOMME(DECALER($B2;0;0;1;$P$1))', 'Cumul jusqu’au mois N, N étant écrit en P1.']],
    ['Fonction « volatile » : recalculée à chaque modification, elle ralentit les gros classeurs. INDEX ou PRENDRE font souvent la même chose sans ce défaut.'],
    'plage dynamique glissante cumul variable decaler',
    'INDEX PRENDRE INDIRECT');

  F('INDIRECT', 'INDIRECT', 'recherche', '',
    'Transforme un texte en référence de cellule. Par exemple, viser la feuille dont le nom est écrit dans une cellule.',
    'INDIRECT(réf_texte; [a1])',
    [['réf_texte', 'Adresse sous forme de texte (par exemple "Janvier!B5").'], ['a1', 'VRAI (par défaut) = style A1 ; FAUX = style L1C1.']],
    [['=INDIRECT(A1&"!B10")', 'Lit B10 dans la feuille dont le nom est écrit en A1 (un mois, par exemple).'],
     ['=SOMME(INDIRECT("B2:B"&C1))', 'Somme de B2 jusqu’à la ligne indiquée en C1.']],
    ['Volatile, et invisible pour l’audit des formules. Si le nom de la feuille contient des espaces : "\'"&A1&"\'!B10".'],
    'reference texte nom de feuille variable dynamique liste en cascade',
    'DECALER');

  F('LIREDONNEESTABCROISDYNAMIQUE', 'GETPIVOTDATA', 'recherche', '',
    'Lit une valeur dans un tableau croisé dynamique par les noms des champs, pas par la position de la cellule : la formule reste juste quand le TCD change de forme.',
    'LIREDONNEESTABCROISDYNAMIQUE(champ_données; tableau_croisé_dyn; [champ1; élément1]; …)',
    [['champ_données', 'Nom du champ de valeurs (par exemple "Ventes").'], ['tableau_croisé_dyn', 'Une cellule du TCD.'],
     ['champ; élément', 'Paires champ / valeur qui désignent la case voulue.']],
    [['=LIREDONNEESTABCROISDYNAMIQUE("Ventes";$A$3;"Région";"Nord";"Mois";"Mars")', 'Ventes du Nord en mars, lues dans le TCD qui commence en A3.']],
    ['Elle s’écrit toute seule quand tu tapes = puis cliques dans un TCD.'],
    'tcd tableau croise dynamique lire extraire valeur tableau de bord',
    'PIVOTER.PAR SOMME.SI.ENS');

  F('LIEN_HYPERTEXTE', 'HYPERLINK', 'recherche', '',
    'Crée un lien cliquable vers une page web, un fichier ou une cellule du classeur.',
    'LIEN_HYPERTEXTE(emplacement_lien; [nom_convivial])',
    [['emplacement_lien', 'Adresse web, chemin d’un fichier, ou "#Feuille!A1" pour une cellule du classeur.'], ['nom_convivial', 'Texte affiché.']],
    [['=LIEN_HYPERTEXTE("#Synthèse!A1";"Retour à la synthèse")', 'Lien de navigation vers la cellule A1 de la feuille Synthèse.'],
     ['=LIEN_HYPERTEXTE("https://www.exemple.fr";"Site du fournisseur")', 'Lien vers une page web.']],
    [], 'lien hypertexte url cliquable navigation sommaire tableau de bord',
    'INDIRECT');

  /* ============== TABLEAUX DYNAMIQUES (Excel 2021 et plus) ============== */
  F('FILTRE', 'FILTER', 'tableaux', '2021',
    'Extrait toutes les lignes qui répondent à un ou plusieurs critères. Le résultat se met à jour tout seul.',
    'FILTRE(tableau; inclure; [si_vide])',
    [['tableau', 'Données à filtrer.'], ['inclure', 'Condition(s) : (col1="x")*(col2>0) pour ET, +(…) pour OU.'],
     ['si_vide', 'Valeur affichée si aucun résultat.']],
    [['=FILTRE(Factures;Factures[Statut]="Impayé";"Aucune")', 'Liste de toutes les factures impayées.'],
     ['=FILTRE(Factures;(Factures[Statut]="Impayé")*(Factures[Échéance]<AUJOURDHUI());"Rien d’échu")', 'Impayées ET échues (relances).'],
     ['=FILTRE(Ventes;(Ventes[Montant]>=1000)*(Ventes[Région]="Nord"))', 'Ventes d’au moins 1 000 € dans la région Nord (deux conditions multipliées).']],
    ['Laisse de la place vide sous la formule, sinon erreur #PROPAGATION!.',
     'Combine avec TRIER : =TRIER(FILTRE(…);3;-1).'],
    'filtrer extraire lignes criteres liste conditionnelle sous tableau impayees',
    'TRIER UNIQUE');

  F('TRIER', 'SORT', 'tableaux', '2021',
    'Trie une plage par une colonne, en croissant ou décroissant, sans toucher aux données sources.',
    'TRIER(tableau; [index_tri]; [ordre_tri]; [par_col])',
    [['tableau', 'Données à trier.'], ['index_tri', 'N° de la colonne de tri (1 par défaut).'],
     ['ordre_tri', '1 = croissant (défaut) ; -1 = décroissant.'], ['par_col', 'VRAI pour trier des colonnes.']],
    [['=TRIER(A2:C100;3;-1)', 'Trie par la 3e colonne (montant) du plus grand au plus petit.'],
     ['=TRIER(UNIQUE(Ventes[Client]))', 'Liste alphabétique des clients, sans doublon.']],
    [], 'trier classer ordre croissant decroissant alphabetique tri',
    'FILTRE UNIQUE');

  F('UNIQUE', 'UNIQUE', 'tableaux', '2021',
    'Renvoie la liste des valeurs distinctes (supprime les doublons) d’une plage.',
    'UNIQUE(tableau; [par_col]; [exactement_une_fois])',
    [['tableau', 'Plage source.'], ['par_col', 'VRAI pour comparer des colonnes.'],
     ['exactement_une_fois', 'VRAI = ne garder que les valeurs présentes une seule fois.']],
    [['=UNIQUE(Ventes[Région])', 'Liste des régions, sans doublon.'],
     ['=NBVAL(UNIQUE(Ventes[Client]))', 'Nombre de clients distincts.'],
     ['=UNIQUE(A2:A500;;VRAI)', 'Valeurs qui n’apparaissent qu’une seule fois.']],
    [], 'doublons supprimer distinct sans doublon liste unique valeurs differentes',
    'TRIER FILTRE NB.SI');

  F('TRIERPAR', 'SORTBY', 'tableaux', '2021',
    'Trie un tableau selon une ou plusieurs autres colonnes, même si elles ne sont pas affichées.',
    'TRIERPAR(tableau; par_tableau1; [ordre_tri1]; [par_tableau2; ordre_tri2]; …)',
    [['tableau', 'Données à renvoyer.'], ['par_tableau1', 'Colonne qui sert au tri.'], ['ordre_tri1', '1 = croissant, -1 = décroissant.']],
    [['=TRIERPAR(A2:A50;B2:B50;-1)', 'Les noms classés du plus gros au plus petit chiffre d’affaires (colonne B).'],
     ['=TRIERPAR(A2:D200;C2:C200;1;A2:A200;1)', 'Tri par date (colonne C), puis par nom.']],
    [], 'trier selon une autre colonne classement plusieurs criteres',
    'TRIER PRENDRE');

  F('PRENDRE', 'TAKE', 'tableaux', '2024',
    'Garde les N premières lignes ou colonnes d’un tableau (les dernières si N est négatif).',
    'PRENDRE(tableau; lignes; [colonnes])',
    [['tableau', 'Plage source.'], ['lignes', 'Nombre de lignes (négatif = depuis la fin).'], ['colonnes', 'Nombre de colonnes.']],
    [['=PRENDRE(TRIERPAR(A2:B100;B2:B100;-1);5)', 'Les 5 meilleures lignes selon la colonne B.'],
     ['=PRENDRE(A2:D500;-10)', 'Les 10 dernières lignes.']],
    [], 'top 5 premiers derniers n lignes classement meilleurs',
    'TRIERPAR GRANDE.VALEUR');

  F('CHOISIRCOLS', 'CHOOSECOLS', 'tableaux', '2024',
    'Renvoie seulement certaines colonnes d’un tableau, dans l’ordre voulu.',
    'CHOISIRCOLS(tableau; col_num1; [col_num2]; …)',
    [['tableau', 'Plage source.'], ['col_num…', 'Numéros des colonnes à garder (négatif = depuis la fin).']],
    [['=CHOISIRCOLS(A2:F100;1;3;5)', 'Garde les colonnes 1, 3 et 5 (par exemple Date, Client et Montant).']],
    [], 'selectionner certaines colonnes extraire reorganiser',
    'PRENDRE FILTRE');

  F('ASSEMB.V', 'VSTACK', 'tableaux', '2024',
    'Empile plusieurs plages les unes sous les autres en un seul tableau.',
    'ASSEMB.V(tableau1; [tableau2]; …)',
    [['tableau1…', 'Plages à empiler (de préférence avec les mêmes colonnes).']],
    [['=ASSEMB.V(Janvier!A2:D100;Février!A2:D100;Mars!A2:D100)', 'Rassemble les tableaux de trois mois en un seul.'],
     ['=ASSEMB.V(Janvier:Décembre!A2:D100)', 'Référence 3D : la même plage de toutes les feuilles, de Janvier à Décembre.']],
    ['Les lignes vides des plages sont reprises : retire-les ensuite avec FILTRE.'],
    'empiler rassembler consolider feuilles fusionner tableaux vertical',
    'FILTRE');

  F('SEQUENCE', 'SEQUENCE', 'tableaux', '2021',
    'Génère une suite de nombres (1, 2, 3… ou avec un pas) sur plusieurs lignes ou colonnes.',
    'SEQUENCE(lignes; [colonnes]; [début]; [pas])',
    [['lignes', 'Nombre de lignes.'], ['colonnes', 'Nombre de colonnes (1 par défaut).'], ['début', 'Premier nombre (1 par défaut).'], ['pas', 'Écart entre deux nombres (1 par défaut).']],
    [['=SEQUENCE(12)', 'Les nombres de 1 à 12, un par ligne.'],
     ['=FIN.MOIS(DATE(2026;1;1);SEQUENCE(12)-1)', 'Les 12 fins de mois de 2026.'],
     ['=SOMME(SEQUENCE(10))', 'Somme de 1 à 10.', 55]],
    [], 'suite de nombres numerotation serie generer 1 a n',
    'PRENDRE');

  F('PIVOTER.PAR', 'PIVOTBY', 'tableaux', '365',
    'Un tableau croisé dynamique en une formule : regroupe en lignes et en colonnes, puis calcule (somme, moyenne…).',
    'PIVOTER.PAR(champs_lignes; champs_colonnes; valeurs; fonction; [en_têtes]; [profondeur_total_lignes]; [ordre_tri_lignes]; [profondeur_total_colonnes]; [ordre_tri_colonnes]; [filtre]; [relatif_à])',
    [['champs_lignes', 'Colonne affichée en lignes (par exemple Produit).'], ['champs_colonnes', 'Colonne affichée en colonnes (par exemple Mois).'],
     ['valeurs', 'Nombres à regrouper.'], ['fonction', 'SOMME, MOYENNE, NB… (le nom seul, sans parenthèses).'],
     ['autres', 'En-têtes, totaux, tris, filtre : facultatifs.']],
    [['=PIVOTER.PAR(B2:B100;A2:A100;C2:C100;SOMME)', 'Ventes par produit (colonne B) et par mois (colonne A), totaux compris.']],
    ['Pas de bouton Actualiser : le résultat suit les données en direct.'],
    'tableau croise dynamique tcd en formule regrouper synthese par mois par produit',
    'LIREDONNEESTABCROISDYNAMIQUE SOMME.SI.ENS');

  /* =========================== INFORMATION =========================== */
  F('ESTVIDE', 'ISBLANK', 'info', '',
    'VRAI si la cellule est vraiment vide.',
    'ESTVIDE(valeur)', [['valeur', 'Cellule.']],
    [['=SI(ESTVIDE(E2);"Non réglé";"Réglé le "&TEXTE(E2;"jj/mm/aaaa"))', 'Statut de règlement.']],
    ['Une cellule contenant "" (formule) n’est PAS vide pour ESTVIDE : teste plutôt E2="".'],
    'vide cellule vide tester vide', 'NB.VIDE ESTNUM');

  F('ESTNUM', 'ISNUMBER', 'info', '',
    'VRAI si la valeur est un nombre (ou une date). Avec CHERCHE, teste si un texte contient un mot.',
    'ESTNUM(valeur)', [['valeur', 'Valeur à tester.']],
    [['=ESTNUM(42)', 'Nombre.', true], ['=ESTNUM("42")', 'Texte qui ressemble à un nombre.', false],
     ['=ESTNUM(CHERCHE("EDF";C2))', 'Le libellé contient « EDF ».']],
    [], 'est un nombre numerique tester nombre contient existe', 'ESTTEXTE CHERCHE');

  F('ESTTEXTE', 'ISTEXT', 'info', '',
    'VRAI si la valeur est du texte. Débusque les montants importés en texte.',
    'ESTTEXTE(valeur)', [['valeur', 'Valeur.']],
    [['=ESTTEXTE("abc")', 'Texte.', true], ['=ESTTEXTE(D2)', 'Montant stocké en texte (ne s’additionne pas).']],
    [], 'est du texte nombre stocke en texte', 'ESTNUM CNUM');
})(window.XL);
