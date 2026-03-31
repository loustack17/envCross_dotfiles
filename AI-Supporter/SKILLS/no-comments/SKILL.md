---
name: no-comments
description: "Default for code, script, config, SQL, and Markdown edits: avoid comments and docstrings unless required by tooling, conventions, safety, or external contracts."
---

# No Comments

- Default: do not add comments or docstrings.
- Prefer clearer naming and small refactors over comments.
- Allow comments or docstrings only when required by:
  - project conventions or public API documentation
  - tooling, linting, or doc generation
  - non-obvious safety, side effects, constraints, or external contracts
- Keep any required comment minimal and use normal language style.

Language notes:
- Go: doc comments only for exported identifiers; start with the identifier name.
- Python: minimal Google-style docstrings only when required.
- C#: XML docs only when required for public APIs.
- Terraform: prefer `description` attributes over comments.
- Fish: prefer `function --description` when a description is needed.
- Markdown: avoid HTML comments unless tooling requires them.
- SQL: avoid comments that restate the query.
- MongoDB/JSON: do not add comments inside strict JSON documents or pipelines.
