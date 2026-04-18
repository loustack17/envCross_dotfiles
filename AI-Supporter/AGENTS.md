# Global Preferences

Keep code correct, readable, maintainable, and simple. Prefer clear naming and small focused refactors over speculative abstraction.
- Prefer low coupling and high cohesion.
- Apply DRY only when it does not reduce clarity.
- Use Clean Code and Clean Architecture only when they reduce change cost and improve maintainability; do not force them.
- Follow project config, formatting, linting, and validation tools when available.
- For infrastructure changes, validate and review before apply; avoid auto-approve by default.
- Write documents for signal. Every word must earn its place.
  - Remove fluff; no hedges or throat-clearing.
  - Include concrete metrics, commands, or decisions.
  - Show trade-offs when the choice is non-obvious.
  - Keep it concise and specific.
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
