#!/usr/bin/env bash
set -euo pipefail

input="$(cat)"
command="$(printf '%s' "$input" | jq -r '.tool_input.command // empty')"
trimmed="${command#"${command%%[![:space:]]*}"}"
ls_pattern='(^|[[:space:];|&()])(/bin/ls|ls)([[:space:]]|$)'
grep_pattern='(^|[[:space:];|&()])grep([[:space:]]|$)'
git_commit_pattern='^git[[:space:]]+commit([[:space:]]|$)'

deny() {
  jq -n --arg reason "$1" '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: $reason
    }
  }'
  exit 0
}

if [[ "$trimmed" =~ ^npm([[:space:]]|$) ]]; then
  deny "Use pnpm or bun instead of npm."
fi

if [[ "$trimmed" =~ ^npx([[:space:]]|$) ]]; then
  deny "Use pnpm dlx or bunx instead of npx."
fi

if [[ "$trimmed" =~ $ls_pattern ]]; then
  deny "Use eza instead of ls."
fi

if [[ "$trimmed" =~ $grep_pattern ]]; then
  deny "Use rg instead of grep."
fi

if [[ "$trimmed" =~ $cat_pattern ]]; then
  deny "Use bat instead of cat for human-readable inspection. Use OpenCode read tool for exact file reads."
fi

if [[ "$trimmed" =~ $pip_pattern || "$trimmed" =~ $python_pip_pattern ]]; then
  deny "Use uv instead of pip/python -m pip."
fi

if [[ "$trimmed" =~ $git_commit_pattern ]]; then
  deny "Run /simplify first, then commit."
fi

exit 0
