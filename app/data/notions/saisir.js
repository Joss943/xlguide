/* Notions — activité « Saisir & mettre en forme » (ordre = ordre de lecture conseillé). */
(function (XL) {
  'use strict';
  var N = XL.N;
  var ARTICLES = { cols: ['Produit', 'Quantité', 'Prix'], rows: [['Stylo', 10, 1.5], ['Cahier', 4, 3.2], ['Classeur', 2, 5.9]], fmt: [null, null, '0.00'] };
  function articles(extra) {
    var s = { cols: ARTICLES.cols, rows: ARTICLES.rows, fmt: ARTICLES.fmt };
    Object.keys(extra).forEach(function (k) { s[k] = extra[k]; });
    return s;
  }

  /* ------------------------------- LES BASES ------------------------------- */
  N({
    activity: 'saisir', level: 'base', title: 'Se repérer dans Excel',
    intro: 'Un fichier Excel s’appelle un classeur. Il contient des feuilles, et chaque feuille est une grille de cellules repérées par une lettre de colonne et un numéro de ligne.',
    points: [
      'La cellule B3 est à l’intersection de la colonne B et de la ligne 3 : c’est son adresse.',
      'La zone Nom, à gauche de la barre de formule, affiche l’adresse de la cellule active ; tape une adresse puis Entrée pour y aller.',
      'La barre de formule montre le contenu réel de la cellule (par exemple une formule) ; la cellule montre le résultat.',
      'Le ruban, en haut, regroupe les commandes par onglet : Accueil, Insertion, Mise en page, Formules, Données, Affichage…',
      'Les onglets en bas de la fenêtre permettent de passer d’une feuille à l’autre.'
    ],
    sample: articles({ select: 'B3', note: 'La cellule sélectionnée est B3 : colonne B, ligne 3. Elle contient 4.' }),
    tips: ['Ctrl+Origine ramène en A1 ; Ctrl+Flèche saute au bout des données.'],
    kw: 'se reperer interface classeur feuille cellule adresse colonne ligne ruban barre de formule zone nom debuter commencer premiers pas'
  });

  N({
    activity: 'saisir', level: 'base', title: 'Saisir et modifier des données',
    intro: 'On tape directement dans une cellule : du texte, un nombre ou une date. Excel reconnaît le type tout seul.',
    steps: [
      'Clique dans une cellule et tape la valeur.',
      'Valide avec Entrée (passe à la cellule du dessous) ou Tab (passe à droite) ; Échap annule la saisie en cours.',
      'Pour corriger sans tout retaper : F2 ou double-clic dans la cellule, puis modifie.'
    ],
    points: [
      'Le texte s’aligne à gauche, les nombres et les dates à droite.',
      'Une date se tape 15/03/2026, un pourcentage 20 %, un nombre décimal 1234,5 (avec une virgule).',
      'Taper dans une cellule déjà remplie remplace tout son contenu ; Suppr l’efface.',
      'Alt+Entrée passe à la ligne à l’intérieur d’une même cellule.',
      'Ctrl+Z annule la dernière action, Ctrl+Y la rétablit.'
    ],
    sample: {
      cols: ['Saisie', 'Type reconnu'],
      rows: [['Dupont', 'Texte : aligné à gauche'], [1234.5, 'Nombre : aligné à droite'], ['d:2026-03-15', 'Date : alignée à droite']],
      note: 'Observe l’alignement : c’est le premier indice du type de donnée.'
    },
    tips: ['#### dans une cellule : la colonne est trop étroite pour afficher le nombre. Élargis-la avec un double-clic sur la bordure de l’en-tête de colonne.'],
    kw: 'saisir taper entrer donnees modifier cellule f2 valider entree tab annuler ctrl z retour a la ligne alt entree'
  });

  N({
    activity: 'saisir', level: 'base', title: 'Sélectionner des cellules',
    intro: 'Presque toutes les commandes s’appliquent à la sélection : bien sélectionner fait gagner beaucoup de temps.',
    points: [
      'Clique-glisse de la première à la dernière cellule pour sélectionner une plage, par exemple A1:C4.',
      'Maj+clic étend la sélection jusqu’à la cellule cliquée ; Ctrl+clic ajoute des cellules qui ne se touchent pas.',
      'Clic sur une lettre de colonne ou un numéro de ligne : toute la colonne ou toute la ligne (Ctrl+Espace / Maj+Espace).',
      'Ctrl+A sélectionne le tableau autour de la cellule active, puis toute la feuille au 2e appui.',
      'Ctrl+Maj+Flèche étend la sélection jusqu’au bout des données.'
    ],
    sample: articles({ select: 'A1:C4', note: 'La plage A1:C4 va de la cellule A1 (en haut à gauche) à la cellule C4 (en bas à droite).' }),
    kw: 'selectionner selection plage cellules colonne entiere ligne entiere ctrl a tout selectionner maj clic ctrl clic'
  });

  N({
    activity: 'saisir', level: 'base', title: 'Lignes, colonnes et feuilles',
    intro: 'Insérer une ligne oubliée, élargir une colonne, ajouter ou renommer une feuille : les manipulations de base pour organiser un classeur.',
    points: [
      'Clic droit sur un numéro de ligne ou une lettre de colonne > Insérer ou Supprimer (raccourcis Ctrl++ et Ctrl+-).',
      'Double-clic sur la bordure droite d’une lettre de colonne : la largeur s’ajuste au contenu.',
      'Clic droit > Masquer cache des colonnes sans les supprimer ; sélectionne les colonnes voisines puis clic droit > Afficher pour les retrouver.',
      'Le bouton + à droite des onglets ajoute une feuille ; double-clic sur un onglet pour le renommer ; fais-le glisser pour déplacer la feuille.',
      'Clic droit sur un onglet > Déplacer ou copier, case « Créer une copie », pour dupliquer une feuille.'
    ],
    tips: ['Les formules suivent les insertions : une SOMME(A2:A10) devient SOMME(A2:A11) si tu insères une ligne au milieu.'],
    kw: 'inserer ligne colonne supprimer largeur colonne ajuster masquer afficher feuille onglet renommer dupliquer copier feuille'
  });

  N({
    activity: 'saisir', level: 'base', title: 'Recopier et créer des séries avec la poignée',
    intro: 'La poignée de recopie, le petit carré en bas à droite de la sélection, recopie une valeur ou prolonge une série en un geste.',
    steps: [
      'Sélectionne la ou les cellules de départ.',
      'Place la souris sur la poignée (petit carré en bas à droite) : le pointeur devient une croix noire fine.',
      'Fais glisser vers le bas ou vers la droite. Un double-clic sur la poignée recopie jusqu’en bas du tableau voisin.'
    ],
    points: [
      'Les jours, les mois et les textes numérotés se prolongent tout seuls : lundi → mardi, janvier → février, Trim 1 → Trim 2.',
      'Pour une suite de nombres (5, 10, 15…), tape les deux premiers, sélectionne-les, puis fais glisser.',
      'Après la recopie, le bouton Options de recopie propose : Copier les cellules, Incrémenter une série, Recopier les mises en forme uniquement…',
      'Une formule recopiée s’adapte à chaque ligne (voir Calculer > Recopier une formule).',
      'Ctrl+B recopie vers le bas la première cellule de la sélection ; Ctrl+D la recopie vers la droite.'
    ],
    sample: {
      cols: ['Jour', 'Mois', 'Valeur'],
      rows: [['lundi', 'janvier', 5], ['mardi', 'février', 10], ['mercredi', 'mars', 15], ['jeudi', 'avril', 20]],
      select: 'A2:C3',
      note: 'Seules les lignes 2 et 3 ont été tapées ; la poignée a prolongé les trois séries.'
    },
    kw: 'recopier poignee de recopie serie incrementer jours mois glisser double clic remplir automatiquement'
  });

  N({
    activity: 'saisir', level: 'base', title: 'Formater les nombres, les dates et les montants',
    intro: 'Le format décide de l’affichage : nombre de décimales, symbole €, pourcentage, date courte ou longue. La valeur, elle, ne change pas.',
    steps: [
      'Sélectionne les cellules.',
      'Accueil > Nombre : choisis un format dans la liste (Nombre, Monétaire, Comptabilité, Date courte, Pourcentage…).',
      'Pour plus d’options : Ctrl+1 (Format de cellule) > onglet Nombre.'
    ],
    points: [
      '0,2 affiché « 20 % » vaut toujours 0,2 dans les calculs.',
      'Les boutons Ajouter une décimale et Réduire les décimales règlent les chiffres après la virgule.',
      'Une date est un nombre : si 46096 s’affiche au lieu d’une date, applique le format Date courte.',
      'Comptabilité aligne les symboles € et les virgules d’une colonne ; Monétaire colle le symbole au nombre.'
    ],
    sample: {
      cols: ['Valeur', 'Format Nombre', 'Format Pourcentage'],
      rows: [[0.2, 0.2, 0.2], [1.5, 1.5, 1.5]],
      fmt: [null, '0.00', '%'],
      note: 'Même valeur, trois affichages : le format ne change pas le nombre.'
    },
    kw: 'format nombre format date format monetaire euro pourcentage decimales format de cellule ctrl 1 affichage'
  });

  /* ------------------------------ INTERMÉDIAIRE ------------------------------ */
  N({
    activity: 'saisir', level: 'intermediaire', title: 'Texte, nombre ou date : le type compte',
    intro: 'Une même saisie peut être stockée comme texte, nombre ou date. Le type décide de ce que les formules peuvent en faire.',
    points: [
      'Par défaut, les nombres et les dates s’alignent à droite, le texte à gauche : un montant aligné à gauche est souvent du texte.',
      'Une date est un nombre de jours mis en forme : on peut donc additionner et soustraire des dates.',
      'Le format (onglet Accueil, groupe Nombre) change l’affichage, jamais la valeur.',
      'ESTNUM, ESTTEXTE et ESTVIDE testent le type d’une cellule.'
    ],
    sample: {
      cols: ['Valeur saisie'],
      rows: [['123'], [123], ['d:2026-11-02'], ['12/13/2026']],
      fill: { header: 'Est un nombre ?', formula: '=ESTNUM(A2)', results: [false, true, true, false] },
      note: '« 123 » entre guillemets est du texte ; « 12/13/2026 » n’est pas une date valide en français (mois 13) et reste du texte.'
    },
    tips: ['Un nombre stocké en texte (petit triangle vert) : sélectionne-le, puis le losange jaune > Convertir en nombre.'],
    kw: 'type format texte nombre date nombre stocke en texte aligne gauche estnum format cellule'
  });

  N({
    activity: 'saisir', level: 'intermediaire', title: 'Mettre en forme un tableau lisible',
    intro: 'Quelques réglages suffisent pour un tableau clair : en-têtes en gras, bordures, alignement, textes longs sur plusieurs lignes.',
    points: [
      'Accueil > Police : gras (Ctrl+G), couleur de remplissage, couleur du texte ; le bouton Bordures quadrille la sélection.',
      'Accueil > Renvoyer à la ligne automatiquement : un texte long s’affiche sur plusieurs lignes dans la cellule.',
      'Pour centrer un titre au-dessus de plusieurs colonnes sans fusionner : Ctrl+1 > Alignement > Horizontal : Centré sur plusieurs colonnes.',
      'Le pinceau (Accueil > Reproduire la mise en forme) copie la mise en forme d’une cellule vers d’autres ; double-clic pour l’appliquer plusieurs fois.',
      'Accueil > Styles de cellules propose des styles prêts à l’emploi (Titre, Total, Entrée…).'
    ],
    tips: [
      'Évite « Fusionner et centrer » dans un tableau de données : les cellules fusionnées empêchent de trier, filtrer et recopier.',
      'Mettre sous forme de tableau (Ctrl+L) applique une mise en forme complète en un clic : voir Organiser & analyser.'
    ],
    kw: 'mise en forme gras bordures couleur remplissage alignement renvoyer a la ligne fusionner centrer pinceau reproduire mise en forme styles'
  });

  N({
    activity: 'saisir', level: 'intermediaire', title: 'Figer les volets',
    intro: 'Dans un long tableau, figer la ligne d’en-têtes la garde à l’écran quand on fait défiler les données.',
    steps: [
      'Affichage > Figer les volets > Figer la ligne supérieure : la ligne 1 reste visible quand tu descends.',
      'Affichage > Figer les volets > Figer la première colonne : la colonne A reste visible quand tu vas vers la droite.',
      'Pour figer plusieurs lignes et colonnes : clique dans la cellule juste en dessous et à droite de la zone à garder (par exemple B2), puis Affichage > Figer les volets > Figer les volets.'
    ],
    points: [
      'Un trait fin marque la limite de la zone figée.',
      'Affichage > Figer les volets > Libérer les volets annule le figeage.',
      'Figer ne concerne que l’écran ; pour répéter les en-têtes à l’impression, utilise Mise en page > Imprimer les titres (voir Présenter).'
    ],
    sample: {
      cols: ['Date', 'Client', 'Montant'],
      rows: [['d:2026-01-05', 'Martin', 300], ['d:2026-01-06', 'Durand', 120], ['d:2026-01-08', 'Petit', 450]],
      select: 'B2',
      note: 'Avec B2 sélectionnée, Figer les volets garde la ligne 1 et la colonne A à l’écran.'
    },
    kw: 'figer volets figer la premiere ligne en tetes visibles bloquer ligne colonne defilement liberer'
  });

  N({
    activity: 'saisir', level: 'intermediaire', title: 'Créer une liste déroulante',
    intro: 'Une liste déroulante oblige à choisir parmi des valeurs prévues : plus de fautes de frappe, et des données faciles à filtrer et à compter.',
    steps: [
      'Sélectionne les cellules qui recevront la liste (par exemple B2:B4).',
      'Données > Validation des données, onglet Options : Autoriser « Liste ».',
      'Source : tape les choix séparés par des points-virgules (En cours;Livrée;Annulée) ou sélectionne une plage qui les contient, puis OK.'
    ],
    points: [
      'Une flèche apparaît à droite de la cellule active : on choisit au lieu de taper.',
      'Onglet Alerte d’erreur : le message affiché si quelqu’un tape une valeur hors liste.',
      'Pour une liste longue ou qui évolue, écris les choix dans une plage (sur une feuille « Listes ») plutôt que dans la source.',
      'Données > Validation des données > Effacer tout supprime la liste.'
    ],
    sample: {
      cols: ['Commande', 'Statut'],
      rows: [['C-101', 'En cours'], ['C-102', 'Livrée'], ['C-103', 'Annulée']],
      select: 'B2:B4',
      note: 'Source de la liste : En cours;Livrée;Annulée'
    },
    kw: 'liste deroulante menu deroulant validation des donnees choix liste de choix saisie controlee'
  });

  N({
    activity: 'saisir', level: 'intermediaire', title: 'Créer un format personnalisé',
    intro: 'Quand aucun format tout prêt ne convient, un code de format personnalisé affiche exactement ce que tu veux, sans changer la valeur.',
    steps: [
      'Sélectionne les cellules, puis Ctrl+1 > onglet Nombre > Personnalisée.',
      'Dans la zone Type, écris le code de format, vérifie l’aperçu, puis OK.'
    ],
    points: [
      '0 affiche un chiffre obligatoire, # un chiffre facultatif ; l’espace sépare les milliers : # ##0,00.',
      'Un texte entre guillemets s’ajoute à l’affichage : 0 "kg" affiche 12 kg, et la cellule vaut toujours 12.',
      '00000 garde les zéros de tête : 1000 s’affiche 01000 (codes postaux).',
      'Dates : jjjj jj mmmm aaaa affiche « lundi 02 novembre 2026 » (j = jour, m = mois, a = année).',
      'Durées : [h]:mm continue au-delà de 24 heures (sans crochets, 25:00 s’afficherait 01:00).'
    ],
    sample: {
      cols: ['Valeur', 'Code de format', 'Affichage obtenu'],
      rows: [[1234.5, '# ##0,00 "€"', '1 234,50 €'], [12, '0 "kg"', '12 kg'], [1000, '00000', '01000']],
      note: 'La colonne C montre ce qui s’affiche ; la valeur réelle reste celle de la colonne A.'
    },
    kw: 'format personnalise code de format zeros devant kg unite date en lettres jjjj mmmm duree h mm ctrl 1'
  });

  N({
    activity: 'saisir', level: 'intermediaire', title: 'Copier-coller : le collage spécial',
    intro: 'Le collage spécial colle seulement ce que tu choisis : les valeurs sans les formules, la mise en forme seule, ou le tableau pivoté.',
    steps: [
      'Copie les cellules (Ctrl+C).',
      'Clic droit sur la cellule de destination > Collage spécial (ou Ctrl+Alt+V).',
      'Choisis Valeurs, Formats ou Formules, ou coche Transposé, puis OK.'
    ],
    points: [
      'Valeurs : colle les résultats sans les formules, pour figer un calcul.',
      'Formats : applique uniquement la mise en forme.',
      'Transposé : les lignes deviennent des colonnes et inversement.',
      'Les icônes des options de collage, dans le menu du clic droit, font les mêmes choses en un clic.'
    ],
    kw: 'collage special coller valeurs coller sans formule transposer coller format ctrl alt v copier coller'
  });
})(window.XL);
