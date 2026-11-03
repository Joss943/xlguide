# Journal des modifications

## 1.5.1 — Sécurité

### Application de bureau
- La fenêtre n’affiche que XLGuide : navigation vers une autre page ou un autre fichier local, nouvelles fenêtres, `<webview>` et téléchargements sont bloqués.
- Un lien ne s’ouvre dans le navigateur que s’il mène, en HTTPS, à GitHub, au site d’installation ou à tabler.io.
- Toutes les autorisations (caméra, micro, position, notifications…) sont refusées, sauf la copie dans le presse-papiers.
- Aucune connexion réseau au démarrage : le correcteur orthographique de Chromium, qui téléchargeait un dictionnaire, est coupé.
- L’exécutable ne peut plus servir à lancer du code Node.js (`ELECTRON_RUN_AS_NODE`, `NODE_OPTIONS`, `--inspect`) et ne charge que le code de son archive (fusibles Electron).
- Outils de développement désactivés dans la version installée.

### Version web et site
- Règles de sécurité du contenu (CSP) resserrées : chaque type de ressource limité au site lui-même, aucun formulaire, aucune balise `<base>`, aucune adresse d’origine transmise.
- Le site d’installation a ses propres règles CSP ; les informations de la dernière version (API GitHub) sont vérifiées puis insérées comme du texte.
- Progression, favoris et réglages sont validés à la lecture : une valeur corrompue ou démesurée est ignorée au lieu de bloquer l’application. Une adresse mal formée ramène à l’accueil.
- Le cache hors-ligne n’enregistre que les réponses valides du site lui-même.

### Installation
- `install.sh` et `install.ps1` comparent l’empreinte SHA-256 de chaque fichier téléchargé à `SHA256SUMS.txt` et s’arrêtent si elle diffère.
- Les commandes manuelles du site et du README font la même vérification.
- Chaque fichier publié reçoit une attestation de provenance, vérifiable avec `gh attestation verify`.

### Publication
- Actions GitHub épinglées par empreinte de commit, droits minimaux par tâche, identifiants Git non conservés après le clonage.
- Dependabot surveille les dépendances npm et les actions GitHub.
- `SECURITY.md` : signaler une faille, protections en place, limites connues.

### Compatibilité
- Contenu et interface inchangés ; progression, favoris et réglages sont conservés.

### Vérifications
- `npm test` contrôle aussi ces protections (configuration Electron, CSP, validation des données, scripts d’installation, workflows) ; chaque régression introduite volontairement fait échouer la suite.
- La CI exécute `install.sh` et `install.ps1` avec des téléchargements simulés (PowerShell 7 et Windows PowerShell 5.1) : un fichier modifié ou absent de `SHA256SUMS.txt` doit être refusé. ShellCheck analyse `install.sh`.

## 1.5.0 — Niveau Expert et nouvelle interface

### Nouveau
- **Niveau Expert** dans les quatre activités : 20 notions sur l’usage avancé d’Excel, sans spécialité métier.
  - Saisir & mettre en forme : plages nommées, saisie contrôlée par une règle, listes déroulantes en cascade, protection d’une feuille, texte importé converti en nombres.
  - Calculer : INDEX + EQUIV, recherche sur plusieurs critères, SOMMEPROD, extraction de texte, DECALER et INDIRECT, LET et LAMBDA.
  - Organiser & analyser : segments, chronologie et champs calculés de TCD, Power Query, statistiques, tendance, tableaux construits par formule.
  - Présenter : graphique croisé dynamique, graphiques spécialisés, graphique piloté par une liste déroulante, tableau de bord.
- **29 fonctions** ajoutées au parcours (98 au total), dont INDEX, EQUIV, SOMMEPROD, LET, LAMBDA, TEXTE.AVANT, PIVOTER.PAR, LIREDONNEESTABCROISDYNAMIQUE ; 2 méthodes (cumul depuis le début de l’année, les 5 meilleurs par formule).
- **Carte du parcours** à l’accueil : un tableau activités × niveaux, avec une barre de données par case et la case en cours signalée.

### Interface
- Nouvelle identité inspirée de la feuille de calcul : quadrillage et en-têtes gris à la place des cartes et des ombres, notions et étapes présentées en lignes numérotées, barre de formule sous les mini-tableaux.
- Le curseur de sélection d’Excel (cadre vert et poignée) signale « tu es ici » ; la navigation active reprend l’en-tête surligné d’Excel.
- Police **Atkinson Hyperlegible** (lecture facile), embarquée : aucune requête externe.
- « À retenir » surligné en jaune ; jauge de trois cases pour le niveau ; textes plus directs (plus de flèches ni d’icônes décoratives).
- Thème sombre en graphite, vert adouci.
- Le site d’installation suit la même identité et montre le parcours complet.

### Compatibilité
- Les liens de la 1.2.0 vers le niveau Expert mènent de nouveau au niveau Expert.
- Progression, favoris et réglages sont conservés.

### Vérifications
- `npm test` contrôle aussi que les polices appelées par les feuilles de style existent et sont disponibles hors-ligne.
- 320 résultats recalculés par LibreOffice Calc, 0 écart (18 non testables avec la version de LibreOffice utilisée : LET, LAMBDA, TEXTE.AVANT…).

## 1.4.0 — Pensée pour le TDAH

Expérience revue pour rester concentré ; le contenu (notions, fonctions, exemples) est inchangé.

