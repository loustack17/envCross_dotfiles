#!/usr/bin/env bash
set -euo pipefail

input="$(cat)"
read -r command is_hermes < <(printf '%s' "$input" | jq -r '[
  (.tool_input.command // ""),
  (if has("hook_event_name") then "true" else "false" end)
] | @tsv')
trimmed="${command#"${command%%[![:space:]]*}"}"

ls_pattern='(^|[[:space:];|&()])(/bin/ls|ls)([[:space:]]|$)'
grep_pattern='(^|[[:space:];|&()])grep([[:space:]]|$)'
cat_pattern='(^|[[:space:];|&()])(/bin/cat|cat)([[:space:]]|$)'
pip_pattern='(^|[[:space:];|&()])(pip|pip3)([[:space:]]|$)'
python_pip_pattern='(^|[[:space:];|&()])(python|python3)[[:space:]]+-m[[:space:]]+pip([[:space:]]|$)'
git_commit_pattern='^git[[:space:]]+commit([[:space:]]|$)'

deny() {
  if [[ "$is_hermes" == "true" ]]; then
    jq -n --arg r "$1" '{"decision":"block","reason":$r}'
  else
    jq -n --arg r "$1" '{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"deny",permissionDecisionReason:$r}}'
  fi
  exit 0
}

[[ "$trimmed" =~ ^npm([[:space:]]|$) ]]                                      && deny "Use pnpm or bun instead of npm."
[[ "$trimmed" =~ ^npx([[:space:]]|$) ]]                                      && deny "Use pnpm dlx or bunx instead of npx."
[[ "$trimmed" =~ $ls_pattern ]]                                               && deny "Use eza instead of ls."
[[ "$trimmed" =~ $grep_pattern ]]                                             && deny "Use rg instead of grep."
[[ "$trimmed" =~ $cat_pattern ]]                                              && deny "Use bat instead of cat for human-readable inspection."
[[ "$trimmed" =~ $pip_pattern || "$trimmed" =~ $python_pip_pattern ]]         && deny "Use uv instead of pip/python -m pip."
[[ "$trimmed" =~ $git_commit_pattern ]]                                       && deny "Run /simplify first, then commit."

exit 0
