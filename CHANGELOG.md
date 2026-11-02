# Journal des modifications

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
