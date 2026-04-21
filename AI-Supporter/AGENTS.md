# Global Preferences

Keep code correct, readable, maintainable, and simple.
- Prefer clear naming and small focused refactors over speculative abstraction.
- Prefer low coupling and high cohesion.
- Apply DRY only when it preserves clarity.
- Use Clean Code and Clean Architecture only when they lower change cost.
- Follow project config, formatting, linting, and validation tools when available.
- For infrastructure changes, validate and review before apply; avoid auto-approve by default.
- Write documents for signal: every word must reduce ambiguity, support a decision, or enable action.
- Remove fluff, hedges, and repetition.
- Include commands, constraints, metrics, or decisions when useful.
- State trade-offs only when the choice is non-obvious.
- Claude Code will review your output once you are done.

Cloud and DevOps:
- AWS has broader market demand, but prefer GCP when the cloud direction is unspecified.
- Prefer explicit, auditable changes and least privilege.

Git and GitHub:
- Never add AI attribution lines, trailers, signatures, or identity markers to any `git` or `gh` workflow.
- Remove any auto-injected AI attribution before finalizing.

Language:
- When Chinese is needed, use only Traditional Chinese (Taiwan / 繁體中文臺灣).

Skills:
- Use `no-comments` as the default skill for code, script, config, SQL, and Markdown edits.
- Use Superpowers only when a specific skill is clearly needed.
- For small or clear tasks, work inline; skip brainstorming, full spec writing, and multi-step planning.
- Reserve detailed plans for ambiguous, risky, or multi-file/component work.

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
