/* Recettes : besoins concrets de comptabilité / gestion → formules prêtes à l'emploi */
(function (XL) {
  'use strict';
  var R = XL.R;

  /* ============================ TVA, PRIX & MARGES ============================ */
  R('tva', 'Passer du HT au TTC',
    'Ajouter la TVA à un montant hors taxes. Place le taux dans une cellule (ex. B1 = 20 %) plutôt qu’en dur dans la formule.',
    [['=ARRONDI(A2*(1+$B$1);2)', 'A2 = montant HT, B1 = taux de TVA. Le $ bloque le taux pour recopier vers le bas.'],
     ['=ARRONDI(100*(1+20%);2)', 'Exemple chiffré : 100 € HT à 20 %.', 120]],
    ['Arrondis au centime à chaque ligne : c’est ce que fait un logiciel de facturation.'],
    'ht ttc ajouter tva calcul ttc hors taxe toutes taxes prix ttc');

  R('tva', 'Passer du TTC au HT',
    'Retrouver le hors taxes à partir d’un prix toutes taxes comprises.',
    [['=ARRONDI(A2/(1+$B$1);2)', 'A2 = TTC, B1 = taux.'],
     ['=ARRONDI(120/(1+20%);2)', 'Exemple : 120 € TTC à 20 %.', 100]],
    ['Erreur fréquente : TTC × 0,8 n’est PAS le HT (120 × 0,8 = 96 et non 100).'],
    'ttc ht enlever tva retirer tva hors taxe depuis ttc');

  R('tva', 'Extraire le montant de TVA d’un TTC',
    'Calculer la TVA contenue dans un montant TTC (ticket, note de frais).',
    [['=ARRONDI(A2-A2/(1+$B$1);2)', 'TTC moins HT.'],
     ['=ARRONDI(119,99*20/120;2)', 'Méthode directe pour 20 % : TTC × 20/120.', 20],
     ['=ARRONDI(A2*$B$1/(1+$B$1);2)', 'Formule générale quel que soit le taux.']],
    ['Taux réduits : ×10/110, ×5,5/105,5, ×2,1/102,1.'],
    'montant tva tva deductible collectee note de frais ticket extraire tva');

  R('tva', 'TVA multi-taux selon un code',
    'Chaque ligne a un code taux (N = normal, I = intermédiaire, R = réduit…) : on va chercher le taux dans une petite table.',
    [['=ARRONDI(C2*RECHERCHEX(D2;Taux[Code];Taux[Taux]);2)', 'C2 = HT, D2 = code, table « Taux » à 2 colonnes (Code, Taux).'],
     ['=ARRONDI(C2*RECHERCHEV(D2;$H$2:$I$6;2;FAUX);2)', 'Même chose avec RECHERCHEV (toutes versions).'],
     ['=SOMME.SI(D2:D500;"N";E2:E500)', 'Total de TVA par code pour la déclaration.']],
    ['Mets les taux dans une table plutôt qu’en dur : si un taux change, une seule cellule à modifier.'],
    'tva plusieurs taux taux reduit 5,5 10 20 code tva declaration ca3');

  R('tva', 'Taux de marge et taux de marque',
    'Taux de marge = marge / coût d’achat. Taux de marque = marge / prix de vente HT. Ne pas les confondre !',
    [['=(B2-A2)/A2', 'Taux de MARGE (A2 = coût d’achat HT, B2 = prix de vente HT).'],
     ['=(B2-A2)/B2', 'Taux de MARQUE.'],
     ['=(150-100)/100', 'Exemple : achat 100, vente 150 → taux de marge 50 %.', 0.5],
     ['=ARRONDI((150-100)/150;4)', 'Même exemple → taux de marque 33,33 %.', 0.3333]],
    ['Format % sur la cellule pour afficher 50 % au lieu de 0,5.'],
    'marge marque taux de marge taux de marque rentabilite produit commercial');

  R('tva', 'Prix de vente à partir d’un taux de marque visé',
    'Je veux 25 % de marque : quel prix de vente HT ?',
    [['=ARRONDI(A2/(1-B2);2)', 'A2 = coût d’achat, B2 = taux de marque visé.'],
     ['=ARRONDI(100/(1-25%);2)', 'Exemple : 100 € de coût, 25 % de marque.', 133.33],
     ['=ARRONDI(A2*(1+B2);2)', 'Si c’est un taux de MARGE visé.']],
    [], 'prix de vente fixer prix taux de marque objectif marge cible coefficient');

  R('tva', 'Coefficient multiplicateur',
    'Coefficient qui transforme un coût d’achat HT en prix de vente (HT ou TTC).',
    [['=B2/A2', 'Coefficient = PV / PA.'],
     ['=ARRONDI(A2*$D$1;2)', 'Appliquer un coefficient fixe (D1) à toute une liste de coûts.']],
    [], 'coefficient multiplicateur prix vente achat');

  R('tva', 'Remises en cascade',
    'Appliquer plusieurs remises successives (ex. 10 % puis 5 %) : elles se multiplient, elles ne s’additionnent pas.',
    [['=ARRONDI(A2*(1-B2)*(1-C2);2)', 'A2 = prix, B2 et C2 = remises.'],
     ['=100*(1-10%)*(1-5%)', '100 € avec 10 % puis 5 % = 85,50 € (et non 85 €).', 85.5],
     ['=1-(1-B2)*(1-C2)', 'Remise globale équivalente.']],
    [], 'remise cascade successive escompte rabais ristourne pourcentage');

  R('tva', 'Arrondis commerciaux',
    'Arrondir un prix aux 5 centimes, à l’euro supérieur, ou en prix psychologique ,99.',
    [['=ARRONDI.AU.MULTIPLE(12,37;0,05)', 'Aux 5 centimes les plus proches.', 12.35],
     ['=PLAFOND.MATH(12,37)-0,01', 'Prix psychologique.', 12.99],
     ['=ARRONDI.SUP(A2;0)', 'À l’euro supérieur.']],
    [], 'arrondi prix psychologique 99 centimes 5 centimes euro superieur');

  /* ========================= EMPRUNTS & PLACEMENTS ========================= */
  R('emprunt', 'Calculer une mensualité d’emprunt',
    'Mensualité constante (capital + intérêts) d’un prêt.',
    [['=-VPM(B1/12;B2*12;B3)', 'B1 = taux annuel, B2 = durée en années, B3 = capital.'],
     ['=ARRONDI(VPM(3%/12;20*12;-200000);2)', '200 000 € sur 20 ans à 3 %.', 1109.2]],
    ['Hors assurance emprunteur : ajoute-la à part (souvent un % du capital initial / 12).'],
    'mensualite emprunt credit pret immobilier echeance remboursement simulateur');

  R('emprunt', 'Coût total d’un crédit',
    'Total des intérêts payés sur toute la durée.',
    [['=-VPM(B1/12;B2*12;B3)*B2*12-B3', 'Total des mensualités moins le capital.'],
     ['=ARRONDI(VPM(3%/12;240;-200000)*240-200000;0)', 'Exemple 200 000 € / 20 ans / 3 %.', 66207]],
    [], 'cout total credit total interets combien coute emprunt');

  R('emprunt', 'Tableau d’amortissement d’un emprunt',
    'Pour chaque échéance : intérêts, capital remboursé et capital restant dû.',
    [['=$B$3*$B$1/12', 'Ligne 1, colonne Intérêts (si on construit à la main) : capital restant × taux/12.'],
     ['=INTPER($B$1/12;A6;$B$2*12;-$B$3)', 'Colonne Intérêts : A6 = n° d’échéance (1, 2, 3…).'],
     ['=PRINCPER($B$1/12;A6;$B$2*12;-$B$3)', 'Colonne Capital remboursé.'],
     ['=$B$3+CUMUL.PRINCPER($B$1/12;$B$2*12;$B$3;1;A6;0)', 'Colonne Capital restant dû après l’échéance A6.'],
     ['=LET(t;B1/12;n;B2*12;c;B3;p;SEQUENCE(n);ASSEMB.H(p;-INTPER(t;p;n;c);-PRINCPER(t;p;n;c)))', 'Version Excel 2024/365 : TOUT le tableau en une seule formule.']],
    ['Contrôle : la somme de la colonne capital doit égaler le capital emprunté.'],
    'tableau amortissement emprunt echeancier interets capital restant du plan de remboursement');

  R('emprunt', 'Intérêts d’emprunt de l’année (charges financières)',
    'Montant à comptabiliser en 661 pour un exercice : intérêts des échéances de l’année.',
    [['=-CUMUL.INTER(B1/12;B2*12;B3;1;12;0)', 'Intérêts des échéances 1 à 12 (1re année).'],
     ['=-CUMUL.INTER(B1/12;B2*12;B3;13;24;0)', 'Intérêts de la 2e année.'],
     ['=-CUMUL.PRINCPER(B1/12;B2*12;B3;1;12;0)', 'Capital remboursé sur l’année (diminution du 164).']],
    ['Si l’exercice ne coïncide pas avec la date anniversaire du prêt, prends les n° d’échéances qui tombent dans l’exercice.'],
    'interets annuels charges financieres 661 164 cloture emprunt annee');

  R('emprunt', 'Capacité d’emprunt',
    'Combien puis-je emprunter avec une mensualité maximale donnée ?',
    [['=VA(B1/12;B2*12;-B4)', 'B4 = mensualité maximale.'],
     ['=ARRONDI(VA(3%/12;240;-1000);0)', '1 000 €/mois, 20 ans, 3 %.', 180311]],
    [], 'capacite emprunt combien emprunter budget mensualite maximum');

  R('emprunt', 'Retrouver le taux réel d’un crédit ou d’un leasing',
    'À partir des loyers/mensualités, retrouver le taux appliqué.',
    [['=TAUX(B2*12;-B4;B3)*12', 'Taux nominal annuel (mensualités en fin de mois).'],
     ['=(1+TAUX(B2*12;-B4;B3))^12-1', 'Taux actuariel annuel (comparable au TAEG).'],
     ['=(1+TAUX(48;-450;20000;-2000;1))^12-1', 'Leasing : 48 loyers de 450 € payés d’avance, option d’achat 2 000 €.']],
    ['TAEG officiel = taux actuariel incluant TOUS les frais : déduis frais de dossier et garanties du capital (B3).'],
    'taux reel taeg leasing loa credit bail taux cache retrouver taux');

  R('emprunt', 'Épargne : combien j’aurai ?',
    'Valeur future de versements réguliers avec intérêts composés.',
    [['=VC(B1/12;B2*12;-B3;-B4)', 'B1 = taux annuel, B2 = années, B3 = versement mensuel, B4 = capital de départ.'],
     ['=ARRONDI(VC(2%/12;120;-100);0)', '100 €/mois pendant 10 ans à 2 %.', 13272]],
    [], 'epargne placement interets composes valeur future livret');

  R('emprunt', 'Rentabilité d’un investissement (VAN et TRI)',
    'Comparer un investissement à son coût du capital.',
    [['=VAN(B1;C3:C7)+C2', 'VAN : C2 = investissement initial (négatif), C3:C7 = flux annuels, B1 = taux d’actualisation.'],
     ['=TRI(C2:C7)', 'TRI : le projet est rentable si TRI > taux exigé.'],
     ['=TRI.PAIEMENTS(C2:C10;B2:B10)', 'Flux à dates irrégulières.']],
    ['VAN > 0 → le projet crée de la valeur au taux choisi.'],
    'van tri rentabilite investissement projet actualisation payback');

  R('emprunt', 'Taux de croissance annuel moyen (TCAM)',
    'Évolution moyenne par an entre deux valeurs (CA, effectif…).',
    [['=(C2/B2)^(1/D2)-1', 'C2 = valeur finale, B2 = valeur initiale, D2 = nombre d’années.'],
     ['=ARRONDI(TAUX.INT.EQUIV(5;100;150);4)', 'De 100 à 150 en 5 ans.', 0.0845]],
    [], 'tcam cagr croissance moyenne annuelle evolution moyenne');

  /* ============================= IMMOBILISATIONS ============================ */
  R('immo', 'Amortissement linéaire (année pleine)',
    'Dotation annuelle constante.',
    [['=AMORLIN(B2;0;C2)', 'B2 = valeur d’origine HT, C2 = durée en années.'],
     ['=AMORLIN(10000;0;5)', 'Bien de 10 000 € sur 5 ans.', 2000],
     ['=B2/C2', 'Équivalent sans fonction.']],
    [], 'amortissement lineaire dotation annuelle 6811 2815 immobilisation');

  R('immo', 'Amortissement linéaire avec prorata temporis',
    'La 1re année, la dotation est calculée au prorata du temps écoulé depuis la mise en service (base 360 jours).',
    [['=ARRONDI(B2/C2*JOURS360(D2;E2;VRAI)/360;2)', 'B2 = valeur, C2 = durée, D2 = date de mise en service, E2 = date de clôture.'],
     ['=ARRONDI(10000/5*JOURS360(DATE(2026;3;15);DATE(2026;12;31);VRAI)/360;2)', 'Mise en service le 15/03/2026, clôture 31/12 : 285 jours.', 1583.33],
     ['=AMORLINC(B2;D2;E2;0;0;1/C2;4)', 'Alternative avec la fonction dédiée AMORLINC.']],
    ['Selon ta pratique, le jour de mise en service est inclus ou non (+1 jour) : reste cohérent d’un bien à l’autre.',
     'La dernière annuité = valeur - cumul des dotations précédentes (elle absorbe le prorata de la 1re année).'],
    'prorata temporis amortissement premiere annee mise en service lineaire 360 jours');

  R('immo', 'Plan d’amortissement linéaire complet',
    'Dotation, cumul et VNC de chaque année.',
    [['=MIN($B$2/$C$2;$B$2-SOMME($F$1:F1))', 'Dotation de l’année (colonne F) : jamais plus que ce qui reste à amortir.'],
     ['=SOMME($F$2:F2)', 'Cumul des amortissements.'],
     ['=$B$2-G2', 'Valeur nette comptable (VNC).'],
     ['=LET(v;B2;n;C2;a;SEQUENCE(n);d;v/n;ASSEMB.H(a;SEQUENCE(n;1;d;0);a*d;v-a*d))', 'Version 2024/365 : année, dotation, cumul, VNC en une formule.']],
    [], 'plan amortissement tableau vnc valeur nette comptable cumul');

  R('immo', 'Amortissement dégressif fiscal (France)',
    'Taux dégressif = taux linéaire × coefficient (1,25 si 3-4 ans ; 1,75 si 5-6 ans ; 2,25 au-delà). On bascule en linéaire quand l’annuité linéaire sur la durée restante devient supérieure.',
    [['=1/C2*SI(C2<=4;1,25;SI(C2<=6;1,75;2,25))', 'Taux dégressif (C2 = durée, 3 ans minimum).'],
     ['=ARRONDI(MAX(G1*$D$2;G1/($C$2-A2+1));2)', 'Annuité de l’année A2 : max(VNC début × taux dégressif ; VNC début / années restantes). G1 = VNC de début d’année.'],
     ['=VDB(10000;0;5;0;1;1,75)', 'Contrôle en années pleines avec VDB (coefficient 1,75, bascule automatique).', 3500]],
    ['1re année : prorata en MOIS (mois d’acquisition compris), pas en jours.',
     'N’utilise pas AMORDEGRC pour un plan fiscal : ses coefficients (1,5 / 2 / 2,5) ne sont pas ceux en vigueur.'],
    'degressif fiscal coefficient 1,25 1,75 2,25 amortissement degressif bascule lineaire');

  R('immo', 'Plus ou moins-value de cession',
    'Résultat de la vente d’une immobilisation.',
    [['=B2-(C2-D2)', 'B2 = prix de cession, C2 = valeur d’origine, D2 = amortissements cumulés à la date de cession.'],
     ['=SI(E2>=0;"Plus-value";"Moins-value")', 'Sens du résultat.']],
    ['N’oublie pas la dotation complémentaire de l’année de cession jusqu’à la date de sortie.'],
    'cession immobilisation plus value moins value vente vnc 675 775');

  /* ========================== FACTURES & ÉCHÉANCES ========================== */
  R('factures', 'Date d’échéance d’une facture',
    'Calculer l’échéance selon les conditions de paiement.',
    [['=A2+30', '30 jours date de facture.'],
     ['=FIN.MOIS(A2+30;0)', '30 jours fin de mois.'],
     ['=FIN.MOIS(DATE(2026;1;15)+30;0)', 'Facture du 15/01/2026 à 30 jours fin de mois.', 'd:2026-02-28'],
     ['=FIN.MOIS(A2;0)+45', '45 jours fin de mois (méthode « fin de mois puis +45 j »).'],
     ['=FIN.MOIS(A2+45;0)', '45 jours fin de mois (méthode « +45 j puis fin de mois »).'],
     ['=A2+60', '60 jours date de facture.']],
    ['Il existe deux lectures de « 45 jours fin de mois » : fixe-la dans tes CGV et reste cohérent.',
     'Délais maximaux entre professionnels (LME) : 60 jours date de facture ou 45 jours fin de mois.'],
    'echeance date paiement 30 jours fin de mois 45 jours 60 jours conditions reglement lme');

  R('factures', 'Retard de paiement en jours',
    'Nombre de jours de retard (0 si pas encore échu).',
    [['=MAX(0;AUJOURDHUI()-E2)', 'E2 = date d’échéance.'],
     ['=SI(F2<>"";0;MAX(0;AUJOURDHUI()-E2))', 'Ignore les factures déjà réglées (F2 = date de règlement).']],
    [], 'retard jours retard paiement relance echu');

  R('factures', 'Pénalités et indemnité de retard',
    'Pénalités calculées au prorata des jours de retard + indemnité forfaitaire de recouvrement entre professionnels.',
    [['=ARRONDI(B2*$H$1*G2/365;2)', 'B2 = montant TTC dû, H1 = taux annuel des pénalités (celui de tes CGV), G2 = jours de retard.'],
     ['=SI(G2>0;40;0)', 'Indemnité forfaitaire de recouvrement de 40 € par facture en retard.']],
    ['Le taux des pénalités est celui prévu dans tes conditions générales : saisis-le dans une cellule plutôt qu’en dur.'],
    'penalites retard interets moratoires indemnite 40 euros recouvrement');

  R('factures', 'Balance âgée (tranches de retard)',
    'Classer chaque créance par ancienneté et totaliser par tranche.',
    [['=SI.CONDITIONS(G2<=0;"Non échu";G2<=30;"0-30 j";G2<=60;"31-60 j";G2<=90;"61-90 j";VRAI;"> 90 j")', 'Libellé de tranche (G2 = jours de retard).'],
     ['=SI(G2<=0;"Non échu";SI(G2<=30;"0-30 j";SI(G2<=60;"31-60 j";SI(G2<=90;"61-90 j";"> 90 j"))))', 'Même chose compatible Excel 2016.'],
     ['=SOMME.SI($H$2:$H$500;K2;$D$2:$D$500)', 'Total par tranche (K2 = libellé de tranche, D = solde dû).'],
     ['=SOMME.SI.ENS(D:D;E:E;"<"&AUJOURDHUI();E:E;">="&AUJOURDHUI()-30)', 'Directement : échu depuis 0 à 30 jours.']],
    [], 'balance agee anciennete creances tranches retard encours clients poste clients');

  R('factures', 'Numéro de facture automatique',
    'Générer des numéros chronologiques du type FA-2026-0042.',
    [['="FA-"&TEXTE(B2;"aaaa")&"-"&TEXTE(LIGNE()-1;"0000")', 'B2 = date de facture ; la ligne sert de compteur.'],
     ['="FA-"&ANNEE(B2)&"-"&TEXTE(NB.SI.ENS($B$2:B2;">="&DATE(ANNEE(B2);1;1))+0;"0000")', 'Compteur qui repart à 1 chaque année (factures triées par date).']],
    ['La numérotation des factures doit être chronologique et continue, sans trou.'],
    'numero facture numerotation automatique compteur reference chrono');

  R('factures', 'Détecter les doublons de factures',
    'Repérer une facture saisie deux fois (même fournisseur + même numéro, ou même montant le même jour).',
    [['=NB.SI.ENS($A$2:$A$500;A2;$B$2:$B$500;B2)>1', 'VRAI si la paire fournisseur (A) / n° (B) existe plusieurs fois.'],
     ['=SI(NB.SI.ENS($A$2:$A$500;A2;$C$2:$C$500;C2;$D$2:$D$500;D2)>1;"⚠ Doublon possible";"")', 'Même fournisseur, même date, même montant.']],
    ['Mets la formule en mise en forme conditionnelle pour colorer les doublons.'],
    'doublon facture double saisie controle fournisseur meme numero');

  R('factures', 'Lister les factures impayées et échues',
    'Extraire automatiquement les factures à relancer.',
    [['=FILTRE(Fact;(Fact[Statut]<>"Payé")*(Fact[Échéance]<AUJOURDHUI());"Rien à relancer")', 'Excel 2021+ : liste dynamique.'],
     ['=TRIER(FILTRE(Fact;(Fact[Statut]<>"Payé")*(Fact[Échéance]<AUJOURDHUI()));5;1)', 'Triée par échéance (colonne 5) de la plus ancienne à la plus récente.'],
     ['=SOMME.SI.ENS(Fact[Solde];Fact[Client];A2;Fact[Échéance];"<"&AUJOURDHUI())', 'Montant échu par client.']],
    [], 'impayes relance factures echues retard client recouvrement liste');

  R('factures', 'Encours total par client',
    'Total restant dû par client (sous-total pour la relance ou le plafond d’encours).',
    [['=SOMME.SI(Fact[Client];A2;Fact[Solde])', 'Encours d’un client.'],
     ['=SI(SOMME.SI(Fact[Client];A2;Fact[Solde])>B2;"⚠ Plafond dépassé";"OK")', 'Contrôle d’un plafond d’encours (B2).'],
     ['=LET(c;UNIQUE(Fact[Client]);ASSEMB.H(c;SOMME.SI(Fact[Client];c;Fact[Solde])))', 'Tableau complet client / encours (2024/365).']],
    [], 'encours client solde du total par client plafond risque');

  /* =========================== TRÉSORERIE & BANQUE ========================== */
  R('treso', 'Solde progressif d’un compte',
    'Solde cumulé ligne après ligne (relevé, compte bancaire, grand livre).',
    [['=E1+C2-D2', 'E1 = solde précédent, C2 = crédit/encaissement, D2 = débit/décaissement (mettre le solde initial en E1).'],
     ['=SOMME($C$2:C2)-SOMME($D$2:D2)', 'Version sans dépendre de la ligne au-dessus (résiste au tri).']],
    [], 'solde progressif cumul cumule releve banque grand livre running balance');

  R('treso', 'Rapprochement bancaire (pointage)',
    'Pointer les écritures comptables avec le relevé bancaire, en gérant les montants identiques.',
    [['=SI(NB.SI(Banque!$C:$C;C2)>0;"✓ Pointé";"✗ À vérifier")', 'Simple : le montant existe-t-il sur le relevé ?'],
     ['=SI(NB.SI($C$2:C2;C2)<=NB.SI(Banque!$C:$C;C2);"✓ Pointé";"✗ À vérifier")', 'Robuste : si 3 chèques de 50 € en compta mais 2 en banque, le 3e ressort.'],
     ['=SI(NB.SI.ENS(Banque!$C:$C;C2;Banque!$A:$A;">="&B2-5;Banque!$A:$A;"<="&B2+5)>0;"✓";"✗")', 'Même montant à ± 5 jours de la date.']],
    ['Fais le pointage dans les DEUX sens (compta → banque, banque → compta) pour trouver les écritures manquantes de chaque côté.',
     'Attention au signe : en compta le débit du 512 = encaissement, sur le relevé c’est un crédit.'],
    'rapprochement bancaire pointage releve banque 512 ecart lettrage banque');

  R('treso', 'Séparer débit et crédit d’un montant signé',
    'Un export donne une seule colonne de montants (+/-) ; on veut deux colonnes Débit / Crédit.',
    [['=SI(A2<0;-A2;"")', 'Colonne Débit (sorties d’argent).'],
     ['=SI(A2>0;A2;"")', 'Colonne Crédit (entrées).'],
     ['=MAX(0;-A2)', 'Variante avec 0 au lieu de vide.']],
    [], 'debit credit separer montant signe positif negatif deux colonnes');

  R('treso', 'Montant signé à partir de Débit / Crédit',
    'L’inverse : fusionner deux colonnes en un montant +/-.',
    [['=N(C2)-N(B2)', 'C2 = crédit, B2 = débit ; N() transforme les vides/textes en 0.']],
    [], 'fusionner debit credit montant signe solde ligne');

  R('treso', 'Prévisionnel de trésorerie mensuel',
    'Encaissements et décaissements prévus par mois.',
    [['=SOMME.SI.ENS(Flux[Montant];Flux[Date];">="&B$1;Flux[Date];"<="&FIN.MOIS(B$1;0);Flux[Sens];"Encaissement")', 'B1 = 1er jour du mois (en-tête de colonne).'],
     ['=B5-B6', 'Variation du mois.'],
     ['=A8+B7', 'Trésorerie de fin de mois = début + variation.']],
    ['Avec Excel 2024/365, PIVOTER.PAR(Flux[Sens];Flux[Mois];Flux[Montant];SOMME) produit le tableau d’un coup.'],
    'previsionnel tresorerie budget tresorerie flux mensuel encaissements decaissements cash');

  /* =========================== CONTRÔLES & AUDIT =========================== */
  R('controle', 'Vérifier qu’une balance est équilibrée',
    'Total débit = total crédit, au centime près.',
    [['=SI(ARRONDI(SOMME(C:C)-SOMME(D:D);2)=0;"✓ Équilibrée";"Écart : "&TEXTE(SOMME(C:C)-SOMME(D:D);"# ##0,00"))', 'Message clair avec l’écart.']],
    ['Toujours ARRONDI(…;2)=0 : comparer directement des sommes donne parfois FAUX à cause des décimales invisibles (0,0000000001).'],
    'balance equilibree controle debit credit ecart equilibre');

  R('controle', 'Trouver les pièces non équilibrées',
    'Pour chaque n° de pièce, débit - crédit doit faire 0.',
    [['=ARRONDI(SOMME.SI($A$2:$A$5000;A2;$C$2:$C$5000)-SOMME.SI($A$2:$A$5000;A2;$D$2:$D$5000);2)', 'Solde de la pièce A2 (≠ 0 = problème).'],
     ['=FILTRE(UNIQUE(Journal[Pièce]);SOMME.SI(Journal[Pièce];UNIQUE(Journal[Pièce]);Journal[Débit])<>SOMME.SI(Journal[Pièce];UNIQUE(Journal[Pièce]);Journal[Crédit]);"Toutes équilibrées")', 'Liste directe des pièces déséquilibrées (2021+).']],
    [], 'piece desequilibree ecriture non equilibree controle journal saisie');

  R('controle', 'Total par classe ou racine de comptes',
    'Somme de tous les comptes 6, ou de tous les 607…, que les comptes soient du texte OU des nombres.',
    [['=SOMME.SI(A:A;"607*";D:D)', 'Fonctionne UNIQUEMENT si les comptes sont stockés en texte.'],
     ['=SOMMEPROD((GAUCHE($A$2:$A$5000;3)="607")*$D$2:$D$5000)', 'Fonctionne dans tous les cas (comptes en nombres).'],
     ['=SOMMEPROD(($A$2:$A$5000>=600000)*($A$2:$A$5000<700000)*$D$2:$D$5000)', 'Classe 6 sur des comptes numériques à 6 chiffres.']],
    ['Pour savoir si tes comptes sont du texte : =ESTTEXTE(A2).'],
    'total classe compte racine 6 7 607 charges produits comptes commencant par');

  R('controle', 'Libellé de la classe d’un compte (PCG)',
    'Afficher la classe du plan comptable à partir du n° de compte.',
    [['=CHOISIR(CNUM(GAUCHE(A2;1));"Capitaux";"Immobilisations";"Stocks";"Tiers";"Financiers";"Charges";"Produits")', 'Classe 1 à 7.'],
     ['=CHOISIR(CNUM(GAUCHE("607100";1));"Capitaux";"Immobilisations";"Stocks";"Tiers";"Financiers";"Charges";"Produits")', 'Exemple avec le compte 607100.', 'Charges'],
     ['=SI(GAUCHE(A2;1)<"6";"Bilan";"Gestion")', 'Bilan (1-5) ou compte de résultat (6-7).']],
    [], 'classe compte pcg plan comptable libelle classe bilan resultat');

  R('controle', 'Lettrage : vérifier qu’un code lettre est soldé',
    'Un groupe d’écritures lettrées doit avoir un solde nul.',
    [['=ARRONDI(SOMME.SI.ENS(C:C;A:A;A2;F:F;F2)-SOMME.SI.ENS(D:D;A:A;A2;F:F;F2);2)=0', 'A = compte, F = code lettre, C/D = débit/crédit.'],
     ['=SI(F2="";"Non lettré";"")', 'Repère les écritures non lettrées.']],
    [], 'lettrage code lettre solde lettre tiers 401 411 non lettre');

  R('controle', 'Comparer deux montants avec tolérance',
    'Accepter un écart d’arrondi (ex. 1 centime) entre deux montants.',
    [['=ABS(A2-B2)<=0,01', 'VRAI si l’écart est d’au plus 1 centime.'],
     ['=SI(ABS(A2-B2)<=0,01;"OK";"Écart "&TEXTE(A2-B2;"0,00"))', 'Version avec message.']],
    [], 'comparer montants tolerance ecart arrondi centime');

  R('controle', 'Contrôler un numéro SIREN (clé de Luhn)',
    'Vérifier qu’un SIREN de 9 chiffres est valide (A2 au format texte).',
    [['=LET(d;--STXT(A2;SEQUENCE(9);1);p;d*(1+MOD(SEQUENCE(9)+1;2));ET(NBCAR(A2)=9;MOD(SOMME(p-9*(p>9));10)=0))', 'VRAI si le SIREN est valide (Excel 2021+).']],
    ['Le SIRET (14 chiffres) suit la même logique en adaptant SEQUENCE(14) et la longueur.'],
    'siren siret luhn valide controle numero entreprise');

  R('controle', 'Repérer les valeurs saisies en dur dans des formules',
    'Audit d’un modèle : quelles cellules contiennent une valeur tapée à la main au lieu d’une formule ?',
    [['=NON(ESTFORMULE(D2))', 'À mettre en mise en forme conditionnelle sur la colonne censée être calculée.'],
     ['=FORMULETEXTE(D2)', 'Affiche la formule à côté pour relecture.']],
    ['Raccourci pour afficher toutes les formules : onglet Formules > Afficher les formules.'],
    'audit modele valeur en dur formule ecrasee controle fichier');

  /* ========================== ANALYSE & REPORTING ========================== */
  R('analyse', 'Variation N / N-1 en %',
    'Évolution entre deux exercices, sans erreur si N-1 = 0.',
    [['=SIERREUR((C2-B2)/ABS(B2);"")', 'C2 = N, B2 = N-1 ; ABS gère les bases négatives.'],
     ['=(120-100)/ABS(100)', 'De 100 à 120.', 0.2]],
    [], 'variation evolution pourcentage n n-1 comparaison annee precedente ecart en pourcentage');

  R('analyse', 'Part de chaque ligne dans le total',
    'Poids en % de chaque client, compte, produit…',
    [['=B2/SOMME($B$2:$B$50)', 'Le $ bloque le total pour recopier.'],
     ['=SOMME($B$2:B2)/SOMME($B$2:$B$50)', 'Part cumulée (analyse Pareto 80/20, liste triée décroissante).']],
    [], 'part pourcentage du total poids repartition pareto 80 20 abc');

  R('analyse', 'Total par mois (et par compte)',
    'Construire un tableau de bord mensuel à partir d’un journal.',
    [['=SOMME.SI.ENS(Journal[Montant];Journal[Date];">="&B$1;Journal[Date];"<="&FIN.MOIS(B$1;0))', 'B1 = 1er jour du mois en en-tête.'],
     ['=SOMME.SI.ENS(Journal[Montant];Journal[Compte];$A2;Journal[Date];">="&B$1;Journal[Date];"<="&FIN.MOIS(B$1;0))', 'Croisement compte (A2) × mois (B1).'],
     ['=PIVOTER.PAR(Journal[Compte];TEXTE(Journal[Date];"aaaa-mm");Journal[Montant];SOMME)', 'Tout le tableau en une formule (365).']],
    [], 'total par mois mensuel tableau de bord reporting compte mois croise synthese');

  R('analyse', 'Cumul depuis le début de l’année (YTD)',
    'Total de l’exercice à date.',
    [['=SOMME.SI.ENS(Montant;Date;">="&DATE(ANNEE(AUJOURDHUI());1;1);Date;"<="&AUJOURDHUI())', 'Du 1er janvier à aujourd’hui.'],
     ['=SOMME.SI.ENS(Montant;Date;">="&DATE(ANNEE(AUJOURDHUI())-1;1;1);Date;"<="&MOIS.DECALER(AUJOURDHUI();-12))', 'Même période l’an dernier (comparaison à date).']],
    [], 'cumul annuel ytd depuis debut annee a date year to date');

  R('analyse', 'Top N clients par chiffre d’affaires',
    'Classement automatique des meilleurs clients.',
    [['=LET(c;UNIQUE(Ventes[Client]);t;SOMME.SI(Ventes[Client];c;Ventes[HT]);PRENDRE(TRIERPAR(ASSEMB.H(c;t);t;-1);5))', 'Top 5 en une formule (2024/365).'],
     ['=GRANDE.VALEUR($B$2:$B$200;1)', 'Toutes versions : 1er CA (puis 2, 3…) ; retrouve le nom avec INDEX/EQUIV.'],
     ['=INDEX($A$2:$A$200;EQUIV(GRANDE.VALEUR($B$2:$B$200;D2);$B$2:$B$200;0))', 'Nom du client classé D2.']],
    [], 'top 5 meilleurs clients classement ca palmares');

  R('analyse', 'Seuil de rentabilité et point mort',
    'CA minimum pour couvrir les charges fixes, et date à laquelle il est atteint.',
    [['=B1/((B2-B3)/B2)', 'B1 = charges fixes, B2 = CA, B3 = charges variables.'],
     ['=50000/((200000-120000)/200000)', 'Exemple : CF 50 000, CA 200 000, CV 120 000.', 125000],
     ['=125000/200000*360', 'Point mort en jours (base 360).', 225],
     ['=DATE(2026;1;1)+B5/360*365', 'Date approximative du point mort sur l’exercice 2026.']],
    [], 'seuil rentabilite point mort marge sur cout variable charges fixes');

  R('analyse', 'Délais clients et fournisseurs (DSO / DPO)',
    'Délai moyen de paiement en jours.',
    [['=Créances_clients_TTC/CA_TTC*360', 'DSO : délai moyen de règlement clients.'],
     ['=Dettes_fournisseurs_TTC/Achats_TTC*360', 'DPO : délai moyen de règlement fournisseurs.'],
     ['=MOYENNE.SI.ENS(Fact[Délai];Fact[Client];A2)', 'Délai réel moyen d’un client (Délai = date règlement - date facture).']],
    [], 'dso dpo delai paiement clients fournisseurs bfr jours');

  R('analyse', 'Budget vs réel',
    'Écart et taux de réalisation.',
    [['=C2-B2', 'Écart en valeur (C = réel, B = budget).'],
     ['=SIERREUR(C2/B2;"")', 'Taux de réalisation.'],
     ['=SI(C2>B2;"▲ Dépassement";"▼ Sous budget")', 'Indicateur pour un tableau de bord.']],
    [], 'budget realise ecart budgetaire taux realisation controle gestion');

  /* ============================ NETTOYAGE D'IMPORTS ============================ */
  R('import', 'Convertir un montant texte en nombre (« 1 234,56 € »)',
    'Un export (banque, logiciel, PDF) donne des montants alignés à gauche qui ne s’additionnent pas.',
    [['=CNUM(SUBSTITUE(SUBSTITUE(SUBSTITUE(A2;"€";"");CAR(160);"");" ";""))', 'Retire €, espaces insécables et espaces.'],
     ['=CNUM(SUBSTITUE(SUBSTITUE(A2;UNICAR(8239);"");" ";""))', 'Variante pour l’espace fine insécable (exports récents).'],
     ['=--A2', 'Si le texte est déjà un nombre « propre », le double moins suffit.']],
    ['Méthode sans formule : sélectionner la colonne > Données > Convertir > Terminer.'],
    'nombre stocke texte convertir montant texte import banque export espace euro');

  R('import', 'Montants au format anglais (1,234.56)',
    'Fichier CSV ou export d’un outil anglo-saxon.',
    [['=VALEURNOMBRE(A2;".";",")', 'Indique le séparateur décimal et le séparateur de milliers du TEXTE source.'],
     ['=VALEURNOMBRE("1,234.56";".";",")', 'Exemple.', 1234.56]],
    [], 'format anglais americain point decimal virgule milliers csv import');

  R('import', 'Montant avec signe à droite ou entre parenthèses',
    'Formats « 123,45- » ou « (123,45) » de certains logiciels.',
    [['=SI(DROITE(A2;1)="-";-CNUM(GAUCHE(A2;NBCAR(A2)-1));CNUM(A2))', 'Signe moins à droite.'],
     ['=SI(GAUCHE(A2;1)="(";-CNUM(SUBSTITUE(SUBSTITUE(A2;"(";"");")";""));CNUM(A2))', 'Négatif entre parenthèses.']],
    [], 'signe moins a droite parentheses negatif import as400 sage');

  R('import', 'Convertir une date texte (AAAAMMJJ, JJ.MM.AAAA…)',
    'Dates importées non reconnues (FEC, exports SAP, CSV).',
    [['=DATE(GAUCHE(A2;4);STXT(A2;5;2);DROITE(A2;2))', 'Format AAAAMMJJ (FEC).'],
     ['=DATE(GAUCHE("20260131";4);STXT("20260131";5;2);DROITE("20260131";2))', 'Exemple.', 'd:2026-01-31'],
     ['=DATE(DROITE(A2;4);STXT(A2;4;2);GAUCHE(A2;2))', 'Format JJ.MM.AAAA ou JJ-MM-AAAA.'],
     ['=DATE(DROITE(A2;4);GAUCHE(A2;2);STXT(A2;4;2))', 'Format américain MM/JJ/AAAA.']],
    ['Applique ensuite un format Date (Ctrl+1).'],
    'date texte convertir aaaammjj fec import date non reconnue format americain');

  R('import', 'Exploiter un FEC (fichier des écritures comptables)',
    'Le FEC est un fichier texte normé : dates AAAAMMJJ, montants avec virgule décimale, colonnes Debit/Credit.',
    [['=DATE(GAUCHE([@EcritureDate];4);STXT([@EcritureDate];5;2);DROITE([@EcritureDate];2))', 'Colonne date exploitable (dans un tableau structuré).'],
     ['=VALEURNOMBRE([@Debit];",")-VALEURNOMBRE([@Credit];",")', 'Montant signé (débit positif).'],
     ['=SOMME.SI.ENS(Tab[Solde];Tab[CompteNum];"6*")', 'Total des charges (CompteNum est du texte dans le FEC).']],
    ['Importe le FEC via Données > À partir d’un fichier texte/CSV en choisissant le séparateur (tabulation ou |) et le type « Texte » pour CompteNum afin de garder les zéros.'],
    'fec fichier ecritures comptables controle fiscal import analyse');

  R('import', 'Nettoyer un libellé',
    'Supprimer espaces multiples, insécables et caractères invisibles.',
    [['=SUPPRESPACE(EPURAGE(SUBSTITUE(A2;CAR(160);" ")))', 'Nettoyage complet.'],
     ['=SUPPRESPACE("  VIR   SEPA   EDF  ")', 'Exemple.', 'VIR SEPA EDF'],
     ['=NOMPROPRE(SUPPRESPACE(A2))', 'Et en prime : Majuscule À Chaque Mot.']],
    [], 'nettoyer libelle espaces caracteres invisibles import propre');

  R('import', 'Extraire un numéro de facture d’un libellé bancaire',
    'Le libellé contient « … FA-2026-0042 … » : récupérer la référence.',
    [['=TEXTE.AVANT(TEXTE.APRES(A2;"FA-");" ";;;1)', 'Ce qui suit « FA- » jusqu’à l’espace suivant (2024/365).'],
     ['=STXT(A2;CHERCHE("FA-";A2);12)', 'Toutes versions : 12 caractères à partir de « FA- ».'],
     ['=SIERREUR(STXT(A2;CHERCHE("FA-";A2);12);"")', 'Vide si le libellé ne contient pas de référence.']],
    [], 'extraire reference numero facture libelle bancaire virement');

  R('import', 'Compléter un numéro de compte à 8 chiffres',
    'Comptes de longueurs différentes (6071, 401000…) → format uniforme.',
    [['=GAUCHE(A2&REPT("0";8);8)', 'Complète à DROITE avec des zéros (norme des comptes généraux).'],
     ['=GAUCHE("6071"&REPT("0";8);8)', 'Exemple.', '60710000'],
     ['=TEXTE(A2;"00000000")', 'Complète à GAUCHE (codes, matricules).'],
     ['=TEXTE(42;"00000")', 'Exemple.', '00042']],
    [], 'completer zeros compte 8 chiffres longueur fixe format compte matricule');

  R('import', 'Séparer nom et prénom',
    'Découper « Dupont Jean » en deux colonnes.',
    [['=TEXTE.AVANT(A2;" ")', 'Premier mot (2024/365).'],
     ['=TEXTE.APRES(A2;" ")', 'Le reste.'],
     ['=GAUCHE(A2;TROUVE(" ";A2)-1)', 'Toutes versions : premier mot.'],
     ['=STXT(A2;TROUVE(" ";A2)+1;100)', 'Toutes versions : le reste.']],
    ['Sans formule : Ctrl+E (remplissage instantané) après avoir tapé 2 exemples.'],
    'separer nom prenom decouper texte espace colonnes');

  /* ============================= DATES & PÉRIODES ============================= */
  R('periodes', 'Premier et dernier jour du mois',
    'Bornes du mois d’une date (pour les critères de SOMME.SI.ENS).',
    [['=FIN.MOIS(A2;-1)+1', 'Premier jour du mois.'],
     ['=FIN.MOIS(DATE(2026;3;17);-1)+1', 'Exemple.', 'd:2026-03-01'],
     ['=FIN.MOIS(A2;0)', 'Dernier jour du mois.']],
    [], 'premier jour du mois dernier jour du mois debut fin mois bornes');

  R('periodes', 'Trimestre et semestre d’une date',
    'Regrouper par période.',
    [['="T"&ARRONDI.SUP(MOIS(A2)/3;0)', 'Trimestre civil.'],
     ['="T"&ARRONDI.SUP(MOIS(DATE(2026;8;10))/3;0)', 'Exemple.', 'T3'],
     ['="S"&SI(MOIS(A2)<=6;1;2)', 'Semestre.'],
     ['=DATE(ANNEE(A2);(ARRONDI.SUP(MOIS(A2)/3;0)-1)*3+1;1)', 'Premier jour du trimestre.']],
    [], 'trimestre semestre periode t1 t2 t3 t4 regrouper');

  R('periodes', 'Exercice décalé',
    'Exercice qui ne suit pas l’année civile (ex. clôture au 30 juin).',
    [['=ANNEE(A2)+(MOIS(A2)>6)', 'Année de clôture de l’exercice (clôture au 30/06).'],
     ['=ANNEE(DATE(2026;9;1))+(MOIS(DATE(2026;9;1))>6)', 'Une date de septembre 2026 appartient à l’exercice clos en 2027.', 2027],
     ['=DATE(ANNEE(A2)+(MOIS(A2)>6)-1;7;1)', 'Date d’ouverture de l’exercice (1er juillet).'],
     ['=MOD(MOIS(A2)-7;12)+1', 'Rang du mois dans l’exercice (juillet = 1).']],
    [], 'exercice decale cloture 30 juin exercice fiscal annee comptable');

  R('periodes', 'Jours ouvrés du mois (fériés inclus)',
    'Nombre de jours travaillés dans un mois, en excluant les jours fériés listés dans une plage « Fériés ».',
    [['=NB.JOURS.OUVRES(FIN.MOIS(A2;-1)+1;FIN.MOIS(A2;0);Fériés)', 'Jours ouvrés (lundi-vendredi).'],
     ['=NB.JOURS.OUVRES.INTL(FIN.MOIS(A2;-1)+1;FIN.MOIS(A2;0);11;Fériés)', 'Jours ouvrables (lundi-samedi).']],
    [], 'jours ouvres mois jours travailles jours ouvrables feries');

  R('periodes', 'Jours fériés français (dont Pâques)',
    'Calculer les fériés d’une année (A1 = année) pour alimenter la plage « Fériés ».',
    [['=PLANCHER(DATE(A1;5;JOUR(MINUTE(A1/38)/2+56));7)-34', 'Dimanche de Pâques (formule valable de 1900 à 2203).'],
     ['=PLANCHER(DATE(2026;5;JOUR(MINUTE(2026/38)/2+56));7)-34', 'Pâques 2026.', 'd:2026-04-05'],
     ['=B1+1', 'Lundi de Pâques (B1 = date de Pâques).'],
     ['=B1+39', 'Jeudi de l’Ascension.'],
     ['=B1+50', 'Lundi de Pentecôte.'],
     ['=DATE(A1;1;1)', 'Fériés fixes : 1/01, 1/05, 8/05, 14/07, 15/08, 1/11, 11/11, 25/12 (DATE(A1;mois;jour)).']],
    ['Alsace-Moselle : ajoute le Vendredi saint (B1-2) et le 26 décembre.'],
    'jours feries paques ascension pentecote calendrier feries france');

  R('periodes', 'Âge ou ancienneté',
    'Années et mois complets entre deux dates.',
    [['=DATEDIF(A2;AUJOURDHUI();"y")', 'Années complètes.'],
     ['=DATEDIF(A2;AUJOURDHUI();"y")&" ans et "&DATEDIF(A2;AUJOURDHUI();"ym")&" mois"', 'En toutes lettres.'],
     ['=DATEDIF(DATE(2000;5;20);DATE(2026;11;2);"y")', 'Exemple.', 26]],
    [], 'age anciennete annees mois entre deux dates calcul age');

  R('periodes', 'Nombre de mois entre deux dates',
    'Pour un prorata mensuel (loyers, abonnements, amortissement dégressif).',
    [['=DATEDIF(A2;B2;"m")', 'Mois complets.'],
     ['=(ANNEE(B2)-ANNEE(A2))*12+MOIS(B2)-MOIS(A2)+1', 'Mois calendaires, mois de début et de fin inclus.'],
     ['=(ANNEE(DATE(2026;12;31))-ANNEE(DATE(2026;4;10)))*12+MOIS(DATE(2026;12;31))-MOIS(DATE(2026;4;10))+1', 'Avril à décembre inclus.', 9]],
    [], 'nombre de mois entre deux dates prorata mensuel mois inclus');

  R('periodes', 'Charges constatées d’avance (prorata)',
    'Part d’une charge qui concerne l’exercice suivant (assurance, abonnement annuel…).',
    [['=ARRONDI(B2*(D2-C2)/(D2-E2+1);2)', 'B2 = montant, E2 = début de période couverte, D2 = fin, C2 = date de clôture.'],
     ['=ARRONDI(1200*(DATE(2027;3;31)-DATE(2026;12;31))/(DATE(2027;3;31)-DATE(2026;4;1)+1);2)', 'Assurance de 1 200 € du 01/04/2026 au 31/03/2027, clôture au 31/12/2026.', 295.89]],
    ['Variante au mois : montant × mois restants / 12.'],
    'charges constatees avance cca prorata cloture regularisation 486 produits constates');

  /* ======================== PAIE & TEMPS DE TRAVAIL ======================== */
  R('rh', 'Heures travaillées (y compris de nuit)',
    'Durée entre une heure de début et de fin, même si on passe minuit.',
    [['=MOD(C2-B2;1)', 'Durée au format heure (format [h]:mm).'],
     ['=MOD(C2-B2;1)*24', 'En heures décimales.'],
     ['=MOD(TEMPS(6;0;0)-TEMPS(22;0;0);1)*24', 'De 22h à 6h.', 8],
     ['=(MOD(C2-B2;1)-D2)*24', 'Moins une pause (D2 au format heure).']],
    ['Format [h]:mm (avec crochets) pour afficher plus de 24 h dans un total.'],
    'heures travaillees duree horaire pointage nuit minuit pause');

  R('rh', 'Heures supplémentaires de la semaine',
    'Heures au-delà de la durée légale hebdomadaire de 35 h.',
    [['=MAX(0;B9-35)', 'B9 = total d’heures de la semaine (décimal).'],
     ['=MIN(MAX(0;B9-35);8)', 'Première tranche (36e à 43e heure).'],
     ['=MAX(0;B9-43)', 'Seconde tranche (au-delà de la 43e heure).']],
    ['Vérifie les taux de majoration prévus par ta convention collective.'],
    'heures supplementaires 35 heures majoration 25 50 semaine');

  R('rh', 'Convertir heures décimales ⇄ hh:mm',
    '7,5 h ⇄ 7:30.',
    [['=A2/24', 'Décimal → heure (puis format hh:mm).'],
     ['=7,5/24', '7,5 h en fraction de jour.', 0.3125],
     ['=A2*24', 'Heure → décimal.'],
     ['=TEXTE(A2/24;"[h]:mm")', 'Directement en texte « 7:30 ».']],
    [], 'convertir heures decimales minutes centiemes format heure');

  R('rh', 'Prorata d’un salaire en cas d’entrée ou de sortie en cours de mois',
    'Une méthode courante : au prorata des jours ouvrés (vérifie celle de ta convention collective).',
    [['=ARRONDI(B2*NB.JOURS.OUVRES(C2;FIN.MOIS(C2;0);Fériés)/NB.JOURS.OUVRES(FIN.MOIS(C2;-1)+1;FIN.MOIS(C2;0);Fériés);2)', 'B2 = salaire mensuel, C2 = date d’entrée.']],
    ['Autres méthodes possibles : jours calendaires, heures réelles. Choisis celle applicable dans ton entreprise.'],
    'prorata salaire entree sortie mois incomplet paie absence');
})(window.XL);
