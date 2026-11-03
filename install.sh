#!/usr/bin/env bash
# XLGuide — installateur Linux
#   curl -fsSL https://joss943.github.io/xlguide/install.sh | bash
#   curl -fsSL https://joss943.github.io/xlguide/install.sh | bash -s -- --uninstall
# Debian/Ubuntu/Mint (.deb) · Fedora/RHEL/Rocky/Alma (.rpm via dnf) · openSUSE (.rpm via zypper)
# Arch/Manjaro/EndeavourOS (pacman) · autres distributions : AppImage dans ~/.local
#
# Sécurité : téléchargements en https uniquement (redirections comprises), fichiers dans un
# dossier temporaire privé, somme SHA-256 comparée à SHA256SUMS.txt de la release AVANT
# toute installation. Tout le script est lu avant de s'exécuter (appel de main à la fin).
set -euo pipefail

REPO="Joss943/xlguide"
BASE="https://github.com/${REPO}/releases/latest/download"
APPIMAGE_DIR="${HOME}/.local/opt/xlguide"
DESKTOP_FILE="${HOME}/.local/share/applications/xlguide.desktop"

c_ok=$'\e[32m'; c_err=$'\e[31m'; c_dim=$'\e[2m'; c_off=$'\e[0m'
info() { printf '%s==>%s %s\n' "$c_ok" "$c_off" "$*"; }
die()  { printf '%sErreur :%s %s\n' "$c_err" "$c_off" "$*" >&2; exit 1; }

SUDO=""
if [ "$(id -u)" -ne 0 ]; then
  if command -v sudo >/dev/null 2>&1; then SUDO="sudo"; else die "sudo est requis (ou lance le script en root)."; fi
fi

download() { # url destination
  if command -v curl >/dev/null 2>&1; then curl -fL --proto '=https' --tlsv1.2 --progress-bar -o "$2" "$1"
  elif command -v wget >/dev/null 2>&1; then wget -q --https-only --show-progress -O "$2" "$1"
  else die "curl ou wget est requis."; fi
}

sha256() { # fichier
  if command -v sha256sum >/dev/null 2>&1; then sha256sum "$1" | cut -d' ' -f1
  elif command -v shasum >/dev/null 2>&1; then shasum -a 256 "$1" | cut -d' ' -f1
  else die "sha256sum est requis pour vérifier le téléchargement."; fi
}

# Télécharge un fichier de la release et vérifie sa somme SHA-256 avant de le rendre.
fetch_verified() { # nom_du_fichier dossier
  local name="$1" dir="$2" expected actual
  [ -f "${dir}/SHA256SUMS.txt" ] || download "${BASE}/SHA256SUMS.txt" "${dir}/SHA256SUMS.txt"
  download "${BASE}/${name}" "${dir}/${name}"
  expected="$(awk -v f="$name" '$2 == f || $2 == "*" f { print $1; exit }' "${dir}/SHA256SUMS.txt")"
  [ -n "$expected" ] || die "${name} absent de SHA256SUMS.txt : installation annulée."
  actual="$(sha256 "${dir}/${name}")"
  [ "$expected" = "$actual" ] || die "somme SHA-256 incorrecte pour ${name} (fichier corrompu ou modifié) : installation annulée."
  info "Somme SHA-256 vérifiée : ${name}"
}

detect() {
  [ -r /etc/os-release ] || { echo appimage; return; }
  # shellcheck disable=SC1091
  . /etc/os-release
  local ids=" ${ID:-} ${ID_LIKE:-} "
  case "$ids" in
    *" debian "*|*" ubuntu "*) echo deb ;;
    *" fedora "*|*" rhel "*|*" centos "*) if command -v dnf >/dev/null 2>&1; then echo dnf; else echo appimage; fi ;;
    *suse*) echo zypper ;;
    *" arch "*|*" archlinux "*) echo pacman ;;
    *) echo appimage ;;
  esac
}

install_appimage() { # dossier_temporaire
  local tmp="$1"
  info "Installation de l'AppImage dans ${APPIMAGE_DIR}"
  fetch_verified "XLGuide-x86_64.AppImage" "$tmp"
  mkdir -p "$APPIMAGE_DIR" "$(dirname "$DESKTOP_FILE")" "${HOME}/.local/bin"
  install -m 755 "${tmp}/XLGuide-x86_64.AppImage" "${APPIMAGE_DIR}/XLGuide.AppImage"
  download "https://joss943.github.io/xlguide/app/icons/icon-512.png" "${APPIMAGE_DIR}/xlguide.png" || true
  ln -sf "${APPIMAGE_DIR}/XLGuide.AppImage" "${HOME}/.local/bin/xlguide"
  cat > "$DESKTOP_FILE" <<DESK
[Desktop Entry]
Name=XLGuide
Comment=Apprendre à utiliser Excel en français
Exec=${APPIMAGE_DIR}/XLGuide.AppImage %U
Icon=${APPIMAGE_DIR}/xlguide.png
Terminal=false
Type=Application
Categories=Office;Education;
Keywords=excel;formule;tableur;apprendre;
StartupWMClass=XLGuide
DESK
  if command -v update-desktop-database >/dev/null 2>&1; then update-desktop-database "$(dirname "$DESKTOP_FILE")" || true; fi
  printf '%s%s%s\n' "$c_dim" "Astuce : si l’AppImage ne démarre pas, installe FUSE 2 (ex. « libfuse2 »)." "$c_off"
}

uninstall() {
  local m; m="$(detect)"
  info "Désinstallation de XLGuide"
  case "$m" in
    deb) $SUDO apt-get remove -y xlguide || true ;;
    dnf) $SUDO dnf remove -y xlguide || true ;;
    zypper) $SUDO zypper --non-interactive remove xlguide || true ;;
    pacman) $SUDO pacman -R --noconfirm xlguide || true ;;
  esac
  rm -rf "$APPIMAGE_DIR" "$DESKTOP_FILE" "${HOME}/.local/bin/xlguide"
  info "XLGuide a été désinstallé."
}

main() {
  if [ "${1:-}" = "--uninstall" ]; then uninstall; exit 0; fi
  [ "$(uname -m)" = "x86_64" ] || die "seule l'architecture x86_64 est disponible pour l'instant (détectée : $(uname -m))."
  local m tmp; m="$(detect)"; tmp="$(mktemp -d)"; trap 'rm -rf "$tmp"' EXIT
  info "Système détecté : ${m}"
  case "$m" in
    deb)
      fetch_verified "xlguide-amd64.deb" "$tmp"
      # lisible par l'utilisateur _apt, qui télécharge et lit les paquets sans droits root
      chmod 644 "${tmp}/xlguide-amd64.deb"; chmod 755 "$tmp"
      $SUDO apt-get install -y "${tmp}/xlguide-amd64.deb" ;;
    dnf)
      fetch_verified "xlguide-x86_64.rpm" "$tmp"
      $SUDO dnf install -y "${tmp}/xlguide-x86_64.rpm" ;;
    zypper)
      fetch_verified "xlguide-x86_64.rpm" "$tmp"
      $SUDO zypper --non-interactive install --allow-unsigned-rpm "${tmp}/xlguide-x86_64.rpm" ;;
    pacman)
      fetch_verified "xlguide-x86_64.pacman" "$tmp"
      $SUDO pacman -U --noconfirm "${tmp}/xlguide-x86_64.pacman" ;;
    *) install_appimage "$tmp" ;;
  esac
  info "XLGuide est installé : lance-le depuis le menu des applications (ou commande « xlguide »)."
}

main "$@"
