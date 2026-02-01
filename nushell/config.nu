# config.nu
#
# Installed by:
# version = "0.109.1"
#
# This file is used to override default Nushell settings, define
# (or import) custom commands, or run any other startup tasks.
# See https://www.nushell.sh/book/configuration.html
#
# Nushell sets "sensible defaults" for most configuration settings,
# so your `config.nu` only needs to override these defaults if desired.
#
# You can open this file in your default editor using:
#     config nu
#
# You can also pretty-print and page through the documentation for configuration
# options using:
#     config nu --doc | nu-highlight | less -R

$env.config.show_banner = false

mkdir ($nu.data-dir | path join "vendor/autoload")
starship init nu | save -f ($nu.data-dir | path join "vendor/autoload/starship.nu")

# WezTerm + Nushell scrolling bug workaround：turn off OSC 133
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

source ./claude-switch.nu
source ./catppuccin_mocha.nu
source ./aliases.nu
source ./zoxide.nu
