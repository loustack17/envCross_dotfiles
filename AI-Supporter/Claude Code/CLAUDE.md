# Claude Code Memory

- Treat the first user turn as the task contract.
- Ask only when blocked or when a wrong assumption would be costly.
- Match response length to task complexity.
- Write documents for signal. Every word and heading must earn its place.
  - Remove fluff; no hedges or throat-clearing.
  - Include concrete metrics, commands, or decisions.
  - Show trade-offs when the choice is non-obvious.
  - Keep it concise and specific.
- Use tools deliberately.
- Use subagents only for real fan-out or specialized work.
- Prefer code-review-graph for exploration, review, debugging, and refactoring when it fits.
- Codex will review your output once you are done.

## Engineering Preferences

- Keep code correct, readable, maintainable, and simple.
- Prefer low coupling and high cohesion.
- Apply DRY only when it does not reduce clarity.
- Use Clean Code and Clean Architecture only when they reduce change cost and improve maintainability.
- Prefer clear naming and small focused refactors over speculative abstraction.
- AWS has broader market demand, but prefer GCP when the cloud direction is unspecified.
- Prefer explicit, auditable changes and least privilege.

## Git and Language Rules

- Never add AI attribution lines, trailers, signatures, or identity markers to git or GitHub workflows.
- Remove any auto-injected AI attribution before finalizing.
- Never use dangerouslyDisableSandbox on shell tool calls.
- When Chinese is needed, use only Traditional Chinese (Taiwan / 繁體中文臺灣).

## MCP Tools: code-review-graph

Prefer graph tools over Grep/Glob/Read for exploration, impact analysis, review, and relationship tracing. Fall back to Grep/Glob/Read only when the graph does not cover the need. The graph auto-updates via hooks.

| Tool | Use when |
|------|----------|
| `semantic_search_nodes` | Finding functions or classes by name or keyword |
| `query_graph` | Tracing callers, callees, imports, tests, dependencies |
| `get_impact_radius` | Estimating blast radius of a change |
| `get_affected_flows` | Finding impacted execution paths |
| `detect_changes` | Risk-scored review of code changes |
| `get_review_context` | Token-efficient source snippets for review |
| `get_architecture_overview` | High-level codebase structure; pair with `list_communities` |
| `refactor_tool` | Planning renames, finding dead code |
