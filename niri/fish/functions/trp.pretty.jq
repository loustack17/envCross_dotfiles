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

        def pad2($n):
            ($n | tostring) as $s | if ($s | length) < 2 then "0" + $s else $s end;

        def fmt_project($s):
            if $s < 60 then "<1m"
            else
                ($s/60 | floor) as $m
                | ($m/60 | floor) as $h
                | ($m%60) as $mm
                | if $h > 0 then "\($h)h \(pad2($mm))m" else "\($mm)m" end
            end;

        def fmt_entry($s):
            if $s < 60 then "<1m"
            else
                ($s/60 | floor) as $m
                | ($m/60 | floor) as $h
                | ($m%60) as $mm
                | if $h > 0 then "\($h)h \(pad2($mm))m" else "\(pad2($mm))m" end
            end;

        def fmt_time($x):
            if $x == null then $now_hm
            else $x | capture("T(?<time>[0-9]{2}:[0-9]{2})").time
            end;

        def label_project($p): $p;

        def label_entry($e):
            ($e.description // "") as $d
            | (fmt_time($e.start_time)) as $s
            | (fmt_time($e.end_time)) as $e
            | "    " + $d + " [" + $s + "-" + $e + "]";

        def build_state:
            reduce .[] as $e (
                {order: [], groups: {}};
                ($e.project // "(no project)") as $p
                | if .groups[$p] then .
                  else .order += [$p] | .groups[$p] = []
                  end
                | .groups[$p] += [$e]
            );

        def labels($st):
            [ $st.order[] as $p
              | label_project($p),
                ($st.groups[$p][] | label_entry(.))
            ];

        def line_width($st):
            (labels($st) | map(length) | max) // 20;

        def dotline($label; $value; $width):
            $label + ("." * (((($width - ($label | length)) + 1) | if . < 1 then 1 else . end))) + " " + $value;

        build_state as $st
        | line_width($st) as $width
        | if ($st.order | length) == 0 then
              [ dotline("Total"; "0m"; $width) ]
          else
              (
                [ $st.order[] as $p
                  | ($st.groups[$p] | map(dur(.)) | add // 0) as $ps
                  | dotline(label_project($p); fmt_project($ps); $width),
                    ($st.groups[$p][] as $e | dotline(label_entry($e); fmt_entry(dur($e)); $width)),
                    ""
                ] | .[:-1]
              ) as $lines
              | ($st.order | map($st.groups[.] | map(dur(.)) | add // 0) | add // 0) as $total
              | ($lines + ["", dotline("Total"; fmt_project($total); $width)])
          end
        | .[]
