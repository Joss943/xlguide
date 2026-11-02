/* Notions — activité « Analyser & présenter ». */
(function (XL) {
  'use strict';
  var N = XL.N;

  /* ------------------------------- LES BASES ------------------------------- */
  N({
    activity: 'analyser', level: 'base', title: 'Mettre ses données sous forme de tableau',
    intro: 'Un tableau structuré (Ctrl+L) rend les données faciles à trier, filtrer et calculer : il s’agrandit tout seul et recopie les formules.',
    points: [
      'Une base propre : une seule ligne d’en-têtes, une information par colonne, pas de ligne ni de colonne vide, pas de cellules fusionnées.',
      'Clique dans les données puis Accueil > Mettre sous forme de tableau (ou Ctrl+L).',
      'Les formules utilisent les noms de colonnes : =[@Quantité]*[@Prix] dans le tableau, =SOMME(Ventes[Montant]) ailleurs.',
      'L’onglet du tableau (Création de tableau) propose une Ligne Total qui tient compte des filtres.'
    ],
    examples: [['=[@Quantité]*[@Prix]', 'Écrite une fois, recopiée sur toute la colonne.'], ['=SOMME(Ventes[Montant])', 'Total d’une colonne du tableau « Ventes ».']],
    tips: ['Donne un nom parlant au tableau (onglet Création de tableau > Nom du tableau) : « Ventes » se lit mieux que « Tableau1 ».'],
    kw: 'tableau structure mettre sous forme de tableau ctrl l base de donnees propre references structurees'
  });

  N({
    activity: 'analyser', level: 'base', title: 'Trier et filtrer',
    intro: 'Le tri réordonne les lignes ; le filtre masque celles qui ne correspondent pas à un critère, sans rien supprimer.',
    points: [
      'Données > Trier : choisis une ou plusieurs colonnes (par exemple client, puis date).',
      'Données > Filtrer (Ctrl+Maj+L) ajoute des flèches dans les en-têtes : filtres par valeur, texte, nombre, date ou couleur.',
      'SOMME additionne aussi les lignes masquées ; SOUS.TOTAL(109;…) n’additionne que les lignes visibles.',
      'Pour trier, clique dans une seule cellule du tableau : Excel trie les lignes entières et ne mélange pas les colonnes.'
    ],
    sample: {
      cols: ['Vendeur', 'Région', 'Ventes'],
      rows: [['Alice', 'Nord', 1200], ['Bruno', 'Sud', 850], ['Chloé', 'Nord', 1430]],
      calc: [['Total des lignes visibles', '=SOUS.TOTAL(109;C2:C4)', 3480]],
      note: 'Sans filtre, toutes les lignes sont visibles : le résultat égale la somme. Filtre « Nord » et il ne reste que 2 630.'
    },
    kw: 'trier filtrer filtre tri ordre croissant decroissant masquer lignes sous total visibles'
  });

  N({
    activity: 'analyser', level: 'base', title: 'Colorer automatiquement : la mise en forme conditionnelle',
    intro: 'La mise en forme conditionnelle colore les cellules selon leur valeur : retards en rouge, doublons, barres de données…',
    points: [
      'Accueil > Mise en forme conditionnelle : règles toutes prêtes (supérieur à, doublons, barres de données, nuances de couleurs).',
      'Pour colorer une ligne entière, choisis « Utiliser une formule… » et bloque la colonne testée : =$D2<AUJOURDHUI().',
      'La formule est écrite pour la première ligne de la sélection : Excel l’adapte aux autres lignes.',
      'Accueil > Mise en forme conditionnelle > Gérer les règles pour modifier ou supprimer une règle.'
    ],
    examples: [
      ['=$D2<AUJOURDHUI()', 'Ligne colorée si l’échéance en colonne D est dépassée.'],
      ['=NB.SI($A$2:$A$500;$A2)>1', 'Doublons de la colonne A.'],
      ['=MOD(LIGNE();2)=0', 'Une ligne sur deux, pour la lisibilité.']
    ],
    kw: 'mise en forme conditionnelle colorer cellule couleur automatique surligner regle barre de donnees'
  });

  N({
    activity: 'analyser', level: 'base', title: 'Classer et repérer les extrêmes',
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

  /* ------------------------------ APPROFONDIR ------------------------------ */
  N({
    activity: 'analyser', level: 'approfondir', title: 'Le tableau croisé dynamique (TCD)',
    intro: 'Le TCD résume des milliers de lignes en quelques clics : totaux par client, par mois, par catégorie… sans écrire de formule.',
    points: [
      'Clique dans les données, puis Insertion > Tableau croisé dynamique.',
      'Glisse les champs dans les zones : Lignes (ex. Client), Colonnes (ex. Mois), Valeurs (ex. Montant), Filtres.',
      'Clic droit sur une date > Grouper pour regrouper par mois, trimestre ou année.',
      'Clic droit sur une valeur > Afficher les valeurs > % du total général pour obtenir des parts.',
      'Le TCD ne se met pas à jour seul : clic droit > Actualiser après avoir modifié les données.'
    ],
    examples: [['=LIREDONNEESTABCROISDYNAMIQUE("Montant";$A$3;"Client";"Martin")', 'Récupère une valeur du TCD dans une formule.']],
    tips: ['Mets d’abord tes données sous forme de tableau (Ctrl+L) : après actualisation, le TCD prend en compte les nouvelles lignes.'],
    kw: 'tableau croise dynamique tcd synthese resume pivot totaux par client par mois grouper actualiser'
  });

  N({
    activity: 'analyser', level: 'approfondir', title: 'Faire une synthèse par catégorie avec des formules',
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
    activity: 'analyser', level: 'approfondir', title: 'Filtrer et trier par formule : FILTRE, TRIER, UNIQUE',
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

  /* -------------------------------- EXPERT -------------------------------- */
  N({
    activity: 'analyser', level: 'expert', title: 'Résumer une série : moyenne, médiane, écart-type',
    intro: 'Pour décrire une série (délais, montants, notes), on regarde sa valeur centrale et sa dispersion.',
    points: [
      'MOYENNE est sensible aux valeurs extrêmes ; MEDIANE donne la valeur du milieu.',
      'ECARTYPE.STANDARD mesure la dispersion : plus il est grand, plus les valeurs s’éloignent de la moyenne.',
      'QUARTILE.INCLURE et CENTILE.INCLURE découpent la série (25 %, 75 %, 90 %…).'
    ],
    sample: {
      cols: ['Délai (jours)'],
      rows: [[12], [15], [9], [30], [14]],
      calc: [['Moyenne', '=MOYENNE(A2:A6)', 16], ['Médiane', '=MEDIANE(A2:A6)', 14],
        ['Écart-type', '=ARRONDI(ECARTYPE.STANDARD(A2:A6);2)', 8.15], ['3e quartile', '=QUARTILE.INCLURE(A2:A6;3)', 15]]
    },
    kw: 'statistiques moyenne mediane ecart type dispersion quartile centile resume serie'
  });

  N({
    activity: 'analyser', level: 'expert', title: 'Prévoir une tendance',
    intro: 'PREVISION.LINEAIRE prolonge une série en ligne droite : une première estimation de chiffre d’affaires ou de consommation.',
    points: [
      '=PREVISION.LINEAIRE(x à prévoir ; valeurs connues ; repères connus).',
      'Les repères sont souvent des numéros de période (1, 2, 3…) ou des dates.',
      'Une tendance linéaire ignore la saisonnalité : c’est un ordre de grandeur.',
      'Données > Feuille de prévision construit automatiquement un graphique de prévision.'
    ],
    sample: {
      cols: ['Mois', 'CA'],
      rows: [[1, 100], [2, 110], [3, 120], [4, 130]],
      calc: [['Prévision pour le mois 5', '=PREVISION.LINEAIRE(5;B2:B5;A2:A5)', 140]]
    },
    kw: 'prevision tendance prevoir projection futur estimation chiffre affaires regression'
  });

  N({
    activity: 'analyser', level: 'expert', title: 'Construire un tableau entier par formule',
    intro: 'Les versions récentes d’Excel construisent des synthèses entières par formule : PIVOTER.PAR, PRENDRE, ASSEMB.V…',
    points: [
      '=PIVOTER.PAR(lignes;colonnes;valeurs;SOMME) : un tableau croisé en une formule (Microsoft 365).',
      '=PRENDRE(TRIERPAR(A2:B100;B2:B100;-1);5) : les 5 meilleures lignes (2024/365).',
      '=ASSEMB.V(Feuil1!A2:C50;Feuil2!A2:C50) : empile plusieurs tableaux (2024/365).'
    ],
    examples: [
      ['=PIVOTER.PAR(B2:B100;A2:A100;C2:C100;SOMME)', 'Synthèse catégorie × mois (365).'],
      ['=PRENDRE(TRIERPAR(A2:B100;B2:B100;-1);5)', 'Top 5 (2024/365).']
    ],
    kw: 'pivoter par prendre assemb top 5 tableau par formule synthese 365 dynamique'
  });
})(window.XL);
