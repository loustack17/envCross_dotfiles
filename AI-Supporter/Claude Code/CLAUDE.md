# Claude Code Memory

## Operating Contract

- Treat the first user turn as the task contract.
- Ask only when blocked or when a wrong assumption would be costly.
- Match response length to task complexity.
- Prefer direct execution over discussion when the task is clear.
- Do not add AI attribution, signatures, trailers, or identity markers.
- Codex will review your output once you are done.

## Token Discipline

- Optimize for correctness per token.
- Keep outputs concise and decision-oriented.
- Remove fluff, hedges, repetition, and obvious background.
- Use detailed reasoning only when the task is ambiguous, risky, multi-file, or correctness-sensitive.
- For simple tasks, answer directly and stop.

## Tool Use

- Use tools deliberately.
- Prefer code-review-graph for exploration, review, debugging, refactoring, impact analysis, and relationship tracing.
- Fall back to Grep/Glob/Read only when graph tools do not fit.
- Prefer fast low-noise shell tools:
  - `rg` over `grep`
  - `eza` over `ls`
  - `bat` over `cat` for human-readable inspection
  - `pnpm` or `bun` over `npm`
  - `pnpm dlx` or `bunx` over `npx`
  - `uv` over `pip` / `python -m pip`
- Never use `dangerouslyDisableSandbox`.

## Safety
- Never use dangerouslyDisableSandbox on shell tool calls.
- Never add AI attribution lines, trailers, signatures, or identity markers to git or GitHub workflows.
- Remove any auto-injected AI attribution before finalizing.

## Writing

- Write for signal.
- Every word must reduce ambiguity, support a decision, or enable action.
- Include commands, constraints, metrics, or decisions when useful.
- State trade-offs only when the choice is non-obvious.
- For resume, career, and technical writing: be precise, professional, human, and evidence-based.

## Engineering

- Keep code correct, readable, maintainable, and simple.
- Prefer clear naming and small focused refactors over speculative abstraction.
- Prefer low coupling and high cohesion.
- Apply DRY only when it preserves clarity.
- Use Clean Code / Clean Architecture only when they reduce change cost.
- Follow project formatting, linting, validation, and test tools when available.
- After changes, run the smallest meaningful verification.

## Infrastructure

- Prefer explicit, auditable, reversible changes.
- Prefer least privilege.
- Validate and review before apply.
- Avoid auto-approve by default.
- Surface blast radius, dependencies, rollback, and verification when relevant.
- AWS has broader market demand, but prefer GCP when cloud direction is unspecified.

## Language

- When Chinese is needed, use only Traditional Chinese, Taiwan style.

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
