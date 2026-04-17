# Windows dotfiles installer via Scoop
# Tools: WezTerm, Windows Terminal, Nushell, Neovim, Yazi, Lazygit

def main [
    --dry-run (-n)          # Show what would be done without making changes
    --backup-only (-b)      # Backup existing configs only (no install/link)
    --no-backup             # Skip backup step
    --no-install            # Skip package installation
    --force-install         # Force reinstall packages
    --skip: any = []        # Skip specific tools (comma-separated or list)
    --only: any = []        # Only process specific tools
    --help (-h)             # Show this help
] {
    let repo_root = (pwd)
    let windows_root = ($repo_root | path join "Windows")
    let backup_root = ($repo_root | path join $"backup/(date now | format date '%Y%m%d-%H%M%S')")

    let home = $env.USERPROFILE
    let appdata = $env.APPDATA
    let localappdata = $env.LOCALAPPDATA

    def log_info  [msg: string] { print $"(ansi green)[INFO](ansi reset)  ($msg)" }
    def log_warn  [msg: string] { print $"(ansi yellow)[WARN](ansi reset)  ($msg)" }
    def log_error [msg: string] { print $"(ansi red)[ERROR](ansi reset) ($msg)" }
    def log_step  [msg: string] { print $"(ansi blue)[STEP](ansi reset)  ($msg)" }
    def log_dry   [msg: string] { print $"(ansi yellow)[DRY](ansi reset)   ($msg)" }

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

    def should_install [tool: string, skip_list: list<string>, only_list: list<string>]: nothing -> bool {
        if ($only_list | is-not-empty) { return ($tool in $only_list) }
        return ($tool not-in $skip_list)
    }

    def check_cmd [cmd: string]: nothing -> bool {
        (which $cmd | is-not-empty)
    }

    def ensure_scoop [dry: bool]: nothing -> bool {
        if (check_cmd "scoop") {
            log_info "Scoop: already installed"
            return true
        }
        if $dry {
            log_dry "Would install Scoop"
            return true
        }
        log_info "Installing Scoop..."
        try {
            ^powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force; Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression"
            if (check_cmd "scoop") {
                log_info "Scoop: installed"
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

    def install_tool [tool: string, pkg: string, cmd: string, dry: bool, force: bool]: nothing -> bool {
        if (check_cmd $cmd) and (not $force) {
            log_info $"($tool): already installed"
            return true
        }
        if $dry {
            log_dry $"Would install: ($tool) ($pkg)"
            return true
        }
        if $force and (check_cmd $cmd) {
            log_info $"($tool): reinstalling (--force-install)"
        } else {
            log_info $"Installing ($tool)..."
        }
        try {
            ^scoop install $pkg
            if (check_cmd $cmd) {
                log_info $"($tool): installed"
                return true
            } else {
                log_warn $"($tool): package installed but command not found"
                return false
            }
        } catch {
            log_warn $"Failed to install ($tool)"
            return false
        }
    }

    def is_repo_symlink [path: string, repo_root: string]: nothing -> bool {
        try {
            let target = (^powershell -Command $"(Get-Item -Path '($path)' -ErrorAction SilentlyContinue).Target" | str trim)
            ($target | str length) > 0 and ($target | str starts-with $repo_root)
        } catch { false }
    }

    def backup [path: string, name: string, no_bak: bool, dry: bool, bak_root: string, repo_root: string] {
        if $no_bak or not ($path | path exists) { return }

        if (is_repo_symlink $path $repo_root) {
            log_info $"($name): already symlinked to repo, skipping backup"
            return
        }

        let dest = ($bak_root | path join ($name | str replace --all '[/\\:*?"<>| ]' '_'))

        if $dry {
            log_dry $"Would backup: ($name)"
        } else {
            mkdir ($dest | path dirname)
            cp -r $path $dest
            log_info $"($name): backed up"
        }
    }

    def link_config [source: string, dest: string, is_file: bool, name: string, dry: bool] {
        if not ($source | path exists) {
            log_warn $"Source not found: ($name)"
            return
        }
        if $dry {
            log_dry $"Would link: ($name) -> ($dest)"
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
            log_info $"Linked: ($name) -> ($dest)"
        } catch {
            log_error $"Failed to link: ($name)"
            log_warn "Enable Developer Mode: Settings → For developers → Developer Mode"
        }
    }

    print "============================================"
    print "  Windows Dotfiles Installer"
    print "============================================"
    print ""
    print $"Repository: ($repo_root)"
    print ""

    let is_admin = (try { (^net session | complete | get exit_code) == 0 } catch { false })
    if not $is_admin {
        log_warn "Not running as Administrator"
        log_warn "Symlinks require Admin or Developer Mode"
        print ""
    }

    if $dry_run { log_warn "DRY RUN MODE - No changes will be made" }

    # === Step 1: Install Tools ===
    if not $no_install and not $backup_only {
        print ""
        log_step "=== Step 1: Installing Tools ==="
        print ""

        if not (ensure_scoop $dry_run) {
            log_error "Scoop required"
            return
        }

        let tools = [
            {name: "WezTerm",           pkg: "wezterm",           cmd: "wezterm"}
            {name: "Windows-Terminal",  pkg: "windows-terminal",  cmd: "wt"}
            {name: "Nushell",           pkg: "nu",                cmd: "nu"}
            {name: "Neovim",            pkg: "neovim",            cmd: "nvim"}
            {name: "Yazi",              pkg: "yazi",              cmd: "yazi"}
            {name: "Lazygit",           pkg: "lazygit",           cmd: "lazygit"}
        ]

        for tool in $tools {
            if (should_install ($tool.name | str downcase) $skip_list $only_list) {
                install_tool $tool.name $tool.pkg $tool.cmd $dry_run $force_install
            }
        }
    }

    # === Step 2: Build targets ===
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

        let wezterm_lua_win  = ($windows_root | path join ".wezterm.lua")
        let wezterm_lua_root = ($repo_root    | path join ".wezterm.lua")
        let wezterm_lua = if ($wezterm_lua_win | path exists) {
            $wezterm_lua_win
        } else if ($wezterm_lua_root | path exists) {
            log_warn "WezTerm .wezterm.lua missing under Windows/; using repo root fallback"
            $wezterm_lua_root
        } else { "" }
        if ($wezterm_lua | str length) > 0 {
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
            log_warn "SCOOP env not set; skipping Windows Terminal linking"
        } else {
            $targets ++= [{
                name: "Windows Terminal"
                source: $wt_src
                dest: ($scoop_root | path join "apps" | path join "windows-terminal" | path join "current" | path join "settings" | path join "settings.json")
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

    if (should_install "nushell" $skip_list $only_list) {
        let nu_src = if (($windows_root | path join "nushell") | path exists) {
            $windows_root | path join "nushell"
        } else {
            log_warn "Nushell dir missing under Windows/; using repo root fallback"
            $repo_root | path join "nushell"
        }
        $targets ++= [{
            name: "Nushell"
            source: $nu_src
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
        $targets ++= [{
            name: "Yazi"
            source: ($repo_root | path join "yazi")
            dest: ($appdata | path join "yazi")
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

    # AI tools
    let ai_root      = ($repo_root | path join "AI-Supporter")
    let claude_root  = ($ai_root   | path join "Claude Code")
    let shared_agents = ($ai_root  | path join "AGENTS.md")
    let shared_skills = ($ai_root  | path join "SKILLS")
    let claude_skills = ($claude_root | path join "skills")
    let claude_agents = ($claude_root | path join "agents")
    let claude_rules  = ($claude_root | path join "rules")
    let active_claude_skills = if ($claude_skills | path exists) { $claude_skills } else { $shared_skills }

    let claude_files = [
        {src: ($claude_root | path join "CLAUDE.md"),      dest: ($home | path join ".claude" | path join "CLAUDE.md"),      is_file: true,  name: "Claude Code CLAUDE.md"}
        {src: ($claude_root | path join "settings.json"),  dest: ($home | path join ".claude" | path join "settings.json"),  is_file: true,  name: "Claude Code settings"}
        {src: ($claude_root | path join "hooks"),          dest: ($home | path join ".claude" | path join "hooks"),          is_file: false, name: "Claude Code hooks"}
        {src: $active_claude_skills,                       dest: ($home | path join ".claude" | path join "skills"),         is_file: false, name: "Claude Code skills"}
        {src: $claude_agents,                              dest: ($home | path join ".claude" | path join "agents"),         is_file: false, name: "Claude Code agents"}
        {src: $claude_rules,                               dest: ($home | path join ".claude" | path join "rules"),          is_file: false, name: "Claude Code rules"}
    ]
    for f in $claude_files {
        if ($f.src | path exists) {
            $targets ++= [{name: $f.name, source: $f.src, dest: $f.dest, is_file: $f.is_file}]
        }
    }

    let codex_config = ($ai_root | path join "Codex" | path join "config.toml")
    let codex_files = [
        {src: $shared_agents,  dest: ($home | path join ".codex" | path join "AGENTS.md"),   is_file: true,  name: "Codex AGENTS.md"}
        {src: $codex_config,   dest: ($home | path join ".codex" | path join "config.toml"), is_file: true,  name: "Codex config.toml"}
        {src: $shared_skills,  dest: ($home | path join ".codex" | path join "skills"),      is_file: false, name: "Codex skills"}
    ]
    for f in $codex_files {
        if ($f.src | path exists) {
            $targets ++= [{name: $f.name, source: $f.src, dest: $f.dest, is_file: $f.is_file}]
        }
    }

    let opencode_files = [
        {src: $shared_agents, dest: ($home | path join ".config" | path join "opencode" | path join "AGENTS.md"), is_file: true,  name: "opencode AGENTS.md"}
        {src: $shared_skills, dest: ($home | path join ".config" | path join "opencode" | path join "skills"),    is_file: false, name: "opencode skills"}
    ]
    for f in $opencode_files {
        if ($f.src | path exists) {
            $targets ++= [{name: $f.name, source: $f.src, dest: $f.dest, is_file: $f.is_file}]
        }
    }

    let gemini_md = ($ai_root | path join "Gemini CLI" | path join "GEMINI.md")
    if ($gemini_md | path exists) {
        $targets ++= [{
            name: "Gemini CLI GEMINI.md"
            source: $gemini_md
            dest: ($home | path join ".gemini" | path join "GEMINI.md")
            is_file: true
        }]
    }

    # === Step 2: Backup ===
    if not $no_backup {
        print ""
        log_step "=== Step 2: Backing Up Existing Configs ==="
        print ""

        if not $dry_run { mkdir $backup_root }

        for t in $targets {
            backup $t.dest $t.name $no_backup $dry_run $backup_root $repo_root
        }
    }

    if $backup_only {
        print ""
        if not $dry_run and ($backup_root | path exists) {
            log_info $"Backup complete: ($backup_root)"
        }
        return
    }

    # === Step 3: Link Configs ===
    print ""
    log_step "=== Step 3: Creating Links ==="
    print ""

    for t in $targets {
        link_config $t.source $t.dest $t.is_file $t.name $dry_run
    }

    # === Done ===
    print ""
    log_step "=== Installation Complete ==="
    print ""

    if $dry_run {
        log_info "Dry run completed. No changes were made."
        return
    }

    if (should_install "neovim" $skip_list $only_list) and (check_cmd "nvim") {
        print "  Open Neovim to install plugins: nvim"
    }
    if (should_install "nushell" $skip_list $only_list) and (check_cmd "nu") {
        print "  Set Nushell as default: scoop install nu"
    }

    print ""
    if ($backup_root | path exists) {
        log_info $"Backups saved to: ($backup_root)"
    }
    print ""
    print "Restart your terminal to apply changes."
}
