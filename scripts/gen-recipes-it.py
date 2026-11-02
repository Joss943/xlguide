# Génère app/data/recipes-it.js (les longues formules sont construites ici pour éviter les erreurs de parenthèses)
pairs=[("é","e"),("è","e"),("ê","e"),("ë","e"),("à","a"),("â","a"),("ä","a"),("î","i"),("ï","i"),("ô","o"),("ö","o"),("ù","u"),("û","u"),("ü","u"),("ç","c"),("œ","oe")]
def sans(x):
    f="MINUSCULE(%s)"%x
    for a,b in pairs: f='SUBSTITUE(%s;"%s";"%s")'%(f,a,b)
    return f
def octet(x,n):  # n = 1..4
    return 'SUPPRESPACE(STXT(SUBSTITUE(%s;".";REPT(" ";100));%d;100))'%(x,(n-1)*100+1)
def ipnum(x):
    return '%s*16777216+%s*65536+%s*256+%s'%(octet(x,1),octet(x,2),octet(x,3),octet(x,4))
def numip(x):
    return 'ENT(%s/16777216)&"."&MOD(ENT(%s/65536);256)&"."&MOD(ENT(%s/256);256)&"."&MOD(%s;256)'%(x,x,x,x)
def mask(p):
    return '&"."&'.join('256-2^(8-MIN(8;MAX(0;%s)))'%(p if k==0 else '%s-%d'%(p,8*k)) for k in range(4))
def nunits(o):
    return '+'.join('(%s>=1024%s)'%(o,'' if k==1 else '^%d'%k) for k in range(1,6))
LOG='Failed password for root from 203.0.113.5 port 22 ssh2'
LOGQ='"%s"'%LOG
DN='"CN=Dupont Jean,OU=Compta,DC=corp,DC=local"'
LINE='"2026-11-02 14:03:11 ERROR sshd: Failed password"'

def js(s):  # chaîne JS entre apostrophes
    return "'"+s.replace("\\","\\\\").replace("'","\\'")+"'"

R=[]
def r(cat,title,desc,steps,tips,kw): R.append((cat,title,desc,steps,tips,kw))

# ------------------------------------------------------------- COMPARAISON
r('comparaison','Comptes orphelins : présents dans l’AD, absents de la liste RH',
  'Comparer l’export des comptes (Active Directory, Entra ID, messagerie…) à la liste des salariés pour trouver les comptes sans propriétaire.',
  [('=SI(ESTNA(EQUIV(A2;RH!$A$2:$A$5000;0));"⚠ Absent RH";"OK")','Dans la feuille AD : A2 = identifiant, comparé à la colonne des identifiants RH.'),
   ('=FILTRE(AD[Login];ESTNA(EQUIV(AD[Login];RH[Login];0));"Aucun orphelin")','Liste directe de tous les comptes orphelins (Excel 2021+).'),
   ('=SOMMEPROD((AD[Login]<>"")*ESTNA(EQUIV(AD[Login];RH[Login];0)))','Nombre de comptes orphelins.')],
  ['Compare toujours sur une clé normalisée (voir « Normaliser les valeurs avant de comparer ») : un espace ou une majuscule suffit à créer un faux orphelin.',
   'Exclus les comptes de service et techniques (préfixe svc_, adm_…) avec une condition supplémentaire : *(GAUCHE(AD[Login];4)<>"svc_").'],
  'comparer deux listes comptes orphelins active directory ad rh absents manquants difference entre deux bases utilisateurs')
r('comparaison','Salariés sans compte (présents RH, absents de l’annuaire)',
  'L’inverse : qui est arrivé chez RH mais n’a pas encore de compte informatique ?',
  [('=SI(ESTNA(EQUIV(A2;AD!$A$2:$A$5000;0));"⚠ Pas de compte";"OK")','Dans la feuille RH.'),
   ('=FILTRE(RH[[Nom]:[Login]];ESTNA(EQUIV(RH[Login];AD[Login];0));"Tout le monde a un compte")','Liste des arrivées à traiter (2021+).')],
  [], 'salaries sans compte arrivees onboarding comparer liste rh annuaire manquant')
r('comparaison','Rapprocher deux listes : dans les deux, seulement A, seulement B',
  'Synthèse complète d’un rapprochement entre deux bases (utilisateurs, postes, licences…).',
  [('=SI(ESTNUM(EQUIV(A2;ListeB;0));"Dans les deux";"Seulement A")','Statut de chaque ligne de la liste A.'),
   ('=SOMMEPROD((ListeA<>"")*ESTNUM(EQUIV(ListeA;ListeB;0)))','Nombre d’éléments communs.'),
   ('=SOMMEPROD((ListeA<>"")*ESTNA(EQUIV(ListeA;ListeB;0)))','Nombre d’éléments seulement dans A.'),
   ('=SOMMEPROD((ListeB<>"")*ESTNA(EQUIV(ListeB;ListeA;0)))','Nombre d’éléments seulement dans B.'),
   ('=FILTRE(ListeA;ESTNUM(EQUIV(ListeA;ListeB;0));"Aucun")','Intersection : éléments présents dans les deux (2021+).'),
   ('=UNIQUE(FILTRE(ASSEMB.V(ListeA;ListeB);ASSEMB.V(ListeA;ListeB)<>""))','Union sans doublon des deux listes (2024/365).')],
  ['ListeA / ListeB : colonnes de même nature (plages nommées ou colonnes de tableaux).'],
  'rapprochement deux listes intersection union difference communs seulement dans a b comparer bases synthese')
r('comparaison','Comparer les champs d’un même utilisateur entre deux bases',
  'L’utilisateur existe des deux côtés, mais son service, son manager ou son e-mail diffèrent-ils ?',
  [('=SI(RECHERCHEX($A2;RH[Login];RH[Service];"∅")=C2;"=";"≠ RH : "&RECHERCHEX($A2;RH[Login];RH[Service];"∅"))','Un champ : « = » si identique, sinon la valeur côté RH.'),
   ('=SOMMEPROD(--(B2:E2<>INDEX(RH!$B$2:$E$5000;EQUIV(A2;RH!$A$2:$A$5000;0);0)))','Nombre de champs différents sur la ligne (colonnes B:E dans le même ordre des deux côtés).'),
   ('=JOINDRE.TEXTE(", ";VRAI;FILTRE($B$1:$E$1;B2:E2<>INDEX(RH!$B$2:$E$5000;EQUIV(A2;RH!$A$2:$A$5000;0);0);""))','Liste des colonnes qui diffèrent (ex. « Service, Manager »).')],
  ['INDEX(plage;ligne;0) renvoie la ligne entière : c’est ce qui permet de comparer toute la ligne d’un coup.',
   'Le signe = n’est pas sensible à la casse ("DUPONT"="dupont" est VRAI). Pour une comparaison stricte, utilise EXACT.'],
  'comparer champs differences valeurs differentes service manager email ecart attributs synchronisation')
