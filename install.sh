#!/usr/bin/env bash

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
CONFIG_HOME="${XDG_CONFIG_HOME:-$HOME/.config}"
BACKUP_DIR=""

# Options
DRY_RUN=false
NO_BACKUP=false
NO_INSTALL=false
FORCE_INSTALL=false
BACKUP_ONLY=false
SKIP_TOOLS=()
ONLY_TOOLS=()

readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[0;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m'

# Format: "name|cmd|pkg|aur|src|dst"
#   - Leave cmd/pkg empty for config-only entries (stow only, no install)
#   - Leave src/dst empty for install-only entries (no config)
#   - dst is relative to CONFIG_HOME, or absolute if starts with /

TOOLS=(
    # === Utilities (no config files) ===
    "playerctl|playerctl|playerctl|false||"
    "brightnessctl|brightnessctl|brightnessctl|false||"
    "bluez|bluetoothctl|bluez,bluez-utils|false||"
    "blueman|blueman-manager|blueman|false||"
    "slurp|slurp|slurp|false||"
    "grim|grim|grim|false||"
    "satty|satty|satty-git|true||"
    "impala|impala|impala|true||"
    "yt-dlp|yt-dlp|yt-dlp|false||"
    "wl-clipboard|wl-copy|wl-clipboard|false||"
    "swayosd|swayosd-server|swayosd|false||"
    "swayidle|swayidle|swayidle|false||"
    "wlr-randr|wlr-randr|wlr-randr|false||"
    "polkit-gnome|/usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1|polkit-gnome|false||"
    "awww|awww|awww-git|true||"
    "ripdrag|ripdrag|ripdrag-git|true||"
    "pcmanfm-qt|pcmanfm-qt|pcmanfm-qt|false|Linux-config/pcmanfm-qt|pcmanfm-qt"

    # === Core Tools ===
    "niri|niri|niri|false|Linux-config/niri|niri"
    "kitty|kitty|kitty-git|true|Linux-config/kitty|kitty"
    "ghostty|ghostty|ghostty-git|true|Linux-config/ghostty|ghostty"
    "fish|fish|fish|false|Linux-config/fish|fish"
    "neovim|nvim|neovim|false|nvim|nvim"
    "zed|zed|zed-git|true|zed|zed"
    "yazi|yazi|yazi|false|yazi|yazi"
    "lazygit|lazygit|lazygit|false|lazygit|lazygit"
    "claude-code|claude||false|AI-Supporter/Claude Code|$HOME/.claude"
    "codex|codex||false|AI-Supporter/Codex|$HOME/.codex"
    "zellij|zellij|zellij|false|Linux-config/zellij|zellij"

    # === Niri Ecosystem ===
    "waybar|waybar|waybar|false|Linux-config/waybar|waybar"
    "mako|mako|mako|false|Linux-config/mako|mako"
    "zathura|zathura|zathura,zathura-pdf-mupdf|false|Linux-config/zathura|zathura"
    "mpv|mpv|mpv|false|mpv|mpv"
    "hyprlock|hyprlock|hyprlock|false|Linux-config/hyprlock|hypr"

    # === Config-only (no package to install, stow only) ===
    "fontconfig|||false|Linux-config/fontconfig|fontconfig"
    "gtk-3|||false|Linux-config/gtk-3.0|gtk-3.0"
    "gtk-4|||false|Linux-config/gtk-4.0|gtk-4.0"
    "qt5ct|||false|Linux-config/qt5ct|qt5ct"
    "qt5ct-env|||false|Linux-config/environment.d|environment.d"
    "vicinae|||false|Linux-config/vicinae|vicinae"
    "vicinae-bitwarden|||false|Linux-config/vicinae-extensions/bitwarden|$HOME/.local/share/vicinae/extensions/bitwarden"
)


log_info()  { printf "${GREEN}[INFO]${NC}  %s\n" "$1"; }
log_warn()  { printf "${YELLOW}[WARN]${NC}  %s\n" "$1"; }
log_error() { printf "${RED}[ERROR]${NC} %s\n" "$1"; }
log_step()  { printf "${BLUE}[STEP]${NC}  %s\n" "$1"; }
log_dry()   { printf "${YELLOW}[DRY]${NC}   %s\n" "$1"; }

die() { log_error "$1"; exit 1; }


show_help() {
    cat << EOF
Usage: ./install.sh [OPTIONS]

Options:
  -n, --dry-run       Show what would be done without making changes
  -b, --backup        Backup existing configs only (no install/link)
  --no-backup         Skip backup step
  --no-install        Skip package installation
  --force-install     Force reinstall packages
  --skip-<tool>       Skip specific tool (e.g., --skip-ghostty)
  --only-<tool>       Only install specific tool (e.g., --only-neovim)
  -h, --help          Show this help

Examples:
  ./install.sh                        # Full installation
  ./install.sh --dry-run              # Preview changes
  ./install.sh --backup               # Backup only
  ./install.sh --skip-kitty           # Skip kitty
  ./install.sh --only-neovim          # Only install neovim

Tools:
  Core:   niri, kitty, ghostty, fish, neovim, zed, yazi, lazygit, zellij
  AI:     claude-code, codex
  Niri:   waybar, mako, zathura, mpv, hyprlock
  Utils:  playerctl, brightnessctl, bluez, blueman, slurp, grim, satty, impala,
          yt-dlp, wl-clipboard, swayosd, swayidle, wlr-randr, polkit-gnome, awww,
          ripdrag, pcmanfm-qt
EOF
    exit 0
}


parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            -n|--dry-run)      DRY_RUN=true ;;
            -b|--backup)       BACKUP_ONLY=true ;;
            --no-backup)       NO_BACKUP=true ;;
            --no-install)      NO_INSTALL=true ;;
            --force-install)   FORCE_INSTALL=true ;;
            --skip-*)          SKIP_TOOLS+=("${1#--skip-}") ;;
            --only-*)          ONLY_TOOLS+=("${1#--only-}") ;;
            -h|--help)         show_help ;;
            *)                 log_warn "Unknown option: $1" ;;
        esac
        shift
    done
}


