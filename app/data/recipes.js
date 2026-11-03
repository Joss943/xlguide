/*
 * Méthodes : cas concrets du parcours, chacun rattaché à une activité et un niveau (data/parcours.js).
 * R(titre, description, [[formule, explication, attendu?]], [astuces], motsClés)
 */
(function (XL) {
  'use strict';
  var R = XL.R;

  R('Passer du HT au TTC',
    'Ajouter la TVA à un montant hors taxes. Place le taux dans une cellule (ex. B1 = 20 %) plutôt qu’en dur dans la formule.',
    [['=ARRONDI(A2*(1+$B$1);2)', 'A2 = montant HT, B1 = taux de TVA. Le $ bloque le taux pour recopier vers le bas.'],
     ['=ARRONDI(100*(1+20%);2)', 'Exemple chiffré : 100 € HT à 20 %.', 120]],
    ['Arrondis au centime à chaque ligne : c’est ce que fait un logiciel de facturation.'],
    'ht ttc ajouter tva calcul ttc hors taxe toutes taxes prix ttc');

  R('Passer du TTC au HT',
    'Retrouver le hors taxes à partir d’un prix toutes taxes comprises.',
    [['=ARRONDI(A2/(1+$B$1);2)', 'A2 = TTC, B1 = taux.'],
     ['=ARRONDI(120/(1+20%);2)', 'Exemple : 120 € TTC à 20 %.', 100]],
    ['Erreur fréquente : TTC × 0,8 n’est PAS le HT (120 × 0,8 = 96 et non 100).'],
    'ttc ht enlever tva retirer tva hors taxe depuis ttc');

  R('Variation N / N-1 en %',
    'Évolution d’une année sur l’autre, sans erreur si l’année précédente vaut 0.',
    [['=SIERREUR((C2-B2)/ABS(B2);"")', 'C2 = N, B2 = N-1 ; ABS gère les bases négatives.'],
     ['=(120-100)/ABS(100)', 'De 100 à 120.', 0.2]],
    [], 'variation evolution pourcentage n n-1 comparaison annee precedente ecart en pourcentage');

  R('Part de chaque ligne dans le total',
    'Poids en % de chaque client, produit, région…',
    [['=B2/SOMME($B$2:$B$50)', 'Le $ bloque le total pour recopier.'],
     ['=SOMME($B$2:B2)/SOMME($B$2:$B$50)', 'Part cumulée (analyse Pareto 80/20, liste triée décroissante).']],
    [], 'part pourcentage du total poids repartition pareto 80 20 abc');

  R('Solde progressif d’un compte',
    'Solde cumulé ligne après ligne (relevé de compte, budget, stock).',
    [['=SOMME($B$2:B2)-SOMME($C$2:C2)', 'Entrées moins sorties depuis la 1re ligne : $B$2 fixe le début, B2 avance à chaque ligne recopiée.'],
     ['=SOMME($B$2:B2)', 'Cumul des entrées seulement.']],
    [], 'solde progressif cumul cumule releve compte budget stock somme cumulee');

  R('Comparer deux montants avec tolérance',
    'Accepter un écart d’arrondi (ex. 1 centime) entre deux montants.',
    [['=ABS(A2-B2)<=0,01', 'VRAI si l’écart est d’au plus 1 centime.'],
     ['=SI(ABS(A2-B2)<=0,01;"OK";"Écart "&TEXTE(A2-B2;"0,00"))', 'Version avec message.']],
    [], 'comparer montants tolerance ecart arrondi centime');

  R('Séparer nom et prénom',
    'Découper « Dupont Jean » en deux colonnes.',
    [['=GAUCHE(A2;TROUVE(" ";A2)-1)', 'Le premier mot (le nom) : tout ce qui précède l’espace.'],
     ['=STXT(A2;TROUVE(" ";A2)+1;100)', 'Le reste (le prénom) : tout ce qui suit l’espace.']],
    ['Sans formule : Ctrl+E (remplissage instantané) après avoir tapé 2 exemples.'],
    'separer nom prenom decouper texte espace colonnes');

  R('Nettoyer un libellé',
    'Supprimer les espaces en trop et uniformiser les majuscules.',
    [['=SUPPRESPACE(A2)', 'Enlève les espaces au début, à la fin et en double.'],
     ['=SUPPRESPACE("  Paris   Lyon   Lille  ")', 'Exemple.', 'Paris Lyon Lille'],
     ['=NOMPROPRE(SUPPRESPACE(A2))', 'Et en prime : Majuscule À Chaque Mot.']],
    ['Les espaces insécables copiés depuis une page web résistent à SUPPRESPACE : remplace-les d’abord avec Rechercher et remplacer (Ctrl+H).'],
    'nettoyer libelle espaces en trop majuscules propre');

  R('Convertir une date texte (AAAAMMJJ, JJ.MM.AAAA…)',
    'Dates importées d’un autre logiciel ou d’un fichier CSV, non reconnues par Excel.',
    [['=DATE(GAUCHE(A2;4);STXT(A2;5;2);DROITE(A2;2))', 'Format AAAAMMJJ.'],
     ['=DATE(GAUCHE("20260131";4);STXT("20260131";5;2);DROITE("20260131";2))', 'Exemple.', 'd:2026-01-31'],
     ['=DATE(DROITE(A2;4);STXT(A2;4;2);GAUCHE(A2;2))', 'Format JJ.MM.AAAA ou JJ-MM-AAAA.'],
     ['=DATE(DROITE(A2;4);GAUCHE(A2;2);STXT(A2;4;2))', 'Format américain MM/JJ/AAAA.']],
    ['Applique ensuite un format Date (Ctrl+1).'],
    'date texte convertir aaaammjj import csv date non reconnue format americain');

  R('Date d’échéance d’une facture',
    'Calculer l’échéance selon les conditions de paiement.',
    [['=A2+30', '30 jours date de facture.'],
     ['=FIN.MOIS(A2+30;0)', '30 jours fin de mois.'],
     ['=FIN.MOIS(DATE(2026;1;15)+30;0)', 'Facture du 15/01/2026 à 30 jours fin de mois.', 'd:2026-02-28'],
     ['=FIN.MOIS(A2;0)+45', '45 jours fin de mois (méthode « fin de mois puis +45 j »).'],
     ['=FIN.MOIS(A2+45;0)', '45 jours fin de mois (méthode « +45 j puis fin de mois »).'],
     ['=A2+60', '60 jours date de facture.']],
    ['Il existe deux lectures de « 45 jours fin de mois » : choisis-en une et reste cohérent.'],
    'echeance date paiement 30 jours fin de mois 45 jours 60 jours conditions reglement');

  R('Premier et dernier jour du mois',
    'Bornes du mois d’une date (pour les critères de SOMME.SI.ENS).',
    [['=FIN.MOIS(A2;-1)+1', 'Premier jour du mois.'],
     ['=FIN.MOIS(DATE(2026;3;17);-1)+1', 'Exemple.', 'd:2026-03-01'],
     ['=FIN.MOIS(A2;0)', 'Dernier jour du mois.']],
    [], 'premier jour du mois dernier jour du mois debut fin mois bornes');

  R('Trimestre et semestre d’une date',
    'Regrouper par période.',
    [['="T"&ARRONDI.SUP(MOIS(A2)/3;0)', 'Trimestre civil.'],
     ['="T"&ARRONDI.SUP(MOIS(DATE(2026;8;10))/3;0)', 'Exemple.', 'T3'],
     ['="S"&SI(MOIS(A2)<=6;1;2)', 'Semestre.'],
     ['=DATE(ANNEE(A2);(ARRONDI.SUP(MOIS(A2)/3;0)-1)*3+1;1)', 'Premier jour du trimestre.']],
    [], 'trimestre semestre periode t1 t2 t3 t4 regrouper');

  R('Âge ou ancienneté',
    'Années et mois complets entre deux dates.',
    [['=DATEDIF(A2;AUJOURDHUI();"y")', 'Années complètes.'],
     ['=DATEDIF(A2;AUJOURDHUI();"y")&" ans et "&DATEDIF(A2;AUJOURDHUI();"ym")&" mois"', 'En toutes lettres.'],
     ['=DATEDIF(DATE(2000;5;20);DATE(2026;11;2);"y")', 'Exemple.', 26]],
    [], 'age anciennete annees mois entre deux dates calcul age');

  R('Nombre de mois entre deux dates',
    'Pour un prorata mensuel (loyers, abonnements).',
    [['=DATEDIF(A2;B2;"m")', 'Mois complets.'],
     ['=(ANNEE(B2)-ANNEE(A2))*12+MOIS(B2)-MOIS(A2)+1', 'Mois calendaires, mois de début et de fin inclus.'],
     ['=(ANNEE(DATE(2026;12;31))-ANNEE(DATE(2026;4;10)))*12+MOIS(DATE(2026;12;31))-MOIS(DATE(2026;4;10))+1', 'Avril à décembre inclus.', 9]],
    [], 'nombre de mois entre deux dates prorata mensuel mois inclus');

  R('Jours ouvrés du mois (fériés inclus)',
    'Nombre de jours travaillés dans un mois, en excluant les jours fériés listés dans une plage « Fériés ».',
    [['=NB.JOURS.OUVRES(FIN.MOIS(A2;-1)+1;FIN.MOIS(A2;0);Fériés)', 'Jours ouvrés (du lundi au vendredi) du mois de la date A2.']],
    ['« Fériés » est une plage nommée qui contient les dates des jours fériés de l’année.'],
    'jours ouvres mois jours travailles feries');

  R('Heures travaillées (y compris de nuit)',
    'Durée entre une heure de début et de fin, même si on passe minuit.',
    [['=MOD(C2-B2;1)', 'Durée au format heure (format [h]:mm).'],
     ['=MOD(C2-B2;1)*24', 'En heures décimales.'],
     ['=MOD(TEMPS(6;0;0)-TEMPS(22;0;0);1)*24', 'De 22h à 6h.', 8],
     ['=(MOD(C2-B2;1)-D2)*24', 'Moins une pause (D2 au format heure).']],
    ['Format [h]:mm (avec crochets) pour afficher plus de 24 h dans un total.'],
    'heures travaillees duree horaire pointage nuit minuit pause');

  R('Convertir heures décimales ⇄ hh:mm',
    '7,5 h ⇄ 7:30.',
    [['=A2/24', 'Décimal → heure (puis format hh:mm).'],
     ['=7,5/24', '7,5 h en fraction de jour.', 0.3125],
     ['=A2*24', 'Heure → décimal.'],
     ['=TEXTE(A2/24;"[h]:mm")', 'Directement en texte « 7:30 ».']],
    [], 'convertir heures decimales minutes centiemes format heure');

  R('Total par mois (et par client)',
    'Construire un tableau de synthèse mensuel à partir d’une liste de ventes.',
    [['=SOMME.SI.ENS(Ventes[Montant];Ventes[Date];">="&B$1;Ventes[Date];"<="&FIN.MOIS(B$1;0))', 'B1 = 1er jour du mois, en en-tête de colonne.'],
     ['=SOMME.SI.ENS(Ventes[Montant];Ventes[Client];$A2;Ventes[Date];">="&B$1;Ventes[Date];"<="&FIN.MOIS(B$1;0))', 'Croisement client (A2) × mois (B1) : une seule formule à recopier.']],
    ['Un tableau croisé dynamique donne le même résultat sans formule (voir Organiser & analyser).'],
    'total par mois mensuel tableau de synthese client mois croise somme si ens');

  R('Budget vs réel',
    'Écart et taux de réalisation.',
    [['=C2-B2', 'Écart en valeur (C = réel, B = budget).'],
     ['=SIERREUR(C2/B2;"")', 'Taux de réalisation.'],
     ['=SI(C2>B2;"▲ Dépassement";"▼ Sous budget")', 'Indicateur pour un tableau de bord.']],
    [], 'budget realise ecart budgetaire taux realisation controle gestion');

  /* --------------------------------- EXPERT --------------------------------- */
  R('Cumul depuis le début de l’année',
    'Total des montants du 1er janvier jusqu’à aujourd’hui : il avance tout seul, chaque jour.',
    [['=SOMME.SI.ENS(B:B;A:A;">="&DATE(ANNEE(AUJOURDHUI());1;1);A:A;"<="&AUJOURDHUI())', 'Dates en colonne A, montants en colonne B.'],
     ['=SOMME.SI.ENS(B:B;A:A;">="&DATE(ANNEE(AUJOURDHUI())-1;1;1);A:A;"<="&MOIS.DECALER(AUJOURDHUI();-12))', 'La même période l’an dernier, pour comparer.']],
    ['Le critère se construit avec & : ">="&DATE(…) colle l’opérateur et la date.'],
    'cumul annuel depuis le debut de l annee total a date periode en cours comparaison annee precedente ytd');

  R('Les 5 meilleurs par formule',
    'Afficher les plus gros montants et le nom qui va avec, à jour dès que les chiffres changent.',
    [['=PRENDRE(TRIERPAR(A2:B100;B2:B100;-1);5)', 'Excel 2024 et 365 : les 5 lignes au plus gros montant, en une formule.'],
     ['=GRANDE.VALEUR($B$2:$B$100;1)', 'Toutes versions : le plus gros montant ; remplace 1 par 2, 3… pour les suivants.'],
     ['=INDEX($A$2:$A$100;EQUIV(GRANDE.VALEUR($B$2:$B$100;1);$B$2:$B$100;0))', 'Le nom qui correspond à ce montant.']],
    ['En cas d’égalité, EQUIV renvoie toujours le premier nom trouvé : la version PRENDRE + TRIERPAR n’a pas ce défaut.'],
    'top 5 meilleurs classement plus gros montants palmares premiers grande valeur');
})(window.XL);
