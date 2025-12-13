# Usage:
#   nu install.nu
#   nu install.nu --dry-run
#   nu install.nu --no-backup
#   nu install.nu --symlink         # Use symlinks instead of copies (requires admin on Windows)

def main [
    --dry-run (-n)
    --no-backup
    --symlink (-s)              # Create symlinks instead of copying
] {
    let repo_root = (pwd)

    let now        = (date now | format date "%Y%m%d-%H%M%S")
    let backup_root = ($repo_root | path join $"backup/($now)")

    let is_windows = ($nu.os-info.name == "windows")
    let home       = (if $is_windows { $env.USERPROFILE } else { $env.HOME })

    let config_home = (
        if (not ($env.XDG_CONFIG_HOME? | is-empty)) and (not $is_windows) {
            $env.XDG_CONFIG_HOME
        } else if $is_windows {
            $env.APPDATA
        } else {
            $"($home)/.config"
        }
    )

    let appdata      = (if $is_windows { $env.APPDATA } else { $config_home })
    let localappdata = (if $is_windows { $env.LOCALAPPDATA } else { $config_home })

    def info [msg: string] { print $"[INFO ] ($msg)" }
    def warn [msg: string] { print $"[WARN ] ($msg)" }

    def backup_if_exists [path: string, name: string] {
        if $no_backup {
            return
        }
        if not ($path | path exists) {
            return
        }

        let safe_name   = ($name | str replace -a '[/\\:*?"<>| ]' '_')
        let backup_dest = ($backup_root | path join $safe_name)

        if $dry_run {
            info $"DryRun: backup ($path) -> ($backup_dest)"
        } else {
            info $"Backup ($name) -> ($backup_dest)"
            mkdir ($backup_dest | path dirname) | ignore
            cp -r $path $backup_dest
        }
    }

    def copy_safe [source: string, dest: string, is_file: bool, name: string] {
        if not ($source | path exists) {
            warn $"Source not found, skip: ($name) [($source)]"
            return
        }

        if $dry_run {
            if $symlink {
                info $"DryRun: symlink ($source) -> ($dest)"
            } else {
                info $"DryRun: copy ($source) -> ($dest)"
            }
            return
        }

        if $symlink {
            # Create symlink
            if ($dest | path exists) {
                info $"Remove old: ($dest)"
                rm -r $dest
            }
            mkdir ($dest | path dirname) | ignore
            
            if $is_windows {
                # Windows symlink command
                if $is_file {
                    ^cmd /c mklink $dest $source | complete | ignore
                } else {
                    ^cmd /c mklink /D $dest $source | complete | ignore
                }
            } else {
                # Unix symlink
                ln -s $source $dest
            }
            
            info $"Linked: ($name)"
        } else {
            # Copy files (original behavior)
            if $is_file {
                mkdir ($dest | path dirname) | ignore
                cp $source $dest -f
            } else {
                if ($dest | path exists) {
                    info $"Remove old: ($dest)"
                    rm -r $dest
                }
                mkdir ($dest | path dirname) | ignore
                cp -r $source $dest
            }

            info $"Installed: ($name)"
        }
    }

    mut targets = [
        {
            name:   "Nushell"
            source: ($repo_root | path join "nushell")
            dest:   (if $is_windows {
                        $appdata | path join "nushell"
                    } else {
                        $config_home | path join "nushell"
                    })
            is_file: false
        }
        {
            name:   "Neovim"
            source: ($repo_root | path join "nvim")
            dest:   (if $is_windows {
                        $localappdata | path join "nvim"
                    } else {
                        $config_home | path join "nvim"
                    })
            is_file: false
        }
        {
            name:   "Yazi"
            source: ($repo_root | path join "yazi")
            dest:   (if $is_windows {
                        $appdata | path join "yazi"
                    } else {
                        $config_home | path join "yazi"
                    })
            is_file: false
        }
        {
            name:   "WezTerm directory"
            source: ($repo_root | path join "wezterm")
            dest:   (if $is_windows {
                        ($home | path join ".config" | path join "wezterm")
                    } else {
                        $config_home | path join "wezterm"
                    })
            is_file: false
        }
    ]

      let wez_main_src = ($repo_root | path join ".wezterm.lua")
      if ($wez_main_src | path exists) {
          $targets ++= [
              {
                  name:   ".wezterm.lua"
                  source: $wez_main_src
                  dest:   ($home | path join ".wezterm.lua")
                  is_file: true
              }
          ]
      }

    if (not $dry_run) and (not $no_backup) {
        mkdir $backup_root | ignore
    }

    for t in $targets {
        backup_if_exists $t.dest $t.name
    }

    for t in $targets {
        copy_safe $t.source $t.dest $t.is_file $t.name
    }

    info "Done."
}

