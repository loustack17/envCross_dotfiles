---
description: Run code-simplifier on the current git diff or provided target while preserving behavior.
---

Use the `code-simplifier` skill.

Task:
Run a behavior-preserving simplify pass on the current git diff or the user-provided target.

Requirements:
- Preserve behavior.
- Prefer current git diff as scope.
- Use `@reuse-reviewer`, `@quality-reviewer`, and `@efficiency-reviewer` when available.
- Keep reviewer passes read-only.
- Merge findings before editing.
- Apply only local safe fixes.
- Run the smallest meaningful validation.
- Report using the skill output format.

If there is no diff and no explicit target, ask for the target files.