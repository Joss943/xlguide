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

  /* ================ TABLEAUX DYNAMIQUES (Excel 2021+) ================ */
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
