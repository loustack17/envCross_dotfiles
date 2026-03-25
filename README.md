# Dotfiles

`AI-Supporter/AGENTS.md` is the only shared AI instructions file in this repo. Claude Code and Gemini CLI use official wrapper files that import it. Codex and OpenCode link that same file directly to their official `AGENTS.md` paths during install. Shared skills live in `AI-Supporter/SKILLS/` and the whole directory is linked to each supported tool during install.

## Tools

Linux install targets are defined in `config/targets.manifest`.

Current scopes:
- `linux`
- `shared`
- `ai`

Current groups:
- `core`
- `niri`
- `utilities`
- `config`
- `ai`

Use `./install.sh --help` to see the resolved target names from the manifest.

### Windows
```text
windows terminal, wezterm, nushell, neovim, yazi, lazygit
```

## Install

### Linux
```bash
./install.sh
./install.sh --dry-run
./install.sh --no-install
./install.sh --skip-kitty
./install.sh --only-neovim
```

### Windows
```powershell
nu install.nu
nu install.nu --dry-run
nu install.nu --skip [wezterm]
nu install.nu --only [nvim lazygit]
```

## AI Structure

```text
AI-Supporter/
├── AGENTS.md
├── SKILLS/
│   └── no-comments/
│       └── SKILL.md
├── Claude Code/
│   ├── CLAUDE.md
│   ├── settings.claude.json
│   └── settings.json
├── Codex/
│   └── config.toml
├── Gemini CLI/
│   └── GEMINI.md
```

Official install targets:

```text
~/.claude/CLAUDE.md                  <- AI-Supporter/Claude Code/CLAUDE.md
~/.gemini/GEMINI.md                  <- AI-Supporter/Gemini CLI/GEMINI.md
~/.codex/AGENTS.md                   <- AI-Supporter/AGENTS.md
~/.config/opencode/AGENTS.md         <- AI-Supporter/AGENTS.md
~/.claude/skills                     <- AI-Supporter/SKILLS
~/.codex/skills                      <- AI-Supporter/SKILLS
~/.config/opencode/skills            <- AI-Supporter/SKILLS
```

## Linux Paths

Linux config sources live primarily under `Linux-config/`.
Non-XDG files such as [`.profile`](/home/lou/Documents/WorkFlow/envCross_dotfiles/.profile) stay at repo root.
`~/.local/share` targets live under [Linux-local-share](/home/lou/Documents/WorkFlow/envCross_dotfiles/Linux-local-share).

| Tool | Path |
|------|------|
| niri | `~/.config/niri/config.kdl` |
| kitty | `~/.config/kitty` |
| ghostty | `~/.config/ghostty` |
| autostart | `~/.config/autostart` |
| fcitx5 | `~/.config/fcitx5` |
| fish | `~/.config/fish` |
| neovim | `~/.config/nvim` |
| zed | `~/.config/zed` |
| yazi | `~/.config/yazi` |
| lazygit | `~/.config/lazygit` |
| tock | `~/.config/tock` |
| zellij | `~/.config/zellij` |
| systemd-user | `~/.config/systemd/user` |
| waybar | `~/.config/waybar` |
| mako | `~/.config/mako` |
| vicinae | `~/.config/vicinae` |
| waypaper | `~/.config/waypaper` |
| pcmanfm-qt | `~/.config/pcmanfm-qt` |
| hyprlock | `~/.config/hypr` |
| zathura | `~/.config/zathura` |
| easyeffects | `~/.config/easyeffects` |
| mpv | `~/.config/mpv` |
| pipewire | `~/.config/pipewire` |
| qt6ct | `~/.config/qt6ct` |
| qt6ct-env | `~/.config/environment.d/qt6ct.conf` |
| mimeapps | `~/.config/mimeapps.list` |
| niri-mimeapps | `~/.config/niri-mimeapps.list` |
| satty-config | `~/.config/satty` |
| wireplumber | `~/.config/wireplumber` |
| xdg-terminals | `~/.config/xdg-terminals.list` |
| xdg-desktop-portal | `~/.config/xdg-desktop-portal` |
| niri-xdg-terminals | `~/.config/niri-xdg-terminals.list` |
| user-dirs | `~/.config/user-dirs.dirs` |
| user-dirs-locale | `~/.config/user-dirs.locale` |
| profile | `~/.profile` |
| kitty-desktop | `~/.local/share/applications/kitty.desktop` |
| claude-code | `~/.claude/{CLAUDE.md,settings*.json,skills}` |
| codex | `~/.codex/{AGENTS.md,config.toml,skills}` |
| gemini-cli | `~/.gemini/GEMINI.md` |
| opencode | `~/.config/opencode/{AGENTS.md,skills}` |
| gitconfig | `~/.gitconfig` |

## Windows Paths

| Tool | Path |
|------|------|
| windows terminal | `%SCOOP%\apps\windows-terminal\current\settings\settings.json` |
| powershell | `%USERPROFILE%\Documents\PowerShell\Microsoft.PowerShell_profile.ps1` |
| wezterm | `%USERPROFILE%\.config\wezterm` |
| nushell | `%APPDATA%\nushell` |
| neovim | `%LOCALAPPDATA%\nvim` |
| yazi | `%APPDATA%\yazi\config` |
| lazygit | `%LOCALAPPDATA%\lazygit` |