r('comparaison','Clé de rapprochement composite (nom + prénom, fabricant + n° de série)',
  'Quand il n’existe pas d’identifiant commun, on fabrique une clé à partir de plusieurs colonnes.',
  [('=MAJUSCULE(SUPPRESPACE(A2))&"|"&MAJUSCULE(SUPPRESPACE(B2))','Clé texte « NOM|PRÉNOM » à créer dans les deux bases, puis à comparer.'),
   ('=RECHERCHEX(1;(RH[Nom]=A2)*(RH[Prénom]=B2);RH[Matricule];"Introuvable")','Recherche directe sur deux critères sans colonne de clé (2021+).'),
   ('=INDEX(RH!$C$2:$C$5000;EQUIV(1;INDEX((RH!$A$2:$A$5000=A2)*(RH!$B$2:$B$5000=B2);0);0))','Même chose compatible toutes versions (le INDEX(…;0) évite Ctrl+Maj+Entrée).')],
  ['Le séparateur « | » évite les fausses correspondances (« AB »+« C » et « A »+« BC »).'],
  'cle composite plusieurs criteres rapprochement nom prenom serie fabricant recherche deux criteres')
r('comparaison','Normaliser les valeurs avant de comparer',
  'Casse, espaces invisibles, accents, séparateurs : la cause n°1 des faux écarts entre deux bases.',
  [('=MAJUSCULE(SUPPRESPACE(SUBSTITUE(A2;CAR(160);" ")))','Texte : majuscules, espaces superflus et insécables supprimés.'),
   ('=MAJUSCULE(SUPPRESPACE(SUBSTITUE("  dupont"&CAR(160)&"jean ";CAR(160);" ")))','Exemple.','DUPONT JEAN'),
   ('='+sans('A2'),'Supprime les accents français (é → e, ç → c, œ → oe…) : toutes versions.'),
   ('=SUBSTITUE(SUBSTITUE(MAJUSCULE(A2);"-";"");" ";"")','N° de série ou MAC : sans tirets ni espaces.'),
   ('=--A2','Matricule « 000123 » en texte d’un côté, 123 en nombre de l’autre : convertir en nombre des deux côtés.'),
   ('="ABC"="abc"','Le signe = ignore la casse.',True)],
  ['Crée une colonne « clé normalisée » dans CHAQUE base plutôt que de normaliser dans la formule de recherche : plus lisible et plus rapide.'],
  'normaliser nettoyer cle comparaison accents casse espaces majuscules faux ecarts')
r('comparaison','Inventaire physique ↔ CMDB (GLPI, Intune, SCCM…)',
  'Rapprocher les numéros de série scannés lors d’un inventaire avec la base de gestion de parc.',
  [('=SI(ESTNUM(EQUIV(A2;Scan[Série];0));"✓ Vu à l’inventaire";"⚠ Non retrouvé")','Dans la CMDB : matériel non vu (perte, vol, prêt, mauvaise saisie ?).'),
   ('=SI(ESTNUM(EQUIV(A2;CMDB[Série];0));"✓ Référencé";"⚠ Non référencé")','Dans le scan : matériel présent mais absent de la CMDB (à ajouter).'),
   ('=SOMMEPROD(--ESTNUM(EQUIV(Scan[Série];CMDB[Série];0)))/NBVAL(CMDB[Série])','Taux de couverture de l’inventaire.')],
  ['Les n° de série doivent être stockés en TEXTE des deux côtés (sinon les zéros de tête et les longs n° numériques sont altérés).'],
  'inventaire physique cmdb glpi intune sccm numero de serie scan parc materiel rapprochement')
r('comparaison','Matériel encore affecté à des utilisateurs partis',
  'Postes, téléphones, badges à récupérer : croiser le parc avec les sorties RH.',
  [('=SI(ESTNUM(EQUIV(C2;Départs[Login];0));"⚠ À récupérer";"")','C2 = utilisateur affecté au matériel, liste des départs.'),
   ('=LET(d;RECHERCHEX(C2;RH[Login];RH[DateSortie];"");SI(ET(ESTNUM(d);d>0;d<AUJOURDHUI());"⚠ Parti le "&TEXTE(d;"jj/mm/aaaa");""))','Avec la date de sortie RH (les dates vides ne déclenchent pas d’alerte).')],
  ['Une cellule de date vide renvoyée par RECHERCHEX vaut 0 : d’où le test d>0, sinon tous les présents seraient signalés.'],
  'materiel utilisateur parti depart restitution recuperer poste ordinateur offboarding')
r('comparaison','Comptes encore actifs d’utilisateurs sortis (à désactiver)',
  'Contrôle de sécurité classique : compte activé dans l’annuaire alors que la personne a quitté l’entreprise.',
  [('=LET(d;RECHERCHEX([@Login];RH[Login];RH[DateSortie];"");SI(ET([@Activé]="True";ESTNUM(d);d>0;d<AUJOURDHUI());"⚠ Désactiver";""))','Dans le tableau AD (export PowerShell : Enabled = "True"/"False" en texte).'),
   ('=SI(ET(D2="True";ESTNUM(EQUIV(A2;Départs!$A$2:$A$500;0)));"⚠ Désactiver";"")','Version toutes versions avec une simple liste de départs.')],
  ['Dans un export CSV, Enabled est souvent du texte "True" : si la colonne contient de vrais booléens, compare à VRAI.'],
  'comptes actifs utilisateurs sortis desactiver securite revue des acces audit offboarding')
r('comparaison','Détecter ajouts, suppressions et modifications entre deux exports',
  'Comparer l’export d’hier et celui d’aujourd’hui (annuaire, parc, licences) grâce à une empreinte de ligne.',
  [('=JOINDRE.TEXTE("|";FAUX;B2:F2)','Empreinte de la ligne (colonne G, dans les DEUX feuilles).'),
   ('=SI(ESTNA(EQUIV(A2;Hier!$A$2:$A$5000;0));"Ajouté";SI(G2=INDEX(Hier!$G$2:$G$5000;EQUIV(A2;Hier!$A$2:$A$5000;0));"Inchangé";"Modifié"))','Dans la feuille du jour.'),
   ('=SI(ESTNA(EQUIV(A2;Auj!$A$2:$A$5000;0));"Supprimé";"")','Dans la feuille de la veille.')],
  ['Avant Excel 2019, remplace JOINDRE.TEXTE par B2&"|"&C2&"|"&D2…'],
  'differences entre deux exports ajouts suppressions modifications delta changements veille jour empreinte')
