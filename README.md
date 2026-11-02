<div align="center">

<img src="app/icons/icon.svg" width="88" alt="XLGuide">

# XLGuide

**Les formules Excel en français, au moment où tu en as besoin.**

Application gratuite pour **Windows** et **Linux** (et version web) : décris ce que tu veux faire, XLGuide trouve la bonne fonction, explique chaque argument et te donne la formule prête à coller. Pensée pour la comptabilité.

[![CI](https://github.com/Joss943/xlguide/actions/workflows/ci.yml/badge.svg)](https://github.com/Joss943/xlguide/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/Joss943/xlguide?label=version&color=1a7f4b)](https://github.com/Joss943/xlguide/releases/latest)
[![Licence MIT](https://img.shields.io/badge/licence-MIT-1a7f4b)](LICENSE)

[**⬇ Télécharger**](https://joss943.github.io/xlguide/#telecharger) · [**🌐 Version web**](https://joss943.github.io/xlguide/app/) · [Site](https://joss943.github.io/xlguide/)

<img src="site/screenshot.png" alt="Capture d’écran de XLGuide" width="900">

</div>

---

## Ce que fait XLGuide

| | |
|---|---|
| 🔎 **Recherche en langage naturel** | « additionner avec plusieurs conditions », « dernier jour du mois », « enlever les espaces »… Tolère accents oubliés, pluriels et fautes de frappe. Accepte aussi les noms anglais (`SUMIFS`, `VLOOKUP`). |
| 📚 **220 fonctions détaillées** | Description, syntaxe, chaque argument expliqué, exemples commentés, pièges à éviter, fonctions liées, version d’Excel requise. |
| 🧾 **73 recettes de comptabilité** | TVA HT/TTC, marges, mensualités et tableau d’amortissement d’emprunt, amortissements (linéaire, prorata temporis, dégressif fiscal), échéances « 30 jours fin de mois », balance âgée, rapprochement bancaire, lettrage, FEC, charges constatées d’avance, jours fériés, heures sup… |
| 🇫🇷 **100 % Excel français** | Noms français (`SOMME.SI.ENS`, `RECHERCHEX`, `SIERREUR`), séparateur `;`, virgule décimale. Bouton **EN** pour voir chaque formule en version anglaise. |
| ⇄ **Traducteur de formules** | Colle une formule d’un tuto anglais, récupère la version française (et inversement), avec avertissements (codes de format, constantes matricielles, fonctions inconnues). |
| 🏷️ **Compatibilité de version** | Choisis ta version (2010 → 365) : les fonctions absentes sont signalées. |
| ⚠️ **Erreurs & raccourcis** | Causes et solutions de `#N/A`, `#VALEUR!`, `#PROPAGATION!`… et les raccourcis clavier Excel (AZERTY). |
| ✈️ **Hors-ligne, privé** | Aucune connexion, aucun compte, aucune donnée envoyée. Favoris, mode sombre, navigation 100 % clavier. |

**Fiabilité :** chaque exemple chiffré (171 aujourd’hui) est recalculé automatiquement par un tableur indépendant (LibreOffice Calc) dans la CI, et chaque formule passe un aller-retour FR → EN → FR.

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

- Clique sur le nom d’une fonction **dans une formule** pour ouvrir sa fiche.
- Colle une formule commençant par `=` dans l’onglet **Traducteur**.
- ★ ajoute une fiche à tes favoris (stockés localement).

## Développement

Prérequis : Node.js 20+.

```bash
git clone https://github.com/Joss943/xlguide && cd xlguide
npm ci
npm start                 # lance l'application de bureau
npm test                  # valide la base, le traducteur et la recherche
npm run dist:linux        # paquets deb, rpm, pacman, AppImage dans dist/
npm run dist:win          # installateur Windows (sous Windows)
npm run site:build        # génère le site GitHub Pages dans _site/
```

Vérifier les résultats des exemples avec LibreOffice (`soffice` + `python3-openpyxl`) :

```bash
node tests/export-examples.js > /tmp/ex.json && python3 tests/verify_libreoffice.py /tmp/ex.json
```

### Structure

```
app/                 Application (HTML/CSS/JS sans dépendance) — partagée par le bureau et le web
  data/              Base de connaissances : fonctions, recettes, erreurs, raccourcis
  js/formula.js      Analyse, coloration et traduction FR ⇄ EN des formules
  js/search.js       Moteur de recherche en langage naturel
  js/app.js          Interface
electron/            Enveloppe bureau (fenêtre sécurisée : sandbox, isolation de contexte)
site/                Site GitHub Pages + scripts d'installation install.sh / install.ps1
tests/               Tests Node + vérification des résultats via LibreOffice
.github/workflows/   CI, compilation Windows/Linux et release, déploiement du site
```

### Ajouter une fonction ou une recette

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

`npm test` signale les erreurs (fonction inconnue dans un exemple, parenthèses, séparateur anglais, aller-retour de traduction…).

### Publier une version

```bash
npm version patch --no-git-tag-version   # 1.0.0 → 1.0.1 dans package.json
# reporter la version dans APP_VERSION (app/js/app.js) et le cache de app/sw.js — npm test le vérifie
git commit -am "Version 1.0.1" && git push
```

Dès que la version de `package.json` change sur `main`, GitHub Actions compile l’installateur Windows et les paquets Linux, puis crée la release `v1.0.1` ; les boutons du site pointent toujours vers la dernière version.

## Licence

[MIT](LICENSE). Excel est une marque de Microsoft Corporation ; XLGuide est un projet indépendant, non affilié à Microsoft.
