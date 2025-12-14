# Dotfiles Setup for WezTerm, Nushell, Yazi, Neovim, and eza

This repository contains cross-platform configuration files for the following tools:

- [**WezTerm**](https://github.com/wezterm/wezterm)
- [**Nushell**](https://github.com/nushell/nushell)
- [**Yazi**](https://github.com/sxyazi/yazi)
- [**Neovim**](https://github.com/neovim/neovim)
- [**Lazygit**](https://github.com/jesseduffield/lazygit)
- [**eza**](https://github.com/eza-community/eza) (via shell aliases)

The goal is to maintain a reproducible, cross-platform environment with one-command setup on:

- **Windows** (PowerShell + Scoop)
- **Linux** (POSIX shell, symlinks)
- **Windows/Linux** (Nushell installer)

---

## Repository Structure

```txt

envCross_dotfiles/
├─ install.ps1        # Windows installer (PowerShell + Scoop)
├─ install.nu         # Nushell installer (Windows + Linux)
├─ install.sh         # POSIX sh installer (Linux)
├─ nushell/           # Nushell configuration
├─ nvim/              # Neovim configuration
├─ yazi/              # Yazi configuration
├─ wezterm/           # WezTerm lua modules
├─ lazygit/           # Lazygit configuration
└─.wezterm.lua       # WezTerm main config (optional)

```

All installers assume you execute commands from the repository root:

```sh

cd ./envCross_dotfiles

```

---

## Plugins & Packages Statistics

This development environment includes **65 total plugins/packages/modules** across all tools:

| Tool        | Plugins/Packages | Description                                                                             |
| ----------- | ---------------- | --------------------------------------------------------------------------------------- |
| **Neovim**  | **59**           | Complete IDE setup with LSP, AI assistants, Git integration, and .NET development tools |
| **Yazi**    | **2**            | File manager with custom plugins (whoosh.yazi, image.lua)                               |
| **Nushell** | **2**            | Shell with Starship prompt and Catppuccin theme                                         |
| **WezTerm** | **2**            | Terminal with custom modules (themes.lua, launcher.lua)                                 |
| **Lazygit** | **0**            | Git TUI with Catppuccin theme configuration                                             |

### 🟣 Neovim Plugins (59)

<details>
<summary>Click to expand full list</summary>

#### 🎨 Appearance & Themes (7)

- [catppuccin](https://github.com/catppuccin/nvim) - Color scheme
- [lualine.nvim](https://github.com/nvim-lualine/lualine.nvim) - Status line
- [bufferline.nvim](https://github.com/akinsho/bufferline.nvim) - Buffer/tab line
- [barbar.nvim](https://github.com/romgrk/barbar.nvim) - Alternative tab manager
- [nvim-web-devicons](https://github.com/nvim-tree/nvim-web-devicons) - Icon support
- [indent-blankline.nvim](https://github.com/lukas-reineke/indent-blankline.nvim) - Indentation guides
- [nvim-colorizer.lua](https://github.com/NvChad/nvim-colorizer.lua) - Color code visualization

#### 📝 Editing Enhancement (6)

- [Comment.nvim](https://github.com/numToStr/Comment.nvim) - Commenting
- [nvim-autopairs](https://github.com/windwp/nvim-autopairs) - Auto-close brackets
- [nvim-ufo](https://github.com/kevinhwang91/nvim-ufo) - Enhanced folding
- [nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter) - Syntax highlighting
- [conform.nvim](https://github.com/stevearc/conform.nvim) - Code formatting
- [LuaSnip](https://github.com/L3MON4D3/LuaSnip) - Snippet engine

#### 🔍 Search & Navigation (4)

- [telescope.nvim](https://github.com/nvim-telescope/telescope.nvim) - Fuzzy finder
- [telescope-fzf-native.nvim](https://github.com/nvim-telescope/telescope-fzf-native.nvim) - FZF integration
- [neo-tree.nvim](https://github.com/nvim-neo-tree/neo-tree.nvim) - File tree
- [yazi.nvim](https://github.com/mikavilpas/yazi.nvim) - Yazi integration

#### 💡 LSP & Completion (11)

- [nvim-lspconfig](https://github.com/neovim/nvim-lspconfig) - LSP configuration
- [mason.nvim](https://github.com/williamboman/mason.nvim) - LSP/DAP/Linter manager
- [mason-lspconfig.nvim](https://github.com/williamboman/mason-lspconfig.nvim) - Mason-LSP bridge
- [nvim-cmp](https://github.com/hrsh7th/nvim-cmp) - Completion engine
- [cmp-nvim-lsp](https://github.com/hrsh7th/cmp-nvim-lsp) - LSP completion source
- [cmp-buffer](https://github.com/hrsh7th/cmp-buffer) - Buffer completion
- [cmp-path](https://github.com/hrsh7th/cmp-path) - Path completion
- [cmp-cmdline](https://github.com/hrsh7th/cmp-cmdline) - Command line completion
- [cmp_luasnip](https://github.com/saadparwaiz1/cmp_luasnip) - LuaSnip completion
- [lspkind.nvim](https://github.com/onsails/lspkind.nvim) - Completion icons
- [none-ls.nvim](https://github.com/nvimtools/none-ls.nvim) - Formatting & diagnostics

#### 🤖 AI Assistants (4)

- [copilot.lua](https://github.com/zbirenbaum/copilot.lua) - GitHub Copilot
- [copilot-cmp](https://github.com/zbirenbaum/copilot-cmp) - Copilot completion
- [codecompanion.nvim](https://github.com/olimorris/codecompanion.nvim) - AI code assistant
- [supermaven-nvim](https://github.com/supermaven-inc/supermaven-nvim) - Supermaven AI

#### 🐛 Debugging (4)

- [nvim-dap](https://github.com/mfussenegger/nvim-dap) - Debug Adapter Protocol
- [nvim-dap-ui](https://github.com/rcarriga/nvim-dap-ui) - DAP UI
- [nvim-dap-virtual-text](https://github.com/theHamsta/nvim-dap-virtual-text) - Virtual text for debugging
- [trouble.nvim](https://github.com/folke/trouble.nvim) - Diagnostics panel

#### 🔧 .NET Development (4)

- [roslyn.nvim](https://github.com/seblj/roslyn.nvim) - Roslyn LSP (C#)
- [rzls.nvim](https://github.com/tris203/rzls.nvim) - Razor LSP
- [dotnet.nvim](https://github.com/MoaidHathot/dotnet.nvim) - .NET tools
- [easy-dotnet.nvim](https://github.com/GustavEikaas/easy-dotnet.nvim) - .NET development helpers

#### 📚 Markdown Support (4)

- [markdown-preview.nvim](https://github.com/iamcco/markdown-preview.nvim) - Live preview
- [markview.nvim](https://github.com/OXY2DEV/markview.nvim) - Markdown visualization
- [render-markdown.nvim](https://github.com/MeanderingProgrammer/render-markdown.nvim) - Markdown rendering
- [img-clip.nvim](https://github.com/HakonHarnes/img-clip.nvim) - Image clipboard

#### 🔄 Git Integration (3)

- [gitsigns.nvim](https://github.com/lewis6991/gitsigns.nvim) - Git signs & hunks
- [git-blame.nvim](https://github.com/f-person/git-blame.nvim) - Git blame
- [mini.diff](https://github.com/echasnovski/mini.diff) - Diff visualization

#### 🛠️ Utilities & Framework (12)

- [lazy.nvim](https://github.com/folke/lazy.nvim) - Package manager
- [plenary.nvim](https://github.com/nvim-lua/plenary.nvim) - Lua utilities
- [nui.nvim](https://github.com/MunifTanjim/nui.nvim) - UI components
- [nvim-nio](https://github.com/nvim-neotest/nvim-nio) - Async I/O
- [promise-async](https://github.com/kevinhwang91/promise-async) - Async promises
- [luarocks.nvim](https://github.com/vhyrro/luarocks.nvim) - Lua package manager
- [which-key.nvim](https://github.com/folke/which-key.nvim) - Keybinding hints
- [auto-session](https://github.com/rmagatti/auto-session) - Session management
- [fidget.nvim](https://github.com/j-hui/fidget.nvim) - LSP progress
- [mcphub.nvim](https://github.com/ravibrock/mcphub.nvim) - MCP Hub
- [friendly-snippets](https://github.com/rafamadriz/friendly-snippets) - Snippet collection

</details>

### 🟦 Yazi Plugins (2)

- [**whoosh.yazi**](https://github.com/yazi-rs/plugins/tree/main/whoosh.yazi) - Navigation enhancement
- **image.lua** - Custom image handling (local plugin)
- Built-in integrations: [fzf](https://github.com/junegunn/fzf), [zoxide](https://github.com/ajeetdsouza/zoxide)

### 🟩 Nushell Components (2)

- [**Starship**](https://github.com/starship/starship) - Cross-shell prompt
- [**Catppuccin Mocha**](https://github.com/catppuccin/nushell) - Color theme

### 🟧 WezTerm Modules (2)

- **themes.lua** - Theme configuration ([Catppuccin](https://github.com/catppuccin/wezterm))
- **launcher.lua** - Launch menu (4 shells: NuShell, PowerShell 7, CMD, Git Bash)

### 🟨 Lazygit Configuration

- [**Catppuccin theme**](https://github.com/catppuccin/lazygit) colors only (no plugins)

### Theme Consistency

All tools use the **Catppuccin** color scheme (primarily Mocha variant) for a unified visual experience! 🎨

---

## 1. Windows Installation (`install.ps1`)

The PowerShell installer:

1. Installs required tools via **Scoop**, if available:
   - `nu` (Nushell)
   - `neovim`
   - `wezterm`
   - `yazi`
   - `lazygit`
   - `eza`
2. Backs up any existing configuration.
3. Copies new config files into Windows-appropriate directories.

---

### 1.1 Install Scoop (if not already installed)

Open **PowerShell (non-admin)**:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex
```

---

### 1.2 Clone the Dotfiles Repo

```powershell
git clone https://github.com/loulazynote/envCross_dotfiles.git
cd envCross_dotfiles
```

---

### 1.3 Run the Installer

```powershell
.\install.ps1
```

#### Optional Flags

```powershell
.\install.ps1 --dry-run     # Show planned operations
.\install.ps1 --no-backup   # Perform install without backup

# PowerShell-style flags also supported:
.\install.ps1 -DryRun
.\install.ps1 -NoBackup
```

---

### 1.4 Windows Paths Used

| Tool                | Destination Path                |
| ------------------- | ------------------------------- |
| Nushell             | `%APPDATA%\nushell`             |
| Neovim              | `%LOCALAPPDATA%\nvim`           |
| Yazi                | `%APPDATA%\yazi`                |
| Lazygit             | `%LOCALAPPDATA%\lazygit`        |
| WezTerm             | `%USERPROFILE%\.config\wezterm` |
| WezTerm main config | `%USERPROFILE%\.wezterm.lua`    |

Backups are stored under:

```sh
envCross_dotfiles/backup/YYYYMMDD-HHMMSS/
```

---

## 2. Cross-Platform Installer (`install.nu`)

The Nushell installer works on **Windows and Linux**.

### What it does

- Detects OS automatically.
- Determines correct config paths.
- Backs up existing config.
- Copies new configuration files (or creates symlinks with `--symlink`).
- Handles `.wezterm.lua` if present.
- Supports symlinks for both directories and individual files.

### Usage

```nu
nu install.nu
```

#### Optional Flags

```nu
nu install.nu --dry-run
nu install.nu --no-backup
nu install.nu --symlink     # Use symlinks instead of copies
nu install.nu -s            # Short form for --symlink

# Combine flags
nu install.nu --symlink --dry-run
```

### Targets installed

- Nushell configuration
- Neovim configuration
- Yazi configuration
- Lazygit configuration
- WezTerm configuration directory
- WezTerm main config (optional)

---

## 3. Linux Installation (`install.sh`)

This installer:

- Creates **symlinks** instead of copying files.
- Backs up any existing configuration.
- Does **not** install packages (you install them using apt/pacman/dnf/brew/etc.).

### Usage

```sh
chmod +x install.sh
./install.sh
```

#### Optional Flags

```sh
./install.sh --dry-run      # Show planned operations
```

---

### 3.1 Installing Required Tools (Linux)

Examples for common systems:

### Ubuntu / Debian

```sh
sudo apt update
sudo apt install -y neovim nushell
```

### Arch Linux

```sh
sudo pacman -S neovim nushell
```

### Fedora

```sh
sudo dnf install -y neovim nushell
```

---

## 4. Notes and Recommendations

### Why symlinks on Linux?

- Repository becomes the **source of truth**.
- Editing files inside the repo immediately applies to the system.
- No need to re-run installers when editing configs.

### Symlinks on Windows

- `install.nu --symlink` now supports creating symlinks for both files and directories on Windows.
- **Requirements**: Windows symlinks require either:
  - Administrator privileges, OR
  - Developer Mode enabled (Windows 10/11)
- **Default behavior**: The installers use copying by default for maximum compatibility.
- **When to use symlinks**: If you want live config updates (edit repo files → changes apply immediately).

### Yazi installation on Windows

Yazi can be installed via Scoop, but the official docs mention
limitations around Unicode file names and the `file` dependency.
If issues occur, consider installing dependencies manually.