r('comparaison','Surligner les différences entre deux feuilles identiques',
  'Deux extractions de même structure : colorer chaque cellule qui change.',
  [('=A2<>Feuil2!A2','Règle de mise en forme conditionnelle appliquée à toute la zone (références relatives).'),
   ('=SOMMEPROD(--(Feuil1!A2:F500<>Feuil2!A2:F500))','Nombre total de cellules différentes.')],
  ['Accueil > Mise en forme conditionnelle > Nouvelle règle > Utiliser une formule.'],
  'surligner differences deux feuilles mise en forme conditionnelle comparer cellule par cellule')
r('comparaison','Membres d’un groupe absents d’un autre (droits, licences)',
  'Ex. : qui est dans « Licence Office » sans être dans « Utilisateurs actifs » ?',
  [('=FILTRE(GroupeA;ESTNA(EQUIV(GroupeA;GroupeB;0));"Aucun")','Membres de A absents de B (2021+).'),
   ('=SI(ESTNA(EQUIV(A2;GroupeB;0));"⚠ Hors groupe B";"")','Toutes versions, ligne par ligne.')],
  [], 'groupe membres absents droits acces licences difference groupes revue')
r('comparaison','Doublons et affectations multiples',
  'Utilisateurs avec plusieurs postes, postes partagés, n° de série en double.',
  [('=NB.SI(Parc[Utilisateur];A2)','Nombre de matériels affectés à l’utilisateur A2.'),
   ('=FILTRE(UNIQUE(Parc[Utilisateur]);NB.SI(Parc[Utilisateur];UNIQUE(Parc[Utilisateur]))>1;"Aucun")','Utilisateurs ayant plusieurs matériels (2021+).'),
   ('=SOMMEPROD(--($C$2:$C$5000=C2))>1','N° de série en double, comparaison EXACTE.')],
  ['NB.SI tronque les nombres à 15 chiffres et interprète * et ? : pour des n° de série ou IMEI, préfère SOMMEPROD(--(plage=valeur)).'],
  'doublons affectations multiples plusieurs postes serie en double imei utilisateur')
r('comparaison','Rapprochement approximatif (orthographes différentes)',
  'Noms saisis différemment d’une base à l’autre (Lefèvre / LEFEVRE / Lefevre-).',
  [('=RECHERCHEX(GAUCHE(B2;6)&"*";RH[NomNormalisé];RH[Login];"Aucun";2)','Correspondance sur les 6 premiers caractères (mode 2 = caractères génériques).'),
   ('=SI(NB.SI(RH[NomNormalisé];GAUCHE(B2;6)&"*")>1;"⚠ Plusieurs candidats";"")','Signale les ambiguïtés à vérifier à la main.')],
  ['Normalise d’abord (majuscules, sans accents ni espaces) dans les deux bases.',
   'Pour un vrai rapprochement « flou » : Données > Obtenir des données (Power Query) > Fusionner > « Utiliser la correspondance approximative ».'],
  'approximatif flou orthographe differente fuzzy nom proche correspondance partielle')

# ------------------------------------------------------------- RÉSEAU
r('reseau','Extraire les octets d’une adresse IPv4',
  'Découper 192.168.10.25 en 4 nombres.',
  [('=--SUPPRESPACE(STXT(SUBSTITUE(A2;".";REPT(" ";100));(B$1-1)*100+1;100))','Octet n° B1 (1 à 4) : toutes versions. Recopie vers la droite avec 1, 2, 3, 4 en ligne 1.'),
   ('=--SUPPRESPACE(STXT(SUBSTITUE("192.168.10.25";".";REPT(" ";100));201;100))','Exemple : 3e octet.',10),
   ('=--FRACTIONNER.TEXTE(A2;".")','Les 4 octets d’un coup, en nombres (2024/365).')],
  ['Astuce du REPT(" ";100) : chaque point devient 100 espaces, on découpe par tranches de 100 puis SUPPRESPACE nettoie.'],
  'ip ipv4 octets decouper adresse ip separer')
r('reseau','Convertir une adresse IP en nombre (pour trier, comparer, calculer)',
  'Une IP est un nombre de 32 bits : la convertir permet de trier correctement (10.0.0.9 avant 10.0.0.10) et de faire des calculs de sous-réseau.',
  [('='+ipnum('A2'),'Toutes versions.'),
   ('='+ipnum('"192.168.10.25"'),'Exemple.',3232238105),
   ('=LET(o;--FRACTIONNER.TEXTE(A2;".");SOMME(o*256^(4-SEQUENCE(1;4))))','Version courte (2024/365).'),
   ('=TRIERPAR(A2:A500;C2:C500;1)','Trier la liste d’IP selon la colonne C (IP en nombre).')],
  [], 'ip en nombre entier convertir trier adresses ip ordre numerique ip vers decimal')
r('reseau','Convertir un nombre en adresse IP',
  'L’opération inverse : 3232238105 → 192.168.10.25.',
  [('='+numip('A2'),'Toutes versions.'),
   ('='+numip('3232238105'),'Exemple.','192.168.10.25')],
  [], 'nombre vers ip decimal en adresse ip convertir')
r('reseau','Masque de sous-réseau à partir du préfixe CIDR',
  '/24 → 255.255.255.0, /20 → 255.255.240.0.',
  [('='+mask('B2'),'B2 = longueur de préfixe (0 à 32).'),
   ('='+mask('20'),'Exemple : /20.','255.255.240.0'),
   ('=2^32-2^(32-B2)','Masque sous forme de nombre (pour BITET).')],
  [], 'masque sous reseau cidr prefixe netmask 255.255.255.0 slash 24')
r('reseau','Préfixe CIDR à partir d’un masque',
  '255.255.240.0 → 20.',
  [('=32-ARRONDI(LOG(2^32-C2;2);0)','C2 = masque converti en nombre (voir « Convertir une adresse IP en nombre »).'),
   ('=32-ARRONDI(LOG(2^32-4294963200;2);0)','Exemple : 255.255.240.0 vaut 4294963200.',20)],
  [], 'prefixe cidr depuis masque nombre de bits masque')
