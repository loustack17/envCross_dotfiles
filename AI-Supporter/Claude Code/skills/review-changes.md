---
name: Review Changes
description: Review changes with risk-first graph analysis and concise findings
---

- Treat the requested review scope as fixed unless the diff proves otherwise.
- Optimize for findings, risks, and missing tests, not for a long summary.

## Workflow

1. Start with `get_minimal_context(task="<review task>")`.
2. Run `detect_changes`.
3. Use `get_affected_flows` or `get_impact_radius` only for risky or ambiguous areas.
4. Use `query_graph(pattern="tests_for")` for changed high-risk code with unclear coverage.
5. Report findings ordered by severity, then residual risks or test gaps.

## Token Efficiency Rules
- Always start with `get_minimal_context(task="<task>")`.
- Use `detail_level="minimal"` by default.
- Avoid extra graph calls once the review findings are already clear.
