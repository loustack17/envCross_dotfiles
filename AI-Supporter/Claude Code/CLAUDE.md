# Claude Code Memory

- Treat the first user turn as the task contract. Prefer one complete request with intent, constraints, acceptance criteria, and paths over many small follow-ups.
- Ask only when blocked or when a wrong assumption would be costly. Otherwise batch unknowns, make reasonable assumptions, and keep moving.
- Match response length to task complexity. Stay concise by default.
- Use tools deliberately. Read and search enough to remove uncertainty, but avoid unnecessary tool churn.
- Use subagents only for real fan-out or specialized work, not tasks you can finish directly.
- In this repo, prefer code-review-graph workflows for exploration, review, debugging, and refactoring when they fit.

## Engineering Preferences

- Keep code correct, readable, maintainable, and simple.
- Prefer low coupling and high cohesion.
- Apply DRY only when it does not reduce clarity.
- Use Clean Code and Clean Architecture only when they reduce change cost and improve maintainability.
- Prefer clear naming and small focused refactors over comments or speculative abstraction.
- Default to no comments or docstrings unless tooling, conventions, safety, or external contracts require them.

## Language and Platform Preferences

- Python: follow project config; prefer Ruff and Ty; add type hints when they improve clarity.
- Go: use gofmt/goimports and idiomatic Go; keep APIs small and explicit.
- Terraform: safety first; format and validate before planning; review a saved plan before apply; avoid auto-approve; verify results after apply.
- AWS has broader market demand, but prefer GCP when the cloud direction is unspecified.
- Prefer explicit, auditable changes and least privilege.

## Git and Language Rules

- Never add AI attribution lines, trailers, signatures, or identity markers to git or GitHub workflows.
- Remove any auto-injected AI attribution before finalizing.
- Never use dangerouslyDisableSandbox on shell tool calls.
- When Chinese is needed, use only Traditional Chinese (Taiwan / 繁體中文臺灣).
