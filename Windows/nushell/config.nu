$env.config.show_banner = false

mkdir ($nu.data-dir | path join "vendor/autoload")
starship init nu | save -f ($nu.data-dir | path join "vendor/autoload/starship.nu")

# WezTerm + Nushell scrolling bug workaround: turn off OSC 133
$env.config.shell_integration.osc133 = false

# Ctrl+h show top 5 history
$env.config.keybindings ++= [
  {
    name: show_history
    modifier: control
    keycode: char_h
    mode: emacs
    event: {
      send: executehostcommand
      cmd: "history | last 5"
    }
  }
  {
    name: fzf_files
    modifier: control
    keycode: char_f
    mode: emacs
    event: {
      send: executehostcommand
      cmd: "ls | get name | fzf"
    }
  }
]


# Yazi wrapper
def --env y [...args] {
	let tmp = (mktemp -t "yazi-cwd.XXXXXX")
	^yazi ...$args --cwd-file $tmp
	let cwd = (open $tmp)
	if $cwd != $env.PWD and ($cwd | path exists) {
		cd $cwd
	}
	rm -fp $tmp
}

source ./catppuccin_mocha.nu
source ./aliases.nu
source ./zoxide.nu

let envcross_system_root = ($env.SYSTEMROOT? | default "")
let envcross_whoami = ($envcross_system_root | path join "System32" | path join "whoami.exe")
let envcross_user_sid = (^$envcross_whoami /user /fo csv /nh | str trim | str replace --regex '^"[^"]+","([^"]+)"$' '$1')
let envcross_state_root = 'D:\ProgramData\envCross_dotfiles'
if ($envcross_system_root | is-empty) or ($envcross_user_sid | is-empty) or ($envcross_state_root | is-empty) or (($envcross_user_sid | str starts-with "S-") == false) {
    error make {msg: "Unable to resolve the protected Nushell history path"}
}
$env.config.history.path = ($envcross_state_root | path join "users" | path join $envcross_user_sid | path join "nushell" | path join "history.txt")
