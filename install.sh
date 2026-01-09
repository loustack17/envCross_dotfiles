#!/usr/bin/env bash
# Linux dotfiles installer
# Target: CachyOS / Arch Linux with Niri
# Core: Ghostty, Fish, Neovim, Zed, Yazi, Lazygit
# Niri: Waybar, Mako, Walker, HyprLock, swww, Thunar, Zathura, Polkit, MPV

set -e

# Config
DRY_RUN=0
NO_BACKUP=0
NO_INSTALL=0
FORCE_INSTALL=0
SKIP_TOOLS=()
ONLY_TOOLS=()

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
BACKUP_ROOT="$REPO_ROOT/backup/$(date +%Y%m%d-%H%M%S)"
CONFIG_HOME="${XDG_CONFIG_HOME:-$HOME/.config}"

DISTRO=""
PKG_MANAGER=""
AUR_HELPER=""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'

# Logging
log_info() { printf "${GREEN}[INFO]${NC} %s\n" "$1"; }
log_warn() { printf "${YELLOW}[WARN]${NC} %s\n" "$1"; }
log_error() { printf "${RED}[ERROR]${NC} %s\n" "$1"; exit 1; }

# Help
show_help() {
    cat << 'EOF'
Usage: ./install.sh [OPTIONS]

Options:
  --dry-run, -n         Simulate without changes
  --no-backup           Skip backup
  --no-install          Skip package installation
  --force-install       Force reinstall
  --skip-<tool>         Skip tool (e.g., --skip-ghostty)
  --only-<tool>         Only install tool (e.g., --only-nvim)
  -h, --help            Show help

Examples:
  ./install.sh
  ./install.sh --dry-run
  ./install.sh --skip-ghostty --skip-waybar
  ./install.sh --only-nvim --only-yazi

Tools:
  Core: kitty, ghostty, fish, neovim, zed, yazi, lazygit
  Niri: waybar, mako, walker, hyprlock, swww, thunar, zathura, polkit-gnome, mpv
  Utils: playerctl, brightnessctl, bluez, blueman, elephant, slurp, satty, impala-nm, yt-dlp
EOF
    exit 0
}

# Parse args
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --dry-run|-n) DRY_RUN=1 ;;
            --no-backup) NO_BACKUP=1 ;;
            --no-install) NO_INSTALL=1 ;;
            --force-install) FORCE_INSTALL=1 ;;
            --skip-*) SKIP_TOOLS+=("${1#--skip-}") ;;
            --only-*) ONLY_TOOLS+=("${1#--only-}") ;;
            -h|--help) show_help ;;
            *) log_warn "Unknown option: $1" ;;
        esac
        shift
    done
}

# Detect system
detect_system() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        DISTRO=$ID
    elif [ -f /etc/arch-release ]; then
        DISTRO="arch"
    else
        log_error "Cannot detect Linux distribution"
    fi
    
    if command -v pacman &>/dev/null; then
        PKG_MANAGER="pacman"
        command -v yay &>/dev/null && AUR_HELPER="yay"
        command -v paru &>/dev/null && AUR_HELPER="paru"
    else
        log_error "No supported package manager found"
    fi
}

# Check if should install tool
should_install() {
    local tool=$1
    
    if [[ ${#ONLY_TOOLS[@]} -gt 0 ]]; then
        for only in "${ONLY_TOOLS[@]}"; do
            [[ "$tool" == "$only" ]] && return 0
        done
        return 1
    fi
    
    for skip in "${SKIP_TOOLS[@]}"; do
        [[ "$tool" == "$skip" ]] && return 1
    done
    
    return 0
}

# Install package
install_pkg() {
    local pkg=$1
    local name=$2
    local use_aur=${3:-false}
    
    [[ $DRY_RUN -eq 1 ]] && { log_info "Would install: $name"; return 0; }
    
    case "$PKG_MANAGER" in
        pacman)
            if [[ "$use_aur" == "true" && -n "$AUR_HELPER" ]]; then
                $AUR_HELPER -S --noconfirm --needed "$pkg"
            elif [[ -n "$AUR_HELPER" ]]; then
                $AUR_HELPER -S --noconfirm --needed "$pkg" 2>/dev/null || \
                sudo pacman -S --noconfirm --needed "$pkg"
            else
                sudo pacman -S --noconfirm --needed "$pkg"
            fi
            ;;
        apt) sudo apt update -qq && sudo apt install -y "$pkg" ;;
        dnf) sudo dnf install -y "$pkg" ;;
        zypper) sudo zypper install -y "$pkg" ;;
        *) log_warn "Manual install required: $pkg"; return 1 ;;
    esac
}

