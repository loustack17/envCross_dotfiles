function __tock_default_project --description "Get default tock project name"
    if type -q git; and command git rev-parse --is-inside-work-tree >/dev/null 2>&1
        set -l root (command git rev-parse --show-toplevel 2>/dev/null)
        if test -n "$root"
            echo (path basename "$root")
            return 0
        end
    end
    echo (path basename (pwd))
end

function tst --description "Start tock with description and project"
    argparse -n tst 'p/project=' 'd/description=' 't/time=' -- $argv
    or return

    set -l project ""
    set -l desc ""

    if set -q _flag_p
        set project $_flag_p
    end

    if set -q _flag_d
        set desc $_flag_d
    end

    if test -z "$project"
        if test (count $argv) -ge 2
            set project $argv[1]
            set -e argv[1]
        else
            set project (__tock_default_project)
        end
    end

    if test -z "$desc" -a (count $argv) -ge 1
        set desc (string join " " -- $argv)
    end

    if test -z "$desc"
        read -P "Description: " desc
    end

    if test -z "$project"
        read -P "Project: " project
    end

    if test -z "$project" -o -z "$desc"
        return 1
    end

    if set -q _flag_t
        command tock start "$project" "$desc" -t "$_flag_t"
        return
    end

    command tock start "$project" "$desc"
end
