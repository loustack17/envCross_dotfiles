# Dotfiles

## Tools

### Linux (Niri)
```
niri, kitty, ghostty, fish, neovim, zed, yazi, lazygit, zellij,
waybar, mako, thunar, zathura, mpv, hyprlock, vicinae,
claude-code, codex,
playerctl, brightnessctl, bluez, blueman, slurp, grim, satty, impala,
yt-dlp, wl-clipboard, swayosd, swayidle, wlr-randr, polkit-gnome, awww
```

### Windows
```
windows terminal, wezterm, nushell, neovim, yazi, lazygit
```

## Install

### Linux
```bash
./install.sh                  # full install
./install.sh --dry-run        # preview
./install.sh --no-install     # symlink only
./install.sh --skip-kitty     # skip tool
./install.sh --only-neovim    # specific tool
```

### Windows
```powershell
nu install.nu
nu install.nu --dry-run
nu install.nu --skip [wezterm]
nu install.nu --only [nvim lazygit]
```

## Structure

```
dotfiles/
├── install.sh          # Linux
├── install.nu          # Windows
│
├── AI-Supporter/       # Shared AI configs (Linux + Windows)
│   ├── Claude Code/
│   └── Codex/
│
├── Linux-config/       # Linux-only config packages
│   ├── niri/
│   ├── kitty/
│   ├── ghostty/
│   ├── fish/
│   ├── zellij/
│   ├── waybar/
│   ├── mako/
│   ├── vicinae/
│   ├── thunar/
│   ├── zathura/
│   ├── hyprlock/
│   ├── fontconfig/
│   ├── gtk-3.0/
│   ├── gtk-4.0/
│   └── qt5ct/
│
├── nvim/               # Neovim (shared)
├── yazi/               # Yazi (shared)
├── lazygit/            # Lazygit (shared)
├── mpv/                # MPV
├── zed/                # Zed
│
├── Windows/
│   ├── wezterm/            # WezTerm
│   ├── windows terminal/   # Windows Terminal
│   ├── nushell/            # Nushell
│   ├── powershell/         # PowerShell (pwsh)
│   ├── glazeWM/            # GlazeWM
│   └── .wezterm.lua
│
└── backup/
```

## Paths

### Linux
| Tool | Path |
|------|------|
| windows terminal | `%SCOOP%\apps\windows-terminal\current\settings\settings.json` |
| niri | `~/.config/niri/config.kdl` |
| kitty | `~/.config/kitty` |
| ghostty | `~/.config/ghostty` |
| fish | `~/.config/fish` |
| neovim | `~/.config/nvim` |
| zed | `~/.config/zed` |
| yazi | `~/.config/yazi` |
| lazygit | `~/.config/lazygit` |
| zellij | `~/.config/zellij` |
| waybar | `~/.config/waybar` |
| mako | `~/.config/mako` |
| vicinae | `~/.config/vicinae` |
| hyprlock | `~/.config/hypr` |
| thunar | `~/.config/Thunar` |
| zathura | `~/.config/zathura` |
| mpv | `~/.config/mpv` |
| claude-code | `~/.claude` |
| codex | `~/.codex` |

### Windows
| Tool | Path |
|------|------|
| windows terminal | `%SCOOP%\apps\windows-terminal\current\settings\settings.json` |
| powershell | `%USERPROFILE%\Documents\PowerShell\Microsoft.PowerShell_profile.ps1` |
| wezterm | `%USERPROFILE%\.config\wezterm` |
| nushell | `%APPDATA%\nushell` |
| neovim | `%LOCALAPPDATA%\nvim` |
| yazi | `%APPDATA%\yazi\config` |
| lazygit | `%LOCALAPPDATA%\lazygit` |

## Post-Install

### Linux
```bash
chsh -s $(which fish)         # set fish as default
nvim                          # install plugins
awww-daemon                   # start wallpaper daemon
```

### Windows
```
wezterm.exe                   # launch terminal
nvim                          # install plugins
```

## References

- [Niri](https://github.com/YaLTeR/niri)
- [Ghostty](https://ghostty.org)
- [Zed](https://zed.dev)
- [Waybar](https://github.com/Alexays/Waybar)
- [Vicinae](https://vicinae.com)
- [awww](https://codeberg.org/LGFae/awww)
- [Zellij](https://zellij.dev)
- [Impala](https://github.com/pythops/impala)
- [CachyOS](https://cachyos.org)

