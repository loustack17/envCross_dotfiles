#!/usr/bin/env bash

input=$(cat)

CYAN='\033[36m'
GREEN='\033[32m'
YELLOW='\033[33m'
RED='\033[31m'
DIM='\033[2m'
RESET='\033[0m'

dir=$(printf '%s' "$input" | jq -r '.workspace.current_dir // .cwd // ""')
if [ -n "$dir" ] && [ -n "$HOME" ] && [[ "$dir" == "$HOME"/* ]]; then
  dir_relative="${dir#"$HOME"/}"
else
  dir_relative="$dir"
fi

if [ -n "$dir_relative" ]; then
  dir_relative=${dir_relative%/}
  folder_name=${dir_relative##*/}
  parent_path=${dir_relative%/*}
  if [ -n "$parent_path" ] && [ "$parent_path" != "$dir_relative" ] && [ "$parent_path" != "." ]; then
    parent_name=${parent_path##*/}
    dir_display="${parent_name}/${folder_name}"
  else
    dir_display="$folder_name"
  fi
else
  dir_display="$dir"
fi

model=$(printf '%s' "$input" | jq -r '.model.display_name // "Unknown"')
model_id=$(printf '%s' "$input" | jq -r '.model.id // ""')

supports_effort=false
case "$model_id" in
  claude-opus-4-6*|claude-sonnet-4-6*)
    supports_effort=true
    ;;
esac

format_effort() {
  case "$1" in
    low) printf 'Low' ;;
    medium) printf 'Medium' ;;
    high) printf 'High' ;;
    max) printf 'Max' ;;
    fixed) printf 'Fixed' ;;
    *) printf '%s' "$1" ;;
  esac
}

effort=""
if [ "$supports_effort" = true ]; then
  if [ "${CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING:-0}" = "1" ]; then
    effort="Fixed"
  else
    effort_raw=""
    if [ -n "${CLAUDE_CODE_EFFORT_LEVEL:-}" ] && [ "${CLAUDE_CODE_EFFORT_LEVEL}" != "auto" ]; then
      effort_raw="${CLAUDE_CODE_EFFORT_LEVEL}"
    else
      settings_effort=$(jq -r '.effortLevel // empty' "$HOME/.claude/settings.json" 2>/dev/null)
      if [ -n "$settings_effort" ] && [ "$settings_effort" != "auto" ]; then
        effort_raw="$settings_effort"
      else
        effort_raw="medium"
      fi
    fi
    effort=$(format_effort "$effort_raw")
  fi
fi

model_info="$model"
if [ -n "$effort" ]; then
  model_info="$model | $effort"
fi

branch_info=""
if [ -n "$dir" ] && git -C "$dir" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  branch=$(git -C "$dir" branch --show-current 2>/dev/null)
  if [ -z "$branch" ]; then
    branch=$(git -C "$dir" rev-parse --short HEAD 2>/dev/null)
  fi

  staged=$(git -C "$dir" diff --cached --numstat 2>/dev/null | wc -l | tr -d ' ')
  modified=$(git -C "$dir" diff --numstat 2>/dev/null | wc -l | tr -d ' ')
  untracked=$(git -C "$dir" ls-files --others --exclude-standard 2>/dev/null | wc -l | tr -d ' ')

  git_status=""
  if [ "${staged:-0}" -gt 0 ]; then
    git_status="${git_status}${GREEN}+${staged}${RESET}"
  fi
  if [ "${modified:-0}" -gt 0 ]; then
    git_status="${git_status}${YELLOW}~${modified}${RESET}"
  fi
  if [ "${untracked:-0}" -gt 0 ]; then
    git_status="${git_status}${RED}?${untracked}${RESET}"
  fi

  branch_info=" | ${branch}"
  if [ -n "$git_status" ]; then
    branch_info="${branch_info} ${git_status}"
  fi
fi

five_hour_used=$(printf '%s' "$input" | jq -r '.rate_limits.five_hour.used_percentage // empty')
five_hour_reset=$(printf '%s' "$input" | jq -r '.rate_limits.five_hour.resets_at // empty')
context_remaining=$(printf '%s' "$input" | jq -r '.context_window.remaining_percentage // empty')

rate_line="${DIM}5h usage unavailable${RESET}"
if [ -n "$five_hour_used" ]; then
  remaining=$(awk -v used="$five_hour_used" 'BEGIN { printf "%.0f", 100 - used }')
  if [ "$remaining" -lt 0 ]; then
    remaining=0
  fi

  if [ "$five_hour_used" -ge 90 ] 2>/dev/null; then
    bar_color="$RED"
  elif [ "$five_hour_used" -ge 70 ] 2>/dev/null; then
    bar_color="$YELLOW"
  else
    bar_color="$GREEN"
  fi

  bar_width=10
  if [ "$remaining" -gt 0 ]; then
    filled=$(( (remaining * bar_width + 99) / 100 ))
  else
    filled=0
  fi
  if [ "$filled" -gt "$bar_width" ]; then
    filled=$bar_width
  fi
  empty=$(( bar_width - filled ))

  bar=""
  if [ "$filled" -gt 0 ]; then
    printf -v fill_part "%${filled}s"
    bar="${fill_part// /█}"
  fi
  if [ "$empty" -gt 0 ]; then
    printf -v empty_part "%${empty}s"
    bar="${bar}${empty_part// /░}"
  fi

  reset_suffix=""
  if [ -n "$five_hour_reset" ]; then
    reset_text=$(date -d "@$five_hour_reset" '+%H:%M' 2>/dev/null)
    if [ -n "$reset_text" ]; then
      reset_suffix=" ${DIM}| reset ${reset_text}${RESET}"
    fi
  fi

  rate_line="${bar_color}${bar}${RESET} ${remaining}% left${reset_suffix}"
fi

context_info=""
if [ -n "$context_remaining" ]; then
  context_remaining_fmt=$(printf '%.0f' "$context_remaining")
  context_info=" | ctx ${context_remaining_fmt}% left"
fi

printf '%b\n' "${CYAN}[${model_info}]${RESET} ${DIM}${dir_display}${RESET}${branch_info}${context_info}"
printf '%b\n' "${DIM}5h${RESET} ${rate_line}"
