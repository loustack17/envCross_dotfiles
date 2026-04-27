---
description: Run code-simplifier on the current git diff while preserving behavior.
---

Use the `code-simplifier` skill on the current git diff (or user-provided target).

Spawn `@reuse-reviewer`, `@quality-reviewer`, and `@efficiency-reviewer` in a single parallel dispatch. If unavailable, stop with: "Cannot run: subagent spawning unavailable in this runtime."

Reviewers are read-only. Merge findings only after all three return, then apply local behavior-preserving fixes. Run minimal validation. Report using the skill's four-section format.

If no diff and no target, ask for target files.
