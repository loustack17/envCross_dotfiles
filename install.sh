#!/usr/bin/env bash
# Linux dotfiles installer with automatic tool installation
# Primary target: CachyOS / Arch Linux (supports other distros)
# Core tools: Kitty, Fish, Neovim, Yazi, Lazygit
# Hyprland ecosystem: Waybar, Mako, Rofi, HyprLock, swww, Thunar, Zathura, Wallust, Polkit-gnome, MPV
#
# Usage:
#   ./install.sh
#   ./install.sh --dry-run
#   ./install.sh --no-backup
#   ./install.sh --no-install           # Skip tool installation, only symlink configs
#   ./install.sh --skip-kitty --skip-fish
#   ./install.sh --only-nvim --only-yazi

set -e

# ==================== Configuration ====================
DRY_RUN=0
NO_BACKUP=0
NO_INSTALL=0
FORCE_INSTALL=0
SKIP_TOOLS=()
ONLY_TOOLS=()

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
BACKUP_ROOT="$REPO_ROOT/backup/$(date +%Y%m%d-%H%M%S)"
CONFIG_HOME="${XDG_CONFIG_HOME:-$HOME/.config}"

# System detection
DISTRO=""
PKG_MANAGER=""
AUR_HELPER=""

# ==================== Colors ====================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# ==================== Utility Functions ====================
info() { printf "${GREEN}[INFO ]${NC} %s\n" "$1"; }
warn() { printf "${YELLOW}[WARN ]${NC} %s\n" "$1"; }
error() { printf "${RED}[ERROR]${NC} %s\n" "$1"; exit 1; }
header() { 
    echo ""
    printf "${BLUE}╔════════════════════════════════════════════╗${NC}\n"
    printf "${BLUE}║${NC} %-42s ${BLUE}║${NC}\n" "$1"
    printf "${BLUE}╚════════════════════════════════════════════╝${NC}\n"
    echo ""
}

section() {
    echo ""
    printf "${CYAN}>>> %s${NC}\n" "$1"
    echo ""
}

# ==================== Help ====================
show_help() {
    cat << EOF
Linux Dotfiles Installer

Usage: ./install.sh [OPTIONS]

Options:
  --dry-run, -n         Simulate installation without making changes
  --no-backup           Skip backing up existing configs
  --no-install          Skip automatic tool installation (only symlink)
  --force-install       Force reinstall even if tools exist
  --skip-<tool>         Skip installing specific tool
                        (e.g., --skip-kitty --skip-waybar)
  --only-<tool>         Only install specific tool
                        (e.g., --only-nvim --only-yazi)
  -h, --help            Show this help message

Examples:
  ./install.sh                          # Full installation
  ./install.sh --dry-run                # Preview changes
  ./install.sh --skip-kitty             # Skip Kitty terminal
  ./install.sh --only-nvim --only-yazi  # Install only Neovim and Yazi

Supported Distributions:
  - Arch Linux / CachyOS (primary)
  - Ubuntu / Debian
  - Fedora
  - openSUSE

Core Tools:
  - Kitty (terminal, from AUR for latest version)
  - Fish (shell)
  - Neovim (editor)
  - Yazi (file manager TUI)
  - Lazygit (git UI)

Hyprland Ecosystem:
  - Waybar (status bar)
  - Mako (notification daemon)
  - Rofi (application launcher)
  - HyprLock (screen locker)
  - swww (wallpaper daemon)
  - Thunar (file manager GUI)
  - Zathura (PDF viewer)
  - Wallust (color palette generator)
  - Polkit-gnome (authentication agent)
  - MPV (media player)
EOF
    exit 0
}

# ==================== Argument Parsing ====================
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --dry-run|-n)
                DRY_RUN=1
                ;;
            --no-backup)
                NO_BACKUP=1
                ;;
            --no-install)
                NO_INSTALL=1
                ;;
            --force-install)
                FORCE_INSTALL=1
                ;;
            --skip-*)
                SKIP_TOOLS+=("${1#--skip-}")
                ;;
            --only-*)
                ONLY_TOOLS+=("${1#--only-}")
                ;;
            -h|--help)
                show_help
                ;;
            *)
                warn "Unknown option: $1"
                ;;
        esac
        shift
    done
}