r('reseau','Nombre d’adresses et d’hôtes d’un sous-réseau',
  'Combien de machines dans un /26 ?',
  [('=2^(32-B2)','Nombre total d’adresses.'),
   ('=SI(B2>=31;2^(32-B2);2^(32-B2)-2)','Hôtes utilisables (adresse réseau et diffusion retirées, sauf /31 et /32).'),
   ('=SI(24>=31;2^(32-24);2^(32-24)-2)','Exemple : /24.',254)],
  [], 'nombre hotes adresses sous reseau taille plage combien de machines')
r('reseau','Adresse réseau, diffusion, première et dernière IP',
  'Calculateur de sous-réseau complet à partir d’une IP (A2) et d’un préfixe (B2).',
  [('=ENT(C2/2^(32-B2))*2^(32-B2)','D2 : adresse réseau en nombre (C2 = IP en nombre).'),
   ('=ENT(3232238105/2^(32-20))*2^(32-20)','Exemple : 192.168.10.25/20 → réseau 192.168.0.0.',3232235520),
   ('=BITET(C2;2^32-2^(32-B2))','Même résultat avec un ET binaire (2013+).'),
   ('=D2+2^(32-B2)-1','E2 : adresse de diffusion (broadcast) en nombre.'),
   ('=3232235520+2^(32-20)-1','Exemple : 192.168.15.255.',3232239615),
   ('=D2+1','Première IP utilisable (puis E2-1 pour la dernière).'),
   ('=LET(o;--FRACTIONNER.TEXTE(A2;".");n;SOMME(o*256^(4-SEQUENCE(1;4)));t;2^(32-B2);r;ENT(n/t)*t;ENT(r/16777216)&"."&MOD(ENT(r/65536);256)&"."&MOD(ENT(r/256);256)&"."&MOD(r;256)&"/"&B2)','Tout en une formule : « 192.168.0.0/20 » (2024/365).')],
  ['Reconvertis chaque nombre en IP avec la recette « Convertir un nombre en adresse IP ».'],
  'calculateur sous reseau adresse reseau broadcast diffusion premiere derniere ip plage subnet')
r('reseau','Fonctions personnalisées IPNUM, NUMIP et IPDANSRESEAU',
  'Crée tes propres fonctions réseau une fois pour toutes (Formules > Gestionnaire de noms > Nouveau, puis colle la formule dans « Fait référence à »).',
  [('=LAMBDA(ip;LET(o;--FRACTIONNER.TEXTE(ip;".");SOMME(o*256^(4-SEQUENCE(1;4)))))','Nom : IPNUM → =IPNUM("10.1.2.3") renvoie le nombre.'),
   ('=LAMBDA(n;'+numip('n')+')','Nom : NUMIP → =NUMIP(167838211) renvoie l’adresse.'),
   ('=LAMBDA(ip;cidr;LET(t;2^(32-TEXTE.APRES(cidr;"/"));ENT(IPNUM(ip)/t)=ENT(IPNUM(TEXTE.AVANT(cidr;"/"))/t)))','Nom : IPDANSRESEAU (nécessite IPNUM).'),
   ('=IPDANSRESEAU(A2;"10.20.0.0/16")','Utilisation : VRAI si l’IP appartient au réseau.'),
   ('=FILTRE(Postes;BYROW(Postes[IP];LAMBDA(i;IPDANSRESEAU(i;"10.20.0.0/16")));"Aucun")','Tous les postes d’un VLAN / sous-réseau (2024/365).')],
  ['Les fonctions LAMBDA nommées sont enregistrées dans le classeur : elles voyagent avec le fichier.'],
  'lambda fonction personnalisee ip dans reseau appartient sous reseau cidr vlan ipnum')
r('reseau','Vérifier qu’une IP appartient à un sous-réseau (toutes versions)',
  'Sans LAMBDA : avec la colonne « IP en nombre ».',
  [('=ENT(C2/2^(32-$G$2))=ENT($H$2/2^(32-$G$2))','C2 = IP en nombre, G2 = préfixe, H2 = adresse réseau en nombre.'),
   ('=ENT(3232238105/2^(32-20))=ENT(3232235520/2^(32-20))','Exemple : 192.168.10.25 est bien dans 192.168.0.0/20.',True)],
  [], 'ip appartient sous reseau dans le reseau vlan plage verification')
r('reseau','Valider le format d’une adresse IPv4',
  'Repérer les saisies invalides (999.1.1.1, 10.0.0, 01.2.3.4…).',
  [('=LET(o;FRACTIONNER.TEXTE(A2;".");SIERREUR(ET(COLONNES(o)=4;--o>=0;--o<=255;o=TEXTE(--o;"0"));FAUX))','VRAI si l’IP est valide (2024/365).'),
   ('=NBCAR(A2)-NBCAR(SUBSTITUE(A2;".";""))=3','Contrôle minimal toutes versions : exactement 3 points.')],
  ['Mets la formule en mise en forme conditionnelle pour colorer les IP invalides.'],
  'valider ip format adresse ip invalide controle saisie')
r('reseau','Détecter une IP privée (RFC 1918)',
  '10.0.0.0/8, 172.16.0.0/12 et 192.168.0.0/16.',
  [('=OU(C2=10;ET(C2=172;D2>=16;D2<=31);ET(C2=192;D2=168))','C2 et D2 = 1er et 2e octets.'),
   ('=OU(172=10;ET(172=172;20>=16;20<=31);ET(172=192;20=168))','Exemple : 172.20.x.x est privée.',True),
   ('=OU(IPDANSRESEAU(A2;"10.0.0.0/8");IPDANSRESEAU(A2;"172.16.0.0/12");IPDANSRESEAU(A2;"192.168.0.0/16"))','Avec la fonction personnalisée IPDANSRESEAU.')],
  [], 'ip privee publique rfc1918 interne externe')
r('reseau','Extraire une IP d’une ligne de log',
  'Ex. « Failed password for root from 203.0.113.5 port 22 ssh2 ».',
  [('=TEXTE.AVANT(TEXTE.APRES(A2;"from ");" ")','2024/365.'),
   ('=STXT(A2;TROUVE("from ";A2)+5;TROUVE(" ";A2&" ";TROUVE("from ";A2)+5)-TROUVE("from ";A2)-5)','Toutes versions.'),
   ('=STXT(%s;TROUVE("from ";%s)+5;TROUVE(" ";%s&" ";TROUVE("from ";%s)+5)-TROUVE("from ";%s)-5)'%(LOGQ,LOGQ,LOGQ,LOGQ,LOGQ),'Exemple.','203.0.113.5'),
   ('=PRENDRE(TRIERPAR(UNIQUE(C2:C5000);NB.SI(C2:C5000;UNIQUE(C2:C5000));-1);10)','Top 10 des IP qui échouent le plus (2024/365).')],
  [], 'extraire ip log ssh echec connexion fail2ban brute force')

