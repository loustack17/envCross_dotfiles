source /usr/share/cachyos-fish-config/cachyos-config.fish

# env
export EDITOR=nvim
export VISUAL=nvim

# paths
# go
fish_add_path (go env GOPATH)/bin
# uv (astral)
fish_add_path "/home/lou/.local/bin"

# pnpm
set -gx PNPM_HOME "/home/lou/.local/share/pnpm"
if not string match -q -- $PNPM_HOME $PATH
    set -gx PATH "$PNPM_HOME" $PATH
end

# functions
function y
    set tmp (mktemp -t "yazi-cwd.XXXXXX")
    command yazi $argv --cwd-file="$tmp"
    if read -z cwd <"$tmp"; and [ -n "$cwd" ]; and [ "$cwd" != "$PWD" ]
        builtin cd -- "$cwd"
    end
    rm -f -- "$tmp"
end

# init
starship init fish | source
zoxide init fish | source
/home/linuxbrew/.linuxbrew/bin/brew shellenv | source

# google cloud sdk
if [ -f '/home/lou/Documents/Practise/google-cloud-sdk/path.fish.inc' ]; . '/home/lou/Documents/Practise/google-cloud-sdk/path.fish.inc'; end

# bun
set --export BUN_INSTALL "$HOME/.bun"
set --export PATH $BUN_INSTALL/bin $PATH
