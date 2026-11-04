#!/usr/bin/env bash
# Claude Code status line: model effort | project path | git branch | 5h usage | context
input=$(cat)
E=$'\033'
R="$E[0m"

# Scoop's jq on Windows emits CRLF; strip CR so values compare and print cleanly.
field() { printf '%s' "$input" | jq -r "$1 // empty" 2>/dev/null | tr -d '\r'; }

percent() {
  local p c
  p=$(printf '%.0f' "$1")
  if [ "$p" -ge 80 ]; then c=31; elif [ "$p" -ge 50 ]; then c=33; else c=32; fi
  printf '%s[%sm%s%%%s' "$E" "$c" "$p" "$R"
}

segments=()

model=$(field '.model.display_name')
effort=$(field '.effort.level')
if [ -z "$effort" ]; then
  effort=$(jq -r '.effortLevel // empty' "$HOME/.claude/settings.json" 2>/dev/null | tr -d '\r')
fi
[ -n "$model" ] && segments+=("$E[2m$model${effort:+ $effort}$R")

dir=$(field '.workspace.project_dir')
[ -z "$dir" ] && dir=$(field '.cwd')
if [ -n "$dir" ]; then
  command -v cygpath >/dev/null && dir=$(cygpath -u "$dir")
  segments+=("$E[1;36m${dir/#$HOME/\~}$R")
  branch=$(git -C "$dir" --no-optional-locks symbolic-ref --short HEAD 2>/dev/null ||
    git -C "$dir" --no-optional-locks rev-parse --short HEAD 2>/dev/null)
  [ -n "$branch" ] && segments+=("$E[1;35m$branch$R")
fi

five=$(field '.rate_limits.five_hour.used_percentage')
if [ -n "$five" ]; then
  seg="5h $(percent "$five")"
  reset=$(field '.rate_limits.five_hour.resets_at')
  if [ -n "$reset" ]; then
    reset_time=$(date -d "@$reset" +%H:%M 2>/dev/null)
    [ -n "$reset_time" ] && seg="$seg (resets $reset_time)"
  fi
  segments+=("$seg")
fi

ctx=$(field '.context_window.used_percentage')
[ -n "$ctx" ] && segments+=("ctx $(percent "$ctx")")

out=""
for s in "${segments[@]}"; do out="${out:+$out | }$s"; done
printf '%s' "$out"
