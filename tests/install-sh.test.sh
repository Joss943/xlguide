#!/usr/bin/env bash
# Vérification SHA-256 de site/install.sh, sans réseau ni installation :
# les fonctions du script sont chargées sans lancer main, et download copie des fichiers locaux.
#   bash tests/install-sh.test.sh
set -euo pipefail
cd "$(dirname "$0")/.."

script="site/install.sh"
[ "$(grep -cx 'main "\$@"' "$script")" = 1 ] || { echo "ÉCHEC : appel « main \"\$@\" » introuvable dans ${script}"; exit 1; }
# shellcheck source=/dev/null
source <(grep -vx 'main "\$@"' "$script")

rel="$(mktemp -d)"
trap 'rm -rf "$rel"' EXIT
# shellcheck disable=SC2329 # appelée par fetch_verified
download() { cp "${rel}/$(basename "$1")" "$2"; } # remplace le téléchargement https

name="xlguide-amd64.deb"
printf 'paquet de test\n' > "${rel}/${name}"
good="$(sha256sum "${rel}/${name}" | cut -d' ' -f1)"
bad="$(printf '0%.0s' {1..64})"
failures=0

# cas <libellé> <attendu : accepte|refuse> <contenu de SHA256SUMS.txt>
cas() {
  local dir got
  dir="$(mktemp -d -p "$rel")"
  printf '%b' "$3" > "${rel}/SHA256SUMS.txt"
  if (fetch_verified "$name" "$dir") >/dev/null 2>&1; then got="accepte"; else got="refuse"; fi
  if [ "$got" = "$2" ]; then echo "ok     $1 : ${got}"; else echo "ÉCHEC  $1 : ${got}, attendu ${2}"; failures=$((failures + 1)); fi
}

cas "fichier intact"                     accepte "${good}  ${name}\n"
cas "marqueur binaire *"                 accepte "${good} *${name}\n"
cas "parmi d'autres fichiers"            accepte "${bad}  XLGuide-Setup.exe\n${good}  ${name}\n"
cas "somme différente (fichier modifié)" refuse  "${bad}  ${name}\n"
cas "absent de SHA256SUMS.txt"           refuse  "${good}  autre.deb\n"
cas "nom voisin"                         refuse  "${good}  ${name}.old\n"
cas "SHA256SUMS.txt vide"                refuse  ""

[ "$failures" -eq 0 ] || { echo "${failures} cas en échec"; exit 1; }
echo "install.sh : vérification SHA-256 conforme"
