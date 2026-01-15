source /usr/share/cachyos-fish-config/cachyos-config.fish
export EDITOR=nvim

starship init fish | source



function y
	set tmp (mktemp -t "yazi-cwd.XXXXXX")
	command yazi $argv --cwd-file="$tmp"
	if read -z cwd < "$tmp"; and [ -n "$cwd" ]; and [ "$cwd" != "$PWD" ]
		builtin cd -- "$cwd"
	end
	rm -f -- "$tmp"
end


# Zellij
if set -q ZELLIJ
else
  zellij
end

if status is-interactive
    ...
    eval (zellij setup --generate-auto-start fish | string collect)
end

# overwrite greeting
# potentially disabling fastfetch
#function fish_greeting
#    # smth smth
#end

# uv
fish_add_path "/home/lou/.local/bin"
/home/linuxbrew/.linuxbrew/bin/brew shellenv | source

# pnpm
set -gx PNPM_HOME "/home/lou/.local/share/pnpm"
if not string match -q -- $PNPM_HOME $PATH
  set -gx PATH "$PNPM_HOME" $PATH
end
# pnpm end
