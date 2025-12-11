# Dotfiles Setup for WezTerm, Nushell, Yazi, Neovim, and eza

This repository contains cross-platform configuration files for the following tools:

- **WezTerm**
- **Nushell**
- **Yazi**
- **Neovim**
- **eza** (via shell aliases)

The goal is to maintain a reproducible, cross-platform environment with one-command setup on:

- **Windows** (PowerShell + Scoop)
- **Linux** (POSIX shell, symlinks)
- **Windows/Linux** (Nushell installer)

---

## Repository Structure

```txt

dotfiles/
├─ install.ps1        # Windows installer (PowerShell + Scoop)
├─ install.nu         # Nushell installer (Windows + Linux)
├─ install.sh         # POSIX sh installer (Linux + macOS)
├─ nushell/           # Nushell configuration
├─ nvim/              # Neovim configuration
├─ yazi/              # Yazi configuration
├─ wezterm/           # WezTerm lua modules
└─.wezterm.lua       # WezTerm main config (optional)

```

All installers assume you execute commands from the repository root:

```sh

cd ./dotfiles

```

---

## 1. Windows Installation (`install.ps1`)

The PowerShell installer:

1. Installs required tools via **Scoop**, if available:
   - `nu` (Nushell)
   - `neovim`
   - `wezterm`
   - `yazi`
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
cd $HOME
git clone https://github.com/<your-user>/dotfiles.git
cd dotfiles
```

---

### 1.3 Run the Installer

```powershell
.\install.ps1
```

#### Optional Flags

```powershell
.\install.ps1 -DryRun       # Show planned operations
.\install.ps1 -NoBackup     # Perform install without backup
.\install.ps1 -SkipInstall  # Skip Scoop installation
```

---

### 1.4 Windows Paths Used

| Tool                | Destination Path                |
| ------------------- | ------------------------------- |
| Nushell             | `%APPDATA%\nushell`             |
| Neovim              | `%LOCALAPPDATA%\nvim`           |
| Yazi                | `%APPDATA%\yazi`                |
| WezTerm             | `%USERPROFILE%\.config\wezterm` |
| WezTerm main config | `%USERPROFILE%\.wezterm.lua`    |

Backups are stored under:

```sh
dotfiles/backup/<timestamp>/
```

---

## 2. Cross-Platform Installer (`install.nu`)

The Nushell installer works on **Windows and Linux**.

### What it does

- Detects OS automatically.
- Determines correct config paths.
- Backs up existing config.
- Copies new configuration files.
- Handles `.wezterm.lua` if present.

### Usage

```nu
nu install.nu
```

#### Optional Flags

```nu
nu install.nu --dry-run
nu install.nu --no-backup
```

### Targets installed

- Nushell configuration
- Neovim configuration
- Yazi configuration
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

### Why copies (not symlinks) on Windows?

- Windows symlink behavior often requires admin rights.
- PowerShell behavior varies by filesystem and policies.
- Copying is stable and predictable on all Windows setups.

### Yazi installation on Windows

Yazi can be installed via Scoop, but the official docs mention
limitations around Unicode file names and the `file` dependency.
If issues occur, consider installing dependencies manually.