# ------------------------------------------------------------- HÔTES & IDENTIFIANTS
r('hote','Normaliser une adresse MAC',
  'aa-bb-cc-dd-ee-0f, aabb.ccdd.ee0f, AA:BB:… → un format unique.',
  [('=MAJUSCULE(SUBSTITUE(SUBSTITUE(SUBSTITUE(A2;":";"");"-";"");".";""))','B2 : 12 caractères sans séparateur.'),
   ('=MAJUSCULE(SUBSTITUE(SUBSTITUE(SUBSTITUE("aa-bb-cc-dd-ee-0f";":";"");"-";"");".";""))','Exemple.','AABBCCDDEE0F'),
   ('=STXT(B2;1;2)&":"&STXT(B2;3;2)&":"&STXT(B2;5;2)&":"&STXT(B2;7;2)&":"&STXT(B2;9;2)&":"&STXT(B2;11;2)','Format AA:BB:CC:DD:EE:FF.'),
   ('=STXT("AABBCCDDEE0F";1;2)&":"&STXT("AABBCCDDEE0F";3;2)&":"&STXT("AABBCCDDEE0F";5;2)&":"&STXT("AABBCCDDEE0F";7;2)&":"&STXT("AABBCCDDEE0F";9;2)&":"&STXT("AABBCCDDEE0F";11;2)','Exemple.','AA:BB:CC:DD:EE:0F'),
   ('=MINUSCULE(STXT(B2;1;4)&"."&STXT(B2;5;4)&"."&STXT(B2;9;4))','Format Cisco aabb.ccdd.ee0f.'),
   ('=JOINDRE.TEXTE(":";VRAI;STXT(B2;SEQUENCE(6;1;1;2);2))','Format avec « : » en une formule courte (2021+).')],
  [], 'adresse mac normaliser format mac deux points tirets cisco')
r('hote','Valider une adresse MAC et trouver le constructeur',
  'Contrôler 12 caractères hexadécimaux, puis le préfixe constructeur (OUI).',
  [('=ET(NBCAR(B2)=12;ESTNUM(HEXDEC(GAUCHE(B2;6)));ESTNUM(HEXDEC(DROITE(B2;6))))','B2 = MAC normalisée.'),
   ('=ET(NBCAR("AABBCCDDEE0F")=12;ESTNUM(HEXDEC(GAUCHE("AABBCCDDEE0F";6)));ESTNUM(HEXDEC(DROITE("AABBCCDDEE0F";6))))','Exemple.',True),
   ('=RECHERCHEX(GAUCHE(B2;6);OUI[Préfixe];OUI[Constructeur];"Inconnu")','Constructeur via une table OUI (liste publique de l’IEEE).'),
   ('=ESTNUM(TROUVE(STXT(B2;2;1);"26AE"))','VRAI = adresse administrée localement (souvent une MAC aléatoire Wi-Fi).'),
   ('=ESTNUM(TROUVE(STXT("DAA119000001";2;1);"26AE"))','Exemple.',True)],
  ['Les MAC aléatoires (smartphones, Windows) faussent le comptage des appareils : filtre-les avec la dernière formule.'],
  'valider mac constructeur oui fabricant hexadecimal mac aleatoire')
r('hote','Nom d’hôte et domaine à partir d’un FQDN',
  'srv-web01.corp.local → srv-web01 et corp.local.',
  [('=GAUCHE(A2;TROUVE(".";A2&".")-1)','Nom d’hôte (fonctionne aussi sans domaine).'),
   ('=GAUCHE("srv-web01.corp.local";TROUVE(".";"srv-web01.corp.local"&".")-1)','Exemple.','srv-web01'),
   ('=STXT(A2;TROUVE(".";A2&".")+1;255)','Domaine.'),
   ('=STXT("srv-web01.corp.local";TROUVE(".";"srv-web01.corp.local"&".")+1;255)','Exemple.','corp.local'),
   ('=NBCAR(GAUCHE(A2;TROUVE(".";A2&".")-1))<=15','Compatible NetBIOS (15 caractères maximum).')],
  [], 'fqdn nom hote domaine hostname netbios dns')
r('hote','Extraire l’identifiant de DOMAINE\\utilisateur ou d’un UPN',
  'CORP\\jdupont ou jdupont@corp.fr → jdupont.',
  [('=STXT(A2;TROUVE("\\";A2)+1;100)','Format DOMAINE\\utilisateur.'),
   ('=STXT("CORP\\jdupont";TROUVE("\\";"CORP\\jdupont")+1;100)','Exemple.','jdupont'),
   ('=GAUCHE(A2;TROUVE("@";A2)-1)','Format UPN / e-mail.'),
   ('=GAUCHE("jdupont@corp.fr";TROUVE("@";"jdupont@corp.fr")-1)','Exemple.','jdupont'),
   ('=SIERREUR(STXT(A2;TROUVE("\\";A2)+1;100);SIERREUR(GAUCHE(A2;TROUVE("@";A2)-1);A2))','Gère les deux formats (et le login seul).')],
  [], 'extraire login identifiant domaine antislash upn email samaccountname')
r('hote','Générer des noms de machines en série',
  'PC-COMPTA-001, PC-COMPTA-002…',
  [('="PC-COMPTA-"&TEXTE(LIGNE()-1;"000")','Toutes versions (en ligne 2 → 001).'),
   ('="PC-"&TEXTE(7;"000")','Exemple.','PC-007'),
   ('="SRV-"&TEXTE(SEQUENCE(20);"00")','20 noms d’un coup (2021+).')],
  [], 'generer noms machines serie nommage postes serveurs numerotation')
