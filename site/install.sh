#!/usr/bin/env bash
# XLGuide — installateur Linux
#   curl -fsSL https://joss943.github.io/xlguide/install.sh | bash
#   curl -fsSL https://joss943.github.io/xlguide/install.sh | bash -s -- --uninstall
# Debian/Ubuntu/Mint (.deb) · Fedora/RHEL/Rocky/Alma (.rpm via dnf) · openSUSE (.rpm via zypper)
# Arch/Manjaro/EndeavourOS (pacman) · autres distributions : AppImage dans ~/.local
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
  command -v sudo >/dev/null 2>&1 && SUDO="sudo" || die "sudo est requis (ou lance le script en root)."
fi

download() { # url destination
  if command -v curl >/dev/null 2>&1; then curl -fL --progress-bar -o "$2" "$1"
  elif command -v wget >/dev/null 2>&1; then wget -q --show-progress -O "$2" "$1"
  else die "curl ou wget est requis."; fi
}

detect() {
  [ -r /etc/os-release ] || { echo appimage; return; }
  # shellcheck disable=SC1091
  . /etc/os-release
  local ids=" ${ID:-} ${ID_LIKE:-} "
  case "$ids" in
    *" debian "*|*" ubuntu "*) echo deb ;;
    *" fedora "*|*" rhel "*|*" centos "*) command -v dnf >/dev/null 2>&1 && echo dnf || echo appimage ;;
    *suse*) echo zypper ;;
    *" arch "*|*" archlinux "*) echo pacman ;;
    *) echo appimage ;;
  esac
}

install_appimage() {
  info "Installation de l'AppImage dans ${APPIMAGE_DIR}"
  mkdir -p "$APPIMAGE_DIR" "$(dirname "$DESKTOP_FILE")" "${HOME}/.local/bin"
  download "${BASE}/XLGuide-x86_64.AppImage" "${APPIMAGE_DIR}/XLGuide.AppImage"
  chmod +x "${APPIMAGE_DIR}/XLGuide.AppImage"
  download "https://joss943.github.io/xlguide/app/icons/icon-512.png" "${APPIMAGE_DIR}/xlguide.png" || true
  ln -sf "${APPIMAGE_DIR}/XLGuide.AppImage" "${HOME}/.local/bin/xlguide"
  cat > "$DESKTOP_FILE" <<DESK
[Desktop Entry]
Name=XLGuide
Comment=Formules Excel en français
Exec=${APPIMAGE_DIR}/XLGuide.AppImage %U
Icon=${APPIMAGE_DIR}/xlguide.png
Terminal=false
Type=Application
Categories=Office;
Keywords=excel;formule;comptabilite;tableur;
StartupWMClass=XLGuide
DESK
  command -v update-desktop-database >/dev/null 2>&1 && update-desktop-database "$(dirname "$DESKTOP_FILE")" || true
  printf '%sAstuce : si l’AppImage ne démarre pas, installe FUSE 2 (ex. « libfuse2 »).%s\n' "$c_dim" "$c_off"
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
  [ "${1:-}" = "--uninstall" ] && { uninstall; exit 0; }
  [ "$(uname -m)" = "x86_64" ] || die "seule l'architecture x86_64 est disponible pour l'instant (détectée : $(uname -m))."
  local m tmp; m="$(detect)"; tmp="$(mktemp -d)"; trap 'rm -rf "$tmp"' EXIT
  info "Système détecté : ${m}"
  case "$m" in
    deb)
      download "${BASE}/xlguide-amd64.deb" "${tmp}/xlguide-amd64.deb"
      chmod 644 "${tmp}/xlguide-amd64.deb"; chmod 755 "$tmp"
      $SUDO apt-get install -y "${tmp}/xlguide-amd64.deb" ;;
    dnf)
      download "${BASE}/xlguide-x86_64.rpm" "${tmp}/xlguide-x86_64.rpm"
      $SUDO dnf install -y "${tmp}/xlguide-x86_64.rpm" ;;
    zypper)
      download "${BASE}/xlguide-x86_64.rpm" "${tmp}/xlguide-x86_64.rpm"
      $SUDO zypper --non-interactive install --allow-unsigned-rpm "${tmp}/xlguide-x86_64.rpm" ;;
    pacman)
      download "${BASE}/xlguide-x86_64.pacman" "${tmp}/xlguide-x86_64.pacman"
      $SUDO pacman -U --noconfirm "${tmp}/xlguide-x86_64.pacman" ;;
    *) install_appimage ;;
  esac
  info "XLGuide est installé : lance-le depuis le menu des applications (ou commande « xlguide »)."
}

main "$@"
