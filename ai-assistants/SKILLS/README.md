# Shared Skills

Source of truth for shared skills. Skill directories contain real files so Windows and Linux checkouts remain self-contained.

Installed links:
- `~/.claude/skills`
- `~/.agents/skills`
- `~/.config/opencode/skills`

Installed tools link to this directory; skills do not depend on machine-local CC Switch or plugin cache paths.

Codex discovers these skills globally through `~/.agents/skills`. Codex loads them natively; bundled system skills remain managed by Codex. TypeSafe is stored in `typesafe-ai/` with its upstream license.