r('hote','Créer un identifiant à partir du nom et du prénom',
  'Hélène Lefèvre-Côté → hlefevrecote, sans accents ni espaces.',
  [('='+sans('A2'),'C2 : prénom sans accents (A2 = prénom). Même formule pour le nom.'),
   ('='+sans('"Hélène Lefèvre-Côté"'),'Exemple.','helene lefevre-cote'),
   ('=GAUCHE(C2;1)&SUBSTITUE(SUBSTITUE(SUBSTITUE(D2;" ";"");"-";"");CAR(39);"")','Identifiant : initiale + nom collé (CAR(39) = apostrophe).'),
   ('=GAUCHE("helene";1)&SUBSTITUE(SUBSTITUE(SUBSTITUE("lefevre-cote";" ";"");"-";"");CAR(39);"")','Exemple.','hlefevrecote'),
   ('=C2&"."&SUBSTITUE(D2;" ";"-")&"@entreprise.fr"','Adresse e-mail prénom.nom.'),
   ('=E2&SI(NB.SI(E$2:E2;E2)>1;NB.SI(E$2:E2;E2);"")','Dédoublonnage : jdupont, jdupont2, jdupont3…')],
  ['Enregistre la première formule comme fonction : Gestionnaire de noms > SANSACCENT = LAMBDA(t;…) en remplaçant A2 par t.'],
  'creer login identifiant nom prenom sans accents email generer compte utilisateur')

# ------------------------------------------------------------- COMPTES & AD
r('comptes','Convertir lastLogonTimestamp / pwdLastSet (Active Directory) en date',
  'Les dates AD brutes sont des FILETIME : nombre d’intervalles de 100 ns depuis le 01/01/1601.',
  [('=SI(OU(A2=0;A2>9E+18);"Jamais";A2/864000000000-109205)','Date UTC (format Date + heure à appliquer).'),
   ('=134116992000000000/864000000000-109205','Exemple.','d:2026-01-01')],
  ['0 = jamais connecté ; 9223372036854775807 (accountExpires) = n’expire jamais.',
   'lastLogonTimestamp n’est répliqué qu’avec un retard pouvant atteindre une quinzaine de jours : utilise un seuil d’inactivité large.'],
  'lastlogontimestamp pwdlastset filetime date active directory ad convertir timestamp windows')
r('comptes','Convertir un timestamp Unix (epoch) en date',
  'Logs Linux, API, bases de données : secondes depuis le 01/01/1970 UTC.',
  [('=A2/86400+DATE(1970;1;1)','Secondes → date UTC.'),
   ('=1767225600/86400+DATE(1970;1;1)','Exemple.','d:2026-01-01'),
   ('=A2/86400000+DATE(1970;1;1)','Millisecondes (JavaScript, Java…).'),
   ('=(A2-DATE(1970;1;1))*86400','Date → timestamp Unix.'),
   ('=A2/86400+DATE(1970;1;1)+1/24','Heure de Paris en hiver (+2/24 en été).')],
  [], 'timestamp unix epoch convertir date linux secondes millisecondes')
r('comptes','Comptes inactifs depuis plus de N jours',
  'Revue des accès : comptes activés sans connexion récente.',
  [('=SI(AUJOURDHUI()-C2>$H$1;"Inactif";"Actif")','C2 = dernière connexion (date), H1 = seuil en jours (ex. 90).'),
   ('=FILTRE(AD;(AD[Activé]="True")*(AUJOURDHUI()-AD[DernièreConnexion]>90);"Aucun")','Liste des comptes activés inactifs depuis 90 jours (2021+).'),
   ('=NB.SI.ENS(AD[Activé];"True";AD[DernièreConnexion];"<"&AUJOURDHUI()-90)','Nombre de comptes concernés.')],
  [], 'comptes inactifs derniere connexion revue des acces 90 jours dormant')
r('comptes','Mots de passe qui expirent bientôt',
  'Jours restants avant expiration selon la politique de mot de passe.',
  [('=C2+$H$1-AUJOURDHUI()','Jours restants (C2 = pwdLastSet converti, H1 = durée de validité en jours).'),
   ('=SI.CONDITIONS(D2<0;"Expiré";D2<=14;"Expire sous 14 j";VRAI;"OK")','Statut pour la relance.')],
  [], 'mot de passe expiration expire bientot pwdlastset politique')
r('comptes','Lire userAccountControl (compte désactivé, mot de passe sans expiration…)',
  'userAccountControl est une somme de drapeaux : BITET isole chacun d’eux.',
  [('=SI(BITET(A2;2)=2;"Désactivé";"Activé")','Drapeau 2 : compte désactivé.'),
   ('=BITET(514;2)','Exemple : 514 = compte normal (512) + désactivé (2).',2),
   ('=BITET(A2;65536)>0','Drapeau 65536 : le mot de passe n’expire jamais.'),
   ('=BITET(66048;65536)>0','Exemple : 66048 = 512 + 65536.',True),
   ('=BITET(A2;32)>0','Drapeau 32 : mot de passe non requis (à corriger).')],
  ['BITET existe depuis Excel 2013.'],
  'useraccountcontrol uac drapeaux compte desactive mot de passe n expire jamais active directory bitet')
r('comptes','Décomposer un DistinguishedName (CN, OU, domaine)',
  'CN=Dupont Jean,OU=Compta,DC=corp,DC=local → nom, unité d’organisation, domaine.',
  [('=STXT(A2;4;TROUVE(",";A2)-4)','Nom (CN).'),
   ('=STXT(%s;4;TROUVE(",";%s)-4)'%(DN,DN),'Exemple.','Dupont Jean'),
   ('=TEXTE.AVANT(TEXTE.APRES(A2;"OU=");",")','Première OU (2024/365).'),
   ('=SUBSTITUE(STXT(A2;CHERCHE("DC=";A2)+3;255);",DC=";".")','Domaine DNS.'),
   ('=SUBSTITUE(STXT(%s;CHERCHE("DC=";%s)+3;255);",DC=";".")'%(DN,DN),'Exemple.','corp.local')],
  [], 'distinguishedname dn cn ou dc decomposer active directory unite organisation')
r('comptes','Groupes d’un utilisateur et membres d’un groupe',
  'À partir d’un export « Utilisateur / Groupe » (une ligne par appartenance).',
  [('=JOINDRE.TEXTE(", ";VRAI;FILTRE(Membres[Groupe];Membres[Login]=A2;""))','Tous les groupes de l’utilisateur A2 dans une cellule (2021+).'),
   ('=NB.SI(Membres[Groupe];E2)','Nombre de membres du groupe E2.'),
   ('=NB.SI.ENS(Membres[Login];A2;Membres[Groupe];"Admins du domaine")>0','L’utilisateur est-il administrateur ?')],
  [], 'groupes utilisateur membres groupe appartenance droits admins')

