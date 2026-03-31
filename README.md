# Dotfiles

A cross-platform dotfiles repository for Linux and Windows, featuring centralized configuration management and shared AI assistant instructions.

## 🚀 Installation

### Linux
Linux installation targets are defined in `config/targets.manifest`. The installer supports different scopes (`linux`, `shared`, `ai`) and groups (`core`, `niri`, `utilities`, `config`, `ai`).

```bash
# Full installation
./install.sh

# View available options and targets
./install.sh --help

# Advanced usage examples
./install.sh --dry-run
./install.sh --no-install
./install.sh --skip-kitty
./install.sh --only-neovim
```

System-level Linux fixes that write to `/etc` are tracked separately under `Linux-system/` and are not part of the regular `install.sh` symlink flow.

```bash
bash ./scripts/install-udev-rules.sh
```

### Windows
```powershell
# Full installation
nu install.nu

# Advanced usage examples
nu install.nu --dry-run
nu install.nu --skip [wezterm]
nu install.nu --only [nvim lazygit]
```

## 🤖 AI Assistant Configuration

This repository centralizes AI instructions so multiple tools share the same context. `AI-Supporter/AGENTS.md` is the core shared instructions file. Shared skills are located in `AI-Supporter/SKILLS/`.

### Directory Structure
```text
AI-Supporter/
├── AGENTS.md
├── SKILLS/
│   └── no-comments/
│       └── SKILL.md
├── Claude Code/
│   ├── CLAUDE.md
│   ├── hooks/
│   └── settings.json
├── Codex/
│   └── config.toml
├── Gemini CLI/
│   └── GEMINI.md
```

### Installation Targets
During installation, these files are linked to the appropriate locations for each tool:

| AI Tool | Source | Target Path |
|---------|--------|-------------|
| **Claude Code** | `Claude Code/CLAUDE.md` | `~/.claude/CLAUDE.md` |
| **Claude Code** | `Claude Code/settings.json` | `~/.claude/settings.json` |
| **Claude Code** | `Claude Code/hooks/` | `~/.claude/hooks` |
| **Claude Code** | `SKILLS/` | `~/.claude/skills` |
| **Gemini CLI** | `Gemini CLI/GEMINI.md` | `~/.gemini/GEMINI.md` |
| **Codex** | `AGENTS.md` | `~/.codex/AGENTS.md` |
| **Codex** | `SKILLS/` | `~/.codex/skills` |
| **OpenCode** | `AGENTS.md` | `~/.config/opencode/AGENTS.md` |
| **OpenCode** | `SKILLS/` | `~/.config/opencode/skills` |

## 📁 Paths & Configuration

### Linux
Linux configuration sources live primarily under the `Linux-config/` directory. 
- Non-XDG files (e.g., `.profile`) remain at the repository root.
- `~/.local/share` targets live under `Linux-local-share/`.
- System-level files that target paths such as `/etc/udev/rules.d` live under `Linux-system/`.
- App-managed state files that frequently rewrite themselves (e.g., `waypaper/config.ini`, `fcitx5` runtime state) are intentionally unmanaged to avoid repository drift.

<details>
<summary><b>View Linux Configuration Paths</b></summary>

| Tool | Target Path |
|------|-------------|
| **niri** | `~/.config/niri/config.kdl` |
| **kitty** | `~/.config/kitty` |
| **ghostty** | `~/.config/ghostty` |
| **autostart** | `~/.config/autostart` |
| **fcitx5** | `~/.config/fcitx5` |
| **fish** | `~/.config/fish` |
| **neovim** | `~/.config/nvim` |
| **zed** | `~/.config/zed` |
| **yazi** | `~/.config/yazi` |
| **lazygit** | `~/.config/lazygit` |
| **tock** | `~/.config/tock` |
| **zellij** | `~/.config/zellij` |
| **systemd-user** | `~/.config/systemd/user` |
| **waybar** | `~/.config/waybar` |
| **mako** | `~/.config/mako` |
| **vicinae** | `~/.config/vicinae` |
| **pcmanfm-qt** | `~/.config/pcmanfm-qt` |
| **hyprlock** | `~/.config/hypr` |
| **zathura** | `~/.config/zathura` |
| **easyeffects** | `~/.config/easyeffects` |
| **mpv** | `~/.config/mpv` |
| **pipewire** | `~/.config/pipewire` |
| **qt6ct** | `~/.config/qt6ct` |
| **qt6ct-env** | `~/.config/environment.d/qt6ct.conf` |
| **mimeapps** | `~/.config/mimeapps.list` |
| **niri-mimeapps**| `~/.config/niri-mimeapps.list` |
| **satty-config** | `~/.config/satty` |
| **wireplumber** | `~/.config/wireplumber` |
| **xdg-terminals**| `~/.config/xdg-terminals.list` |
| **xdg-desktop-portal** | `~/.config/xdg-desktop-portal` |
| **niri-xdg-terminals** | `~/.config/niri-xdg-terminals.list` |
| **user-dirs** | `~/.config/user-dirs.dirs` |
| **user-dirs-locale** | `~/.config/user-dirs.locale` |
| **profile** | `~/.profile` |
| **kitty-desktop**| `~/.local/share/applications/kitty.desktop` |
| **gitconfig** | `~/.gitconfig` |

</details>

### Windows
Windows terminal, wezterm, nushell, neovim, yazi, and lazygit configurations are supported.

<details>
<summary><b>View Windows Configuration Paths</b></summary>

| Tool | Target Path |
|------|-------------|
| **windows terminal** | `%SCOOP%\apps\windows-terminal\current\settings\settings.json` |
| **powershell** | `%USERPROFILE%\Documents\PowerShell\Microsoft.PowerShell_profile.ps1` |
| **wezterm** | `%USERPROFILE%\.config\wezterm` |
| **nushell** | `%APPDATA%\nushell` |
| **neovim** | `%LOCALAPPDATA%\nvim` |
| **yazi** | `%APPDATA%\yazi\config` |
| **lazygit** | `%LOCALAPPDATA%\lazygit` |

</details>
