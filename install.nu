# Windows dotfiles installer with automatic tool installation via Scoop
# Tools: WezTerm, Nushell, Neovim, Yazi, Lazygit
#
# Usage:
#   nu install.nu
#   nu install.nu --dry-run
#   nu install.nu --no-backup
#   nu install.nu --no-install           # Skip tool installation, only symlink configs
#   nu install.nu --skip [wezterm yazi]  # Skip specific tools
#   nu install.nu --only [nvim lazygit]  # Only install specific tools

def main [
    --dry-run (-n)                # Simulate without making changes
    --no-backup                   # Skip backing up existing configs
    --no-install                  # Skip automatic tool installation
    --force-install               # Force reinstall even if tools exist
    --skip: list<string> = []     # Tools to skip (e.g., --skip [wezterm yazi])
    --only: list<string> = []     # Only install these tools (e.g., --only [nvim])
] {
    # ==================== Environment Setup ====================
    let repo_root = (pwd)
    let now = (date now | format date "%Y%m%d-%H%M%S")
    let backup_root = ($repo_root | path join $"backup/($now)")

    let home = $env.USERPROFILE
    let appdata = $env.APPDATA
    let localappdata = $env.LOCALAPPDATA

    # ==================== Utility Functions ====================
    def info [msg: string] { print $"(ansi green)[INFO ](ansi reset) ($msg)" }
    def warn [msg: string] { print $"(ansi yellow)[WARN ](ansi reset) ($msg)" }
    def error [msg: string] { print $"(ansi red)[ERROR](ansi reset) ($msg)" }

    # ==================== Tool Filtering ====================
    def should_install [tool: string, skip_list: list<string>, only_list: list<string>]: nothing -> bool {
        if ($only_list | is-not-empty) {
            return ($tool in $only_list)
        }
        
        return ($tool not-in $skip_list)
    }

    # ==================== Command Checking ====================
    def check_command [cmd: string]: nothing -> bool {
        (which $cmd | is-not-empty)
    }

    # ==================== Scoop Installation ====================
    def ensure_scoop [dry: bool]: nothing -> bool {
        if (check_command "scoop") {
            info "Scoop already installed"
            return true
        }

        info "Installing Scoop package manager..."
        
        if $dry {
            info "DryRun: Would install Scoop via PowerShell"
            return true
        }

        try {
            ^powershell.exe -NoProfile -ExecutionPolicy Bypass -Command `
                "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force; `
                 Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression"
            
            if (check_command "scoop") {
                info "✓ Scoop installed successfully"
                
                try {
                    ^scoop bucket add extras
                    info "✓ Added 'extras' bucket"
                } catch {
                    warn "Failed to add 'extras' bucket (may already exist)"
                }
                
                return true
            } else {
                error "Failed to verify Scoop installation"
                return false
            }
        } catch {
            error $"Failed to install Scoop: ($in)"
            warn "Please install Scoop manually from: https://scoop.sh"
            return false
        }
    }

    # ==================== Tool Installation ====================
    def install_tool [
        tool: string,     # Tool name for display
        pkg: string,      # Scoop package name
        cmd: string,      # Command to check
        dry: bool,
        force: bool
    ]: nothing -> bool {
        if (check_command $cmd) and (not $force) {
            info $"✓ ($tool) already installed"
            return true
        }

        info $"Installing ($tool)..."
        
        if $dry {
            info $"DryRun: Would run 'scoop install ($pkg)'"
            return true
        }

        try {
            ^scoop install $pkg
            
            if (check_command $cmd) {
                info $"✓ ($tool) installed successfully"
                return true
            } else {
                warn $"($tool) installation completed but command not found"
                warn "You may need to restart your terminal"
                return false
            }
        } catch {
            warn $"Failed to install ($tool): ($in)"
            warn $"Try manually: scoop install ($pkg)"
            return false
        }
    }

    # ==================== Backup Function ====================
    def backup_if_exists [path: string, name: string, no_bak: bool, dry: bool, bak_root: string] {
        if $no_bak { return }
        if not ($path | path exists) { return }

        let safe_name = ($name | str replace -a '[/\\:*?"<>| ]' '_')
        let backup_dest = ($bak_root | path join $safe_name)

        if $dry {
            info $"DryRun: Would backup ($path) -> ($backup_dest)"
        } else {
            info $"Backing up ($name)..."
            mkdir ($backup_dest | path dirname)
            cp -r $path $backup_dest
            info $"✓ Backup saved to ($backup_dest)"
        }
    }

    # ==================== Symlink Function ====================
    def link_safe [source: string, dest: string, is_file: bool, name: string, dry: bool] {
        if not ($source | path exists) {
            warn $"Source not found, skip: ($name) [($source)]"
            return
        }

        if $dry {
            info $"DryRun: Would create symlink ($source) -> ($dest)"
            return
        }

        if ($dest | path exists) {
            info $"Removing existing: ($dest)"
            try {
                rm -r $dest
            } catch {
                warn $"Failed to remove existing: ($dest)"
                return
            }
        }

        mkdir ($dest | path dirname)

        try {
            if $is_file {
                ^cmd /c mklink $dest $source | complete | ignore
            } else {
                ^cmd /c mklink /D $dest $source | complete | ignore
            }
            info $"✓ Linked: ($name)"
        } catch {
            error $"Failed to create symlink for ($name)"
            warn "Make sure you're running as Administrator or have Developer Mode enabled"
            warn "Windows Settings → Update & Security → For developers → Developer Mode"
        }
    }

    # ==================== Main Logic ====================
    print ""
    info "╔════════════════════════════════════════════╗"
    info "║  Windows Dotfiles Installer (Nushell)    ║"
    info "╚════════════════════════════════════════════╝"
    print ""
    info $"Repository: ($repo_root)"
    info $"Home: ($home)"
    print ""

    let is_admin = (
        try {
            (^net session | complete | get exit_code) == 0
        } catch {
            false
        }
    )
    
    if not $is_admin {
        warn "Not running as Administrator"
        warn "Symlinks may fail unless Developer Mode is enabled"
        warn "To enable: Settings → Privacy & Security → For developers → Developer Mode"
        print ""
    }

    # ==================== Tool Installation Phase ====================
    if not $no_install {
        info "═══ Phase 1: Tool Installation ═══"
        print ""
        
        if not (ensure_scoop $dry_run) {
            error "Cannot proceed without Scoop package manager"
            return
        }
        print ""

        let tools = [
            {name: "WezTerm", pkg: "wezterm", cmd: "wezterm"}
            {name: "Nushell", pkg: "nu", cmd: "nu"}
            {name: "Neovim", pkg: "neovim", cmd: "nvim"}
            {name: "Yazi", pkg: "yazi", cmd: "yazi"}
            {name: "Lazygit", pkg: "lazygit", cmd: "lazygit"}
        ]

        for tool in $tools {
            let tool_key = ($tool.name | str downcase)
            if (should_install $tool_key $skip $only) {
                install_tool $tool.name $tool.pkg $tool.cmd $dry_run $force_install
            } else {
                info $"⊘ Skipping ($tool.name)"
            }
        }
        print ""
    } else {
        info "⊘ Skipping tool installation (--no-install)"
        print ""
    }

    # ==================== Configuration Phase ====================
    info "═══ Phase 2: Configuration Setup ═══"
    print ""

    if not $dry_run and not $no_backup {
        mkdir $backup_root
    }

    mut targets = []

    # WezTerm configs
    if (should_install "wezterm" $skip $only) {
        let wezterm_dir = ($repo_root | path join "wezterm")
        if ($wezterm_dir | path exists) {
            $targets ++= [
                {
                    name: "WezTerm directory"
                    source: $wezterm_dir
                    dest: ($home | path join ".config" | path join "wezterm")
                    is_file: false
                }
            ]
        }
        
        let wezterm_lua = ($repo_root | path join ".wezterm.lua")
        if ($wezterm_lua | path exists) {
            $targets ++= [
                {
                    name: ".wezterm.lua"
                    source: $wezterm_lua
                    dest: ($home | path join ".wezterm.lua")
                    is_file: true
                }
            ]
        }
    }

    # Nushell config
    if (should_install "nushell" $skip $only) {
        $targets ++= [
            {
                name: "Nushell"
                source: ($repo_root | path join "nushell")
                dest: ($appdata | path join "nushell")
                is_file: false
            }
        ]
    }

    # Neovim config
    if (should_install "neovim" $skip $only) {
        $targets ++= [
            {
                name: "Neovim"
                source: ($repo_root | path join "nvim")
                dest: ($localappdata | path join "nvim")
                is_file: false
            }
        ]
    }

    # Yazi config
    if (should_install "yazi" $skip $only) {
        $targets ++= [
            {
                name: "Yazi"
                source: ($repo_root | path join "yazi")
                dest: ($appdata | path join "yazi")
                is_file: false
            }
        ]
    }

    # Lazygit config
    if (should_install "lazygit" $skip $only) {
        $targets ++= [
            {
                name: "Lazygit"
                source: ($repo_root | path join "lazygit")
                dest: ($localappdata | path join "lazygit")
                is_file: false
            }
        ]
    }

    if ($targets | is-not-empty) {
        info "Backing up existing configs..."
        for t in $targets {
            backup_if_exists $t.dest $t.name $no_backup $dry_run $backup_root
        }
        print ""

        info "Creating symlinks..."
        for t in $targets {
            link_safe $t.source $t.dest $t.is_file $t.name $dry_run
        }
    } else {
        warn "No configurations to install (check --skip/--only filters)"
    }

    # ==================== Completion ====================
    print ""
    info "╔════════════════════════════════════════════╗"
    info "║         Installation Complete! 🎉         ║"
    info "╚════════════════════════════════════════════╝"
    print ""
    
    if not $dry_run {
        info "Next steps:"
        info "  1. Restart your terminal (or open a new tab)"
        info "  2. WezTerm: launch wezterm.exe"
        info "  3. Nushell: type 'nu' to enter Nushell"
        info "  4. Neovim: type 'nvim' to open Neovim"
        print ""
        
        if ($backup_root | path exists) {
            info $"Backups saved to: ($backup_root)"
        }
    }
}
