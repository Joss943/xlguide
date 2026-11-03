/* Notions — activité « Présenter » (ordre = ordre de lecture conseillé). */
(function (XL) {
  'use strict';
  var N = XL.N;

  /* ------------------------------- LES BASES ------------------------------- */
  N({
    activity: 'presenter', level: 'base', title: 'Créer un graphique',
    intro: 'Un graphique se crée en deux clics à partir d’un tableau : Excel lit les en-têtes pour nommer les séries et les catégories.',
    steps: [
      'Sélectionne les données avec leurs en-têtes (par exemple A1:B5).',
      'Insertion > Graphiques recommandés : Excel propose les graphiques adaptés à tes données.',
      'Choisis un modèle, puis OK : le graphique apparaît sur la feuille ; fais-le glisser pour le placer.'
    ],
    points: [
      'Alt+F1 crée directement un graphique par défaut sur la feuille ; F11 le crée sur une nouvelle feuille.',
      'Le graphique reste lié aux données : modifie un chiffre, il se met à jour.',
      'La première colonne donne les catégories (axe horizontal), les colonnes suivantes les séries de valeurs.'
    ],
    sample: {
      cols: ['Mois', 'Ventes'],
      rows: [['Janv', 1200], ['Févr', 950], ['Mars', 1430], ['Avr', 1100]],
      select: 'A1:B5',
      note: 'Sélection A1:B5 : les mois deviennent l’axe horizontal, les ventes la hauteur des barres.'
    },
    kw: 'graphique creer un graphique histogramme diagramme courbe camembert inserer graphique graphiques recommandes alt f1'
  });

  N({
    activity: 'presenter', level: 'base', title: 'Modifier un graphique : titre, étiquettes, couleurs',
    intro: 'Un clic sur le graphique fait apparaître les outils pour le rendre lisible : titre, étiquettes de données, légende, couleurs.',
    steps: [
      'Clique sur le graphique : trois boutons apparaissent à sa droite.',
      '+ (Éléments de graphique) : coche Titre du graphique, Étiquettes de données, Légende, Titres des axes…',
      'Pinceau (Styles du graphique) : choisis un style ou une palette de couleurs.'
    ],
    points: [
      'Entonnoir (Filtres du graphique) : masque une série ou une catégorie sans toucher aux données.',
      'Clique sur le titre pour le réécrire ; double-clique sur un élément (barre, axe, légende) pour ouvrir ses options.',
      'Création de graphique > Modifier le type de graphique : passe d’un histogramme à une courbe sans tout refaire.',
      'Création de graphique > Intervertir les lignes/colonnes si les séries ne sont pas dans le bon sens.',
      'Création de graphique > Sélectionner des données pour ajouter ou retirer une série.'
    ],
    tips: ['Un titre qui dit ce qu’il faut voir (« Mars, meilleur mois ») est plus utile que « Ventes ».'],
    kw: 'modifier graphique titre etiquettes de donnees legende couleur style axe elements de graphique changer type'
  });

  N({
    activity: 'presenter', level: 'base', title: 'Mettre en page et imprimer',
    intro: 'Avant d’imprimer, l’aperçu montre ce qui sortira réellement : orientation, nombre de pages, colonnes coupées.',
    steps: [
      'Fichier > Imprimer (Ctrl+P) : l’aperçu s’affiche à droite.',
      'Choisis l’orientation (Portrait ou Paysage) et le format du papier.',
      'Si le tableau déborde, remplace « Pas de mise à l’échelle » par « Ajuster toutes les colonnes à une page », puis Imprimer.'
    ],
    points: [
      'Pour n’imprimer qu’une partie : sélectionne-la, puis Mise en page > Zone d’impression > Définir.',
      'Affichage > Aperçu des sauts de page montre les pages ; fais glisser les traits bleus pour les ajuster.',
      'Mise en page > Marges, Orientation et Taille règlent la page sans passer par l’impression.'
    ],
    kw: 'imprimer impression mise en page apercu orientation paysage portrait ajuster une page zone d impression ctrl p marges'
  });

  /* ------------------------------ INTERMÉDIAIRE ------------------------------ */
  N({
    activity: 'presenter', level: 'intermediaire', title: 'Choisir le bon graphique',
    intro: 'Le bon graphique dépend du message : comparer, montrer une évolution, une répartition ou un lien entre deux valeurs.',
    points: [
      'Comparer des catégories (ventes par vendeur) : histogramme, ou barres horizontales si les libellés sont longs.',
      'Montrer une évolution dans le temps : courbes.',
      'Montrer la part de chaque élément dans un total : secteurs, avec peu de parts (cinq au maximum).',
      'Montrer le lien entre deux mesures (prix et quantité vendue) : nuage de points.',
      'Deux grandeurs d’échelles différentes (chiffre d’affaires et nombre de clients) : graphique combiné.'
    ],
    tips: ['Évite la 3D et les effets : ils déforment les proportions.', 'Trie les barres de la plus grande à la plus petite pour faciliter la lecture.'],
    kw: 'choisir graphique quel graphique histogramme barres courbes secteurs camembert nuage de points comparer evolution repartition'
  });

  N({
    activity: 'presenter', level: 'intermediaire', title: 'Graphique combiné : deux séries, deux axes',
    intro: 'Quand deux séries n’ont pas la même échelle (un chiffre d’affaires en euros et un nombre de clients), un graphique combiné les affiche ensemble, chacune sur son axe.',
    steps: [
      'Sélectionne les données avec les deux séries et leurs en-têtes (par exemple A1:C5).',
      'Insertion > Insérer un graphique combiné > Histogramme groupé - Courbe sur l’axe secondaire.',
      'Sur un graphique existant : Création de graphique > Modifier le type de graphique > Graphique combiné, puis coche Axe secondaire pour la série concernée.'
    ],
    points: [
      'L’axe secondaire, à droite, a sa propre échelle.',
      'Donne un titre à chaque axe (Éléments de graphique > Titres des axes) pour savoir quelle série lire sur quel axe.'
    ],
    sample: {
      cols: ['Mois', 'CA', 'Clients'],
      rows: [['Janv', 12000, 45], ['Févr', 9500, 38], ['Mars', 14300, 52], ['Avr', 11000, 41]],
      select: 'A1:C5',
      note: 'Le CA se compte en milliers, les clients en dizaines : le CA en histogramme, les clients en courbe sur l’axe secondaire.'
    },
    kw: 'graphique combine deux axes axe secondaire histogramme et courbe double echelle deux series'
  });

  N({
    activity: 'presenter', level: 'intermediaire', title: 'Les graphiques sparkline',
    intro: 'Un graphique sparkline est un mini-graphique logé dans une cellule : il montre la tendance de chaque ligne d’un tableau.',
    steps: [
      'Clique dans la cellule qui recevra le graphique (par exemple F2).',
      'Insertion > Graphiques sparkline > Courbe (ou Histogramme).',
      'Plage de données : les valeurs de la ligne (B2:E2), puis OK. Recopie la cellule vers le bas avec la poignée pour les autres lignes.'
    ],
    points: [
      'L’onglet Graphique sparkline permet de faire ressortir le point haut et le point bas.',
      'Le type Positif/Négatif colore différemment les valeurs négatives.',
      'Le graphique est un fond de cellule : on peut encore écrire un texte dans la cellule.'
    ],
    sample: {
      cols: ['Produit', 'T1', 'T2', 'T3', 'T4'],
      rows: [['Stylo', 120, 135, 150, 170], ['Cahier', 80, 70, 65, 90]],
      select: 'B2:E2',
      note: 'La plage B2:E2 alimente le graphique sparkline de la cellule F2.'
    },
    kw: 'sparkline mini graphique dans une cellule tendance courbe histogramme point haut point bas'
  });

  N({
    activity: 'presenter', level: 'intermediaire', title: 'Imprimer un grand tableau',
    intro: 'Sur plusieurs pages, un tableau doit rester lisible : en-têtes répétés, coupures au bon endroit, numéros de page.',
    steps: [
      'Mise en page > Imprimer les titres : dans « Lignes à répéter en haut », sélectionne la ligne d’en-têtes (par exemple $1:$1), puis OK.',
      'Fichier > Imprimer : choisis « Ajuster toutes les colonnes à une page » pour éviter une colonne isolée sur une page.',
      'Insertion > En-tête/Pied de page : ajoute le numéro de page et le nom du fichier.'
    ],
    points: [
      'Les en-têtes répétés rendent chaque page lisible seule.',
      'Mise en page > Sauts de page > Insérer un saut de page coupe avant la ligne sélectionnée.',
      'Affichage > Aperçu des sauts de page : fais glisser les traits bleus pour décider où chaque page s’arrête.'
    ],
    kw: 'imprimer grand tableau plusieurs pages repeter en tetes imprimer les titres lignes a repeter saut de page en tete pied de page numero de page'
  });
})(window.XL);
