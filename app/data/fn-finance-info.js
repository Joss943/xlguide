/* Fonctions : Finance & amortissements, Information, Base de données, Conversion */
(function (XL) {
  'use strict';
  var F = XL.F;

  /* ===================== FINANCE & AMORTISSEMENTS ===================== */
  F('VPM', 'PMT', 'finance', '',
    'Montant de l’échéance constante d’un emprunt (capital + intérêts).',
    'VPM(taux; npm; va; [vc]; [type])',
    [['taux', 'Taux PAR PÉRIODE : taux annuel/12 pour des mensualités.'], ['npm', 'Nombre total d’échéances (années × 12).'],
     ['va', 'Capital emprunté.'], ['vc', 'Valeur résiduelle (0 par défaut).'], ['type', '0 = fin de période (défaut) ; 1 = début (loyers payés d’avance).']],
    [['=ARRONDI(VPM(3%/12;240;-200000);2)', 'Mensualité de 200 000 € sur 20 ans à 3 %.', 1109.2],
     ['=-VPM(B1/12;B2*12;B3)', 'Version avec cellules (taux annuel, années, capital) et signe inversé.']],
    ['Convention de signe : argent reçu positif, argent versé négatif. Mets le capital en négatif (ou un - devant VPM) pour obtenir une mensualité positive.',
     'Taux et nombre de périodes doivent être dans la même unité (mois/mois).'],
    'mensualite emprunt credit pret echeance remboursement calcul mensualite annuite',
    'INTPER PRINCPER TAUX NPM VA CUMUL.INTER');

  F('INTPER', 'IPMT', 'finance', '',
    'Part d’INTÉRÊTS d’une échéance donnée d’un emprunt.',
    'INTPER(taux; pér; npm; va; [vc]; [type])',
    [['taux', 'Taux par période.'], ['pér', 'N° de l’échéance (1 à npm).'], ['npm', 'Nombre d’échéances.'], ['va', 'Capital.'], ['vc', 'Valeur résiduelle.'], ['type', '0 ou 1.']],
    [['=INTPER(3%/12;1;240;-200000)', 'Intérêts de la 1re mensualité.', 500],
     ['=INTPER($B$1/12;A5;$B$2*12;-$B$3)', 'Colonne intérêts d’un tableau d’amortissement (A5 = n° d’échéance).']],
    [], 'interets echeance part interets tableau amortissement emprunt charges financieres 661',
    'PRINCPER VPM CUMUL.INTER');

  F('PRINCPER', 'PPMT', 'finance', '',
    'Part de CAPITAL remboursé dans une échéance donnée.',
    'PRINCPER(taux; pér; npm; va; [vc]; [type])',
    [['taux', 'Taux par période.'], ['pér', 'N° de l’échéance.'], ['npm', 'Nombre d’échéances.'], ['va', 'Capital.'], ['vc', 'Valeur résiduelle.'], ['type', '0 ou 1.']],
    [['=ARRONDI(PRINCPER(3%/12;1;240;-200000);2)', 'Capital remboursé à la 1re mensualité.', 609.2]],
    ['Intérêts + capital = mensualité (VPM) à chaque période.'],
    'capital rembourse amortissement emprunt part capital 164', 'INTPER VPM CUMUL.PRINCPER');

  F('CUMUL.INTER', 'CUMIPMT', 'finance', '',
    'Total des intérêts payés entre deux échéances (ex. intérêts de l’année pour la liasse fiscale).',
    'CUMUL.INTER(taux; npm; va; période_début; période_fin; type)',
    [['taux', 'Taux par période.'], ['npm', 'Nombre d’échéances.'], ['va', 'Capital (POSITIF ici).'], ['période_début', '1re échéance.'], ['période_fin', 'Dernière échéance.'], ['type', 'Obligatoire : 0 ou 1.']],
    [['=ARRONDI(-CUMUL.INTER(3%/12;240;200000;1;12;0);2)', 'Intérêts de la première année.'],
     ['=-CUMUL.INTER(3%/12;240;200000;13;24;0)', 'Intérêts de la 2e année.']],
    ['Résultat négatif (sortie d’argent) : ajoute un - devant.'],
    'interets annuels cumul interets annee total interets emprunt', 'CUMUL.PRINCPER INTPER');

  F('CUMUL.PRINCPER', 'CUMPRINC', 'finance', '',
    'Total du capital remboursé entre deux échéances (variation du compte 164 sur l’année).',
    'CUMUL.PRINCPER(taux; npm; va; période_début; période_fin; type)',
    [['taux', 'Taux par période.'], ['npm', 'Nombre d’échéances.'], ['va', 'Capital (positif).'], ['période_début', 'Début.'], ['période_fin', 'Fin.'], ['type', '0 ou 1.']],
    [['=-CUMUL.PRINCPER(3%/12;240;200000;1;12;0)', 'Capital remboursé la 1re année.']],
    [], 'capital rembourse annee cumul capital restant du', 'CUMUL.INTER PRINCPER');

  F('TAUX', 'RATE', 'finance', '',
    'Retrouve le taux d’un emprunt à partir de la mensualité (taux réel, coût d’un leasing…).',
    'TAUX(npm; vpm; va; [vc]; [type]; [estimation])',
    [['npm', 'Nombre d’échéances.'], ['vpm', 'Échéance (négative).'], ['va', 'Montant reçu.'], ['vc', 'Valeur résiduelle / option d’achat.'], ['type', '0 ou 1.'], ['estimation', 'Point de départ (10 % par défaut).']],
    [['=ARRONDI(TAUX(240;-1109,2;200000)*12;4)', 'Taux annuel nominal retrouvé.', 0.03],
     ['=(1+TAUX(48;-450;20000;-2000;1))^12-1', 'Taux actuariel annuel d’un leasing (loyers d’avance, option d’achat 2 000 €).']],
    ['TAUX renvoie un taux PAR PÉRIODE : ×12 pour le nominal, (1+t)^12-1 pour le taux actuariel.'],
    'taux emprunt retrouver taux taeg taux reel leasing cout credit', 'VPM TRI TAUX.EFFECTIF');

  F('NPM', 'NPER', 'finance', '',
    'Nombre d’échéances nécessaires pour rembourser un emprunt (ou atteindre un objectif d’épargne).',
    'NPM(taux; vpm; va; [vc]; [type])',
    [['taux', 'Taux par période.'], ['vpm', 'Échéance (négative).'], ['va', 'Capital.'], ['vc', 'Objectif final.'], ['type', '0 ou 1.']],
    [['=ARRONDI(NPM(3%/12;-1109,2;200000);0)', 'Nombre de mensualités.', 240]],
    [], 'duree emprunt nombre de mois combien de temps rembourser', 'VPM TAUX');

  F('VA', 'PV', 'finance', '',
    'Valeur actuelle : capital empruntable pour une mensualité donnée, ou valeur aujourd’hui d’une série de paiements.',
    'VA(taux; npm; vpm; [vc]; [type])',
    [['taux', 'Taux par période.'], ['npm', 'Nombre de périodes.'], ['vpm', 'Paiement périodique.'], ['vc', 'Valeur future.'], ['type', '0 ou 1.']],
    [['=ARRONDI(VA(3%/12;240;-1000);0)', 'Capacité d’emprunt avec 1 000 €/mois sur 20 ans à 3 %.', 180311]],
    [], 'capacite emprunt valeur actuelle combien emprunter actualiser', 'VC VPM VAN');

  F('VC', 'FV', 'finance', '',
    'Valeur future d’un placement à versements réguliers.',
    'VC(taux; npm; vpm; [va]; [type])',
    [['taux', 'Taux par période.'], ['npm', 'Nombre de versements.'], ['vpm', 'Versement (négatif).'], ['va', 'Capital initial (négatif).'], ['type', '0 ou 1.']],
    [['=ARRONDI(VC(2%/12;120;-100);0)', '100 €/mois pendant 10 ans à 2 %.', 13272],
     ['=VC(3%;5;0;-10000)', 'Capital de 10 000 € placé 5 ans à 3 % sans versement.']],
    [], 'valeur future epargne placement capitalisation combien j aurai', 'VA VPM VC.PAIEMENTS');

  F('VAN', 'NPV', 'finance', '',
    'Valeur actuelle nette de flux futurs réguliers. Le premier flux est actualisé d’une période.',
    'VAN(taux; valeur1; [valeur2]; …)',
    [['taux', 'Taux d’actualisation par période.'], ['valeur1…', 'Flux de trésorerie (à partir de la période 1).']],
    [['=ARRONDI(VAN(10%;100;100;100);2)', 'Valeur actuelle de 3 flux de 100.', 248.69],
     ['=VAN(8%;C3:C7)+C2', 'VAN d’un investissement : C2 = décaissement initial (négatif) AJOUTÉ hors de VAN.']],
    ['Erreur classique : inclure l’investissement initial dans VAN, ce qui l’actualise à tort.'],
    'van valeur actuelle nette rentabilite investissement actualisation projet', 'TRI VAN.PAIEMENTS VA');

  F('TRI', 'IRR', 'finance', '',
    'Taux de rentabilité interne d’une série de flux réguliers (taux qui annule la VAN).',
    'TRI(valeurs; [estimation])',
    [['valeurs', 'Flux, le 1er négatif (investissement) puis les recettes.'], ['estimation', 'Valeur de départ (10 %).']],
    [['=TRI(C2:C7)', 'Rentabilité d’un projet (C2 = -investissement).']],
    ['Pour des flux à dates irrégulières, utilise TRI.PAIEMENTS.'],
    'tri taux rentabilite interne rendement projet investissement', 'VAN TRI.PAIEMENTS TRIM');

  F('VAN.PAIEMENTS', 'XNPV', 'finance', '',
    'VAN pour des flux à dates irrégulières.',
    'VAN.PAIEMENTS(taux; valeurs; dates)',
    [['taux', 'Taux annuel.'], ['valeurs', 'Flux (le 1er à la date initiale).'], ['dates', 'Dates des flux.']],
    [['=VAN.PAIEMENTS(8%;B2:B8;A2:A8)', 'VAN de flux datés.']],
    [], 'van dates irregulieres actualisation', 'TRI.PAIEMENTS VAN');

  F('TRI.PAIEMENTS', 'XIRR', 'finance', '',
    'TRI annuel pour des flux à dates irrégulières (rendement réel d’un placement avec versements ponctuels).',
    'TRI.PAIEMENTS(valeurs; dates; [estimation])',
    [['valeurs', 'Flux.'], ['dates', 'Dates correspondantes.'], ['estimation', 'Départ.']],
    [['=TRI.PAIEMENTS(B2:B8;A2:A8)', 'Rendement annualisé.']],
    [], 'tri dates irregulieres rendement reel', 'VAN.PAIEMENTS TRI');

  F('TRIM', 'MIRR', 'finance', '',
    'TRI modifié : tient compte du coût de financement et du taux de réinvestissement.',
    'TRIM(valeurs; taux_emprunt; taux_placement)',
    [['valeurs', 'Flux.'], ['taux_emprunt', 'Coût des fonds.'], ['taux_placement', 'Taux de réinvestissement.']],
    [['=TRIM(C2:C7;5%;3%)', 'TRI modifié.']],
    [], 'tri modifie reinvestissement', 'TRI');

  F('TAUX.EFFECTIF', 'EFFECT', 'finance', '',
    'Convertit un taux nominal en taux effectif annuel (actuariel).',
    'TAUX.EFFECTIF(taux_nominal; nb_périodes)',
    [['taux_nominal', 'Taux annuel nominal.'], ['nb_périodes', 'Capitalisations par an (12 = mensuel).']],
    [['=ARRONDI(TAUX.EFFECTIF(3%;12);6)', '3 % nominal capitalisé mensuellement.', 0.030416]],
    [], 'taux effectif actuariel nominal conversion', 'TAUX.NOMINAL TAUX');

  F('TAUX.NOMINAL', 'NOMINAL', 'finance', '',
    'Convertit un taux effectif annuel en taux nominal.',
    'TAUX.NOMINAL(taux_effectif; nb_périodes)',
    [['taux_effectif', 'Taux effectif.'], ['nb_périodes', 'Périodes par an.']],
    [['=ARRONDI(TAUX.NOMINAL(5%;12);6)', 'Nominal équivalent à 5 % effectif.', 0.048889]],
    [], 'taux nominal conversion', 'TAUX.EFFECTIF');

  F('TAUX.INT.EQUIV', 'RRI', 'finance', '2013',
    'Taux de croissance annuel moyen (TCAM / CAGR) entre une valeur de départ et d’arrivée.',
    'TAUX.INT.EQUIV(npm; va; vc)',
    [['npm', 'Nombre de périodes.'], ['va', 'Valeur de départ.'], ['vc', 'Valeur d’arrivée.']],
    [['=ARRONDI(TAUX.INT.EQUIV(5;100;150);4)', 'CA passé de 100 à 150 en 5 ans.', 0.0845]],
    [], 'tcam cagr croissance annuelle moyenne evolution moyenne', 'MOYENNE.GEOMETRIQUE PDUREE');

  F('PDUREE', 'PDURATION', 'finance', '2013',
    'Nombre de périodes pour qu’un placement atteigne une valeur cible.',
    'PDUREE(taux; va; vc)',
    [['taux', 'Taux par période.'], ['va', 'Valeur actuelle.'], ['vc', 'Valeur visée.']],
    [['=ARRONDI(PDUREE(5%;1000;2000);2)', 'Années pour doubler à 5 %.', 14.21]],
    [], 'duree doubler capital combien de temps', 'TAUX.INT.EQUIV NPM');

  F('AMORLIN', 'SLN', 'finance', '',
    'Annuité d’amortissement LINÉAIRE (constante) sur une année pleine.',
    'AMORLIN(coût; valeur_rés; durée)',
    [['coût', 'Valeur d’origine HT.'], ['valeur_rés', 'Valeur résiduelle (souvent 0).'], ['durée', 'Durée d’utilisation en années.']],
    [['=AMORLIN(10000;1000;5)', 'Annuité linéaire.', 1800]],
    ['Pas de prorata temporis : pour la 1re année, multiplie par jours/360 (voir la recette « Amortissement linéaire avec prorata ») ou utilise AMORLINC.'],
    'amortissement lineaire annuite dotation immobilisation 681 28', 'AMORLINC AMORDEGRC DDB');

  F('AMORLINC', 'AMORLINC', 'finance', '',
    'Amortissement linéaire avec prorata temporis la première année (fonction issue du système comptable français).',
    'AMORLINC(coût; date_achat; première_pér; val_résiduelle; période; taux; [base])',
    [['coût', 'Valeur d’origine.'], ['date_achat', 'Date d’acquisition / mise en service.'], ['première_pér', 'Date de fin de la 1re période (clôture).'],
     ['val_résiduelle', 'Valeur résiduelle.'], ['période', 'N° de période : 0 = 1re année (prorata), 1 = 2e…'], ['taux', 'Taux d’amortissement (1/durée).'], ['base', '0 = 360 jours (défaut), 1 = réel, 3 = 365, 4 = 360 européen.']],
    [['=AMORLINC(10000;DATE(2026;4;1);DATE(2026;12;31);0;0;20%;4)', 'Dotation 2026 d’un bien acquis le 1er avril, sur 5 ans.'],
     ['=AMORLINC(10000;DATE(2026;4;1);DATE(2026;12;31);0;1;20%;4)', 'Dotation pleine de 2027.']],
    ['Vérifie toujours le total de ton plan : la somme des dotations doit égaler la base amortissable.'],
    'amortissement lineaire prorata temporis premiere annee plan amortissement', 'AMORLIN AMORDEGRC JOURS360');

  F('AMORDEGRC', 'AMORDEGRC', 'finance', '',
    'Amortissement dégressif avec prorata (fonction issue du système comptable français).',
    'AMORDEGRC(coût; date_achat; première_pér; val_résiduelle; période; taux; [base])',
    [['coût', 'Valeur d’origine.'], ['date_achat', 'Date d’acquisition.'], ['première_pér', 'Fin de la 1re période.'], ['val_résiduelle', 'Valeur résiduelle.'],
     ['période', 'N° de période (0 = 1re).'], ['taux', 'Taux linéaire (1/durée).'], ['base', 'Base de jours.']],
    [['=AMORDEGRC(10000;DATE(2026;1;1);DATE(2026;12;31);0;0;20%;0)', 'Dotation dégressive de la 1re année.']],
    ['⚠️ Les coefficients intégrés à AMORDEGRC (1,5 / 2 / 2,5) ne correspondent PAS aux coefficients fiscaux français en vigueur (1,25 / 1,75 / 2,25). Pour un plan fiscal, calcule-le toi-même (voir la recette « Amortissement dégressif fiscal »).'],
    'amortissement degressif fiscal coefficient immobilisation', 'AMORLINC DDB DB');

  F('DB', 'DB', 'finance', '',
    'Amortissement dégressif à taux fixe pour une période.',
    'DB(coût; valeur_rés; durée; période; [mois])',
    [['coût', 'Coût.'], ['valeur_rés', 'Valeur résiduelle.'], ['durée', 'Durée.'], ['période', 'Période calculée.'], ['mois', 'Mois de la 1re année (12 par défaut).']],
    [['=DB(10000;1000;5;1)', 'Dotation de la 1re année.', 3690]],
    [], 'degressif taux fixe', 'DDB VDB');

  F('DDB', 'DDB', 'finance', '',
    'Amortissement dégressif à double taux (ou facteur au choix).',
    'DDB(coût; valeur_rés; durée; période; [facteur])',
    [['coût', 'Coût.'], ['valeur_rés', 'Valeur résiduelle.'], ['durée', 'Durée.'], ['période', 'Période.'], ['facteur', '2 par défaut.']],
    [['=DDB(10000;0;5;1)', 'Dotation de la 1re année (2/5 du coût).', 4000],
     ['=DDB(10000;0;5;1;1,75)', 'Avec un coefficient de 1,75.', 3500]],
    ['DDB ne bascule pas automatiquement en linéaire : VDB le fait.'],
    'degressif double coefficient', 'VDB DB AMORDEGRC');

  F('VDB', 'VDB', 'finance', '',
    'Amortissement dégressif sur une période quelconque, avec bascule automatique en linéaire quand c’est plus favorable.',
    'VDB(coût; valeur_rés; durée; période_début; période_fin; [facteur]; [valeur_log])',
    [['coût', 'Coût.'], ['valeur_rés', 'Valeur résiduelle.'], ['durée', 'Durée.'], ['période_début', 'Début.'], ['période_fin', 'Fin.'], ['facteur', '2 par défaut (1,75 pour le coefficient fiscal 5-6 ans).'], ['valeur_log', 'FAUX = bascule en linéaire (défaut).']],
    [['=VDB(10000;0;5;0;1;1,75)', '1re année avec coefficient 1,75.', 3500],
     ['=VDB(10000;0;5;1;2;1,75)', '2e année.', 2275]],
    ['Avec facteur = coefficient fiscal, VDB reproduit le dégressif fiscal français en années pleines (le prorata en mois de la 1re année reste à gérer).'],
    'degressif bascule lineaire coefficient fiscal plan', 'DDB AMORDEGRC');

  F('SYD', 'SYD', 'finance', '',
    'Amortissement « somme des chiffres des années » (dégressif proportionnel).',
    'SYD(coût; valeur_rés; durée; période)',
    [['coût', 'Coût.'], ['valeur_rés', 'Valeur résiduelle.'], ['durée', 'Durée.'], ['période', 'Période.']],
    [['=ARRONDI(SYD(10000;0;5;1);2)', '1re année : 5/15 du coût.', 3333.33]],
    [], 'somme des annees amortissement', 'DDB');

  F('VC.PAIEMENTS', 'FVSCHEDULE', 'finance', '',
    'Valeur future d’un capital avec des taux qui changent chaque période.',
    'VC.PAIEMENTS(va; taux)',
    [['va', 'Capital initial.'], ['taux', 'Plage des taux successifs.']],
    [['=VC.PAIEMENTS(10000;B2:B6)', 'Capital après 5 ans de taux variables.']],
    [], 'taux variables capitalisation', 'VC');

  /* ======================== INFORMATION & ERREURS ====================== */
  F('ESTVIDE', 'ISBLANK', 'info', '',
    'VRAI si la cellule est vraiment vide.',
    'ESTVIDE(valeur)', [['valeur', 'Cellule.']],
    [['=SI(ESTVIDE(E2);"Non réglé";"Réglé le "&TEXTE(E2;"jj/mm/aaaa"))', 'Statut de règlement.']],
    ['Une cellule contenant "" (formule) n’est PAS vide pour ESTVIDE : teste plutôt E2="".'],
    'vide cellule vide tester vide', 'NB.VIDE ESTNUM');

  F('ESTNUM', 'ISNUMBER', 'info', '',
    'VRAI si la valeur est un nombre (ou une date). Très utilisé avec CHERCHE/EQUIV pour tester une présence.',
    'ESTNUM(valeur)', [['valeur', 'Valeur à tester.']],
    [['=ESTNUM(42)', 'Nombre.', true], ['=ESTNUM("42")', 'Texte qui ressemble à un nombre.', false],
     ['=ESTNUM(CHERCHE("EDF";C2))', 'Le libellé contient « EDF ».']],
    [], 'est un nombre numerique tester nombre contient existe', 'ESTTEXTE CHERCHE');

  F('ESTTEXTE', 'ISTEXT', 'info', '',
    'VRAI si la valeur est du texte. Débusque les montants importés en texte.',
    'ESTTEXTE(valeur)', [['valeur', 'Valeur.']],
    [['=ESTTEXTE("abc")', 'Texte.', true], ['=ESTTEXTE(D2)', 'Montant stocké en texte (ne s’additionne pas).']],
    [], 'est du texte nombre stocke en texte', 'ESTNUM CNUM');

  F('ESTERREUR', 'ISERROR', 'info', '',
    'VRAI si la valeur est n’importe quelle erreur.',
    'ESTERREUR(valeur)', [['valeur', 'Valeur ou formule.']],
    [['=ESTERREUR(1/0)', 'Division par zéro.', true]],
    [], 'erreur tester erreur', 'SIERREUR ESTNA ESTERR');

  F('ESTERR', 'ISERR', 'info', '',
    'VRAI pour toute erreur SAUF #N/A.',
    'ESTERR(valeur)', [['valeur', 'Valeur.']],
    [['=ESTERR(NA())', '#N/A n’est pas compté.', false]],
    [], 'erreur sauf na', 'ESTERREUR ESTNA');

  F('ESTNA', 'ISNA', 'info', '',
    'VRAI uniquement pour l’erreur #N/A (valeur introuvable).',
    'ESTNA(valeur)', [['valeur', 'Valeur.']],
    [['=ESTNA(NA())', '#N/A.', true], ['=SI(ESTNA(EQUIV(A2;Banque!C:C;0));"Non pointé";"Pointé")', 'Pointage bancaire.']],
    [], 'na introuvable absent pointage', 'SI.NON.DISP ESTERREUR');

  F('ESTLOGIQUE', 'ISLOGICAL', 'info', '',
    'VRAI si la valeur est VRAI ou FAUX.',
    'ESTLOGIQUE(valeur)', [['valeur', 'Valeur.']],
    [['=ESTLOGIQUE(VRAI)', 'Booléen.', true]],
    [], 'booleen vrai faux logique', 'ESTNUM');

  F('ESTFORMULE', 'ISFORMULA', 'info', '2013',
    'VRAI si la cellule contient une formule. Utile en mise en forme conditionnelle pour repérer les valeurs saisies en dur.',
    'ESTFORMULE(référence)', [['référence', 'Cellule.']],
    [['=NON(ESTFORMULE(D2))', 'Repère les montants tapés à la main dans une colonne censée être calculée.']],
    [], 'formule detecter valeur en dur audit', 'FORMULETEXTE');

  F('EST.PAIR', 'ISEVEN', 'info', '',
    'VRAI si le nombre est pair.',
    'EST.PAIR(nombre)', [['nombre', 'Valeur.']],
    [['=EST.PAIR(4)', 'Pair.', true]],
    [], 'pair nombre pair tester parite', 'EST.IMPAIR MOD');

  F('EST.IMPAIR', 'ISODD', 'info', '',
    'VRAI si le nombre est impair.',
    'EST.IMPAIR(nombre)', [['nombre', 'Valeur.']],
    [['=EST.IMPAIR(7)', 'Impair.', true]],
    [], 'impair nombre impair tester parite', 'EST.PAIR MOD');

  F('TYPE.ERREUR', 'ERROR.TYPE', 'info', '',
    'Numéro du type d’erreur (1 #NUL!, 2 #DIV/0!, 3 #VALEUR!, 4 #REF!, 5 #NOM?, 6 #NOMBRE!, 7 #N/A).',
    'TYPE.ERREUR(valeur_erreur)', [['valeur_erreur', 'Formule en erreur.']],
    [['=TYPE.ERREUR(1/0)', '#DIV/0! = 2.', 2]],
    [], 'type erreur numero erreur', 'ESTERREUR SIERREUR');

  F('NA', 'NA', 'info', '',
    'Renvoie volontairement l’erreur #N/A (ex. pour qu’un graphique ignore un point).',
    'NA()', [],
    [['=SI(B2=0;NA();B2)', 'Les zéros ne sont pas tracés dans un graphique en courbe.']],
    [], 'na erreur volontaire graphique', 'ESTNA');

  F('N', 'N', 'info', '',
    'Convertit une valeur en nombre : texte → 0, VRAI → 1, date → n° de série.',
    'N(valeur)', [['valeur', 'Valeur.']],
    [['=N("abc")', 'Texte → 0.', 0], ['=N(C2)-N(D2)', 'Crédit - débit même si une cellule contient du texte.']],
    [], 'convertir nombre zero texte', 'CNUM');

  F('CELLULE', 'CELL', 'info', '',
    'Informations sur une cellule : format, adresse, nom du fichier…',
    'CELLULE(type_info; [référence])',
    [['type_info', '"nomfichier", "adresse", "format", "contenu", "ligne", "col"…'], ['référence', 'Cellule.']],
    [['=CELLULE("nomfichier";A1)', 'Chemin + nom du classeur + nom de la feuille (classeur enregistré).'],
     ['=TEXTE.APRES(CELLULE("nomfichier";A1);"]")', 'Nom de la feuille courante.']],
    [], 'nom feuille nom fichier chemin information cellule', 'FEUILLE');

  F('FEUILLE', 'SHEET', 'info', '2013',
    'Numéro de la feuille.',
    'FEUILLE([valeur])', [['valeur', 'Référence ou nom de feuille.']],
    [['=FEUILLE()', 'Numéro de la feuille courante.']],
    [], 'numero feuille onglet', 'CELLULE');

  /* =========================== BASE DE DONNÉES ========================= */
  var bdArgs = [['base_de_données', 'Plage avec en-têtes.'], ['champ', 'En-tête de la colonne à calculer ("Montant") ou son n°.'],
    ['critères', 'Petite plage : en-têtes + conditions dessous (même ligne = ET, lignes différentes = OU).']];

  F('BDSOMME', 'DSUM', 'bdd', '',
    'Somme d’une colonne selon une zone de critères (pratique pour des critères OU complexes et modifiables à l’écran).',
    'BDSOMME(base_de_données; champ; critères)', bdArgs,
    [['=BDSOMME(A1:F500;"Montant";H1:I3)', 'Somme selon les critères saisis en H1:I3.']],
    ['La zone de critères accepte >1000, *texte*, et des formules.'],
    'somme base de donnees criteres zone criteres', 'SOMME.SI.ENS BDNB');

  F('BDMOYENNE', 'DAVERAGE', 'bdd', '', 'Moyenne d’une colonne selon une zone de critères.',
    'BDMOYENNE(base_de_données; champ; critères)', bdArgs,
    [['=BDMOYENNE(A1:F500;"Délai";H1:H2)', 'Délai moyen pour les critères choisis.']], [],
    'moyenne base de donnees', 'BDSOMME');

  F('BDNB', 'DCOUNT', 'bdd', '', 'Compte les cellules NUMÉRIQUES d’une colonne selon une zone de critères.',
    'BDNB(base_de_données; champ; critères)', bdArgs,
    [['=BDNB(A1:F500;"Montant";H1:I2)', 'Nombre de montants correspondant.']], [],
    'compter base de donnees', 'BDNBVAL NB.SI.ENS');

  F('BDNBVAL', 'DCOUNTA', 'bdd', '', 'Compte les cellules NON VIDES d’une colonne selon une zone de critères.',
    'BDNBVAL(base_de_données; champ; critères)', bdArgs,
    [['=BDNBVAL(A1:F500;"Client";H1:I2)', 'Nombre de lignes correspondantes.']], [],
    'compter non vides base', 'BDNB');

  F('BDMAX', 'DMAX', 'bdd', '', 'Valeur maximale d’une colonne selon une zone de critères.',
    'BDMAX(base_de_données; champ; critères)', bdArgs,
    [['=BDMAX(A1:F500;"Montant";H1:H2)', 'Plus grosse facture correspondante.']], [],
    'maximum base', 'BDMIN MAX.SI.ENS');

  F('BDMIN', 'DMIN', 'bdd', '', 'Valeur minimale d’une colonne selon une zone de critères.',
    'BDMIN(base_de_données; champ; critères)', bdArgs,
    [['=BDMIN(A1:F500;"Date";H1:H2)', 'Plus ancienne date correspondante.']], [],
    'minimum base', 'BDMAX MIN.SI.ENS');

  F('BDLIRE', 'DGET', 'bdd', '', 'Extrait LA valeur unique qui répond aux critères (erreur s’il y en a 0 ou plusieurs).',
    'BDLIRE(base_de_données; champ; critères)', bdArgs,
    [['=BDLIRE(A1:F500;"Libellé";H1:I2)', 'Libellé de l’écriture unique répondant aux critères.']],
    ['#NOMBRE! = plusieurs résultats ; #VALEUR! = aucun.'],
    'extraire valeur unique base', 'RECHERCHEX');

  /* ======================= CONVERSION & INGÉNIERIE ===================== */
  F('CONVERT', 'CONVERT', 'conv', '',
    'Convertit entre unités de mesure (distance, poids, température, temps…).',
    'CONVERT(nombre; de_unité; à_unité)',
    [['nombre', 'Valeur.'], ['de_unité', 'Unité source ("mi", "km", "lbm", "kg", "C", "F", "hr", "mn"…).'], ['à_unité', 'Unité cible.']],
    [['=CONVERT(1;"mi";"km")', '1 mile en km.', 1.609344], ['=CONVERT(90;"mn";"hr")', '90 minutes en heures.', 1.5]],
    ['Les codes d’unités sont sensibles à la casse.'],
    'convertir unites distance poids temperature kilometre mile', 'TEMPS');

  F('DECHEX', 'DEC2HEX', 'conv', '',
    'Décimal → hexadécimal.',
    'DECHEX(nombre; [nb_car])', [['nombre', 'Entier.'], ['nb_car', 'Longueur minimale (zéros devant).']],
    [['=DECHEX(255)', '255 en hexa.', 'FF'], ['=DECHEX(10;4)', 'Sur 4 caractères.', '000A']],
    [], 'hexadecimal hexa convertir base 16', 'HEXDEC BASE');

  F('HEXDEC', 'HEX2DEC', 'conv', '',
    'Hexadécimal → décimal.',
    'HEXDEC(nombre)', [['nombre', 'Texte hexadécimal.']],
    [['=HEXDEC("FF")', 'FF en décimal.', 255]],
    [], 'hexadecimal vers decimal', 'DECHEX DECIMAL');

  F('DECBIN', 'DEC2BIN', 'conv', '',
    'Décimal → binaire (de -512 à 511).',
    'DECBIN(nombre; [nb_car])', [['nombre', 'Entier.'], ['nb_car', 'Longueur minimale.']],
    [['=DECBIN(10)', '10 en binaire.', '1010']],
    [], 'binaire convertir base 2', 'BINDEC BASE');

  F('BINDEC', 'BIN2DEC', 'conv', '',
    'Binaire → décimal.',
    'BINDEC(nombre)', [['nombre', 'Texte binaire (10 bits max).']],
    [['=BINDEC("1010")', 'Binaire vers décimal.', 10]],
    [], 'binaire vers decimal', 'DECBIN DECIMAL');

  F('BASE', 'BASE', 'conv', '2013',
    'Convertit un nombre dans n’importe quelle base (2 à 36).',
    'BASE(nombre; base; [longueur_min])', [['nombre', 'Entier positif.'], ['base', '2 à 36.'], ['longueur_min', 'Zéros devant.']],
    [['=BASE(255;16)', 'Base 16.', 'FF'], ['=BASE(5;2;8)', 'Binaire sur 8 bits.', '00000101']],
    [], 'base conversion binaire hexa', 'DECIMAL DECHEX');

  F('DECIMAL', 'DECIMAL', 'conv', '2013',
    'Convertit un texte écrit dans une base (2 à 36) en nombre décimal.',
    'DECIMAL(texte; base)', [['texte', 'Nombre écrit dans la base.'], ['base', '2 à 36.']],
    [['=DECIMAL("FF";16)', 'Hexa → décimal.', 255]],
    [], 'base vers decimal conversion', 'BASE HEXDEC');
})(window.XL);
