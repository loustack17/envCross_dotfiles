# Cross-Platform Dotfiles

Personal dotfiles for Windows and Linux with automatic tool installation.

## Platforms

### Windows
- **Terminal**: WezTerm
- **Shell**: Nushell
- **Editor**: Neovim
- **File Manager**: Yazi
- **Git UI**: Lazygit

### Linux (CachyOS/Arch)
- **Terminal**: Kitty (from AUR)
- **Shell**: Fish
- **Editor**: Neovim
- **File Manager**: Yazi
- **Git UI**: Lazygit
- **Hyprland Ecosystem**:
  - Waybar (status bar)
  - Mako (notifications)
  - Rofi (launcher)
  - HyprLock (screen lock)
  - swww (wallpaper)
  - Thunar (file manager GUI)
  - Zathura (PDF viewer)
  - Wallust (color palette, AUR)
  - Polkit-gnome (authentication)
  - MPV (media player)

---

## Installation

### Windows

```powershell
# Install via Nushell
nu install.nu

# Options
nu install.nu --dry-run
nu install.nu --no-backup
nu install.nu --skip [wezterm yazi]
nu install.nu --only [nvim lazygit]
```

**Requirements**:
- Administrator or Developer Mode enabled
- Automatically installs Scoop if missing

### Linux

```bash
# Full installation
./install.sh

# Options
./install.sh --dry-run
./install.sh --no-backup
./install.sh --skip-kitty --skip-waybar
./install.sh --only-nvim --only-yazi
```

**Requirements**:
- AUR helper (`yay` or `paru`) for Kitty and Wallust
- Supported: Arch, Ubuntu, Fedora, openSUSE

---

## Directory Structure

```
dotfiles/
├── install.sh              # Linux installer
├── install.nu              # Windows installer
│
# Shared configs
├── nvim/                   # Neovim
├── yazi/                   # Yazi
├── lazygit/                # Lazygit
│
# Linux-specific
├── kitty/                  # Kitty terminal
├── fish/                   # Fish shell
├── waybar/                 # Waybar
├── mako/                   # Mako
├── rofi/                   # Rofi
├── hyprlock/               # HyprLock
├── swww/                   # swww
├── thunar/                 # Thunar
├── zathura/                # Zathura
├── wallust/                # Wallust
├── mpv/                    # MPV
│
# Windows-specific
├── wezterm/                # WezTerm dir
├── .wezterm.lua            # WezTerm main config
├── nushell/                # Nushell
│
└── backup/                 # Auto-backups
    └── 20241231-143052/
```

---

## Configuration Paths

### Windows
| Tool | Config Path |
|------|-------------|
| WezTerm | `%USERPROFILE%\.config\wezterm` |
| Nushell | `%APPDATA%\nushell` |
| Neovim | `%LOCALAPPDATA%\nvim` |
| Yazi | `%APPDATA%\yazi` |
| Lazygit | `%LOCALAPPDATA%\lazygit` |

### Linux
| Tool | Config Path |
|------|-------------|
| Kitty | `~/.config/kitty` |
| Fish | `~/.config/fish` |
| Neovim | `~/.config/nvim` |
| Yazi | `~/.config/yazi` |
| Lazygit | `~/.config/lazygit` |
| Waybar | `~/.config/waybar` |
| Mako | `~/.config/mako` |
| Rofi | `~/.config/rofi` |
| HyprLock | `~/.config/hypr/hyprlock.conf` |
| swww | `~/.config/swww` |
| Thunar | `~/.config/Thunar` |
| Zathura | `~/.config/zathura` |
| Wallust | `~/.config/wallust` |
| MPV | `~/.config/mpv` |

---

## Usage Examples

### Basic

```bash
# Windows
nu install.nu

# Linux
./install.sh
```

### Dry Run

```bash
# Windows
nu install.nu --dry-run

# Linux
./install.sh --dry-run
```

### Selective Installation

```bash
# Skip tools
./install.sh --skip-kitty --skip-waybar
nu install.nu --skip [wezterm yazi]

# Install specific tools only
./install.sh --only-nvim --only-yazi
nu install.nu --only [nvim lazygit]
```

### Config Only (No Package Installation)

```bash
./install.sh --no-install
nu install.nu --no-install
```

---

## Post-Installation

### Linux

```bash
# Set Fish as default shell
chsh -s $(which fish)

# Open Neovim to install plugins
nvim

# Add Polkit to Hyprland config
echo 'exec-once = /usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1' >> ~/.config/hypr/hyprland.conf

# Initialize swww
swww init
swww img ~/Pictures/wallpaper.jpg
```

### Windows

```powershell
# Restart terminal
# Launch WezTerm
wezterm.exe

# Open Neovim to install plugins
nvim
```

---

## Troubleshooting

### Linux: AUR Helper Required

```bash
# Install yay
sudo pacman -S --needed git base-devel
git clone https://aur.archlinux.org/yay.git
cd yay && makepkg -si
```

### Windows: Symlink Failed

Enable Developer Mode:
1. Open Settings
2. Privacy & Security → For developers
3. Enable Developer Mode

Or run terminal as Administrator.

### Linux: Polkit Not Working

Check binary exists:
```bash
ls /usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1
```

Add to Hyprland config:
```bash
exec-once = /usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1
```

---

## Features

- ✅ Automatic package installation
- ✅ Automatic backup before changes
- ✅ Symlink-based config management
- ✅ Selective tool installation
- ✅ Dry-run mode
- ✅ Cross-platform (Windows/Linux)
- ✅ AUR support (Arch Linux)
- ✅ Multiple package managers (pacman/apt/dnf/zypper)

---

## License

MIT
