function t --description "Short tock wrapper"
    if test (count $argv) -eq 0
        command tock
        return
    end

    set -l sub $argv[1]
    set -e argv[1]

    switch $sub
        case r report
            if test (count $argv) -eq 0
                command tock report --today
            else
                command tock report $argv
            end
        case cal calendar
            command tock calendar $argv
        case l ls list
            command tock list $argv
        case la last
            command tock last $argv
        case q quit stop
            command tock stop $argv
        case co con continue
            command tock continue $argv
        case cur current
            command tock current $argv
        case w watch
            command tock watch $argv
        case a add
            command tock add $argv
        case st start
            tst $argv
        case pr print
            trp $argv
        case '*'
            command tock $sub $argv
    end
end
