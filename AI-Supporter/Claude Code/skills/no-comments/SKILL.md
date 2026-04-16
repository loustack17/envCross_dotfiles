---
name: no-comments
description: Keep code, scripts, config, SQL, and Markdown free of comments by default; add them only when they carry required information.
---

# No Comments

- Use this skill when writing or editing code, scripts, config, SQL, or Markdown.
- Default: do not add comments or docstrings.
- Prefer clearer naming, smaller edits, and simpler structure over explanatory comments.
- Add comments or docstrings only when required by tooling, conventions, public APIs, safety, or external contracts.
- If a comment is required, keep it brief and make it explain something non-obvious.

## Language Notes

- Go: add doc comments only when required for exported identifiers.
- Python: add docstrings only when required by project rules or tooling.
- Terraform: prefer `description` attributes over comments.
- Fish: prefer `function --description` when a description is required.
- JSON and strict machine-readable formats: never add comments.
