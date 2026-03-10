# Dotfiles

`AI-Supporter/AGENTS.md` is the only shared AI instructions file in this repo. Claude Code and Gemini CLI use official wrapper files that import it. Codex and OpenCode link that same file directly to their official `AGENTS.md` paths during install. Shared skills live in `AI-Supporter/SKILLS/` and the whole directory is linked to each supported tool during install.

## Tools

### Linux
```text
niri, kitty, ghostty, fish, neovim, zed, yazi, lazygit, zellij,
waybar, mako, zathura, easyeffects, mpv, hyprlock, vicinae, qt6ct,
claude-code, codex, gemini-cli, opencode,
playerctl, brightnessctl, bluez, blueman, slurp, grim, satty, impala,
yt-dlp, wl-clipboard, swayosd, swayidle, wlr-randr, polkit-gnome, awww, ripdrag,
pcmanfm-qt
```

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

| Tool | Path |
|------|------|
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
| pcmanfm-qt | `~/.config/pcmanfm-qt` |
| hyprlock | `~/.config/hypr` |
| zathura | `~/.config/zathura` |
| easyeffects | `~/.config/easyeffects` |
| mpv | `~/.config/mpv` |
| qt6ct | `~/.config/qt6ct` |
| qt6ct-env | `~/.config/environment.d/qt6ct.conf` |
| mimeapps | `~/.config/mimeapps.list` |
| niri-mimeapps | `~/.config/niri-mimeapps.list` |
| xdg-terminals | `~/.config/xdg-terminals.list` |
| niri-xdg-terminals | `~/.config/niri-xdg-terminals.list` |
| user-dirs | `~/.config/user-dirs.dirs` |
| user-dirs-locale | `~/.config/user-dirs.locale` |
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