AUR_HELPER=""

detect_system() {
    command -v pacman &>/dev/null || die "pacman not found - Arch-based distro required"

    # Prefer paru over yay
    if command -v paru &>/dev/null; then
        AUR_HELPER="paru"
    elif command -v yay &>/dev/null; then
        AUR_HELPER="yay"
    else
        log_warn "No AUR helper found (paru/yay). AUR packages will be skipped, official packages will use pacman."
    fi
}


should_process() {
    local name="$1"

    if [[ ${#ONLY_TOOLS[@]} -gt 0 ]]; then
        for only in "${ONLY_TOOLS[@]}"; do
            [[ "$name" == "$only" ]] && return 0
        done
        return 1
    fi

    for skip in "${SKIP_TOOLS[@]}"; do
        [[ "$name" == "$skip" ]] && return 1
    done

    return 0
}


is_installed() {
    local cmd="$1"

    if [[ "$cmd" == /* ]]; then
        [[ -f "$cmd" ]]
    else
        command -v "$cmd" &>/dev/null
    fi
}

install_packages() {
    local pkgs="$1"
    local is_aur="$2"

    # Split comma-separated packages
    IFS=',' read -ra pkg_array <<< "$pkgs"

    if [[ "$is_aur" == "true" ]]; then
        if [[ -z "$AUR_HELPER" ]]; then
            log_warn "No AUR helper available, skipping: ${pkg_array[*]}"
            return 1
        fi
        $AUR_HELPER -S --noconfirm --needed "${pkg_array[@]}"
    else
        if [[ -n "$AUR_HELPER" ]]; then
            $AUR_HELPER -S --noconfirm --needed "${pkg_array[@]}"
        else
            sudo pacman -S --noconfirm --needed "${pkg_array[@]}"
        fi
    fi
}

install_tool() {
    local name="$1"
    local cmd="$2"
    local pkg="$3"
    local is_aur="$4"

    if is_installed "$cmd"; then
        if [[ "$FORCE_INSTALL" == "false" ]]; then
            log_info "$name: already installed"
            return 0
        fi
        log_info "$name: reinstalling (--force-install)"
    fi

    if [[ "$DRY_RUN" == "true" ]]; then
        log_dry "Would install: $name ($pkg)"
        return 0
    fi

    log_info "Installing $name..."
    if install_packages "$pkg" "$is_aur"; then
        if is_installed "$cmd"; then
            log_info "$name: installed successfully"
        else
            log_warn "$name: package installed but command not found"
        fi
    else
        log_warn "$name: installation failed"
        return 1
    fi
}

ensure_stow() {
    if command -v stow &>/dev/null; then
        log_info "stow: already installed"
        return 0
    fi

    if [[ "$DRY_RUN" == "true" ]]; then
        log_dry "Would install required tool: stow"
        return 0
    fi

    if [[ "$NO_INSTALL" == "true" ]]; then
        log_warn "stow is required; installing even with --no-install"
    fi

    log_info "stow: not found, installing..."
    if install_packages "stow" "false" && command -v stow &>/dev/null; then
        log_info "stow: installed successfully"
        return 0
    fi

    die "failed to install required tool: stow"
}


init_backup_dir() {
    if [[ "$NO_BACKUP" == "true" ]]; then
        return
    fi

    BACKUP_DIR="$REPO_ROOT/backup/$(date +%Y%m%d-%H%M%S)"

    if [[ "$DRY_RUN" == "true" ]]; then
        log_dry "Backup directory: $BACKUP_DIR"
    else
        mkdir -p "$BACKUP_DIR"
        log_info "Backup directory: $BACKUP_DIR"
    fi
}

backup_path() {
    local path="$1"
    local name="$2"

    [[ "$NO_BACKUP" == "true" ]] && return 0
    [[ ! -e "$path" ]] && return 0

    if [[ -L "$path" ]]; then
        local target
        target=$(readlink -f "$path" 2>/dev/null || true)
        if [[ "$target" == "$REPO_ROOT"* ]]; then
            log_info "$name: already symlinked to repo"
            return 0
        fi
    fi

    local backup_name
    backup_name=$(echo "$name" | tr '/\\:*?"<>| ' '_')

    if [[ "$DRY_RUN" == "true" ]]; then
        log_dry "Would backup: $name"
    else
        if cp -a "$path" "$BACKUP_DIR/$backup_name" 2>/dev/null; then
            log_info "$name: backed up"
        else
            log_warn "$name: backup failed"
        fi
    fi
}


remove_stow_conflicts() {
    local src_dir="$1"
    local dst_dir="$2"
    local item base target

    shopt -s dotglob nullglob
    for item in "$src_dir"/*; do
        base="$(basename "$item")"
        target="$dst_dir/$base"
        if [[ -d "$item" && ! -L "$item" ]]; then
            [[ -d "$target" ]] && remove_stow_conflicts "$item" "$target"
        else
            [[ -e "$target" || -L "$target" ]] && rm -f "$target"
        fi
    done
    shopt -u dotglob nullglob
}

create_stow_package() {
    local src="$1"
    local dst="$2"
    local name="$3"

    if [[ ! -d "$src" ]]; then
        log_warn "$name: source not found ($src)"
        return 1
    fi

    if [[ "$DRY_RUN" == "true" ]]; then
        log_dry "Would stow: $name -> $dst"
        return 0
    fi

    [[ -L "$dst" ]] && rm -f "$dst"
    mkdir -p "$dst"
    remove_stow_conflicts "$src" "$dst"

    if stow --no-folding -d "$(dirname "$src")" -t "$dst" "$(basename "$src")"; then
        log_info "$name: stowed -> $dst"
    else
        log_error "$name: failed to stow"
        return 1
    fi
}


step_install_tools() {
    [[ "$NO_INSTALL" == "true" ]] && return

    echo ""
    log_step "=== Step 1: Installing Tools ==="
    echo ""

    for entry in "${TOOLS[@]}"; do
        IFS='|' read -r name cmd pkg is_aur src dst <<< "$entry"
        [[ -z "$pkg" ]] && continue

        should_process "$name" || continue
        install_tool "$name" "$cmd" "$pkg" "$is_aur"
    done
}

step_backup_configs() {
    [[ "$NO_BACKUP" == "true" ]] && return

    echo ""
    log_step "=== Step 2: Backing Up Existing Configs ==="
    echo ""

    init_backup_dir

    for entry in "${TOOLS[@]}"; do
        IFS='|' read -r name cmd pkg is_aur src dst <<< "$entry"
        [[ -z "$dst" ]] && continue

        should_process "$name" || continue

        local full_dst
        if [[ "$dst" == /* ]]; then
            full_dst="$dst"
        else
            full_dst="$CONFIG_HOME/$dst"
        fi

        backup_path "$full_dst" "$name"
    done
}

step_symlink_configs() {
    echo ""
    log_step "=== Step 3: Creating Links ==="
    echo ""

    for entry in "${TOOLS[@]}"; do
        IFS='|' read -r name cmd pkg is_aur src dst <<< "$entry"
        [[ -z "$src" || -z "$dst" ]] && continue

        should_process "$name" || continue

        local full_src="$REPO_ROOT/$src"
        local full_dst
        if [[ "$dst" == /* ]]; then
            full_dst="$dst"
        else
            full_dst="$CONFIG_HOME/$dst"
        fi

        create_stow_package "$full_src" "$full_dst" "$name"
    done
}

show_summary() {
    echo ""
    log_step "=== Installation Complete ==="
    echo ""

    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "Dry run completed. No changes were made."
        return
    fi

    if should_process "fish" && command -v fish &>/dev/null; then
        echo "  Set Fish as default shell: chsh -s \$(which fish)"
    fi

    if should_process "neovim" && command -v nvim &>/dev/null; then
        echo "  Open Neovim to install plugins: nvim"
    fi

    if should_process "awww" && command -v awww &>/dev/null; then
        echo "  Initialize wallpaper daemon: awww-daemon"
    fi

    if should_process "polkit-gnome"; then
        echo "  Add to Niri config: spawn-at-startup \"/usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1\""
    fi

    echo ""
    if [[ -n "$BACKUP_DIR" && -d "$BACKUP_DIR" ]]; then
        log_info "Backups saved to: $BACKUP_DIR"
    fi

    echo ""
    echo "Restart your shell: exec \$SHELL"
}


main() {
    echo "============================================"
    echo "  Linux Dotfiles Installer (CachyOS/Arch)"
    echo "============================================"
    echo ""
    echo "Repository: $REPO_ROOT"
    echo "Config:     $CONFIG_HOME"
    echo ""

    parse_args "$@"
    detect_system

    log_info "AUR Helper: ${AUR_HELPER:-none}"
    [[ "$DRY_RUN" == "true" ]] && log_warn "DRY RUN MODE - No changes will be made"

    if [[ "$BACKUP_ONLY" == "true" ]]; then
        step_backup_configs
        [[ -n "$BACKUP_DIR" ]] && log_info "Backup complete: $BACKUP_DIR"
        exit 0
    fi

    ensure_stow

    step_install_tools
    step_backup_configs
    step_symlink_configs
    show_summary
}

main "$@"
