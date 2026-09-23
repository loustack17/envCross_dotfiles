---
description: Simplify recently modified code for clarity and maintainability while preserving behavior.
---

Use the `code-simplifier` subagent on the current git diff or the target supplied in `$ARGUMENTS`.

If there is no diff and no target, ask for target files.

Wait for the simplifier result. Verify each proposed change against the actual code and project instructions.
Apply only local, behavior-preserving simplifications in the primary session.
Do not apply suggestions that change behavior, add features, broaden scope, or conflict with project conventions.

Run the smallest relevant validation after edits.
Report:
- what was simplified
- what was intentionally left unchanged
- validation run
