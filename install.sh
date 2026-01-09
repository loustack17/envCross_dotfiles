#!/usr/bin/env bash
# Linux dotfiles installer
# Target: Arch Linux with Niri
# Core: Ghostty, Fish, Neovim, Zed, Yazi, Lazygit
# Niri: Waybar, Mako, Walker, HyprLock, swww, Thunar, Zathura, Polkit, MPV

set -e

# ============================================================================
# Configuration
# ============================================================================

DRY_RUN=0
NO_BACKUP=0
BACKUP_ONLY=0
NO_INSTALL=0
FORCE_INSTALL=0
SKIP_TOOLS=()
ONLY_TOOLS=()

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
BACKUP_ROOT="$REPO_ROOT/backup/$(date +%Y%m%d-%H%M%S)"
CONFIG_HOME="${XDG_CONFIG_HOME:-$HOME/.config}"

PKG_MANAGER=""
AUR_HELPER=""

# Colors
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[0;33m'
readonly RED='\033[0;31m'
readonly NC='\033[0m'

# ============================================================================
# Tool Definitions (Data-Driven Configuration)
# ============================================================================

# Format: "cmd|pkg|name|use_aur|src_subdir|dst_path"
# - cmd: command to check
# - pkg: package name
# - name: display name
# - use_aur: true/false
# - src_subdir: subdirectory in repo (relative to REPO_ROOT)
# - dst_path: destination path (relative to CONFIG_HOME, or absolute)

declare -a TOOL_DEFINITIONS=(
    # Utilities (dependencies for other tools)
    "playerctl|playerctl|Playerctl|false|||"
    "brightnessctl|brightnessctl|Brightnessctl|false|||"
    "bluetoothctl|bluez|Bluez|false|||"
    "blueman-manager|blueman|Blueman|false|||"
    "elephant|elephant-all-git|Elephant|true|niri/elephant|elephant"
    "slurp|slurp|Slurp|false|||"
    "satty|satty-git|Satty|true|||"
    "impala-nm|wlctl-bin|Impala-NM|true|||"
    "yt-dlp|yt-dlp|yt-dlp|false|||"
    
    # Core tools
    "kitty|kitty-git|Kitty|true|niri/kitty|kitty"
    "ghostty|ghostty-git|Ghostty|true|niri/ghostty|ghostty"
    "fish|fish|Fish|false|niri/fish|fish"
    "neovim|neovim|Neovim|false|nvim|nvim"
    "zed|zed-git|Zed|true|zed|zed"
    "yazi|yazi|Yazi|false|yazi|yazi"
    "lazygit|lazygit|Lazygit|false|lazygit|lazygit"
    
    # Niri ecosystem
    "waybar|waybar|Waybar|false|niri/waybar|waybar"
    "mako|mako|Mako|false|niri/mako|mako"
    "walker|walker-git|Walker|true|niri/walker|walker"
    "hyprlock|hyprlock|HyprLock|false|niri/hyprlock|niri/hyprlock.conf"
    "swww|swww|swww|false|niri/swww|swww"
    "thunar|thunar|Thunar|false|niri/thunar|Thunar"
    "zathura|zathura|Zathura|false|niri/zathura|zathura"
    "mpv|mpv|MPV|false|mpv|mpv"
)

# Special handling tools
readonly POLKIT_BINARY="/usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1"

# ============================================================================
# Logging Functions
# ============================================================================

log_info() { printf "${GREEN}[INFO]${NC} %s\n" "$1"; }
log_warn() { printf "${YELLOW}[WARN]${NC} %s\n" "$1"; }
log_error() { printf "${RED}[ERROR]${NC} %s\n" "$1"; exit 1; }

# ============================================================================
# Help & Argument Parsing
# ============================================================================

show_help() {
    cat << 'EOF'
Usage: ./install.sh [OPTIONS]

Options:
  --dry-run, -n         Simulate without changes
  --backup, -b          Backup existing configs only (no install/link)
  --no-backup           Skip backup
  --no-install          Skip package installation
  --force-install       Force reinstall
  --skip-<tool>         Skip tool (e.g., --skip-ghostty)
  --only-<tool>         Only install tool (e.g., --only-neovim)
  -h, --help            Show help

Examples:
  ./install.sh
  ./install.sh --dry-run
  ./install.sh --backup
  ./install.sh --skip-ghostty --skip-waybar
  ./install.sh --only-neovim --only-yazi

Tools:
  Core: kitty, ghostty, fish, neovim, zed, yazi, lazygit
  Niri: waybar, mako, walker, hyprlock, swww, thunar, zathura, polkit-gnome, mpv
  Utils: playerctl, brightnessctl, bluez, blueman, elephant, slurp, satty, impala-nm, yt-dlp
EOF
    exit 0
}


parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --dry-run|-n) DRY_RUN=1 ;;
            --backup|-b) BACKUP_ONLY=1 ;;
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

