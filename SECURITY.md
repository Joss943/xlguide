# Sécurité

## Signaler une faille

Merci de ne pas ouvrir d’issue publique pour une faille. Utilise le signalement privé de GitHub :
onglet **Security** du dépôt, puis **Report a vulnerability**. Décris la version concernée, les étapes
pour reproduire et l’impact.

Seule la dernière version publiée reçoit des correctifs.

## Ce que fait l’application

XLGuide n’a ni compte, ni serveur, ni télémétrie. Le contenu est embarqué ; les favoris, la progression
et les réglages restent dans le stockage local de l’appareil. La seule requête réseau du site est la
lecture de la dernière version publiée (API GitHub), affichée en texte.

### Application de bureau (Electron)

- Rendu isolé et sans accès à Node : `contextIsolation`, `sandbox`, `nodeIntegration: false` ; le script
  de préchargement n’expose qu’un marqueur « version bureau ».
- Aucune navigation hors de `app/index.html` (y compris vers d’autres fichiers locaux), aucune nouvelle
  fenêtre, aucune `<webview>`, aucun téléchargement.
- Aucune connexion réseau au démarrage : le correcteur orthographique de Chromium, qui téléchargeait un
  dictionnaire chez Google, est coupé.
- Liens externes ouverts dans le navigateur seulement en https, vers une liste fermée de sites
  (dépôt GitHub, site du projet, crédits des icônes).
- Permissions web refusées (caméra, micro, géolocalisation, notifications, périphériques…), sauf
  l’écriture dans le presse-papiers utilisée par les boutons « Copier ».
- Fusibles Electron : `ELECTRON_RUN_AS_NODE`, `NODE_OPTIONS` et `--inspect` désactivés, code chargé
  uniquement depuis l’archive `app.asar`.

### Version web et site

- Politique de sécurité du contenu stricte : scripts, styles, polices et images du site uniquement,
  aucun script ni style en ligne, ni plugin, ni cadre.
- Toute donnée affichée est échappée ; les valeurs relues du stockage local sont contrôlées.
- Aucune ressource tierce (pas de CDN) : polices et icônes sont servies par le site.

### Installation

- Les scripts `install.sh` et `install.ps1` téléchargent en https uniquement et comparent la somme
  SHA-256 du paquet à `SHA256SUMS.txt` avant toute installation.
- Les releases sont compilées par GitHub Actions avec un jeton en lecture seule ; seul le job de
  publication peut écrire. Les actions sont épinglées par empreinte de commit.

## Vérifier un téléchargement

```bash
sha256sum -c --ignore-missing SHA256SUMS.txt                     # Linux
gh attestation verify XLGuide-Setup.exe --repo Joss943/xlguide   # provenance signée (Sigstore)
```

Sous Windows : `(Get-FileHash .\XLGuide-Setup.exe).Hash` doit être égal à la ligne `XLGuide-Setup.exe`
de `SHA256SUMS.txt`.

## Limites connues

- Les installateurs ne sont pas signés (pas de certificat Authenticode, paquets Linux sans signature
  GPG) : Windows SmartScreen peut avertir. Les sommes SHA-256 et l’attestation de provenance
  permettent de vérifier l’origine des fichiers.
- La version web partage son stockage local avec les autres pages de `joss943.github.io` (même origine
  GitHub Pages) ; l’application ne fait confiance à aucune valeur relue sans la contrôler.
- `npm audit` signale une alerte modérée (minimatch, déni de service sur des motifs malveillants) dans les
  outils de compilation (electron-builder) : ils ne sont pas livrés dans l’application et n’utilisent
  que des motifs fixes.

## Contrôles automatiques

`npm test` contient une section **Sécurité** : options d’Electron (avec un module simulé), politiques de
sécurité du contenu, contrôle du stockage local, scripts d’installation, permissions et épinglage des
workflows. La CI exécute aussi les deux scripts d’installation avec des téléchargements simulés
(`tests/install-sh.test.sh`, `tests/install-ps1.test.ps1`, sous PowerShell 7 et Windows PowerShell 5.1) :
un fichier modifié, absent de `SHA256SUMS.txt` ou au nom voisin doit être refusé. ShellCheck analyse
`install.sh` ; Dependabot propose chaque semaine les mises à jour de dépendances et d’actions.
