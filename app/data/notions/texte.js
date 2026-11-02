/* Notions — activité « Texte & dates ». */
(function (XL) {
  'use strict';
  var N = XL.N;

  /* ------------------------------- LES BASES ------------------------------- */
  N({
    activity: 'texte', level: 'base', title: 'Texte, nombre ou date : le type compte',
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
    kw: 'type format texte nombre date nombre stocke en texte aligne gauche estnum format cellule'
  });

  N({
    activity: 'texte', level: 'base', title: 'Assembler et découper du texte',
    intro: '& colle des morceaux de texte ; GAUCHE, DROITE et STXT en extraient une partie ; NBCAR compte les caractères.',
    points: [
      '=A2&" "&B2 colle le prénom, une espace et le nom.',
      '=GAUCHE(A2;2) prend les 2 premiers caractères, =DROITE(A2;3) les 3 derniers.',
      '=STXT(A2;4;4) prend 4 caractères à partir du 4e.',
      'Le résultat est du texte : pour obtenir un nombre, convertis-le avec CNUM.'
    ],
    sample: {
      cols: ['Référence'],
      rows: [['FR-2026-001'], ['BE-2025-042'], ['DE-2026-117']],
      fill: { header: 'Année', formula: '=STXT(A2;4;4)', results: ['2026', '2025', '2026'] },
      calc: [['Pays de la 1re référence', '=GAUCHE(A2;2)', 'FR'], ['Numéro de la 1re référence', '=DROITE(A2;3)', '001'], ['Longueur', '=NBCAR(A2)', 11]]
    },
    examples: [['=A2&" "&B2', 'Prénom + espace + nom.'], ['=CONCATENER("FA-";A2)', 'Même principe avec la fonction CONCATENER.']],
    kw: 'assembler concatener coller texte decouper extraire gauche droite stxt nbcar caracteres'
  });

  N({
    activity: 'texte', level: 'base', title: 'Nettoyer du texte',
    intro: 'Les données saisies à la main ou importées contiennent souvent des espaces en trop et des majuscules incohérentes.',
    points: [
      'SUPPRESPACE enlève les espaces au début, à la fin et les espaces doublés.',
      'MAJUSCULE, MINUSCULE et NOMPROPRE uniformisent la casse.',
      'SUBSTITUE remplace un caractère par un autre partout (par exemple l’espace insécable CAR(160) des exports web).',
      'Une fois le résultat correct : copie, puis Collage spécial > Valeurs pour remplacer les données d’origine.'
    ],
    sample: {
      cols: ['Saisie brute'],
      rows: [['  jean   DUPONT '], ['MARIE  martin'], [' paul durand']],
      fill: { header: 'Nettoyé', formula: '=NOMPROPRE(SUPPRESPACE(A2))', results: ['Jean Dupont', 'Marie Martin', 'Paul Durand'] }
    },
    kw: 'nettoyer texte espaces en trop majuscules minuscules nompropre supprespace propre'
  });

  N({
    activity: 'texte', level: 'base', title: 'Calculer avec les dates',
    intro: 'Les dates étant des nombres, on les additionne et on les soustrait directement ; quelques fonctions les construisent et les découpent.',
    points: [
      'Écart en jours : =B2-A2. Date + 30 jours : =A2+30.',
      '=AUJOURDHUI() renvoie la date du jour (mise à jour à chaque ouverture du fichier).',
      '=DATE(2026;3;15) construit une date ; ANNEE, MOIS et JOUR la découpent.',
      'Si le résultat s’affiche comme un grand nombre (46096), applique un format Date.'
    ],
    sample: {
      cols: ['Début', 'Fin'],
      rows: [['d:2026-01-01', 'd:2026-01-31'], ['d:2026-02-10', 'd:2026-03-10'], ['d:2026-11-02', 'd:2026-12-25']],
      fill: { header: 'Jours d’écart', formula: '=B2-A2', results: [30, 28, 53] }
    },
    examples: [['=AUJOURDHUI()-A2', 'Nombre de jours écoulés depuis la date en A2.'], ['=ANNEE(A2)', 'Année de la date.']],
    kw: 'dates calculer difference entre deux dates ajouter jours aujourdhui date nombre de jours'
  });

  /* ------------------------------ APPROFONDIR ------------------------------ */
  N({
    activity: 'texte', level: 'approfondir', title: 'Convertir du texte importé en nombre ou en date',
    intro: 'Un export (banque, logiciel, CSV) donne souvent des montants et des dates en texte : ils ne s’additionnent pas et se trient mal.',
    points: [
      'Sans formule : sélectionne la colonne, puis Données > Convertir > Terminer.',
      '=CNUM(A2) convertit un texte « propre » en nombre.',
      '=VALEURNOMBRE(A2;",";" ") précise les séparateurs décimal et de milliers utilisés dans le texte.',
      'Date au format AAAAMMJJ : =DATE(GAUCHE(A2;4);STXT(A2;5;2);DROITE(A2;2)).'
    ],
    sample: {
      cols: ['Montant importé (texte)'],
      rows: [['1 234,50'], ['980,00'], ['12 000,75']],
      fill: { header: 'Nombre', formula: '=VALEURNOMBRE(A2;",";" ")', results: [1234.5, 980, 12000.75], fmt: '0.00' }
    },
    kw: 'convertir texte en nombre date import csv nombre stocke en texte valeurnombre cnum'
  });

  N({
    activity: 'texte', level: 'approfondir', title: 'Mettre en forme avec TEXTE',
    intro: 'TEXTE transforme un nombre ou une date en texte formaté, pour l’intégrer dans une phrase ou un code.',
    points: [
      '=TEXTE(A2;"0000") complète avec des zéros : 42 devient 0042.',
      '=TEXTE(A2;"jj/mm/aaaa") ou "mmmm aaaa" pour les dates (codes français : j, m, a).',
      '=TEXTE(B2;"# ##0,00 €") pour insérer un montant dans un libellé.',
      'Le résultat est du texte : il ne s’additionne plus.'
    ],
    sample: {
      cols: ['N°'],
      rows: [[7], [42], [315]],
      fill: { header: 'Code facture', formula: '="FA-"&TEXTE(A2;"0000")', results: ['FA-0007', 'FA-0042', 'FA-0315'] }
    },
    examples: [['="Échéance : "&TEXTE(B2;"jj/mm/aaaa")', 'Une date dans une phrase.']],
    tips: ['Les codes de format dépendent de la langue d’Excel : « aaaa » en français, « yyyy » en anglais.'],
    kw: 'texte format nombre zeros devant date en texte libelle mettre en forme'
  });

  N({
    activity: 'texte', level: 'approfondir', title: 'Échéances, fins de mois et jours ouvrés',
    intro: 'FIN.MOIS, MOIS.DECALER et NB.JOURS.OUVRES couvrent la plupart des calculs d’échéances et de délais.',
    points: [
      '=FIN.MOIS(A2;0) : dernier jour du mois de A2 ; =FIN.MOIS(A2;-1)+1 : premier jour.',
      '=MOIS.DECALER(A2;3) : même jour, 3 mois plus tard.',
      '=NB.JOURS.OUVRES(début;fin;fériés) : jours du lundi au vendredi, jours fériés exclus.',
      '=JOURSEM(A2;2) : 1 = lundi … 7 = dimanche.'
    ],
    sample: {
      cols: ['Date de facture'],
      rows: [['d:2026-01-15'], ['d:2026-02-20'], ['d:2026-03-31']],
      fill: { header: 'Échéance 30 jours fin de mois', formula: '=FIN.MOIS(A2+30;0)', results: ['d:2026-02-28', 'd:2026-03-31', 'd:2026-04-30'] }
    },
    examples: [['=NB.JOURS.OUVRES(A2;B2;Fériés)', 'Jours ouvrés entre deux dates.'], ['=MOIS.DECALER(A2;12)', 'Date anniversaire.']],
    kw: 'echeance fin de mois jours ouvres delai date limite mois decaler joursem'
  });

  N({
    activity: 'texte', level: 'approfondir', title: 'Calculer avec les heures',
    intro: 'Pour Excel, une heure est une fraction de journée : 12:00 vaut 0,5. On peut donc soustraire des heures, à condition de bien les afficher.',
    points: [
      'Durée : =B2-A2 (format hh:mm). Pour un total de plus de 24 h : format [h]:mm.',
      'En heures décimales : =(B2-A2)*24 (7:30 devient 7,5).',
      'Si la fin est après minuit : =MOD(B2-A2;1).',
      '=TEMPS(8;30;0) construit une heure.'
    ],
    sample: {
      cols: ['Arrivée', 'Départ'],
      rows: [['t:08:30', 't:17:00'], ['t:09:15', 't:18:45'], ['t:22:00', 't:06:00']],
      fill: { header: 'Heures (décimal)', formula: '=MOD(B2-A2;1)*24', results: [8.5, 9.5, 8], fmt: '0.00' }
    },
    kw: 'heures duree temps de travail hh mm decimal minuit calculer heures'
  });

  /* -------------------------------- EXPERT -------------------------------- */
  N({
    activity: 'texte', level: 'expert', title: 'Extraire un morceau de texte repéré par un séparateur',
    intro: 'Quand la position varie (libellés bancaires, codes), on repère un séparateur avec TROUVE ou CHERCHE puis on extrait avec STXT. Excel 2024 et 365 simplifient avec TEXTE.AVANT et TEXTE.APRES.',
    points: [
      'TROUVE renvoie la position d’un texte (sensible à la casse) ; CHERCHE fait de même sans tenir compte de la casse.',
      '=STXT(A2;TROUVE("FA-";A2);12) extrait 12 caractères à partir de « FA- ».',
      '=TEXTE.APRES(A2;"FA-") (2024/365) renvoie tout ce qui suit « FA- ».',
      'Entoure la formule de SIERREUR pour les lignes où le repère est absent.'
    ],
    sample: {
      cols: ['Libellé bancaire'],
      rows: [['VIR SEPA FA-2026-0042 MARTIN'], ['PRLV FA-2026-0107 EDF'], ['CB CARREFOUR']],
      fill: { header: 'N° de facture', formula: '=SIERREUR(STXT(A2;TROUVE("FA-";A2);12);"")', results: ['FA-2026-0042', 'FA-2026-0107', ''] }
    },
    kw: 'extraire texte entre separateur trouve cherche stxt texte avant texte apres libelle'
  });

  N({
    activity: 'texte', level: 'expert', title: 'Répartir une colonne sur plusieurs colonnes',
    intro: 'Pour répartir « Nom;Prénom;Ville » sur plusieurs colonnes, trois outils : l’assistant Convertir, le remplissage instantané, ou FRACTIONNER.TEXTE en formule.',
    points: [
      'Données > Convertir : choisis le séparateur, Excel remplit les colonnes (opération ponctuelle).',
      'Remplissage instantané (Données > Remplissage instantané, ou Ctrl+E) : tape deux exemples, Excel devine la suite.',
      '=FRACTIONNER.TEXTE(A2;";") (2024/365) : un découpage qui se met à jour tout seul.'
    ],
    examples: [['=FRACTIONNER.TEXTE(A2;";")', 'Découpe sur les points-virgules (2024/365).'], ['=TEXTE.AVANT(A2;" ")', 'Premier mot (2024/365).']],
    kw: 'decouper colonne plusieurs colonnes convertir separateur remplissage instantane fractionner texte'
  });
})(window.XL);