# ============================================================================
# System Detection & Tool Filtering
# ============================================================================

detect_system() {
    if command -v pacman &>/dev/null; then
        PKG_MANAGER="pacman"
        command -v yay &>/dev/null && AUR_HELPER="yay"
        command -v paru &>/dev/null && AUR_HELPER="paru"
    else
        log_error "pacman not found - Arch-based distro required"
    fi
}

should_install() {
    local tool=$1
    
    # If ONLY_TOOLS specified, check if tool is in the list
    if [[ ${#ONLY_TOOLS[@]} -gt 0 ]]; then
        for only in "${ONLY_TOOLS[@]}"; do
            [[ "$tool" == "$only" ]] && return 0
        done
        return 1
    fi
    
    # Check if tool is in SKIP_TOOLS
    for skip in "${SKIP_TOOLS[@]}"; do
        [[ "$tool" == "$skip" ]] && return 1
    done
    
    return 0
}

# ============================================================================
# Package Installation
# ============================================================================

install_pkg() {
    local pkg=$1
    local name=$2
    local use_aur=${3:-false}
    
    [[ $DRY_RUN -eq 1 ]] && { log_info "Would install: $name"; return 0; }
    
    if [[ "$use_aur" == "true" && -n "$AUR_HELPER" ]]; then
        $AUR_HELPER -S --noconfirm --needed "$pkg"
    elif [[ -n "$AUR_HELPER" ]]; then
        $AUR_HELPER -S --noconfirm --needed "$pkg" 2>/dev/null || \
        sudo pacman -S --noconfirm --needed "$pkg"
    else
        sudo pacman -S --noconfirm --needed "$pkg"
    fi
}

install_tool() {
    local cmd=$1
    local pkg=$2
    local name=$3
    local use_aur=${4:-false}
    
    # Check if already installed
    if command -v "$cmd" &>/dev/null; then
        if [[ $FORCE_INSTALL -eq 0 ]]; then
            log_info "$name already installed (skipping)"
            return 0
        fi
        log_info "$name already installed (forcing reinstall)"
    fi
    
    log_info "Installing $name..."
    [[ $DRY_RUN -eq 1 ]] && { log_info "Would install: $name"; return 0; }
    
    if install_pkg "$pkg" "$name" "$use_aur"; then
        if command -v "$cmd" &>/dev/null; then
            log_info "$name installed successfully"
        else
            log_warn "$name package installed but command not found"
        fi
    else
        log_warn "Failed to install $name"
        return 1
    fi
}

install_zathura() {
    # Check if already installed
    if command -v zathura &>/dev/null; then
        if [[ $FORCE_INSTALL -eq 0 ]]; then
            log_info "Zathura already installed (skipping)"
            return 0
        fi
        log_info "Zathura already installed (forcing reinstall)"
    fi
    
    log_info "Installing Zathura..."
    [[ $DRY_RUN -eq 1 ]] && { log_info "Would install: Zathura"; return 0; }
    
    if [[ -n "$AUR_HELPER" ]]; then
        $AUR_HELPER -S --noconfirm --needed zathura zathura-pdf-mupdf
    else
        sudo pacman -S --noconfirm --needed zathura zathura-pdf-mupdf
    fi
    
    if command -v zathura &>/dev/null; then
        log_info "Zathura installed successfully"
    else
        log_warn "Zathura install failed"
    fi
}

install_polkit() {
    # Check if already installed
    if [[ -f "$POLKIT_BINARY" ]]; then
        if [[ $FORCE_INSTALL -eq 0 ]]; then
            log_info "Polkit-gnome already installed (skipping)"
            return 0
        fi
        log_info "Polkit-gnome already installed (forcing reinstall)"
    fi
    
    log_info "Installing Polkit-gnome..."
    [[ $DRY_RUN -eq 1 ]] && { log_info "Would install: Polkit-gnome"; return 0; }
    
    install_pkg "polkit-gnome" "Polkit-gnome" false
    
    if [[ -f "$POLKIT_BINARY" ]]; then
        log_info "Polkit-gnome installed successfully"
    else
        log_warn "Polkit-gnome binary not found"
    fi
}

# ============================================================================
# Backup & Symlink Management
# ============================================================================

backup() {
    local src=$1
    local name=$2
    
    [[ $NO_BACKUP -eq 1 || ! -e "$src" ]] && return
    
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

link_config() {
    local src=$1
    local dst=$2
    local name=$3
    
    [[ ! -e "$src" ]] && { log_warn "Source not found: $name ($src)"; return 1; }
    
    [[ $DRY_RUN -eq 1 ]] && { log_info "Would link: $name"; return 0; }
    
    # Backup and remove existing config
    if [[ -e "$dst" || -L "$dst" ]]; then
        backup "$dst" "$name"
        rm -rf "$dst"
    fi
    
    mkdir -p "$(dirname "$dst")"
    
    if ln -sf "$src" "$dst"; then
        log_info "Linked: $name → $dst"
    else
        log_error "Failed to link: $name"
    fi
}

# ============================================================================
# Main Installation Logic
# ============================================================================

install_all_tools() {
    [[ $NO_INSTALL -eq 1 ]] && { log_info "Skipping tool installation"; return; }
    
    echo ""
    log_info "=== Installing Tools ==="
    
    # Process all tools from TOOL_DEFINITIONS
    for definition in "${TOOL_DEFINITIONS[@]}"; do
        IFS='|' read -r cmd pkg name use_aur src_subdir dst_path <<< "$definition"
        
        # Skip tools without package (config-only)
        [[ -z "$pkg" ]] && continue
        
        should_install "$cmd" && install_tool "$cmd" "$pkg" "$name" "$use_aur"
    done
    
    # Special tools with custom install logic
    should_install "zathura" && install_zathura
    should_install "polkit-gnome" && install_polkit
}

backup_all_configs() {
    echo ""
    log_info "=== Backing Up Configs ==="
    
    mkdir -p "$BACKUP_ROOT"
    
    # Backup all configs from TOOL_DEFINITIONS
    for definition in "${TOOL_DEFINITIONS[@]}"; do
        IFS='|' read -r cmd pkg name use_aur src_subdir dst_path <<< "$definition"
        
        # Skip if no config path defined
        [[ -z "$dst_path" ]] && continue
        
        local full_path="$CONFIG_HOME/$dst_path"
        [[ -e "$full_path" ]] && backup "$full_path" "$name"
    done
    
    echo ""
    log_info "Backup Complete: $BACKUP_ROOT"
}

link_all_configs() {
    echo ""
    log_info "=== Linking Configs ==="
    
    # Link all configs from TOOL_DEFINITIONS
    for definition in "${TOOL_DEFINITIONS[@]}"; do
        IFS='|' read -r cmd pkg name use_aur src_subdir dst_path <<< "$definition"
        
        # Skip if no config defined
        [[ -z "$src_subdir" || -z "$dst_path" ]] && continue
        
        should_install "$cmd" && link_config "$REPO_ROOT/$src_subdir" "$CONFIG_HOME/$dst_path" "$name"
    done
}

show_next_steps() {
    echo ""
    log_info "=== Installation Complete ==="
    echo ""
    
    [[ $DRY_RUN -eq 1 ]] && return
    
    should_install "fish" && command -v fish &>/dev/null && echo "Set Fish as default shell: chsh -s \$(which fish)"
    should_install "neovim" && command -v nvim &>/dev/null && echo "Open Neovim to install plugins: nvim"
    should_install "polkit-gnome" && echo "Add to Niri config: spawn-at-startup \"$POLKIT_BINARY\""
    should_install "swww" && echo "Initialize swww: swww-daemon && swww img /path/to/wallpaper.jpg"
    
    echo ""
    [[ -d "$BACKUP_ROOT" ]] && log_info "Backups: $BACKUP_ROOT"
    echo "Restart terminal: exec \$SHELL"
}

# ============================================================================
# Main Entry Point
# ============================================================================

main() {
    echo "Linux Dotfiles Installer (Arch)"
    echo "Repository: $REPO_ROOT"
    echo ""
    
    parse_args "$@"
    detect_system
    
    log_info "Package Manager: $PKG_MANAGER${AUR_HELPER:+ ($AUR_HELPER)}"
    
    # Backup only mode
    if [[ $BACKUP_ONLY -eq 1 ]]; then
        backup_all_configs
        return
    fi
    
    [[ $NO_INSTALL -eq 0 ]] && install_all_tools
    link_all_configs
    show_next_steps
}

main "$@"
