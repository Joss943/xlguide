<div align="center">

<img src="app/icons/icon.svg" width="88" alt="XLGuide">

# XLGuide

**Apprendre Excel en français, des bases aux formules avancées.**

Application gratuite pour **Windows** et **Linux** (et version web) : quatre activités en trois niveaux, des notions courtes illustrées par un mini-tableau, et une recherche en langage naturel quand tu cherches une formule précise.

[![CI](https://github.com/Joss943/xlguide/actions/workflows/ci.yml/badge.svg)](https://github.com/Joss943/xlguide/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/Joss943/xlguide?label=version&color=1a7f4b)](https://github.com/Joss943/xlguide/releases/latest)
[![Licence MIT](https://img.shields.io/badge/licence-MIT-1a7f4b)](LICENSE)

[**⬇ Télécharger**](https://joss943.github.io/xlguide/#telecharger) · [**🌐 Version web**](https://joss943.github.io/xlguide/app/) · [Site](https://joss943.github.io/xlguide/)

<img src="site/screenshot.png" alt="Capture d’écran de XLGuide : activité Calculer, niveau Approfondir, fiche SOMME.SI" width="900">

</div>

---

## Ce que fait XLGuide

**Un parcours en 4 activités**, chacune en 3 niveaux (**Les bases → Approfondir → Expert**) :

| Activité | Les bases | Pour aller plus loin |
|---|---|---|
| **1 · Calculer** | écrire et recopier une formule, bloquer une cellule avec `$`, pourcentages, `SOMME`, `SI` | `SOMME.SI.ENS`, `SI.CONDITIONS`, arrondis, `SOMMEPROD`, `LET` / `LAMBDA` |
| **2 · Rechercher & croiser** | `RECHERCHEV`, `RECHERCHEX`, gérer `#N/A` | `INDEX` + `EQUIV`, comparer deux listes, doublons, barèmes, `DECALER` |
| **3 · Texte & dates** | le type d’une cellule, assembler / découper / nettoyer, calculer avec les dates | texte importé, `TEXTE`, échéances et jours ouvrés, heures, `FRACTIONNER.TEXTE` |
| **4 · Analyser & présenter** | tableaux, tri et filtre, mise en forme conditionnelle, classements | TCD, synthèses par formule, `FILTRE` / `TRIER` / `UNIQUE`, statistiques, tendances |

- **40 notions** à lire dans l’ordre, chacune avec un **mini-tableau** : l’argument de la formule et les cellules qu’il vise ont la même couleur, la colonne calculée montre la formule recopiée ligne par ligne.
- **Fiches claires** : l’essentiel d’abord (exemple + piège à éviter), puis la syntaxe argument par argument ; le reste est replié dans « Aller plus loin ».
- **Recherche en langage naturel** : « additionner avec une condition », « bloquer une cellule », « comparer deux listes »… Tolère accents oubliés, pluriels et fautes de frappe ; accepte aussi les noms anglais (`SUMIFS`, `VLOOKUP`).
- **Outils** : traducteur de formules FR ⇄ EN, erreurs (`#N/A`, `#VALEUR!`…), raccourcis clavier, index des 222 fonctions, compatibilité de version (2010 → 365).
- **Cas pratiques métier**, hors du parcours : 73 en **comptabilité** (TVA, emprunts, amortissements, rapprochement bancaire, FEC…) et 55 en **informatique** (IPv4, Active Directory, parc, supervision, comparaison de bases utilisateurs et matériel).
- **Hors-ligne, privé** : aucune connexion, aucun compte, aucune donnée envoyée. Favoris, mode sombre, navigation au clavier.

**Fiabilité :** chaque résultat affiché (exemples et mini-tableaux, plus de 400 aujourd’hui) est recalculé automatiquement par un tableur indépendant (LibreOffice Calc) dans la CI, et chaque formule passe un aller-retour FR → EN → FR.

## Installation

### Windows 10 / 11

Télécharge [**XLGuide-Setup.exe**](https://github.com/Joss943/xlguide/releases/latest/download/XLGuide-Setup.exe) et lance-le (pas besoin de droits administrateur).

> L’installateur n’est pas signé par un certificat payant : si SmartScreen s’affiche, clique sur **Informations complémentaires → Exécuter quand même**.

Ou en une ligne dans PowerShell :

```powershell
irm https://joss943.github.io/xlguide/install.ps1 | iex
```

### Linux (x86_64)

Une commande qui détecte ta distribution et installe le bon paquet :

```bash
curl -fsSL https://joss943.github.io/xlguide/install.sh | bash
```

Ou manuellement :

| Distribution | Commande |
|---|---|
| **Ubuntu / Debian / Mint / Pop!_OS** | `wget -qO /tmp/xlguide.deb https://github.com/Joss943/xlguide/releases/latest/download/xlguide-amd64.deb && sudo apt install -y /tmp/xlguide.deb` |
| **Fedora / RHEL / Rocky / Alma** | `sudo dnf install -y https://github.com/Joss943/xlguide/releases/latest/download/xlguide-x86_64.rpm` |
| **openSUSE** | `sudo zypper install --allow-unsigned-rpm ./xlguide-x86_64.rpm` |
| **Arch / Manjaro / EndeavourOS** | `curl -fLo /tmp/xlguide.pacman https://github.com/Joss943/xlguide/releases/latest/download/xlguide-x86_64.pacman && sudo pacman -U --noconfirm /tmp/xlguide.pacman` |
| **Autres** | [AppImage](https://github.com/Joss943/xlguide/releases/latest/download/XLGuide-x86_64.AppImage) : `chmod +x XLGuide-x86_64.AppImage && ./XLGuide-x86_64.AppImage` (nécessite FUSE 2) |

Désinstaller : `curl -fsSL https://joss943.github.io/xlguide/install.sh | bash -s -- --uninstall`

### Sans installation

[joss943.github.io/xlguide/app](https://joss943.github.io/xlguide/app/) fonctionne dans n’importe quel navigateur, et s’installe comme une application (Chrome/Edge : icône « Installer » dans la barre d’adresse). Elle reste disponible hors-ligne.

## Utilisation

| Touche | Action |
|---|---|
| <kbd>/</kbd> ou <kbd>Ctrl</kbd>+<kbd>K</kbd> | Aller dans la recherche |
| <kbd>↑</kbd> <kbd>↓</kbd> | Parcourir les résultats (la fiche s’ouvre à droite) |
| <kbd>Entrée</kbd> | Ouvrir le premier résultat |
| <kbd>Échap</kbd> | Effacer la recherche / fermer la fiche |

- Débutant : **Calculer › Les bases**, notions 1, 2, 3… dans l’ordre.
- Clique sur le nom d’une fonction **dans une formule** pour ouvrir sa fiche.
- Colle une formule commençant par `=` dans **Outils › Traducteur**.
- ★ ajoute une fiche à tes favoris (stockés localement).

## Développement

Prérequis : Node.js 20+.

```bash
git clone https://github.com/Joss943/xlguide && cd xlguide
npm ci
npm start                 # lance l'application de bureau
npm test                  # contenu, traducteur, recherche, rendu de toutes les pages et fiches
npm run dist:linux        # paquets deb, rpm, pacman, AppImage dans dist/
npm run dist:win          # installateur Windows (sous Windows)
npm run site:build        # génère le site GitHub Pages dans _site/
```

Vérifier les résultats des exemples avec LibreOffice (`soffice` + `python3-openpyxl`) :

```bash
npm run verify:formulas
```

### Structure

```
app/                 Application (HTML/CSS/JS sans dépendance) — partagée par le bureau et le web
  data/              Contenu : fonctions, recettes, erreurs, raccourcis
    parcours.js      Les 4 activités, les 3 niveaux et le placement des fonctions et méthodes
    notions/         Les notions du parcours, un fichier par activité
    samples.js       Mini-tableaux des fiches fonctions et méthodes
  js/config.js       Version et liens publics (lus aussi par Electron)
  js/formula.js      Analyse, coloration, références de cellules et traduction FR ⇄ EN des formules
  js/search.js       Moteur de recherche en langage naturel
  js/core/           Modèle (index du contenu, parcours) et stockage local
  js/views/          Vues : fonctions pures données → HTML (accueil, listes, fiches, outils)
  js/app.js          Contrôleur : routage, rendu, événements
  css/               app.css (socle) et parcours.css (niveaux, fiches, mini-tableaux)
electron/            Enveloppe bureau (fenêtre sécurisée : sandbox, isolation de contexte)
site/                Site GitHub Pages + scripts d'installation install.sh / install.ps1
scripts/             Génération des icônes, des recettes informatique et du site
tests/               Tests Node + vérification des résultats via LibreOffice
.github/workflows/   CI, compilation Windows/Linux et release, déploiement du site
```

### Ajouter du contenu

Tout est dans `app/data/`. Une fonction tient en un appel :

```js
F('SOMME.SI', 'SUMIF', 'math', '',                       // nom FR, nom EN, catégorie, version minimale
  'Additionne les valeurs qui répondent à UN critère.',  // description
  'SOMME.SI(plage; critère; [somme_plage])',            // syntaxe
  [['plage', 'Cellules testées.'], ['critère', '…'], ['somme_plage', '…']],
  [['=SOMME.SI(B2:B500;"Fournisseur A";D2:D500)', 'Total des achats chez un fournisseur.'],
   ['=SOMME(10;20;30)', 'Exemple vérifié automatiquement.', 60]],   // 3e valeur = résultat attendu
  ['Astuce…'],
  'mots clés pour la recherche',
  'SOMME.SI.ENS SOMMEPROD');                            // voir aussi
```

Une notion du parcours (`app/data/notions/*.js`) :

```js
N({
  activity: 'calculer', level: 'base',                 // calculer | rechercher | texte | analyser ; base | approfondir | expert
  title: 'Calculer des pourcentages',
  intro: 'Un pourcentage est un nombre comme un autre…',
  points: ['…', '…'],                                   // « À retenir »
  examples: [['=B2*(1+$E$1)', 'Hausse de 5 %.']],       // 3e valeur facultative = résultat attendu
  tips: ['…'], kw: 'pourcentage taux part',
  sample: { cols: ['Région', 'Ventes'], rows: [['Nord', 300], ['Sud', 500]],
            fill: { header: 'Part', formula: '=B2/SOMME($B$2:$B$3)', results: [0.375, 0.625], fmt: '%' } }
});
```

Pour placer une fonction ou une méthode dans un niveau : `XL.place(activité, niveau, ['f:NOM', 'r:Titre exact'])` dans `parcours.js` ; un mini-tableau pour une fiche existante : `XL.S('f:NOM', { … })` dans `samples.js`. Les résultats des mini-tableaux sont vérifiés par LibreOffice comme les exemples.

Les recettes du volet informatique sont générées par `scripts/gen-recipes-it.py` (`npm run gen:it`) : les longues formules (IP, accents…) y sont construites automatiquement. Pour changer les icônes : modifier la liste de `scripts/build-icons.js` puis `npm run icons`.

`npm test` signale les erreurs (fonction inconnue dans un exemple, parenthèses, séparateur anglais, aller-retour de traduction, mini-tableau incohérent, lien interne cassé, HTML mal formé…).

### Publier une version

```bash
npm version patch --no-git-tag-version   # 1.2.0 → 1.2.1 dans package.json
# reporter la version dans app/js/config.js et le cache de app/sw.js — npm test le vérifie
git commit -am "Version 1.2.1" && git push
```

Dès que la version de `package.json` change sur `main`, GitHub Actions compile l’installateur Windows et les paquets Linux, puis crée la release `v1.2.1` ; les boutons du site pointent toujours vers la dernière version.

## Licence et crédits

[MIT](LICENSE). Icônes : [Tabler Icons](https://tabler.io/icons) (MIT, © Paweł Kuna) — voir [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Excel est une marque de Microsoft Corporation ; XLGuide est un projet indépendant, non affilié à Microsoft.
