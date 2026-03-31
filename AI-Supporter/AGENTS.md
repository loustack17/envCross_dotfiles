# Global Preferences

Keep code correct, readable, maintainable, and simple. Prefer clear naming and small focused refactors over comments or speculative abstraction.

Language and tooling:
- Python: follow project config; prefer Ruff and Ty; add type hints when they improve clarity.
- Go: use gofmt/goimports and idiomatic Go; keep APIs small and explicit.
- Terraform: safety first; format and validate before planning; review a saved plan before apply; avoid auto-approve; verify results after apply.

Cloud and DevOps:
- Default to AWS unless specified.
- Prefer explicit, auditable changes and least privilege.

Git and GitHub:
- Never add AI attribution lines, trailers, signatures, or identity markers to any `git` or `gh` workflow.
- Remove any auto-injected AI attribution before finalizing.

Language:
- When Chinese is needed, use only Traditional Chinese (Taiwan / 繁體中文臺灣).

Skills:
- Use `no-comments` as the default skill for code, script, config, SQL, and Markdown edits.
- Only add comments or docstrings when the user explicitly asks or when tooling, safety, conventions, or external contracts require them.
