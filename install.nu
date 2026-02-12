# Windows dotfiles installer via Scoop
# Tools: WezTerm, Windows Terminal, Nushell, Neovim, Yazi, Lazygit

def main [
    --dry-run (-n)
    --no-backup
    --no-install
    --force-install
    --skip: any = []
    --only: any = []
] {
    let repo_root = (pwd)
    let windows_root = ($repo_root | path join "Windows")
    let backup_root = ($repo_root | path join $"backup/(date now | format date '%Y%m%d-%H%M%S')")
    
    let home = $env.USERPROFILE
    let appdata = $env.APPDATA
    let localappdata = $env.LOCALAPPDATA

    # Logging
    def log_info [msg: string] { print $"(ansi green)[INFO](ansi reset) ($msg)" }
    def log_warn [msg: string] { print $"(ansi yellow)[WARN](ansi reset) ($msg)" }
    def log_error [msg: string] { print $"(ansi red)[ERROR](ansi reset) ($msg)" }

    # Normalize list args
    def normalize_list [val: any]: nothing -> list<string> {
        if ($val == null) { return [] }

        let t = ($val | describe)

        if ($t | str starts-with "list") { return $val }

        if $t == "string" {
            let s = ($val | str trim)
            if ($s | str length) == 0 { return [] }

            if ($s | str contains ",") {
                return ($s | split row "," | each { $in | str trim } | where { $in | is-not-empty })
            }

            return [$s]
        }

        return [($val | into string)]
    }

    let skip_list = (normalize_list $skip)
    let only_list = (normalize_list $only)

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
            ^powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force; Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression"
            
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
            {name: "Windows-Terminal", pkg: "windows-terminal", cmd: "wt"}
            {name: "Nushell", pkg: "nu", cmd: "nu"}
            {name: "Neovim", pkg: "neovim", cmd: "nvim"}
            {name: "Yazi", pkg: "yazi", cmd: "yazi"}
            {name: "Lazygit", pkg: "lazygit", cmd: "lazygit"}
        ]

        for tool in $tools {
            if (should_install ($tool.name | str downcase) $skip_list $only_list) {
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

    if (should_install "wezterm" $skip_list $only_list) {
        mut wezterm_dir = ($windows_root | path join "wezterm")
        if not ($wezterm_dir | path exists) {
            let fallback = ($repo_root | path join "wezterm")
            if ($fallback | path exists) {
                log_warn "WezTerm dir missing under Windows/; using repo root fallback"
                $wezterm_dir = $fallback
            }
        }
        if ($wezterm_dir | path exists) {
            $targets ++= [{
                name: "WezTerm"
                source: $wezterm_dir
                dest: ($home | path join ".config" | path join "wezterm")
                is_file: false
            }]
        }
        
        let wezterm_lua_win = ($windows_root | path join ".wezterm.lua")
        let wezterm_lua_root = ($repo_root | path join ".wezterm.lua")
        let wezterm_lua = if ($wezterm_lua_win | path exists) {
            $wezterm_lua_win
        } else if ($wezterm_lua_root | path exists) {
            log_warn "WezTerm .wezterm.lua missing under Windows/; using repo root fallback"
            $wezterm_lua_root
        } else {
            ""
        }
        if (($wezterm_lua | str length) > 0) and ($wezterm_lua | path exists) {
            $targets ++= [{
                name: ".wezterm.lua"
                source: $wezterm_lua
                dest: ($home | path join ".wezterm.lua")
                is_file: true
            }]
        }
    }

    if (should_install "windows-terminal" $skip_list $only_list) {
        mut wt_src = ($windows_root | path join "windows terminal" | path join "settings.json")
        if not ($wt_src | path exists) {
            let fallback = ($repo_root | path join "windows terminal" | path join "settings.json")
            if ($fallback | path exists) {
                log_warn "Windows Terminal settings missing under Windows/; using repo root fallback"
                $wt_src = $fallback
            }
        }
        let scoop_root = ($env.SCOOP? | default "")
        if ($scoop_root | str length) == 0 {
            log_warn "SCOOP env not set; skip Windows Terminal linking"
        } else {
            let wt_dest = ($scoop_root | path join "apps" | path join "windows-terminal" | path join "current" | path join "settings" | path join "settings.json")
            $targets ++= [{
                name: "Windows Terminal"
                source: $wt_src
                dest: $wt_dest
                is_file: true
            }]
        }
    }

    mut pwsh_profile = ($windows_root | path join "powershell" | path join "Microsoft.PowerShell_profile.ps1")
    if not ($pwsh_profile | path exists) {
        let fallback = ($repo_root | path join "powershell" | path join "Microsoft.PowerShell_profile.ps1")
        if ($fallback | path exists) {
            log_warn "PowerShell profile missing under Windows/; using repo root fallback"
            $pwsh_profile = $fallback
        }
    }
    if ($pwsh_profile | path exists) {
        $targets ++= [{
            name: "PowerShell profile"
            source: $pwsh_profile
            dest: ($home | path join "Documents" | path join "PowerShell" | path join "Microsoft.PowerShell_profile.ps1")
            is_file: true
        }]
    }

    # AI-Supporter (Claude Code / Codex)
    let ai_root = ($repo_root | path join "AI-Supporter")
    let claude_md = ($ai_root | path join "Claude Code" | path join "CLAUDE.md")
    let claude_skills = ($ai_root | path join "Claude Code" | path join "skills")
    let codex_agents = ($ai_root | path join "Codex" | path join "AGENTS.md")
    let codex_skills = ($ai_root | path join "Codex" | path join "skills")

    if ($claude_md | path exists) {
        $targets ++= [{
            name: "Claude Code CLAUDE.md"
            source: $claude_md
            dest: ($home | path join ".claude" | path join "CLAUDE.md")
            is_file: true
        }]
    }

    if ($claude_skills | path exists) {
        $targets ++= [{
            name: "Claude Code skills"
            source: $claude_skills
            dest: ($home | path join ".claude" | path join "skills")
            is_file: false
        }]
    }

    if ($codex_skills | path exists) {
        $targets ++= [{
            name: "Codex skills"
            source: $codex_skills
            dest: ($home | path join ".codex" | path join "skills")
            is_file: false
        }]
    }

    if ($codex_agents | path exists) {
        $targets ++= [{
            name: "Codex AGENTS.md"
            source: $codex_agents
            dest: ($home | path join ".codex" | path join "AGENTS.md")
            is_file: true
        }]
    }
    if (should_install "nushell" $skip_list $only_list) {
        $targets ++= [{
            name: "Nushell"
            source: (if (($windows_root | path join "nushell") | path exists) {
                $windows_root | path join "nushell"
            } else {
                log_warn "Nushell dir missing under Windows/; using repo root fallback"
                $repo_root | path join "nushell"
            })
            dest: ($appdata | path join "nushell")
            is_file: false
        }]
    }

    if (should_install "neovim" $skip_list $only_list) {
        $targets ++= [{
            name: "Neovim"
            source: ($repo_root | path join "nvim")
            dest: ($localappdata | path join "nvim")
            is_file: false
        }]
    }

    if (should_install "yazi" $skip_list $only_list) {
        # Windows yazi expects config in %APPDATA%\yazi\config\
        $targets ++= [{
            name: "Yazi"
            source: ($repo_root | path join "yazi")
            dest: ($appdata | path join "yazi" | path join "config")
            is_file: false
        }]
    }

    if (should_install "lazygit" $skip_list $only_list) {
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
