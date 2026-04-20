#!/usr/bin/env bash
set -euo pipefail

path=${1:?}
width=${2:-80}

if ! [[ $width =~ ^[0-9]+$ ]] || [ "$width" -lt 20 ]; then
  width=80
fi

if awk '
  function trim(value) {
    sub(/^[[:space:]]+/, "", value)
    sub(/[[:space:]]+$/, "", value)
    return value
  }
  function is_separator(value,    count, part) {
    value = trim(value)
    if (value == "" || index(value, "|") == 0) {
      return 0
    }
    sub(/^\|/, "", value)
    sub(/\|$/, "", value)
    count = split(value, parts, /\|/)
    if (count < 2) {
      return 0
    }
    for (part = 1; part <= count; part++) {
      if (trim(parts[part]) !~ /^:?-+:?$/) {
        return 0
      }
    }
    return 1
  }
  function is_row(value) {
    value = trim(value)
    if (value == "" || is_separator(value)) {
      return 0
    }
    return gsub(/\|/, "|", value) >= 1
  }
  {
    if (is_separator($0) && is_row(previous)) {
      found = 1
      exit 0
    }
    previous = $0
  }
  END {
    exit found ? 0 : 1
  }
' "$path"; then
  exec bat -p --color=always --language=markdown --terminal-width="$width" -- "$path"
fi

exec env CLICOLOR_FORCE=1 glow -s dark -w "$width" -- "$path"
