# Windows dotfiles installer via Scoop
# Tools: WezTerm, Nushell, Neovim, Yazi, Lazygit

def main [
    --dry-run (-n)
    --no-backup
    --no-install
    --force-install
    --skip: list<string> = []
    --only: list<string> = []
] {
    let repo_root = (pwd)
    let backup_root = ($repo_root | path join $"backup/(date now | format date '%Y%m%d-%H%M%S')")
    
    let home = $env.USERPROFILE
    let appdata = $env.APPDATA
    let localappdata = $env.LOCALAPPDATA

    # Logging
    def log_info [msg: string] { print $"(ansi green)[INFO](ansi reset) ($msg)" }
    def log_warn [msg: string] { print $"(ansi yellow)[WARN](ansi reset) ($msg)" }
    def log_error [msg: string] { print $"(ansi red)[ERROR](ansi reset) ($msg)" }

    # Filter
    def should_install [tool: string, skip_list: list<string>, only_list: list<string>]: nothing -> bool {
        if ($only_list | is-not-empty) { return ($tool in $only_list) }
        return ($tool not-in $skip_list)
    }

    # Check command
    def check_cmd [cmd: string]: nothing -> bool {
        (which $cmd | is-not-empty)
    }

    # Install Scoop
    def ensure_scoop [dry: bool]: nothing -> bool {
        if (check_cmd "scoop") {
            log_info "Scoop already installed"
            return true
        }

        log_info "Installing Scoop..."
        
        if $dry {
            log_info "Would install Scoop"
            return true
        }

        try {
            ^powershell.exe -NoProfile -ExecutionPolicy Bypass -Command `
                "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force; `
                 Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression"
            
            if (check_cmd "scoop") {
                log_info "Scoop installed"
                try { ^scoop bucket add extras } catch { }
                return true
            } else {
                log_error "Scoop install failed"
                return false
            }
        } catch {
            log_error "Scoop install failed"
            return false
        }
    }

    # Install tool
    def install_tool [tool: string, pkg: string, cmd: string, dry: bool, force: bool]: nothing -> bool {
        if (check_cmd $cmd) and (not $force) {
            log_info $"($tool) already installed"
            return true
        }

        log_info $"Installing ($tool)..."
        
        if $dry {
            log_info $"Would install ($tool)"
            return true
        }

        try {
            ^scoop install $pkg
            
            if (check_cmd $cmd) {
                log_info $"($tool) installed"
                return true
            } else {
                log_warn $"($tool) command not found"
                return false
            }
        } catch {
            log_warn $"Failed to install ($tool)"
            return false
        }
    }

    # Backup
    def backup [path: string, name: string, no_bak: bool, dry: bool, bak_root: string] {
        if $no_bak or not ($path | path exists) { return }

        let dest = ($bak_root | path join ($name | str replace -a '[/\\:*?"<>| ]' '_'))

        if $dry {
            log_info $"Would backup: ($name)"
        } else {
            mkdir ($dest | path dirname)
            cp -r $path $dest
            log_info $"Backed up: ($name)"
        }
    }

    # Symlink
    def link_config [source: string, dest: string, is_file: bool, name: string, dry: bool] {
        if not ($source | path exists) {
            log_warn $"Source not found: ($name)"
            return
        }

        if $dry {
            log_info $"Would link: ($name)"
            return
        }

        if ($dest | path exists) {
            try { rm -r $dest } catch { log_warn $"Failed to remove: ($dest)"; return }
        }

        mkdir ($dest | path dirname)

        try {
            if $is_file {
                ^cmd /c mklink $dest $source | complete | ignore
            } else {
                ^cmd /c mklink /D $dest $source | complete | ignore
            }
            log_info $"Linked: ($name)"
        } catch {
            log_error $"Failed to link: ($name)"
            log_warn "Enable Developer Mode: Settings → For developers → Developer Mode"
        }
    }

    # Main logic
    print "Windows Dotfiles Installer"
    print $"Repository: ($repo_root)"
    print ""

    let is_admin = (try { (^net session | complete | get exit_code) == 0 } catch { false })
    
    if not $is_admin {
        log_warn "Not running as Administrator"
        log_warn "Symlinks require Admin or Developer Mode"
        print ""
    }

    # Install tools
    if not $no_install {
        print ""
        log_info "=== Installing Tools ==="
        
        if not (ensure_scoop $dry_run) {
            log_error "Scoop required"
            return
        }

        let tools = [
            {name: "WezTerm", pkg: "wezterm", cmd: "wezterm"}
            {name: "Nushell", pkg: "nu", cmd: "nu"}
            {name: "Neovim", pkg: "neovim", cmd: "nvim"}
            {name: "Yazi", pkg: "yazi", cmd: "yazi"}
            {name: "Lazygit", pkg: "lazygit", cmd: "lazygit"}
        ]

        for tool in $tools {
            if (should_install ($tool.name | str downcase) $skip $only) {
                install_tool $tool.name $tool.pkg $tool.cmd $dry_run $force_install
            }
        }
    }

    # Link configs
    print ""
    log_info "=== Linking Configs ==="
    
    if not $dry_run and not $no_backup {
        mkdir $backup_root
    }

    mut targets = []

    if (should_install "wezterm" $skip $only) {
        let wezterm_dir = ($repo_root | path join "wezterm")
        if ($wezterm_dir | path exists) {
            $targets ++= [{
                name: "WezTerm"
                source: $wezterm_dir
                dest: ($home | path join ".config" | path join "wezterm")
                is_file: false
            }]
        }
        
        let wezterm_lua = ($repo_root | path join ".wezterm.lua")
        if ($wezterm_lua | path exists) {
            $targets ++= [{
                name: ".wezterm.lua"
                source: $wezterm_lua
                dest: ($home | path join ".wezterm.lua")
                is_file: true
            }]
        }
    }

    if (should_install "nushell" $skip $only) {
        $targets ++= [{
            name: "Nushell"
            source: ($repo_root | path join "nushell")
            dest: ($appdata | path join "nushell")
            is_file: false
        }]
    }

    if (should_install "neovim" $skip $only) {
        $targets ++= [{
            name: "Neovim"
            source: ($repo_root | path join "nvim")
            dest: ($localappdata | path join "nvim")
            is_file: false
        }]
    }

    if (should_install "yazi" $skip $only) {
        $targets ++= [{
            name: "Yazi"
            source: ($repo_root | path join "yazi")
            dest: ($appdata | path join "yazi")
            is_file: false
        }]
    }

    if (should_install "lazygit" $skip $only) {
        $targets ++= [{
            name: "Lazygit"
            source: ($repo_root | path join "lazygit")
            dest: ($localappdata | path join "lazygit")
            is_file: false
        }]
    }

    for t in $targets {
        backup $t.dest $t.name $no_backup $dry_run $backup_root
    }

    for t in $targets {
        link_config $t.source $t.dest $t.is_file $t.name $dry_run
    }

    # Done
    print ""
    log_info "=== Installation Complete ==="
    print ""
    
    if not $dry_run {
        print "Restart terminal"
        print "Launch WezTerm: wezterm.exe"
        print "Open Neovim: nvim"
        
        if ($backup_root | path exists) {
            print ""
            log_info $"Backups: ($backup_root)"
        }
    }
}
