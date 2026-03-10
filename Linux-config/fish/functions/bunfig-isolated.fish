set -g __bunfig_isolated_template_file (path resolve (path dirname (path dirname (status filename)))/templates/bun/bunfig.toml)

function bunfig-isolated --description "Create an isolated bunfig.toml in the current directory"
    argparse -n bunfig-isolated 'f/force' 'p/print' -- $argv
    or return

    if test (count $argv) -gt 0
        echo "bunfig-isolated: unexpected arguments" >&2
        return 2
    end

    set -l template_file "$__bunfig_isolated_template_file"

    if not test -f "$template_file"
        echo "bunfig-isolated: template not found: $template_file" >&2
        return 1
    end

    if set -q _flag_print
        command cat -- "$template_file"
        return
    end

    set -l dest_file "$PWD/bunfig.toml"

    if test -e "$dest_file"
        if not set -q _flag_force
            echo "bunfig-isolated: bunfig.toml already exists: $dest_file" >&2
            return 1
        end
    end

    command cp -- "$template_file" "$dest_file"
    echo "$dest_file"
end