# ==================== System Detection ====================
detect_system() {
    info "Detecting system..."
    
    # Detect distribution
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        DISTRO=$ID
    elif [ -f /etc/arch-release ]; then
        DISTRO="arch"
    else
        error "Cannot detect Linux distribution"
    fi
    
    # Detect package manager
    if command -v pacman &>/dev/null; then
        PKG_MANAGER="pacman"
        
        # Detect AUR helper
        if command -v yay &>/dev/null; then
            AUR_HELPER="yay"
        elif command -v paru &>/dev/null; then
            AUR_HELPER="paru"
        fi
    elif command -v apt &>/dev/null; then
        PKG_MANAGER="apt"
    elif command -v dnf &>/dev/null; then
        PKG_MANAGER="dnf"
    elif command -v zypper &>/dev/null; then
        PKG_MANAGER="zypper"
    else
        error "No supported package manager found"
    fi
    
    info "Distribution: $DISTRO"
    info "Package Manager: $PKG_MANAGER${AUR_HELPER:+ (with $AUR_HELPER)}"
}

# ==================== Tool Filtering ====================
should_install_tool() {
    local tool=$1
    
    # If only-tools specified, only install those
    if [[ ${#ONLY_TOOLS[@]} -gt 0 ]]; then
        for only_tool in "${ONLY_TOOLS[@]}"; do
            [[ "$tool" == "$only_tool" ]] && return 0
        done
        return 1
    fi
    
    # Check if tool is in skip list
    for skip_tool in "${SKIP_TOOLS[@]}"; do
        [[ "$tool" == "$skip_tool" ]] && return 1
    done
    
    return 0
}

# ==================== Package Installation ====================
install_package() {
    local pkg_name=$1
    local display_name=$2
    local use_aur=${3:-false}
    
    if [[ $DRY_RUN -eq 1 ]]; then
        info "DryRun: Would install $display_name ($pkg_name)"
        return 0
    fi
    
    info "Installing $display_name..."
    
    case "$PKG_MANAGER" in
        pacman)
            # If explicitly AUR package or AUR helper available
            if [[ "$use_aur" == "true" ]]; then
                if [[ -z "$AUR_HELPER" ]]; then
                    warn "AUR helper (yay/paru) required for $display_name"
                    warn "Install yay: https://github.com/Jguer/yay#installation"
                    return 1
                fi
                $AUR_HELPER -S --noconfirm --needed "$pkg_name"
            elif [[ -n "$AUR_HELPER" ]]; then
                # Try AUR helper first, fallback to pacman
                $AUR_HELPER -S --noconfirm --needed "$pkg_name" 2>/dev/null || \
                sudo pacman -S --noconfirm --needed "$pkg_name"
            else
                sudo pacman -S --noconfirm --needed "$pkg_name"
            fi
            ;;
        apt)
            sudo apt update -qq
            sudo apt install -y "$pkg_name"
            ;;
        dnf)
            sudo dnf install -y "$pkg_name"
            ;;
        zypper)
            sudo zypper install -y "$pkg_name"
            ;;
        *)
            warn "Please manually install: $pkg_name"
            return 1
            ;;
    esac
    
    return $?
}

# ==================== Tool Installation ====================
install_tool() {
    local tool_cmd=$1
    local pkg_name=$2
    local display_name=$3
    local use_aur=${4:-false}
    
    # Check if already installed
    if command -v "$tool_cmd" &>/dev/null && [[ $FORCE_INSTALL -eq 0 ]]; then
        info "✓ $display_name already installed"
        return 0
    fi
    
    # Install package
    if install_package "$pkg_name" "$display_name" "$use_aur"; then
        # Verify installation
        if command -v "$tool_cmd" &>/dev/null; then
            info "✓ $display_name installed successfully"
            return 0
        else
            warn "$display_name installation completed but command not found"
            warn "You may need to restart your session"
            return 1
        fi
    else
        warn "Failed to install $display_name"
        return 1
    fi
}

# ==================== Special: Zathura with PDF support ====================
install_zathura() {
    local display_name="Zathura"
    
    if command -v zathura &>/dev/null && [[ $FORCE_INSTALL -eq 0 ]]; then
        info "✓ $display_name already installed"
        return 0
    fi
    
    info "Installing $display_name with PDF support..."
    
    if [[ $DRY_RUN -eq 1 ]]; then
        info "DryRun: Would install zathura zathura-pdf-mupdf"
        return 0
    fi
    
    case "$PKG_MANAGER" in
        pacman)
            if [[ -n "$AUR_HELPER" ]]; then
                $AUR_HELPER -S --noconfirm --needed zathura zathura-pdf-mupdf
            else
                sudo pacman -S --noconfirm --needed zathura zathura-pdf-mupdf
            fi
            ;;
        apt)
            sudo apt update -qq
            sudo apt install -y zathura zathura-pdf-poppler
            ;;
        dnf)
            sudo dnf install -y zathura zathura-pdf-mupdf
            ;;
        *)
            warn "Please manually install: zathura"
            return 1
            ;;
    esac
    
    if command -v zathura &>/dev/null; then
        info "✓ $display_name installed successfully"
        return 0
    else
        warn "Failed to install $display_name"
        return 1
    fi
}

