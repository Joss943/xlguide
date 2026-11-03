/* Notions — activité « Organiser & analyser » (ordre = ordre de lecture conseillé). */
(function (XL) {
  'use strict';
  var N = XL.N;

  /* ------------------------------- LES BASES ------------------------------- */
  N({
    activity: 'organiser', level: 'base', title: 'Mettre ses données sous forme de tableau',
    intro: 'Un tableau structuré rend les données faciles à trier, filtrer et calculer : il s’agrandit tout seul quand on ajoute une ligne et recopie les formules.',
    steps: [
      'Vérifie la base : une seule ligne d’en-têtes, une information par colonne, pas de ligne ni de colonne vide.',
      'Clique dans une cellule des données, puis Accueil > Mettre sous forme de tableau et choisis un style (ou Ctrl+L).',
      'Vérifie la plage proposée, coche « Mon tableau comporte des en-têtes », puis OK.'
    ],
    points: [
      'Les en-têtes reçoivent des flèches de tri et de filtre, et les lignes sont colorées une sur deux.',
      'Une formule écrite dans une colonne du tableau est recopiée automatiquement sur toutes les lignes.',
      'Les formules utilisent les noms de colonnes : =[@Quantité]*[@Prix] dans le tableau, =SOMME(Ventes[Montant]) ailleurs.',
      'L’onglet Création de tableau propose une Ligne Total qui tient compte des filtres.'
    ],
    sample: {
      cols: ['Produit', 'Quantité', 'Prix'],
      rows: [['Stylo', 10, 1.5], ['Cahier', 4, 3.2], ['Classeur', 2, 5.9]],
      fmt: [null, null, '0.00'],
      select: 'A1:C4',
      note: 'Clique dans n’importe quelle cellule de A1:C4 : Excel détecte tout seul la plage du tableau.'
    },
    examples: [['=[@Quantité]*[@Prix]', 'Écrite une fois, recopiée sur toute la colonne.'], ['=SOMME(Ventes[Montant])', 'Total d’une colonne du tableau « Ventes ».']],
    tips: [
      'Donne un nom parlant au tableau (Création de tableau > Nom du tableau) : « Ventes » se lit mieux que « Tableau1 ».',
      'Évite les cellules fusionnées dans les données : elles empêchent de trier et de filtrer.'
    ],
    kw: 'tableau structure mettre sous forme de tableau ctrl l base de donnees propre references structurees ligne total'
  });

  N({
    activity: 'organiser', level: 'base', title: 'Trier et filtrer',
    intro: 'Le tri réordonne les lignes ; le filtre masque celles qui ne correspondent pas à un critère, sans rien supprimer.',
    steps: [
      'Clique dans une seule cellule du tableau : Excel trie les lignes entières et ne mélange pas les colonnes.',
      'Pour trier : Données > Trier, choisis la colonne et l’ordre ; « Ajouter un niveau » pour un 2e critère (par exemple client, puis date).',
      'Pour filtrer : Données > Filtrer (Ctrl+Maj+L), puis clique sur la flèche d’un en-tête et coche les valeurs à garder.'
    ],
    points: [
      'Le filtre masque des lignes sans rien supprimer : Données > Effacer réaffiche tout.',
      'La flèche d’en-tête propose aussi des filtres textuels, numériques ou chronologiques : « commence par », « supérieur à », « ce mois-ci »…',
      'SOMME additionne aussi les lignes masquées ; SOUS.TOTAL(109;…) n’additionne que les lignes visibles.'
    ],
    sample: {
      cols: ['Vendeur', 'Région', 'Ventes'],
      rows: [['Alice', 'Nord', 1200], ['Bruno', 'Sud', 850], ['Chloé', 'Nord', 1430]],
      calc: [['Total des lignes visibles', '=SOUS.TOTAL(109;C2:C4)', 3480]],
      note: 'Sans filtre, toutes les lignes sont visibles : le résultat égale la somme. Filtre « Nord » et il ne reste que 2 630.'
    },
    kw: 'trier filtrer filtre tri ordre croissant decroissant alphabetique masquer lignes sous total visibles'
  });

  N({
    activity: 'organiser', level: 'base', title: 'Rechercher et remplacer',
    intro: 'Pour retrouver une valeur dans une grande feuille, ou corriger la même erreur partout d’un coup.',
    steps: [
      'Ctrl+F (Rechercher) : tape le texte cherché, puis « Suivant », ou « Rechercher tout » pour la liste complète.',
      'Ctrl+H (Remplacer) : tape le texte à remplacer et son remplacement, puis « Remplacer tout ».',
      'Bouton « Options » : chercher dans la feuille ou dans tout le classeur, respecter la casse, cellule entière.'
    ],
    points: [
      'Sélectionne d’abord une plage pour limiter le remplacement à cette zone.',
      '« Respecter la casse » distingue majuscules et minuscules ; « Totalité du contenu de la cellule » évite de modifier un mot plus long qui contient le texte cherché.',
      'L’astérisque * remplace n’importe quelle suite de caractères : « Dup* » trouve Dupont et Dupuis.',
      'Un remplacement de trop ? Ctrl+Z l’annule.'
    ],
    kw: 'rechercher remplacer trouver remplacer tout ctrl f ctrl h corriger partout chercher un mot'
  });

  N({
    activity: 'organiser', level: 'base', title: 'Repérer et supprimer les doublons',
    intro: 'Excel sait colorer et supprimer les doublons sans formule ; NB.SI permet de les repérer dans une colonne.',
    steps: [
      'Pour les voir : sélectionne la colonne, puis Accueil > Mise en forme conditionnelle > Règles de mise en surbrillance des cellules > Valeurs en double.',
      'Pour les supprimer : clique dans les données, puis Données > Supprimer les doublons.',
      'Coche les colonnes qui doivent être identiques pour parler de doublon, puis OK : Excel indique combien de lignes ont été supprimées.'
    ],
    points: [
      '=NB.SI($A$2:$A$7;A2)>1 renvoie VRAI pour toutes les occurrences d’un doublon.',
      '=NB.SI($A$2:A2;A2)>1 ne signale que les répétitions (la plage s’agrandit à chaque ligne).',
      'Avec Excel 2021+ : =UNIQUE(A2:A100) renvoie la liste sans doublon.'
    ],
    sample: {
      cols: ['N° commande'],
      rows: [['C-101'], ['C-102'], ['C-101'], ['C-103'], ['C-102'], ['C-104']],
      fill: { header: 'Déjà vu plus haut ?', formula: '=NB.SI($A$2:A2;A2)>1', results: [false, false, true, false, true, false] }
    },
    tips: ['Supprimer les doublons est définitif une fois le fichier enregistré : garde une copie des données avant.'],
    kw: 'doublons double supprimer les doublons reperer valeurs en double unique occurrences'
  });

  /* ------------------------------ INTERMÉDIAIRE ------------------------------ */
  N({
    activity: 'organiser', level: 'intermediaire', title: 'Colorer automatiquement : la mise en forme conditionnelle',
    intro: 'La mise en forme conditionnelle colore les cellules selon leur valeur : retards en rouge, meilleurs résultats en vert, barres de données…',
    steps: [
      'Sélectionne les cellules à colorer.',
      'Accueil > Mise en forme conditionnelle, puis une règle toute prête : Règles de mise en surbrillance des cellules (supérieur à, entre, texte qui contient…), Barres de données, Nuances de couleurs.',
      'Indique la valeur et la couleur, puis OK.'
    ],
    points: [
      'Pour colorer une ligne entière selon une colonne : Nouvelle règle > « Utiliser une formule pour déterminer pour quelles cellules le format sera appliqué ».',
      'La formule est écrite pour la première ligne de la sélection, avec un $ devant la colonne testée (=$D2<AUJOURDHUI()) : Excel l’adapte aux autres lignes.',
      'Accueil > Mise en forme conditionnelle > Gérer les règles pour modifier ou supprimer une règle.'
    ],
    examples: [
      ['=$D2<AUJOURDHUI()', 'Ligne colorée si l’échéance en colonne D est dépassée.'],
      ['=NB.SI($A$2:$A$500;$A2)>1', 'Doublons de la colonne A.']
    ],
    kw: 'mise en forme conditionnelle colorer cellule couleur automatique surligner regle barre de donnees nuances'
  });

  N({
    activity: 'organiser', level: 'intermediaire', title: 'Classer et repérer les extrêmes',
    intro: 'Quelques fonctions répondent aux questions « qui est premier ? », « quelle est la 2e plus grosse vente ? », « quelle est la valeur typique ? ».',
    points: [
      '=EQUATION.RANG(B2;$B$2:$B$6) donne le rang de chaque valeur (1 = la plus grande).',
      '=GRANDE.VALEUR(B2:B6;2) renvoie la 2e plus grande valeur ; PETITE.VALEUR la 2e plus petite.',
      '=MEDIANE(B2:B6) donne la valeur du milieu, moins sensible que la moyenne à une valeur exceptionnelle.'
    ],
    sample: {
      cols: ['Commercial', 'CA'],
      rows: [['Alice', 1200], ['Bruno', 850], ['Chloé', 1430], ['David', 990], ['Emma', 5000]],
      fill: { header: 'Rang', formula: '=EQUATION.RANG(B2;$B$2:$B$6)', results: [3, 5, 2, 4, 1] },
      calc: [['2e plus gros CA', '=GRANDE.VALEUR(B2:B6;2)', 1430], ['Moyenne', '=MOYENNE(B2:B6)', 1894], ['Médiane', '=MEDIANE(B2:B6)', 1200]],
      note: 'Le CA exceptionnel d’Emma tire la moyenne vers le haut ; la médiane reste représentative.'
    },
    kw: 'classement rang premier meilleur extremes plus grand plus petit grande valeur mediane top'
  });

  N({
    activity: 'organiser', level: 'intermediaire', title: 'Comparer deux listes',
    intro: 'Pour savoir si chaque élément d’une liste existe dans une autre, on compte sa présence avec NB.SI.',
    points: [
      '=NB.SI($B$2:$B$5;A2) compte combien de fois A2 apparaît dans la liste B : 0 = absent.',
      '=SI(NB.SI($B$2:$B$5;A2)>0;"Oui";"Non") affiche directement Oui ou Non.',
      'Fais la comparaison dans les deux sens pour trouver les absents de chaque côté.',
      'Nettoie d’abord les deux listes (espaces, majuscules) : sinon des éléments identiques semblent différents.'
    ],
    sample: {
      cols: ['Liste A', 'Liste B'],
      rows: [['Dupont', 'Martin'], ['Martin', 'Leroy'], ['Bernard', 'Dupont'], ['Petit', 'Moreau']],
      fill: { header: 'A présent dans B ?', formula: '=SI(NB.SI($B$2:$B$5;A2)>0;"Oui";"Non")', results: ['Oui', 'Oui', 'Non', 'Non'] }
    },
    examples: [['=FILTRE(A2:A100;NB.SI(C2:C80;A2:A100)=0;"Aucun")', 'Liste des éléments de A absents de C (Excel 2021+).']],
    tips: ['En mise en forme conditionnelle, la règle =NB.SI($B$2:$B$5;$A2)=0 colore les absents.'],
    kw: 'comparer deux listes present absent existe dans liste rapprocher difference correspondance'
  });

  N({
    activity: 'organiser', level: 'intermediaire', title: 'Répartir une colonne sur plusieurs colonnes',
    intro: 'Pour répartir « Dupont;Jean;Lyon » sur trois colonnes, Excel propose deux outils sans formule : Convertir et le remplissage instantané.',
    steps: [
      'Vérifie que les colonnes à droite sont vides : elles vont recevoir les morceaux.',
      'Sélectionne la colonne à découper, puis Données > Convertir.',
      'Choisis « Délimité », coche le séparateur (point-virgule, virgule, espace…), vérifie l’aperçu, puis Terminer.'
    ],
    points: [
      'Remplissage instantané : tape le résultat attendu sur une ou deux lignes de la colonne voisine, puis Données > Remplissage instantané (Ctrl+E) : Excel devine la suite.',
      'Le remplissage instantané sait aussi assembler, par exemple « Jean Dupont » à partir de deux colonnes.',
      'Ces deux outils donnent des valeurs fixes : si les données d’origine changent, il faut recommencer.'
    ],
    sample: {
      cols: ['Contact'],
      rows: [['Dupont;Jean;Lyon'], ['Martin;Léa;Lille'], ['Petit;Hugo;Nantes']],
      select: 'A2:A4',
      note: 'Après Données > Convertir avec le séparateur « ; », chaque morceau se retrouve dans sa propre colonne (A, B et C).'
    },
    kw: 'decouper colonne plusieurs colonnes convertir separateur remplissage instantane ctrl e repartir separer'
  });

  N({
    activity: 'organiser', level: 'intermediaire', title: 'Le tableau croisé dynamique (TCD)',
    intro: 'Le TCD résume des milliers de lignes en quelques clics : totaux par client, par mois, par catégorie… sans écrire de formule.',
    steps: [
      'Clique dans les données, puis Insertion > Tableau croisé dynamique, et OK (nouvelle feuille).',
      'Dans le volet « Champs de tableau croisé dynamique », glisse un champ dans Lignes (ex. Client) et un autre dans Valeurs (ex. Montant).',
      'Ajoute si besoin un champ dans Colonnes (ex. Mois) ou dans Filtres.'
    ],
    points: [
      'Clic droit sur une date > Grouper pour regrouper par mois, trimestre ou année.',
      'Clic droit sur une valeur > Synthétiser les valeurs par : somme, nombre, moyenne, max…',
      'Clic droit sur une valeur > Afficher les valeurs > % du total général pour obtenir des parts.',
      'Le TCD ne se met pas à jour seul : clic droit > Actualiser après avoir modifié les données.'
    ],
    sample: {
      cols: ['Mois', 'Client', 'Montant'],
      rows: [['Janv', 'Martin', 300], ['Janv', 'Durand', 120], ['Févr', 'Martin', 450], ['Févr', 'Petit', 80]],
      select: 'A1:C5',
      note: 'Client en Lignes, Mois en Colonnes, Montant en Valeurs : Martin totalise 750, dont 450 en février.'
    },
    tips: ['Mets d’abord tes données sous forme de tableau (Ctrl+L) : après actualisation, le TCD prend en compte les nouvelles lignes.'],
    kw: 'tableau croise dynamique tcd synthese resume pivot totaux par client par mois grouper actualiser'
  });

  N({
    activity: 'organiser', level: 'intermediaire', title: 'Faire une synthèse par catégorie avec des formules',
    intro: 'Pour un tableau de synthèse qui se met à jour tout seul, on combine SOMME.SI.ENS et des références mixtes.',
    points: [
      'Écris les catégories en colonne A et les mois en ligne 1 du tableau de synthèse.',
      '=SOMME.SI.ENS(Montants;Catégories;$A2;Mois;B$1) : $A2 bloque la colonne des catégories, B$1 la ligne des mois.',
      'Une seule formule, recopiée vers la droite et vers le bas, remplit tout le tableau.',
      'Avec Excel 2021+, =UNIQUE(Catégories) fournit automatiquement la liste des catégories.'
    ],
    sample: {
      cols: ['Mois', 'Catégorie', 'Montant'],
      rows: [['Janv', 'Achats', 300], ['Janv', 'Frais', 120], ['Févr', 'Achats', 450], ['Févr', 'Achats', 80], ['Févr', 'Frais', 60]],
      calc: [['Achats de Févr', '=SOMME.SI.ENS(C2:C6;A2:A6;"Févr";B2:B6;"Achats")', 530], ['Frais (tous mois)', '=SOMME.SI(B2:B6;"Frais";C2:C6)', 180]]
    },
    kw: 'synthese par categorie tableau de bord somme si ens references mixtes recapitulatif par mois'
  });

  N({
    activity: 'organiser', level: 'intermediaire', title: 'Filtrer et trier par formule : FILTRE, TRIER, UNIQUE',
    intro: 'Avec Excel 2021 et plus, une seule formule renvoie toute une liste filtrée, triée ou sans doublon, qui se met à jour automatiquement.',
    points: [
      'Le résultat « déborde » sur les cellules voisines : laisse-les vides, sinon Excel affiche #PROPAGATION!.',
      '=FILTRE(A2:C100;C2:C100>=1000;"Aucun") : lignes dont le montant est d’au moins 1 000.',
      '=TRIER(A2:C100;3;-1) : tri par la 3e colonne, du plus grand au plus petit.',
      '=UNIQUE(B2:B100) : liste sans doublon ; =TRIER(UNIQUE(B2:B100)) la trie en plus.'
    ],
    sample: {
      cols: ['Client', 'Montant'],
      rows: [['Martin', 1200], ['Durand', 300], ['Martin', 450], ['Petit', 1500]],
      calc: [['Clients distincts', '=UNIQUE(A2:A5)', [['Martin'], ['Durand'], ['Petit']]], ['Montants ≥ 1 000', '=FILTRE(A2:B5;B2:B5>=1000)', [['Martin', 1200], ['Petit', 1500]]]]
    },
    kw: 'filtre trier unique formule dynamique liste filtree debordement propagation tableau dynamique'
  });
})(window.XL);
