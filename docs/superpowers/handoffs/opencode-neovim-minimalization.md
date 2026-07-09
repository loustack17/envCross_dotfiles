# OpenCode Handoff

Recommended models:

- Implementer: `opencode-go/kimi-k2.7-code`
- Reviewer: `opencode-go/qwen3.7-max`

Prompt:

```text
Read AGENTS.md.

Execute:
docs/superpowers/plans/2026-07-09-neovim-minimalization.md

Design:
docs/superpowers/specs/2026-07-09-neovim-minimalization-design.md

Preserve all existing uncommitted changes.
Inspect git status and git diff before editing.
Execute each task independently.
After each task, review spec compliance and code quality.
Run every verification command.
Do not commit unrelated files.
```

If Superpowers workflows are unavailable, execute the plan checkboxes sequentially and retain the same review gates.
