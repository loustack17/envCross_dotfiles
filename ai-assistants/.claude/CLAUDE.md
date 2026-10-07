@./AGENTS.md

# Claude Code Specific

## Safety
- Never use `dangerouslyDisableSandbox` on shell tool calls.

## Agents
- Use explorer for repository exploration, librarian for official documentation, oracle for architecture and independent review, fixer for scoped implementation, and designer for UI and accessibility work.
- Follow the shared omo-slim workflow for suitable material tasks. Keep orchestration and final acceptance in the main conversation.
- Use oracle for independent review when useful. Do not assume a separate Codex session will review the work.

## Shell
- On Windows, use the native PowerShell tool for PowerShell commands.
- Launch the official CLI from the user's Fish terminal on Linux. Use Claude Code's supported native tools; do not force Fish into an unsupported interpreter setting or create shell adapters.
