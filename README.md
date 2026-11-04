# Dotfiles

A cross-platform dotfiles repository for CachyOS/Arch Linux and Windows, featuring centralized configuration management and shared AI assistant instructions.

Clone the repository anywhere and run the installers from its root. Installers link `~/.local/share/envcross` to the clone, and every config reaches the repository through that link; after moving the clone, rerun the installer. Preview changes before applying them.

| Task | Windows (Nushell) | Linux (Bash) |
|------|-------------------|--------------|
| Preview all targets | `nu install.nu --dry-run` | `./install.sh --dry-run` |
| Apply all targets | `nu install.nu` | `./install.sh` |
| Reapply Codex config | `nu install.nu --no-install --only codex` | `./install.sh --no-install --only-codex` |
| Reapply Yazi config | `nu install.nu --no-install --only yazi` | `./install.sh --no-install --only-yazi` |

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
./install.sh --only-sqlit
./install.sh --only-moli   # Moli CLI for the moli-* skills
```

System-level Linux fixes that write to `/etc` are tracked separately under `Linux-system/` and are not part of the regular `install.sh` symlink flow.

```bash
bash ./scripts/install-udev-rules.sh
```

### Windows
Install Nushell before running the installer. Scoop supplies packages; Python is required when rendering platform-specific AI or Zed settings. Creating file symlinks requires Administrator privileges or Windows Developer Mode.

```nu
# Full installation
nu install.nu

# Advanced usage examples
nu install.nu --dry-run
nu install.nu --skip yasb
nu install.nu --only "neovim,lazygit"
```

Windows `--only` and `--skip` accept a single tool name or a comma-separated string. Use `--no-install` to relink an already installed tool, or `--backup-only` to save current settings without applying changes. The installer prints the backup location; `ENVCROSS_STATE_ROOT` controls where Windows installer state is stored. Keep backups enabled for normal installs.

### Changing settings later

1. Edit the tracked source in this repository. Use the shared file for settings common to both platforms and the matching platform file for OS-specific settings.
2. Run a selective install with `--dry-run`, then repeat without `--dry-run` if the preview matches your intent.
3. Restart the affected application and verify the result. Check `git status --short` and `git diff --check` before committing.

Directly linked files reflect source edits immediately. Generated configs must be rebuilt by the installer. Do not edit generated output: the next install replaces it. If an install fails, inspect its error and transaction record before retrying; use the backup location printed by the installer to restore affected settings. Linux backups are kept in the repository's ignored `backup/` directory.

## 🤖 AI Assistant Configuration

Managed tools: **Claude Code**, **Codex**, and **Grok Build**. Everything lives under `ai-assistants/`: shared rules in `AGENTS.md`, shared skills in `SKILLS/` (one copy linked into every tool), and tool-specific settings in `.claude/`, `.codex/`, and `.grok/`. Add a per-tool setting only when the tool genuinely needs it. See [Claude configuration](ai-assistants/.claude/README.md), [Codex configuration](ai-assistants/.codex/README.md), and [MCP and secrets](ai-assistants/mcp/README.md).

```text
ai-assistants/
├── AGENTS.md              shared rules for every tool
├── SKILLS/                shared skills; SKILLS/claude-tools/ is the Claude plugin holding its MCP servers
├── .claude/               settings.json, CLAUDE.md, agents/, statusline.sh
├── .codex/                config.toml (system defaults), hooks.json, agents/
├── .grok/                 config.toml
└── mcp/                   Cursor and VS Code MCP JSON, secrets documentation
```

| Tool | Source | Target |
|------|--------|--------|
| **Claude Code** | `.claude/settings.json`, `CLAUDE.md`, `statusline.sh`, `agents/` | `~/.claude/` |
| **Claude Code** | `AGENTS.md`, `SKILLS/` | `~/.claude/AGENTS.md`, `~/.claude/skills` |
| **Codex** | `.codex/config.toml` | `/etc/codex/config.toml` or `%ProgramData%\OpenAI\Codex\config.toml` |
| **Codex** | `AGENTS.md`, `.codex/hooks.json`, `.codex/agents/` | `~/.codex/` |
| **Codex** | `SKILLS/` | `~/.agents/skills` |
| **Grok Build** | `AGENTS.md`, `.grok/config.toml` | `~/.grok/` |
| **Grok Build (Windows)** | `scripts/windows/grok/` (syncs config, then starts Grok) | user `PATH` |

### Secrets

Every key and token comes from one Bitwarden Secrets Manager project through the `bws` CLI, which both installers install. Configure the machine token once per host (`scripts/secrets/configure.sh` on Linux, `scripts\windows\secrets-configure.ps1` on Windows), then launch tools through `with-secrets` or their wrappers. Never put a key in an environment variable, `.env`, or config file. OAuth sessions (Claude, freehire, Mem0) stay in each tool's own store and are signed in once per host.

## 📁 Paths & Configuration

Launch sqlit with `sql` in Fish (Linux) or Nushell (Windows). The alias is provided by the repository Fish/Nushell configuration and forwards arguments to `sqlit`. Install that shell configuration on a new host; the sqlit-only target does not configure a shell. Install targets remain `--only-sqlit` on Linux and `--only sqlit` on Windows.

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
| **direnv** | `~/.config/direnv` |
| **neovim** | `~/.config/nvim` |
| **helix** | `~/.config/helix` |
| **zed** | `~/.config/zed` |
| **yazi** | `~/.config/yazi` |
| **lazygit** | `~/.config/lazygit` |
| **sqlit (`sql`)** | `~/.config/sqlit` |
| **tock** | `~/.config/tock` |
| **zellij** | `~/.config/zellij` |
| **systemd-user** | `~/.config/systemd/user` |
| **waybar** | `~/.config/waybar` |
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
Windows Terminal, WezTerm, Nushell, Neovim, Yazi, MPV, Codex, Lazygit, Yasb, Komorebi, and Whkd configurations are supported.

<details>
<summary><b>View Windows Configuration Paths</b></summary>

| Tool | Target Path |
|------|-------------|
| **windows terminal** | `%SCOOP%\apps\windows-terminal\current\settings\settings.json` |
| **wezterm** | `%USERPROFILE%\.config\wezterm\wezterm.lua` |
| **powershell** | `%USERPROFILE%\Documents\PowerShell\Microsoft.PowerShell_profile.ps1` |
| **nushell** | `%APPDATA%\nushell` |
| **neovim** | `%LOCALAPPDATA%\nvim` |
| **yazi** | `%APPDATA%\yazi` |
| **mpv** | `%SCOOP%\persist\mpv\portable_config` |
| **codex** | `%ProgramData%\OpenAI\Codex\config.toml` |
| **lazygit** | `%LOCALAPPDATA%\lazygit` |
| **sqlit (`sql`)** | `%USERPROFILE%\.config\sqlit` |
| **yasb** | `%USERPROFILE%\.config\yasb\config.yaml` |
| **yasb** | `%USERPROFILE%\.config\yasb\styles.css` |
| **komorebi** | `%USERPROFILE%\komorebi.json` |
| **komorebi** | `%USERPROFILE%\komorebi.bar.json` |
| **komorebi** | `%USERPROFILE%\applications.json` |
| **whkd** | `%USERPROFILE%\.config\whkdrc` |

</details>
