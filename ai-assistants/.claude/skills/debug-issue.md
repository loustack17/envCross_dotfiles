---
name: Debug Issue
description: Debug issues with graph-first narrowing before deep file inspection
---

- Treat the reported bug, symptom, or failing path as the starting contract.
- Narrow the search space quickly, then read code where the graph indicates the fault is most likely.

## Workflow

1. Start with `get_minimal_context(task="<debug task>")`.
2. Use `semantic_search_nodes` to find the likely files or functions.
3. Use `query_graph` with `callers_of` and `callees_of` to trace the local chain.
4. Use `get_flow` only when the full execution path matters.
5. Run `detect_changes` when recent edits may explain the issue.

## Token Efficiency Rules
- Always start with `get_minimal_context(task="<task>")`.
- Use `detail_level="minimal"` by default.
- Prefer targeted graph queries over broad exploratory reads.