# Install tool
install_tool() {
    local cmd=$1
    local pkg=$2
    local name=$3
    local use_aur=${4:-false}
    
    # Check if tool exists
    if command -v "$cmd" &>/dev/null; then
        if [[ $FORCE_INSTALL -eq 0 ]]; then
            log_info "$name already installed (skipping)"
            return 0
        fi
        log_info "$name already installed (forcing reinstall)"
    fi
    
    log_info "Installing $name..."
    
    if [[ $DRY_RUN -eq 1 ]]; then
        log_info "Would install: $name"
        return 0
    fi
    
    if install_pkg "$pkg" "$name" "$use_aur"; then
        if command -v "$cmd" &>/dev/null; then
            log_info "$name installed successfully"
            return 0
        else
            log_warn "$name package installed but command not found"
            return 1
        fi
    else
        log_warn "Failed to install $name"
        return 1
    fi
}

# Special: Zathura with PDF backend
install_zathura() {
    command -v zathura &>/dev/null && [[ $FORCE_INSTALL -eq 0 ]] && { log_info "Zathura already installed"; return 0; }
    
    [[ $DRY_RUN -eq 1 ]] && { log_info "Would install: Zathura"; return 0; }
    
    log_info "Installing Zathura..."
    
    case "$PKG_MANAGER" in
        pacman)
            [[ -n "$AUR_HELPER" ]] && $AUR_HELPER -S --noconfirm --needed zathura zathura-pdf-mupdf || \
            sudo pacman -S --noconfirm --needed zathura zathura-pdf-mupdf
            ;;
        apt) sudo apt update -qq && sudo apt install -y zathura zathura-pdf-poppler ;;
        dnf) sudo dnf install -y zathura zathura-pdf-mupdf ;;
        *) log_warn "Manual install required: zathura"; return 1 ;;
    esac
    
    command -v zathura &>/dev/null && log_info "Zathura installed" || log_warn "Zathura install failed"
}

# Special: Polkit (binary check)
install_polkit() {
    local binary="/usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1"
    
    [[ -f "$binary" && $FORCE_INSTALL -eq 0 ]] && { log_info "Polkit-gnome already installed"; return 0; }
    
    [[ $DRY_RUN -eq 1 ]] && { log_info "Would install: Polkit-gnome"; return 0; }
    
    log_info "Installing Polkit-gnome..."
    install_pkg "polkit-gnome" "Polkit-gnome" false
    
    [[ -f "$binary" ]] && log_info "Polkit-gnome installed" || log_warn "Polkit-gnome binary not found"
}

# Backup
backup() {
    local src=$1
    local name=$2
    
    [[ $NO_BACKUP -eq 1 ]] && return
    [[ ! -e "$src" ]] && return
    
    if [[ $DRY_RUN -eq 1 ]]; then
        log_info "Would backup: $name"
        return
    fi
    
    mkdir -p "$BACKUP_ROOT"
    local dest="$BACKUP_ROOT/$(echo "$name" | tr '/\\:*?"<>| ' '_')"
    
    if cp -a "$src" "$dest" 2>/dev/null; then
        log_info "Backed up: $name → $dest"
    else
        log_warn "Failed to backup: $name"
    fi
}

# Symlink
link_config() {
    local src=$1
    local dst=$2
    local name=$3
    
    # Check source exists
    if [[ ! -e "$src" ]]; then
        log_warn "Source not found: $name ($src)"
        return 1
    fi
    
    if [[ $DRY_RUN -eq 1 ]]; then
        log_info "Would link: $name"
        return 0
    fi
    
    # Backup existing config if it exists
    if [[ -e "$dst" || -L "$dst" ]]; then
        backup "$dst" "$name"
        rm -rf "$dst"
    fi
    
    # Create parent directory
    mkdir -p "$(dirname "$dst")"
    
    # Create symlink
    if ln -sf "$src" "$dst"; then
        log_info "Linked: $name → $dst"
        return 0
    else
        log_error "Failed to link: $name"
        return 1
    fi
}

