/* Fonctions : Texte, Dates & heures */
(function (XL) {
  'use strict';
  var F = XL.F;

  /* ============================== TEXTE ============================== */
  F('CONCATENER', 'CONCATENATE', 'texte', '',
    'Assemble plusieurs textes en un seul. L’opérateur & fait la même chose, plus court.',
    'CONCATENER(texte1; [texte2]; …)',
    [['texte1…', 'Textes, nombres ou cellules à coller.']],
    [['=CONCATENER("FA-";"2026")', 'Assemble deux textes.', 'FA-2026'],
     ['=A2&" "&B2', 'Prénom + espace + nom avec l’opérateur &.'],
     ['="Total : "&TEXTE(D50;"# ##0,00 €")', 'Texte + montant formaté.']],
    ['Un nombre collé perd son format : passe-le dans TEXTE() pour garder les décimales et le symbole €.'],
    'coller assembler fusionner joindre texte concatener ajouter texte et',
    'JOINDRE.TEXTE TEXTE');

  F('JOINDRE.TEXTE', 'TEXTJOIN', 'texte', '2019',
    'Assemble une plage avec un séparateur, en ignorant éventuellement les vides.',
    'JOINDRE.TEXTE(délimiteur; ignorer_vide; texte1; [texte2]; …)',
    [['délimiteur', 'Séparateur (", ", " / ", CAR(10) pour un saut de ligne).'], ['ignorer_vide', 'VRAI = sauter les cellules vides.'], ['texte1…', 'Plages ou textes.']],
    [['=JOINDRE.TEXTE(", ";VRAI;"Paris";"";"Lyon")', 'Liste séparée par des virgules, sans trou.', 'Paris, Lyon'],
     ['=JOINDRE.TEXTE(", ";VRAI;FILTRE(Fact[N°];Fact[Client]=A2))', 'Tous les n° de factures d’un client dans une cellule.']],
    [], 'joindre liste separateur virgule regrouper valeurs une cellule',
    '');

  F('GAUCHE', 'LEFT', 'texte', '',
    'Extrait les N premiers caractères d’un texte.',
    'GAUCHE(texte; [no_car])',
    [['texte', 'Texte source.'], ['no_car', 'Nombre de caractères (1 par défaut).']],
    [['=GAUCHE("75008 Paris";5)', 'Code postal en début d’adresse.', '75008'], ['=GAUCHE(A2;1)', 'Première lettre (initiale).']],
    ['Renvoie toujours du TEXTE : =GAUCHE(A2;1)=6 est FAUX, compare avec "6" ou convertis avec CNUM().'],
    'extraire debut premiers caracteres gauche racine compte classe prefixe',
    'DROITE STXT');

  F('DROITE', 'RIGHT', 'texte', '',
    'Extrait les N derniers caractères d’un texte.',
    'DROITE(texte; [no_car])',
    [['texte', 'Texte source.'], ['no_car', 'Nombre de caractères.']],
    [['=DROITE("FR7612345";5)', 'Derniers caractères.', '12345'], ['=DROITE(A2;4)', 'Année à la fin d’un libellé.']],
    [], 'extraire fin derniers caracteres droite suffixe', 'GAUCHE STXT');

  F('STXT', 'MID', 'texte', '',
    'Extrait une portion de texte à partir d’une position.',
    'STXT(texte; no_départ; no_car)',
    [['texte', 'Texte source.'], ['no_départ', 'Position du 1er caractère.'], ['no_car', 'Nombre de caractères.']],
    [['=STXT("FA-2026-0042";4;4)', 'Extrait l’année d’un n° de facture.', '2026'],
     ['=STXT(A2;TROUVE("-";A2)+1;100)', 'Tout ce qui suit le premier tiret.']],
    [], 'extraire milieu partie texte position sous chaine', 'GAUCHE DROITE TROUVE');

  F('NBCAR', 'LEN', 'texte', '',
    'Nombre de caractères d’un texte (espaces compris).',
    'NBCAR(texte)', [['texte', 'Texte.']],
    [['=NBCAR("Bonjour")', 'Longueur.', 7], ['=NBCAR(A2)<>5', 'Signale un code postal qui n’a pas 5 caractères.']],
    [], 'longueur nombre caracteres taille texte compter lettres', 'GAUCHE SUPPRESPACE');

  F('TROUVE', 'FIND', 'texte', '',
    'Position d’un texte dans un autre, en respectant MAJUSCULES/minuscules. Sans caractères génériques.',
    'TROUVE(texte_cherché; texte; [no_départ])',
    [['texte_cherché', 'Ce qu’on cherche.'], ['texte', 'Où on cherche.'], ['no_départ', 'Position de départ.']],
    [['=TROUVE("-";"FA-2026")', 'Position du tiret.', 3]],
    ['#VALEUR! si absent : =ESTNUM(TROUVE("x";A2)) pour tester la présence.'],
    'position trouver caractere chercher dans texte sensible casse', 'CHERCHE STXT');

  F('CHERCHE', 'SEARCH', 'texte', '',
    'Position d’un texte dans un autre, SANS tenir compte de la casse, avec * et ?.',
    'CHERCHE(texte_cherché; texte; [no_départ])',
    [['texte_cherché', 'Ce qu’on cherche.'], ['texte', 'Où on cherche.'], ['no_départ', 'Départ.']],
    [['=CHERCHE("loyer";"Prlv LOYER mars")', 'Position, majuscules ignorées.', 6],
     ['=SI(ESTNUM(CHERCHE("URSSAF";C2));"431000";"")', 'Affecte un compte selon le libellé bancaire.']],
    [], 'contient chercher mot dans libelle texte contient position', 'TROUVE ESTNUM');

  F('SUBSTITUE', 'SUBSTITUTE', 'texte', '',
    'Remplace un texte par un autre partout (ou à la N-ième occurrence).',
    'SUBSTITUE(texte; ancien_texte; nouveau_texte; [no_position])',
    [['texte', 'Texte source.'], ['ancien_texte', 'À remplacer.'], ['nouveau_texte', 'Remplacement.'], ['no_position', 'Seulement cette occurrence.']],
    [['=SUBSTITUE("1.234,56";".";"")', 'Supprime les points de milliers.', '1234,56'],
     ['=SUBSTITUE(A2;"-";"/")', 'Remplace tous les tirets par des barres obliques.']],
    [], 'remplacer texte caractere supprimer enlever caractere', 'SUPPRESPACE');

  F('SUPPRESPACE', 'TRIM', 'texte', '',
    'Supprime les espaces en début/fin et réduit les espaces multiples à un seul.',
    'SUPPRESPACE(texte)', [['texte', 'Texte à nettoyer.']],
    [['=SUPPRESPACE("  Dupont   SARL ")', 'Nettoyage.', 'Dupont SARL']],
    ['N’enlève PAS l’espace insécable CAR(160) : =SUPPRESPACE(SUBSTITUE(A2;CAR(160);" ")).'],
    'espaces supprimer nettoyer enlever espaces trop espaces', 'SUBSTITUE');

  F('MAJUSCULE', 'UPPER', 'texte', '',
    'Convertit en MAJUSCULES.',
    'MAJUSCULE(texte)', [['texte', 'Texte.']],
    [['=MAJUSCULE("sarl dupont")', 'Majuscules.', 'SARL DUPONT']],
    [], 'majuscules capitales mettre en majuscule', 'MINUSCULE NOMPROPRE');

  F('MINUSCULE', 'LOWER', 'texte', '',
    'Convertit en minuscules.',
    'MINUSCULE(texte)', [['texte', 'Texte.']],
    [['=MINUSCULE("CONTACT@SOCIETE.FR")', 'Minuscules.', 'contact@societe.fr']],
    [], 'minuscules mettre en minuscule bas de casse', 'MAJUSCULE NOMPROPRE');

  F('NOMPROPRE', 'PROPER', 'texte', '',
    'Met une majuscule à chaque mot.',
    'NOMPROPRE(texte)', [['texte', 'Texte.']],
    [['=NOMPROPRE("jean DUPONT")', 'Nom propre.', 'Jean Dupont']],
    [], 'majuscule premiere lettre nom propre', 'MAJUSCULE');

  F('TEXTE', 'TEXT', 'texte', '',
    'Convertit un nombre ou une date en texte avec un format précis.',
    'TEXTE(valeur; format_texte)',
    [['valeur', 'Nombre ou date.'], ['format_texte', 'Codes FR : "jj/mm/aaaa", "mmmm aaaa", "jjjj", "# ##0,00 €", "0,0 %", "00000".']],
    [['=TEXTE(42;"00000")', 'Complète avec des zéros.', '00042'],
     ['=TEXTE(A2;"mmmm aaaa")', 'Date → « mars 2026 ».'],
     ['=TEXTE(A2;"jjjj")', 'Nom du jour (« lundi »).'],
     ['=TEXTE(B2;"# ##0,00 €")', 'Montant formaté pour un libellé.']],
    ['Les codes de format sont LOCALISÉS : "aaaa"/"jj" en français, "yyyy"/"dd" en anglais. Un classeur partagé entre Excel FR et EN peut afficher n’importe quoi.',
     'Le résultat est du texte : il ne s’additionne plus.'],
    'format texte date en lettres mois en lettres nom du jour zeros devant formater montant',
    'CNUM');

  F('CNUM', 'VALUE', 'texte', '',
    'Convertit un texte qui ressemble à un nombre en vrai nombre (selon les paramètres régionaux).',
    'CNUM(texte)', [['texte', 'Texte à convertir.']],
    [['=CNUM("1234")', 'Texte → nombre.', 1234],
     ['=CNUM(SUBSTITUE(A2;" ";""))', 'Montant importé avec espaces de milliers.']],
    ['Astuce : --A2 ou A2*1 convertit aussi un texte en nombre.'],
    'convertir texte en nombre nombre stocke en texte transformer chiffre', 'TEXTE');

  F('TEXTE.AVANT', 'TEXTBEFORE', 'texte', '2024',
    'Renvoie le texte situé avant un séparateur.',
    'TEXTE.AVANT(texte; délimiteur; [no_instance]; [mode_correspondance]; [correspondance_fin]; [si_non_trouvé])',
    [['texte', 'Texte source.'], ['délimiteur', 'Séparateur.'], ['no_instance', 'Quelle occurrence (négatif = depuis la fin).'],
     ['mode_correspondance', '1 = ignorer les majuscules.'], ['correspondance_fin', '1 = la fin du texte compte comme un séparateur.'], ['si_non_trouvé', 'Valeur renvoyée si le séparateur est absent.']],
    [['=TEXTE.AVANT("Dupont Jean";" ")', 'Le premier mot.', 'Dupont'],
     ['=TEXTE.AVANT(A2;" - ";-1)', 'Tout sauf le dernier morceau.']],
    [], 'avant separateur extraire debut premier mot nom prenom', 'TEXTE.APRES FRACTIONNER.TEXTE GAUCHE');

  F('TEXTE.APRES', 'TEXTAFTER', 'texte', '2024',
    'Renvoie le texte situé après un séparateur.',
    'TEXTE.APRES(texte; délimiteur; [no_instance]; [mode_correspondance]; [correspondance_fin]; [si_non_trouvé])',
    [['texte', 'Texte source.'], ['délimiteur', 'Séparateur.'], ['no_instance', 'Quelle occurrence (négatif = depuis la fin).'],
     ['mode_correspondance', '1 = ignorer les majuscules.'], ['correspondance_fin', '1 = la fin du texte compte comme un séparateur.'], ['si_non_trouvé', 'Valeur renvoyée si le séparateur est absent.']],
    [['=TEXTE.APRES("jean.dupont@exemple.fr";"@")', 'Le domaine d’une adresse e-mail.', 'exemple.fr'],
     ['=TEXTE.APRES(A2;" ";-1)', 'Le dernier mot (après la dernière espace).']],
    [], 'apres separateur extraire fin domaine email dernier mot', 'TEXTE.AVANT FRACTIONNER.TEXTE DROITE');

  F('FRACTIONNER.TEXTE', 'TEXTSPLIT', 'texte', '2024',
    'Découpe un texte en plusieurs cellules selon un séparateur : l’équivalent de Données > Convertir, en formule.',
    'FRACTIONNER.TEXTE(texte; délimiteur_col; [délimiteur_ligne]; [ignorer_vide]; [mode_correspondance]; [remplir_avec])',
    [['texte', 'Texte source.'], ['délimiteur_col', 'Séparateur entre les colonnes.'], ['délimiteur_ligne', 'Séparateur entre les lignes.'],
     ['ignorer_vide', 'VRAI = ignorer les morceaux vides.'], ['mode_correspondance', '1 = ignorer les majuscules.'], ['remplir_avec', 'Valeur pour les cases manquantes.']],
    [['=FRACTIONNER.TEXTE(A2;";")', 'Répartit « Dupont;Jean;Lyon » sur trois cellules voisines.']],
    ['Le résultat se met à jour tout seul quand le texte d’origine change, contrairement à Données > Convertir.'],
    'decouper separer diviser colonnes separateur convertir', 'TEXTE.AVANT TEXTE.APRES JOINDRE.TEXTE');

  F('VALEURNOMBRE', 'NUMBERVALUE', 'texte', '2013',
    'Convertit un texte en nombre en précisant les séparateurs décimal et de milliers utilisés dans le texte. Idéal pour les exports au format anglais.',
    'VALEURNOMBRE(texte; [séparateur_décimal]; [séparateur_groupe])',
    [['texte', 'Texte à convertir.'], ['séparateur_décimal', 'Par exemple "." pour un format anglais.'], ['séparateur_groupe', 'Par exemple "," pour un format anglais.']],
    [['=VALEURNOMBRE("1,234.56";".";",")', 'Montant au format anglais converti en nombre.', 1234.56],
     ['=VALEURNOMBRE("12,5%";",")', 'Fonctionne aussi avec les pourcentages.', 0.125]],
    [], 'convertir texte en nombre format anglais point virgule decimal import csv', 'CNUM SUBSTITUE');

  F('EPURAGE', 'CLEAN', 'texte', '',
    'Supprime les caractères invisibles d’un texte importé (sauts de ligne, codes de contrôle).',
    'EPURAGE(texte)', [['texte', 'Texte à nettoyer.']],
    [['=SUPPRESPACE(EPURAGE(A2))', 'Nettoyage complet d’un libellé importé : caractères invisibles et espaces en trop.']],
    [], 'nettoyer caracteres invisibles saut de ligne import', 'SUPPRESPACE');

  /* ========================== DATES & HEURES ========================== */
  F('AUJOURDHUI', 'TODAY', 'date', '',
    'Date du jour (mise à jour à chaque ouverture).',
    'AUJOURDHUI()', [],
    [['=AUJOURDHUI()-E2', 'Nombre de jours depuis l’échéance.'], ['=SI(E2<AUJOURDHUI();"Échu";"À venir")', 'Statut d’une échéance.']],
    ['Volatile. Pour figer la date de saisie : Ctrl+; .'],
    'date du jour aujourd hui maintenant date actuelle', 'MAINTENANT');

  F('MAINTENANT', 'NOW', 'date', '',
    'Date ET heure actuelles.',
    'MAINTENANT()', [],
    [['=MAINTENANT()', 'Horodatage (recalculé).']],
    [], 'heure actuelle date et heure horodatage', 'AUJOURDHUI');

  F('DATE', 'DATE', 'date', '',
    'Construit une date à partir de l’année, du mois et du jour. Gère les débordements (mois 13 = janvier suivant).',
    'DATE(année; mois; jour)',
    [['année', 'Année (4 chiffres).'], ['mois', 'Mois (peut dépasser 12 ou être négatif).'], ['jour', 'Jour (0 = dernier jour du mois précédent).']],
    [['=DATE(2026;13;1)', 'Mois 13 → janvier 2027.', 'd:2027-01-01'],
     ['=DATE(2026;3;0)', 'Jour 0 → dernier jour de février.', 'd:2026-02-28'],
     ['=DATE(GAUCHE(A2;4);STXT(A2;5;2);DROITE(A2;2))', 'Convertit "20260131" (export) en vraie date.']],
    ['Dans un critère : ">="&DATE(2026;1;1).'],
    'creer date construire date annee mois jour convertir date texte', 'ANNEE MOIS JOUR FIN.MOIS');

  F('ANNEE', 'YEAR', 'date', '',
    'Année d’une date.',
    'ANNEE(numéro_de_série)', [['numéro_de_série', 'Date.']],
    [['=ANNEE(DATE(2026;3;15))', 'Année.', 2026]],
    [], 'annee extraire annee exercice', 'MOIS JOUR');

  F('MOIS', 'MONTH', 'date', '',
    'Mois d’une date (1 à 12).',
    'MOIS(numéro_de_série)', [['numéro_de_série', 'Date.']],
    [['=MOIS(DATE(2026;3;15))', 'Mois.', 3], ['="T"&ARRONDI.SUP(MOIS(A2)/3;0)', 'Trimestre (T1 à T4).']],
    [], 'mois extraire mois numero mois trimestre', 'ANNEE TEXTE FIN.MOIS');

  F('JOUR', 'DAY', 'date', '',
    'Jour du mois d’une date (1 à 31).',
    'JOUR(numéro_de_série)', [['numéro_de_série', 'Date.']],
    [['=JOUR(DATE(2026;3;15))', 'Jour.', 15], ['=JOUR(FIN.MOIS(A2;0))', 'Nombre de jours dans le mois.']],
    [], 'jour du mois nombre de jours dans le mois', 'MOIS JOURSEM');

  F('HEURE', 'HOUR', 'date', '',
    'Heure (0-23) d’une valeur horaire.',
    'HEURE(numéro_de_série)', [['numéro_de_série', 'Heure ou date-heure.']],
    [['=HEURE(TEMPS(14;45;0))', 'Heure.', 14]],
    [], 'heure extraire', 'MINUTE TEMPS');

  F('MINUTE', 'MINUTE', 'date', '',
    'Minutes (0-59) d’une valeur horaire.',
    'MINUTE(numéro_de_série)', [['numéro_de_série', 'Heure.']],
    [['=MINUTE(TEMPS(14;45;0))', 'Minutes.', 45]],
    [], 'minutes extraire', 'HEURE');

  F('TEMPS', 'TIME', 'date', '',
    'Construit une heure à partir d’heures, minutes, secondes.',
    'TEMPS(heure; minute; seconde)', [['heure', 'Heures.'], ['minute', 'Minutes.'], ['seconde', 'Secondes.']],
    [['=TEMPS(8;30;0)*24', 'En heures décimales.', 8.5], ['=A2+TEMPS(0;45;0)', 'Ajoute 45 minutes.']],
    ['Une heure = fraction de jour : 12:00 vaut 0,5. Multiplie par 24 pour des heures décimales.'],
    'heure construire ajouter minutes duree', 'HEURE MOD');

  F('JOURSEM', 'WEEKDAY', 'date', '',
    'Jour de la semaine sous forme de numéro.',
    'JOURSEM(numéro_de_série; [type_retour])',
    [['numéro_de_série', 'Date.'], ['type_retour', '2 = lundi=1 … dimanche=7 (format français) ; 1 = dimanche=1 (défaut).']],
    [['=JOURSEM(DATE(2026;11;2);2)', 'Le 2 novembre 2026 est un lundi.', 1],
     ['=JOURSEM(A2;2)>5', 'VRAI si week-end.']],
    ['Mets toujours 2 en France, sinon dimanche = 1.'],
    'jour de la semaine lundi week end samedi dimanche', 'TEXTE NB.JOURS.OUVRES');

  F('FIN.MOIS', 'EOMONTH', 'date', '',
    'Dernier jour du mois, N mois avant ou après une date. Incontournable pour les échéances « fin de mois ».',
    'FIN.MOIS(date_départ; mois)',
    [['date_départ', 'Date de référence.'], ['mois', '0 = fin du mois courant ; 1 = fin du mois suivant ; -1 = fin du mois précédent.']],
    [['=FIN.MOIS(DATE(2026;2;10);0)', 'Fin du mois.', 'd:2026-02-28'],
     ['=FIN.MOIS(A2;-1)+1', 'Premier jour du mois de A2.'],
     ['=FIN.MOIS(A2+30;0)', 'Échéance « 30 jours fin de mois ».']],
    ['Le résultat est un nombre : applique un format Date à la cellule.'],
    'fin de mois dernier jour du mois echeance cloture premier jour du mois', 'MOIS.DECALER DATE');

  F('MOIS.DECALER', 'EDATE', 'date', '',
    'Même jour, N mois plus tard (ou plus tôt). Gère les fins de mois courtes.',
    'MOIS.DECALER(date_départ; mois)',
    [['date_départ', 'Date.'], ['mois', 'Nombre de mois (+/-).']],
    [['=MOIS.DECALER(DATE(2026;1;31);1)', '31 janvier + 1 mois = 28 février.', 'd:2026-02-28'],
     ['=MOIS.DECALER(A2;12)', 'Date anniversaire d’un contrat.']],
    [], 'ajouter mois date plus mois echeance mensuelle anniversaire', 'FIN.MOIS DATE');

  F('NB.JOURS.OUVRES', 'NETWORKDAYS', 'date', '',
    'Nombre de jours ouvrés (lundi-vendredi) entre deux dates incluses, hors jours fériés fournis.',
    'NB.JOURS.OUVRES(date_début; date_fin; [jours_fériés])',
    [['date_début', 'Début (inclus).'], ['date_fin', 'Fin (incluse).'], ['jours_fériés', 'Plage des dates fériées à exclure.']],
    [['=NB.JOURS.OUVRES(DATE(2026;11;2);DATE(2026;11;6))', 'Du lundi au vendredi.', 5],
     ['=NB.JOURS.OUVRES(FIN.MOIS(A2;-1)+1;FIN.MOIS(A2;0);Fériés)', 'Jours ouvrés du mois de A2.']],
    [], 'jours ouvres travailles ouvrables entre deux dates hors week end feries', '');

  F('DATEDIF', 'DATEDIF', 'date', '',
    'Écart entre deux dates en années, mois ou jours complets. Fonction « cachée » (pas d’assistant) mais fiable pour l’âge et l’ancienneté.',
    'DATEDIF(date_début; date_fin; unité)',
    [['date_début', 'Date la plus ancienne.'], ['date_fin', 'Date la plus récente (sinon #NOMBRE!).'],
     ['unité', '"y" années ; "m" mois ; "d" jours ; "ym" mois restants après les années ; "yd" jours après les années.']],
    [['=DATEDIF(DATE(2000;5;20);DATE(2026;11;2);"y")', 'Années complètes.', 26],
     ['=DATEDIF(A2;AUJOURDHUI();"y")&" ans "&DATEDIF(A2;AUJOURDHUI();"ym")&" mois"', 'Ancienneté en clair.']],
    ['Évite l’unité "md", connue pour donner des résultats faux.'],
    'age anciennete difference entre deux dates annees mois ecart duree', '');
})(window.XL);