# ==================== Backup Function ====================
backup_if_exists() {
    [[ $NO_BACKUP -eq 1 ]] && return
    
    local path=$1
    local name=$2
    
    [[ ! -e "$path" ]] && return
    
    if [[ $DRY_RUN -eq 1 ]]; then
        info "DryRun: Would backup $path"
        return
    fi
    
    mkdir -p "$BACKUP_ROOT"
    local safe_name=$(echo "$name" | tr '/\\:*?"<>| ' '_')
    local dest="$BACKUP_ROOT/$safe_name"
    
    info "Backing up $name..."
    cp -a "$path" "$dest"
    info "✓ Backup saved to $dest"
}

# ==================== Symlink Function ====================
link_safe() {
    local source=$1
    local dest=$2
    local name=$3
    
    if [[ ! -e "$source" ]]; then
        warn "Source not found, skip: $name ($source)"
        return
    fi
    
    if [[ $DRY_RUN -eq 1 ]]; then
        info "DryRun: Would create symlink $source -> $dest"
        return
    fi
    
    # Backup and remove existing
    if [[ -e "$dest" ]] || [[ -L "$dest" ]]; then
        backup_if_exists "$dest" "$name"
        rm -rf "$dest"
    fi
    
    # Create symlink
    mkdir -p "$(dirname "$dest")"
    ln -sf "$source" "$dest"
    
    info "✓ Linked: $name"
}

# ==================== Tool Installation Phase ====================
install_tools() {
    header "Phase 1: Tool Installation"
    
    # ===== Core Tools =====
    section "Core Tools"
    
    # Tool format: [command]="package_name|display_name|use_aur"
    declare -A CORE_TOOLS=(
        ["kitty"]="kitty|Kitty|true"
        ["fish"]="fish|Fish Shell|false"
        ["nvim"]="neovim|Neovim|false"
        ["yazi"]="yazi|Yazi|false"
        ["lazygit"]="lazygit|Lazygit|false"
    )
    
    for tool_cmd in "${!CORE_TOOLS[@]}"; do
        IFS='|' read -r pkg_name display_name use_aur <<< "${CORE_TOOLS[$tool_cmd]}"
        
        if should_install_tool "$tool_cmd"; then
            install_tool "$tool_cmd" "$pkg_name" "$display_name" "$use_aur"
        else
            info "⊘ Skipping $display_name"
        fi
    done
    
    # ===== Hyprland Ecosystem =====
    section "Hyprland Ecosystem"
    
    declare -A HYPR_TOOLS=(
        ["waybar"]="waybar|Waybar|false"
        ["mako"]="mako|Mako|false"
        ["rofi"]="rofi-wayland|Rofi (Wayland)|false"
        ["hyprlock"]="hyprlock|HyprLock|false"
        ["swww"]="swww|swww|false"
        ["thunar"]="thunar|Thunar|false"
        ["wallust"]="wallust|Wallust|true"
        ["mpv"]="mpv|MPV|false"
    )
    
    for tool_cmd in "${!HYPR_TOOLS[@]}"; do
        IFS='|' read -r pkg_name display_name use_aur <<< "${HYPR_TOOLS[$tool_cmd]}"
        
        if should_install_tool "$tool_cmd"; then
            install_tool "$tool_cmd" "$pkg_name" "$display_name" "$use_aur"
        else
            info "⊘ Skipping $display_name"
        fi
    done
    
    # Special handling for Zathura (requires PDF backend)
    if should_install_tool "zathura"; then
        install_zathura
    else
        info "⊘ Skipping Zathura"
    fi
    
    # Special handling for Polkit-gnome (no direct command)
    if should_install_tool "polkit-gnome"; then
        if [[ -f "/usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1" ]] && [[ $FORCE_INSTALL -eq 0 ]]; then
            info "✓ Polkit-gnome already installed"
        else
            install_package "polkit-gnome" "Polkit-gnome" false
            if [[ -f "/usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1" ]]; then
                info "✓ Polkit-gnome installed successfully"
            else
                warn "Polkit-gnome installation completed but binary not found"
            fi
        fi
    else
        info "⊘ Skipping Polkit-gnome"
    fi
    
    echo ""
}

