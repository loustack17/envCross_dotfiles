---
name: Refactor Safely
description: Use graph analysis to refactor with minimal blast radius and avoid blind edits
---

- Treat the requested refactor as the target state. Clarify only if the scope is unsafe or contradictory.
- Use graph data to reduce risk before editing.

## Workflow

1. Start with `get_minimal_context(task="<refactor task>")`.
2. Use `get_impact_radius` for risky edits and `find_large_functions` for decomposition candidates.
3. Use `refactor_tool(mode="rename")` for renames and preview before apply.
4. Use `refactor_tool(mode="dead_code")` or `mode="suggest"` only when they directly help the requested change.
5. After edits, run `detect_changes` if you need to confirm blast radius or affected flows.

## Token Efficiency Rules
- Always start with `get_minimal_context(task="<task>")`.
- Use `detail_level="minimal"` by default.
- Prefer the smallest graph workflow that removes uncertainty before editing.