### Nouveau
- **Commencer / Continuer** : l’accueil met en avant une seule action, la prochaine notion à lire (la dernière ouverte si elle n’est pas terminée).
- **Progression enregistrée** : « J’ai compris, notion suivante » en fin de notion, coches sur les notions terminées, barres d’avancement par niveau, activité et parcours, remise à zéro en deux clics.
- **Étapes à cocher** dans « Comment faire », au fur et à mesure dans Excel.
- **Durée estimée** de chaque notion (lecture et pratique).
- **Mode concentration** : la fiche seule, centrée, sans onglets ni listes ; le choix est mémorisé.
- **Flèches ← →** pour passer d’une notion à l’autre ; bouton **texte plus grand**.

### Modifié
- Dans un niveau, seules les notions sont dépliées ; méthodes et fonctions sont dans des groupes repliés, ouverts automatiquement quand on en sélectionne une.
- Les animations sont coupées quand le système demande moins de mouvement.

## 1.3.0 — Centré sur l’utilisation d’Excel

### Nouveau
- **4 activités d’utilisation d’Excel** : Saisir & mettre en forme · Calculer · Organiser & analyser · Présenter, chacune en **2 niveaux** : Les bases → Intermédiaire.
- **19 nouvelles notions sur le logiciel lui-même** : se repérer, saisir, sélectionner, poignée de recopie, formats, figer les volets, listes déroulantes, formats personnalisés, collage spécial, rechercher-remplacer, graphiques (création, choix, combiné, sparklines), mise en page et impression.
- Rubrique **« Comment faire »** dans les notions : les étapes à suivre dans Excel, numérotées.
- Mini-tableaux avec **plage à sélectionner** en couleur, pour les manipulations sans formule.
- Dans un niveau, les fonctions sont **regroupées par thème** (conditions, recherche, dates, texte…).

### Retiré
- Le volet **administration système et réseau** (55 cas : IP, Active Directory, comparaison de bases) et son générateur.
- Les cas pratiques **comptables spécialisés** (amortissements, FEC, rapprochement bancaire…) ; les méthodes générales (TVA, pourcentages, dates, heures, texte) restent dans les activités.
- Les fonctions au-delà du niveau intermédiaire (finance, statistiques avancées, ingénierie, tableaux dynamiques 2024…) : 69 fonctions gardées sur 222. Le traducteur FR ⇄ EN reconnaît toujours tous les noms.
- Le niveau Expert et la page Cas pratiques.

### Compatibilité
- Les liens de la 1.2.0 (#/a/rechercher/…, #/a/analyser/…, niveaux Approfondir et Expert) mènent à la nouvelle activité correspondante.
- Les favoris vers un contenu retiré sont ignorés sans erreur ; les autres restent valables.

### Vérifications
- `npm test` vérifie que chaque fonction et chaque méthode a sa place dans le parcours et qu’aucun exemple n’utilise une fonction sans fiche.
- 269 résultats recalculés par LibreOffice Calc, 0 écart.

## 1.2.0 — Parcours d’apprentissage

L’application est réorganisée autour de l’usage d’Excel ; les contenus métier passent dans Outils.

### Nouveau
- **4 activités** — Calculer · Rechercher & croiser · Texte & dates · Analyser & présenter — chacune en **3 niveaux** : Les bases → Approfondir → Expert.
- **40 notions** à lire dans l’ordre (écrire et recopier une formule, références `$`, pourcentages, RECHERCHEV/RECHERCHEX, doublons, dates, heures, TCD, FILTRE/TRIER/UNIQUE…), avec navigation notion précédente / suivante.
- **Mini-tableaux** sur les notions et les fiches courantes : l’argument de la formule et les cellules qu’il vise ont la même couleur ; la colonne calculée montre la formule recopiée ligne par ligne.
- **Fiches restructurées** : l’essentiel d’abord (exemple et piège à éviter), puis la syntaxe argument par argument (mêmes couleurs) ; le reste est replié dans « Aller plus loin ».
- Badge de niveau et fil d’Ariane sur chaque fiche ; filtres par type dans les résultats de recherche.
- Page **Outils** : traducteur FR ⇄ EN, erreurs, raccourcis, index A→Z des fonctions, cas pratiques comptabilité et informatique.

### Modifié
- Les cas pratiques métier (comptabilité, administration système et réseau) ne font plus partie du parcours ; ils restent accessibles dans Outils et par la recherche.
- La recherche classe d’abord les notions et les méthodes du parcours.
- Les noms de fonctions sans fiche (anciennes fonctions comme PLANCHER) ne sont plus des liens morts dans les formules.
- `npm run verify:formulas` lance directement la vérification LibreOffice.
- Interface découpée en modules (modèle, vues, contrôleur) ; version et liens publics centralisés dans `app/js/config.js`, utilisés aussi par l’application de bureau.

### Compatibilité
- Les favoris, la version d’Excel choisie, le thème et les liens existants (`#/f/…`, `#/r/…`, `#/e/…`, `#/fn`, `#/rx`, `#/it`…) restent valables.

### Vérifications
- `npm test` rend désormais chaque page et chaque fiche (HTML équilibré, aucun lien interne cassé, rien d’interdit par la CSP).
- 446 résultats recalculés par LibreOffice Calc, 0 écart.

## 1.1.0
- Volet **Informatique & réseau** (55 recettes : IPv4, Active Directory, parc, supervision, stockage) et formules de **comparaison de bases** utilisateurs et matériel.
- Fonctions BITET et BITOU ; icônes **Tabler Icons** (MIT).

## 1.0.0
- Première version : 220 fonctions expliquées en français, recettes de comptabilité, traducteur FR ⇄ EN, recherche en langage naturel ; application Windows et Linux, version web.