# ==================== Configuration Phase ====================
setup_configs() {
    header "Phase 2: Configuration Setup"
    
    # Core tools configs
    if should_install_tool "kitty"; then
        link_safe "$REPO_ROOT/kitty" "$CONFIG_HOME/kitty" "Kitty"
    fi
    
    if should_install_tool "fish"; then
        link_safe "$REPO_ROOT/fish" "$CONFIG_HOME/fish" "Fish Shell"
    fi
    
    if should_install_tool "nvim"; then
        link_safe "$REPO_ROOT/nvim" "$CONFIG_HOME/nvim" "Neovim"
    fi
    
    if should_install_tool "yazi"; then
        link_safe "$REPO_ROOT/yazi" "$CONFIG_HOME/yazi" "Yazi"
    fi
    
    if should_install_tool "lazygit"; then
        link_safe "$REPO_ROOT/lazygit" "$CONFIG_HOME/lazygit" "Lazygit"
    fi
    
    # Hyprland ecosystem configs
    if should_install_tool "waybar"; then
        link_safe "$REPO_ROOT/waybar" "$CONFIG_HOME/waybar" "Waybar"
    fi
    
    if should_install_tool "mako"; then
        link_safe "$REPO_ROOT/mako" "$CONFIG_HOME/mako" "Mako"
    fi
    
    if should_install_tool "rofi"; then
        link_safe "$REPO_ROOT/rofi" "$CONFIG_HOME/rofi" "Rofi"
    fi
    
    if should_install_tool "hyprlock"; then
        link_safe "$REPO_ROOT/hyprlock" "$CONFIG_HOME/hypr/hyprlock.conf" "HyprLock"
    fi
    
    if should_install_tool "swww"; then
        link_safe "$REPO_ROOT/swww" "$CONFIG_HOME/swww" "swww"
    fi
    
    if should_install_tool "thunar"; then
        link_safe "$REPO_ROOT/thunar" "$CONFIG_HOME/Thunar" "Thunar"
    fi
    
    if should_install_tool "zathura"; then
        link_safe "$REPO_ROOT/zathura" "$CONFIG_HOME/zathura" "Zathura"
    fi
    
    if should_install_tool "wallust"; then
        link_safe "$REPO_ROOT/wallust" "$CONFIG_HOME/wallust" "Wallust"
    fi
    
    if should_install_tool "mpv"; then
        link_safe "$REPO_ROOT/mpv" "$CONFIG_HOME/mpv" "MPV"
    fi
    
    echo ""
}

# ==================== Post-Installation ====================
post_install() {
    header "Installation Complete! 🎉"
    
    if [[ $DRY_RUN -eq 0 ]]; then
        info "Next steps:"
        echo ""
        
        # Core tools
        if should_install_tool "fish" && command -v fish &>/dev/null; then
            info "  1. Set Fish as default shell:"
            info "     chsh -s \$(which fish)"
            echo ""
        fi
        
        if should_install_tool "kitty" && command -v kitty &>/dev/null; then
            info "  2. Launch Kitty terminal"
        fi
        
        if should_install_tool "nvim" && command -v nvim &>/dev/null; then
            info "  3. Open Neovim and let plugins install:"
            info "     nvim"
            echo ""
        fi
        
        # Hyprland specific
        if should_install_tool "polkit-gnome"; then
            info "  4. Add Polkit to Hyprland startup (if using Hyprland):"
            info "     exec-once = /usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1"
            echo ""
        fi
        
        if should_install_tool "swww"; then
            info "  5. Initialize swww daemon:"
            info "     swww init"
            info "     swww img /path/to/wallpaper.jpg"
            echo ""
        fi
        
        info "Restart your terminal or run: exec \$SHELL"
        
        if [[ -d "$BACKUP_ROOT" ]]; then
            echo ""
            info "Backups saved to: $BACKUP_ROOT"
        fi
    fi
}

# ==================== Main ====================
main() {
    header "Linux Dotfiles Installer"
    
    info "Repository: $REPO_ROOT"
    info "Config Home: $CONFIG_HOME"
    
    parse_args "$@"
    detect_system
    
    # Tool installation phase
    if [[ $NO_INSTALL -eq 0 ]]; then
        install_tools
    else
        echo ""
        info "⊘ Skipping tool installation (--no-install)"
        echo ""
    fi
    
    # Configuration phase
    setup_configs
    
    # Post-installation messages
    post_install
}

main "$@"
