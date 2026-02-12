        def base_time($x):
            if $x == null then null
            else $x | capture("(?<base>.*?)(?:Z|[+-][0-9]{2}:[0-9]{2})$").base
            end;

        def offset_seconds($x):
            if $x == null then 0
            elif ($x | test("Z$")) then 0
            elif ($x | test("[+-][0-9]{2}:[0-9]{2}$")) then
                $x
                | capture("(?<sign>[+-])(?<hh>[0-9]{2}):(?<mm>[0-9]{2})$") as $c
                | (($c.hh | tonumber) * 3600 + ($c.mm | tonumber) * 60) as $secs
                | if $c.sign == "-" then -1 * $secs else $secs end
            else 0
            end;

        def t($x):
            if $x == null then $now
            else
                (base_time($x) | strptime("%Y-%m-%dT%H:%M:%S") | mktime)
                - offset_seconds($x)
            end;

        def dur($e):
            (t($e.end_time) - t($e.start_time)) | if . < 0 then 0 else . end;

        def dur_minutes($e):
            ((dur($e) / 60) * 100 | floor / 100);

        def row($e):
            [
                ($e.project // ""),
                ($e.description // ""),
                ($e.start_time // ""),
                ($e.end_time // ""),
                dur_minutes($e)
            ] | @csv;

        . as $data
        | ["project","description","start_time","end_time","duration_minutes"] | @csv,
        ( $data[] | row(.) )