# Install all tools
install_all_tools() {
    [[ $NO_INSTALL -eq 1 ]] && { log_info "Skipping tool installation"; return; }
    
    echo ""
    log_info "=== Installing Tools ==="
    
    # Core tools (Kitty requires latest from AUR)
    declare -A CORE=(
        ["kitty"]="kitty-git|Kitty|true"
        ["ghostty"]="ghostty-git|Ghostty|true"
        ["fish"]="fish|Fish|false"
        ["neovim"]="neovim|Neovim|false"
        ["zed"]="zed-git|Zed Editor|true"
        ["yazi"]="yazi|Yazi|false"
        ["lazygit"]="lazygit|Lazygit|false"
    )
    
    for cmd in "${!CORE[@]}"; do
        IFS='|' read -r pkg name aur <<< "${CORE[$cmd]}"
        should_install "$cmd" && install_tool "$cmd" "$pkg" "$name" "$aur"
    done
    
    # Niri tools
    declare -A NIRI=(
        ["waybar"]="waybar|Waybar|false"
        ["mako"]="mako|Mako|false"
        ["walker"]="walker-git|Walker|true"
        ["hyprlock"]="hyprlock|HyprLock|false"
        ["swww"]="swww|swww|false"
        ["thunar"]="thunar|Thunar|false"
        ["mpv"]="mpv|MPV|false"
    )
    
    for cmd in "${!NIRI[@]}"; do
        IFS='|' read -r pkg name aur <<< "${NIRI[$cmd]}"
        should_install "$cmd" && install_tool "$cmd" "$pkg" "$name" "$aur"
    done
    
    # Utility tools
    declare -A UTILS=(
        ["playerctl"]="playerctl|Playerctl|false"
        ["brightnessctl"]="brightnessctl|Brightnessctl|false"
        ["bluetoothctl"]="bluez|Bluez|false"
        ["blueman-manager"]="blueman|Blueman|false"
        ["elephant"]="elephant-all-git|Elephant (Walker dependency)|true"
        ["slurp"]="slurp|Slurp|false"
        ["satty"]="satty-git|Satty|true"
        ["impala-nm"]="wlctl-bin|Impala-NM (TUI Network Manager)|true"
        ["yt-dlp"]="yt-dlp|yt-dlp (MPV dependency)|false"
    )
    
    for cmd in "${!UTILS[@]}"; do
        IFS='|' read -r pkg name aur <<< "${UTILS[$cmd]}"
        should_install "$cmd" && install_tool "$cmd" "$pkg" "$name" "$aur"
    done
    
    should_install "zathura" && install_zathura
    should_install "polkit-gnome" && install_polkit
}

# Link all configs
link_all_configs() {
    echo ""
    log_info "=== Linking Configs ==="
    
    # Core
    should_install "kitty" && link_config "$REPO_ROOT/kitty" "$CONFIG_HOME/kitty" "Kitty"
    should_install "ghostty" && link_config "$REPO_ROOT/ghostty" "$CONFIG_HOME/ghostty" "Ghostty"
    should_install "fish" && link_config "$REPO_ROOT/fish" "$CONFIG_HOME/fish" "Fish"
    should_install "neovim" && link_config "$REPO_ROOT/nvim" "$CONFIG_HOME/nvim" "Neovim"
    should_install "zed" && link_config "$REPO_ROOT/zed" "$CONFIG_HOME/zed" "Zed"
    should_install "yazi" && link_config "$REPO_ROOT/yazi" "$CONFIG_HOME/yazi" "Yazi"
    should_install "lazygit" && link_config "$REPO_ROOT/lazygit" "$CONFIG_HOME/lazygit" "Lazygit"
    
    # Niri
    should_install "waybar" && link_config "$REPO_ROOT/waybar" "$CONFIG_HOME/waybar" "Waybar"
    should_install "mako" && link_config "$REPO_ROOT/mako" "$CONFIG_HOME/mako" "Mako"
    should_install "walker" && link_config "$REPO_ROOT/walker" "$CONFIG_HOME/walker" "Walker"
    should_install "hyprlock" && link_config "$REPO_ROOT/hyprlock" "$CONFIG_HOME/niri/hyprlock.conf" "HyprLock"
    should_install "swww" && link_config "$REPO_ROOT/swww" "$CONFIG_HOME/swww" "swww"
    should_install "thunar" && link_config "$REPO_ROOT/thunar" "$CONFIG_HOME/Thunar" "Thunar"
    should_install "zathura" && link_config "$REPO_ROOT/zathura" "$CONFIG_HOME/zathura" "Zathura"
    should_install "mpv" && link_config "$REPO_ROOT/mpv" "$CONFIG_HOME/mpv" "MPV"
}

# Post install info
show_next_steps() {
    echo ""
    log_info "=== Installation Complete ==="
    echo ""
    
    [[ $DRY_RUN -eq 1 ]] && return
    
    should_install "fish" && command -v fish &>/dev/null && echo "Set Fish as default shell: chsh -s \$(which fish)"
    should_install "nvim" && command -v nvim &>/dev/null && echo "Open Neovim to install plugins: nvim"
    should_install "polkit-gnome" && echo "Add to Niri config: exec-once = /usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1"
    should_install "swww" && echo "Initialize swww: swww-daemon && swww img /path/to/wallpaper.jpg"
    
    echo ""
    [[ -d "$BACKUP_ROOT" ]] && log_info "Backups: $BACKUP_ROOT"
    echo "Restart terminal: exec \$SHELL"
}

# Main
main() {
    echo "Linux Dotfiles Installer (Niri Edition)"
    echo "Repository: $REPO_ROOT"
    echo ""
    
    parse_args "$@"
    detect_system
    
    log_info "System: $DISTRO"
    log_info "Package Manager: $PKG_MANAGER${AUR_HELPER:+ ($AUR_HELPER)}"
    
    [[ $NO_INSTALL -eq 0 ]] && install_all_tools
    link_all_configs
    show_next_steps
}

main "$@"
