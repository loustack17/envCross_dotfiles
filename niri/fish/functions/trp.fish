function trp --description "Pretty tock report"
    argparse -n trp 'e=' 'export=' -- $argv
    or return

    set -l export_format ""
    if set -q _flag_e
        set export_format $_flag_e
    else if set -q _flag_export
        set export_format $_flag_export
    end
    if test -n "$export_format"
        set export_format (string lower -- $export_format)
    end

    set -l filtered
    for a in $argv
        if test "$a" != "--json"
            set filtered $filtered $a
        end
    end

    if test (count $filtered) -eq 0
        set filtered --today
    end

    if not type -q jq
        echo "jq not found" >&2
        return 1
    end

    set -l now_epoch (date +%s)
    set -l now_hm (date +%H:%M)
    set -l trp_dir (path dirname (status -f))
    set -l pretty_jq_file "$trp_dir/trp.pretty.jq"
    set -l csv_jq_file "$trp_dir/trp.csv.jq"

    switch $export_format
        case ""
            command tock report --json $filtered | TZ=UTC jq -r --argjson now "$now_epoch" --arg now_hm "$now_hm" -f "$pretty_jq_file"
        case txt
            set -l output (command tock report --json $filtered | TZ=UTC jq -r --argjson now "$now_epoch" --arg now_hm "$now_hm" -f "$pretty_jq_file" | string collect)
            set -l dest_dir "$HOME/Documents/Cases/time-log"
            command mkdir -p -- $dest_dir
            set -l stamp (date +%Y%m%d-%H%M%S)
            set -l outfile "$dest_dir/tock-report-$stamp.txt"
            printf '%s\n' "$output" > "$outfile"
            echo $outfile
        case csv
            set -l output (command tock report --json $filtered | TZ=UTC jq -r --argjson now "$now_epoch" -f "$csv_jq_file" | string collect)
            set -l dest_dir "$HOME/Documents/Cases/time-log"
            command mkdir -p -- $dest_dir
            set -l stamp (date +%Y%m%d-%H%M%S)
            set -l outfile "$dest_dir/tock-report-$stamp.csv"
            printf '%s\n' "$output" > "$outfile"
            echo $outfile
        case '*'
            echo "trp: unsupported --export value: $export_format (use txt or csv)" >&2
            return 2
    end
end
