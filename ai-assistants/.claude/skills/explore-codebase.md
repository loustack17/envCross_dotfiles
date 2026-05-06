---
name: Explore Codebase
description: Understand unfamiliar code quickly with code-review-graph and minimal tool churn
---

- Treat the user request as the task contract. Start broad, narrow fast, and avoid exploratory churn.
- Use code-review-graph first when it can answer the question faster than manual reading.

## Workflow

1. Start with `get_minimal_context(task="<task>")`.
2. If needed, use `get_architecture_overview` or `list_communities` to locate the right module.
3. Use `semantic_search_nodes` or `query_graph` to find the exact files, functions, callers, callees, or imports.
4. Use `get_flow` only when execution order matters.
5. Read source only after the graph narrows the search space.

## Token Efficiency Rules
- Always start with `get_minimal_context(task="<task>")`.
- Use `detail_level="minimal"` by default. Escalate only when minimal is insufficient.
- Prefer ≤5 graph calls before switching to manual file reading.