# ------------------------------------------------------------- PARC & LICENCES
r('parc','Âge du matériel et alerte de renouvellement',
  'Ancienneté depuis la date d’achat et seuil de renouvellement.',
  [('=DATEDIF(B2;AUJOURDHUI();"y")','Âge en années complètes.'),
   ('=SI(DATEDIF(B2;AUJOURDHUI();"m")>=$H$1*12;"À renouveler";"OK")','H1 = durée de vie retenue en années.'),
   ('=NB.SI.ENS(Parc[Achat];"<"&MOIS.DECALER(AUJOURDHUI();-12*$H$1))','Nombre de matériels à renouveler.')],
  [], 'age materiel renouvellement anciennete parc vieux postes plan de renouvellement')
r('parc','Fin de garantie et contrats',
  'Date de fin, jours restants et statut.',
  [('=MOIS.DECALER(B2;C2)','Fin de garantie (C2 = durée en mois).'),
   ('=SI.CONDITIONS(D2<AUJOURDHUI();"Expirée";D2-AUJOURDHUI()<=90;"Expire sous 90 j";VRAI;"Sous garantie")','Statut.'),
   ('=FILTRE(Parc[[Série]:[FinGarantie]];(Parc[FinGarantie]>=AUJOURDHUI())*(Parc[FinGarantie]<=AUJOURDHUI()+90);"Rien")','Garanties qui expirent dans les 90 jours (2021+).')],
  [], 'garantie fin de garantie contrat maintenance expiration support')
r('parc','Licences : installées ou attribuées vs achetées',
  'Écart de conformité par logiciel.',
  [('=NB.SI(Installs[Logiciel];A2)','Nombre d’installations du logiciel A2.'),
   ('=SI(C2>B2;"⚠ "&C2-B2&" licence(s) manquante(s)";"OK ("&B2-C2&" disponible(s))")','B2 = licences achetées, C2 = utilisées.'),
   ('=SOMMEPROD((C2:C50>B2:B50)*(C2:C50-B2:B50)*D2:D50)','Coût total du rattrapage (D = prix unitaire).')],
  [], 'licences conformite logiciel installees achetees ecart audit editeur')
r('parc','Répartition du parc (par modèle, OS, site)',
  'Tableau de comptage croisé.',
  [('=NB.SI.ENS(Parc[OS];$A2;Parc[Site];B$1)','OS en ligne × site en colonne.'),
   ('=LET(m;UNIQUE(Parc[Modèle]);TRIERPAR(ASSEMB.H(m;NB.SI(Parc[Modèle];m));NB.SI(Parc[Modèle];m);-1))','Modèles classés par nombre (2024/365).'),
   ('=PIVOTER.PAR(Parc[OS];Parc[Site];Parc[Série];NBVAL)','Tableau croisé complet en une formule (365).')],
  [], 'repartition parc modele os site comptage inventaire statistiques')
r('parc','Version d’OS : extraire le numéro de build',
  '« 10.0.19045 » → 19045, pour repérer les postes pas à jour.',
  [('=--STXT(A2;CHERCHE(".";A2;CHERCHE(".";A2)+1)+1;10)','Toutes versions : après le 2e point.'),
   ('=--STXT("10.0.19045";CHERCHE(".";"10.0.19045";CHERCHE(".";"10.0.19045")+1)+1;10)','Exemple.',19045),
   ('=--TEXTE.APRES(A2;".";-1)','2024/365 : après le dernier point.'),
   ('=SI(C2<$H$1;"⚠ Obsolète";"OK")','H1 = build minimal exigé.')],
  [], 'version os build windows obsolete mise a jour parc numero de version')

# ------------------------------------------------------------- SUPERVISION
r('supervision','Disponibilité (SLA) et indisponibilité autorisée',
  'Calculer un taux de disponibilité et le temps d’arrêt toléré.',
  [('=1-B2/(C2*24*60)','Disponibilité (B2 = minutes d’indisponibilité, C2 = jours de la période).'),
   ('=(1-99,9%)*30*24*60','Indisponibilité autorisée par mois de 30 jours pour 99,9 %.',43.2),
   ('=(1-$H$1)*JOUR(FIN.MOIS(A2;0))*24*60','Pour le mois réel de A2 (H1 = SLA visé).')],
  [], 'disponibilite sla uptime indisponibilite 99,9 taux de disponibilite')
r('supervision','Uptime en secondes → jours, heures, minutes',
  'Rendre lisible une durée en secondes (uptime, durée de sauvegarde).',
  [('=ENT(A2/86400)&" j "&TEXTE(MOD(A2;86400)/86400;"hh:mm:ss")','A2 = secondes.'),
   ('=ENT(200000/86400)&" j "&TEXTE(MOD(200000;86400)/86400;"hh:mm:ss")','Exemple.','2 j 07:33:20'),
   ('=A2/86400','En durée Excel (format [h]:mm:ss).')],
  [], 'uptime secondes duree jours heures minutes convertir')
r('supervision','MTTR et MTBF',
  'Temps moyen de réparation et temps moyen entre pannes.',
  [('=MOYENNE(Incidents[DuréeH])','MTTR en heures (DuréeH = (Fin-Début)*24).'),
   ('=(C1*24-SOMME(Incidents[DuréeH]))/NBVAL(Incidents[Début])','MTBF en heures (C1 = nombre de jours de la période).')],
  [], 'mttr mtbf temps moyen reparation panne fiabilite incidents')
r('supervision','Âge et respect des délais des tickets',
  'Ancienneté des tickets ouverts et dépassement des délais par priorité.',
  [('=SI.CONDITIONS(AUJOURDHUI()-B2<=1;"< 1 j";AUJOURDHUI()-B2<=7;"1-7 j";AUJOURDHUI()-B2<=30;"8-30 j";VRAI;"> 30 j")','Tranche d’ancienneté (B2 = ouverture).'),
   ('=SI((C2-B2)*24>RECHERCHEX(D2;Délais[Priorité];Délais[Heures]);"Hors délai";"OK")','C2 = résolution, D2 = priorité, table des délais en heures.'),
   ('=NB.SI.ENS(Tickets[Statut];"Ouvert";Tickets[Ouverture];"<"&AUJOURDHUI()-30)','Tickets ouverts depuis plus de 30 jours.')],
  [], 'tickets anciennete delai sla helpdesk support priorite aging')
