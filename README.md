# Cross-Platform Dotfiles

Personal dotfiles for Windows and Linux with automatic tool installation.

## Platforms

### Windows

- **Terminal**: WezTerm
- **Shell**: Nushell
- **Editor**: Neovim
- **File Manager**: Yazi
- **Git UI**: Lazygit

### Linux (CachyOS with Niri)

- **Terminal**: Kitty, Ghostty
- **Shell**: Fish
- **Editor**: Neovim, Zed
- **File Manager**: Yazi, Thunar
- **Git UI**: Lazygit
- **Niri Ecosystem**:
  - Waybar (status bar)
  - Mako (notifications)
  - Walker (launcher - requires Elephant)
  - HyprLock (screen lock)
  - swww (wallpaper)
  - Zathura (PDF viewer)
  - Polkit-gnome (authentication)
  - MPV (media player)
- **Utilities**:
  - Playerctl (media control)
  - Brightnessctl (brightness control)
  - Bluez/Blueman (Bluetooth)
  - Elephant (Walker dependency - required)
  - Slurp (screen region select)
  - Satty (screenshot annotation)
  - Impala-nm (TUI network manager for NetworkManager)
  - yt-dlp (optional for mpv streaming)

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

### Linux (CachyOS with Niri)

```bash
# Full installation
./install.sh

# Options
./install.sh --dry-run
./install.sh --no-backup
./install.sh --skip-ghostty --skip-waybar
./install.sh --only-nvim --only-yazi
```

**Requirements**:

- AUR helper (yay or paru) for specific packages
- Priority: CachyOS official repository > AUR
- Kitty: Always install latest from kitty-git (AUR)
- Supported: Arch Based distros

---

## Directory Structure

```text
dotfiles/
├── install.sh              # Linux installer (Niri edition)
├── install.nu              # Windows installer
│
# Shared configs
├── nvim/                   # Neovim
├── yazi/                   # Yazi
├── lazygit/                # Lazygit
├── mpv/                    # MPV
│
# Linux-specific (Niri)
├── niri/                   # Niri ecosystem configs
│   ├── kitty/              # Kitty terminal
│   ├── ghostty/            # Ghostty terminal
│   ├── fish/               # Fish shell
│   ├── waybar/             # Waybar
│   ├── mako/               # Mako
│   ├── walker/             # Walker launcher
│   ├── elephant/           # Elephant
│   ├── hyprlock/           # HyprLock
│   ├── swww/               # swww
│   ├── thunar/             # Thunar
│   └── zathura/            # Zathura
├── zed/                    # Zed editor
│
# Windows-specific
├── wezterm/                # WezTerm
├── .wezterm.lua            # WezTerm main config
├── nushell/                # Nushell
│
# Other
├── chrome/                 # Zen Browser themes
└── backup/                 # Auto-backups
```

---

## Configuration Paths

### Windows

| Tool    | Config Path                     |
| ------- | ------------------------------- |
| WezTerm | `%USERPROFILE%\.config\wezterm` |
| Nushell | `%APPDATA%\nushell`             |
| Neovim  | `%LOCALAPPDATA%\nvim`           |
| Yazi    | `%APPDATA%\yazi`                |
| Lazygit | `%LOCALAPPDATA%\lazygit`        |

### Linux (Niri)

| Tool     | Config Path                    |
| -------- | ------------------------------ |
| Kitty    | `~/.config/kitty`              |
| Ghostty  | `~/.config/ghostty`            |
| Fish     | `~/.config/fish`               |
| Neovim   | `~/.config/nvim`               |
| Zed      | `~/.config/zed`                |
| Yazi     | `~/.config/yazi`               |
| Lazygit  | `~/.config/lazygit`            |
| Waybar   | `~/.config/waybar`             |
| Mako     | `~/.config/mako`               |
| Walker   | `~/.config/walker`             |
| Elephant | `~/.config/elephant`           |
| HyprLock | `~/.config/niri/hyprlock.conf` |
| swww     | `~/.config/swww`               |
| Thunar   | `~/.config/Thunar`             |
| Zathura  | `~/.config/zathura`            |
| MPV      | `~/.config/mpv`                |

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
./install.sh --skip-ghostty --skip-waybar
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

### Linux (Niri)

```bash
# Set Fish as default shell
chsh -s $(which fish)

# Open Neovim to install plugins
nvim
:Lazy

# Add Polkit to Niri config (~/.config/niri/config.kdl)
spawn-at-startup "/usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1"

# Initialize swww
swww-daemon
swww img ~/Pictures/wallpaper.jpg
```

### Windows

```powershell
# Restart terminal and launch WezTerm
wezterm.exe

# Open Neovim to install plugins
nvim
:Lazy
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

Add to Niri config (`~/.config/niri/config.kdl`):

```conf
spawn-at-startup "/usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1"
```

---

## Features

- Automatic package installation
- Automatic backup before changes
- Symlink-based config management
- Selective tool installation
- Dry-run mode
- Cross-platform (Windows/Linux)
- AUR support (Arch Linux)
- Niri window manager support

---

## References

- **Ghostty**: <https://ghostty.org>
- **Zed**: <https://zed.dev>
- **Walker**: <https://github.com/abenz1267/walker>
- **Niri**: <https://github.com/YaLTeR/niri>
- **CachyOS**: <https://cachyos.org>
- **Waybar**: <https://github.com/Alexays/Waybar>
- **Impala-mn**: <https://github.com/aashish-thapa/wlctl>

---

## License

MIT