r('supervision','Analyser une ligne de log (date, niveau)',
  'Format « 2026-11-02 14:03:11 ERROR sshd: … ».',
  [('=DATE(GAUCHE(A2;4);STXT(A2;6;2);STXT(A2;9;2))+TEMPS(STXT(A2;12;2);STXT(A2;15;2);STXT(A2;18;2))','Horodatage.'),
   ('=DATE(GAUCHE(%s;4);STXT(%s;6;2);STXT(%s;9;2))'%(LINE,LINE,LINE),'Exemple (partie date).','d:2026-11-02'),
   ('=STXT(A2;21;CHERCHE(" ";A2;21)-21)','Niveau (ERROR, WARN…).'),
   ('=STXT(%s;21;CHERCHE(" ";%s;21)-21)'%(LINE,LINE),'Exemple.','ERROR'),
   ('=NB.SI.ENS(Logs[Niveau];"ERROR";Logs[Horodatage];">="&E2;Logs[Horodatage];"<"&E2+1/24)','Erreurs par heure (E2 = début de l’heure).')],
  [], 'log parser analyser ligne de log horodatage niveau erreur syslog journal')
r('supervision','Sévérité et facility syslog',
  'Décoder la valeur PRI <34> d’un message syslog.',
  [('=MOD(A2;8)','Sévérité = PRI modulo 8.'),
   ('=MOD(34;8)','Exemple : <34> → sévérité 2.',2),
   ('=ENT(A2/8)','Facility = partie entière de PRI / 8.'),
   ('=SI.MULTIPLE(B2;0;"Emergency";1;"Alert";2;"Critical";3;"Error";4;"Warning";5;"Notice";6;"Informational";7;"Debug";"?")','Libellé de la sévérité.'),
   ('=SI.MULTIPLE(3;0;"Emergency";1;"Alert";2;"Critical";3;"Error";4;"Warning";5;"Notice";6;"Informational";7;"Debug";"?")','Exemple.','Error')],
  [], 'syslog severite facility pri niveau log')

# ------------------------------------------------------------- STOCKAGE & DÉBIT
r('stockage','Afficher une taille en octets de façon lisible',
  '3221225472 → « 3 Gio ».',
  [('=LET(o;A2;n;%s;ARRONDI(o/1024^n;2)&" "&CHOISIR(n+1;"o";"Kio";"Mio";"Gio";"Tio";"Pio"))'%nunits('o'),'2021+.'),
   ('='+nunits('A2'),'Toutes versions, étape 1 (B2) : rang de l’unité.'),
   ('='+nunits('3221225472'),'Exemple : 3 = Gio.',3),
   ('=ARRONDI(A2/1024^B2;2)&" "&CHOISIR(B2+1;"o";"Kio";"Mio";"Gio";"Tio";"Pio")','Étape 2 : affichage.')],
  ['Kio/Mio/Gio = puissances de 1024 (ce qu’affichent Windows et la plupart des outils). Pour des Ko/Mo/Go décimaux, remplace 1024 par 1000.'],
  'taille octets lisible ko mo go to gio convertir octets humain')
r('stockage','Go ou Gio ? Capacité réelle d’un disque',
  'Un disque de « 1 To » (10^12 octets) n’affiche que 931 Gio.',
  [('=ARRONDI(1E12/1024^3;2)','1 To décimal en Gio.',931.32),
   ('=A2*1E9/1024^3','Go (fabricant) → Gio (système).')],
  [], 'go gio to tio capacite disque reelle difference 1000 1024')
r('stockage','Temps de transfert et conversion de débit',
  'Combien de temps pour copier 10 Go sur un lien à 100 Mbit/s ?',
  [('=A2*8000/B2','Secondes (A2 = taille en Go, B2 = débit en Mbit/s).'),
   ('=10*8000/100','Exemple : 800 s, soit 13 min 20 s.',800),
   ('=A2*8000/B2/86400','En durée Excel (format [h]:mm:ss).'),
   ('=1000/8','Mbit/s → Mo/s : diviser par 8 (1 Gbit/s ≈ 125 Mo/s).',125)],
  ['En pratique, prévois une marge (protocoles, disques) : multiplie le temps par 1,2 à 1,5.'],
  'debit temps de transfert mbit mo par seconde bande passante sauvegarde copie')
r('stockage','Capacité utile d’une grappe RAID',
  'Selon le niveau de RAID, le nombre de disques (A2) et leur taille (B2).',
  [('=SI.MULTIPLE(C2;"RAID0";A2*B2;"RAID1";B2;"RAID5";(A2-1)*B2;"RAID6";(A2-2)*B2;"RAID10";A2*B2/2;"?")','C2 = niveau de RAID.'),
   ('=SI.MULTIPLE("RAID5";"RAID0";4*4;"RAID1";4;"RAID5";(4-1)*4;"RAID6";(4-2)*4;"RAID10";4*4/2;"?")','Exemple : 4 disques de 4 To en RAID 5.',12)],
  [], 'raid capacite utile raid5 raid6 raid10 disques stockage nas')
r('stockage','Date prévisionnelle de saturation d’un disque',
  'À partir de l’historique d’occupation, estimer quand le volume sera plein.',
  [('=PENTE(Usage[Go];Usage[Date])','Croissance moyenne en Go par jour.'),
   ('=AUJOURDHUI()+(C1-DERNIER)/PENTE(Usage[Go];Usage[Date])','C1 = capacité, DERNIER = dernière mesure (nomme la cellule).'),
   ('=SI(B2/C2>=85%;"⚠ "&TEXTE(B2/C2;"0%");"OK")','Alerte d’occupation à 85 %.')],
  [], 'saturation disque capacity planning prevision espace disque plein occupation')

# ------------------------------------------------------------- écriture
out=['/* Volet « Informatique & réseau » : recettes d’administration système et réseau, comparaison de bases. */',
     '/* Fichier généré par scripts/gen-recipes-it.py : modifier le script puis le relancer. */',
     '(function (XL) {',"  'use strict';",'  var R = XL.R;','',
     "  ['IPNUM', 'NUMIP', 'IPDANSRESEAU', 'SANSACCENT'].forEach(function (n) { XL.userFunctions[n] = 1; });",'']
for cat,title,desc,steps,tips,kw in R:
    st=',\n     '.join('['+js(s[0])+', '+js(s[1])+(', '+(('true' if s[2] else 'false') if isinstance(s[2],bool) else (repr(s[2]) if isinstance(s[2],(int,float)) else js(s[2]))) if len(s)>2 else '')+']' for s in steps)
    tp=', '.join(js(t) for t in tips)
    out.append("  R(%s, %s,\n    %s,\n    [%s],\n    [%s],\n    %s);\n"%(js(cat),js(title),js(desc),st,tp,js(kw)))
out.append('})(window.XL);\n')
open('app/data/recipes-it.js','w').write('\n'.join(out))
print(len(R),'recettes IT')
