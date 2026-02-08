---
name: coding-standards
description: Use when writing or editing code or scripts in Go, Python, .NET (C#), Terraform, Bash, Fish, YAML, TOML, TypeScript, JavaScript, Markdown, SQL Server, PostgreSQL, or MongoDB. Apply global coding style priorities and a minimal-comment policy; when comments or docstrings are required, follow mainstream language documentation styles.
---

# Coding Standards

## Priority Order

1. Correctness and safety first.
2. Readability first: make intent obvious to future maintainers.
3. Maintainability: low change cost, clear boundaries.
4. Simple by default: avoid unnecessary complexity and over-engineering.
5. Low coupling, high cohesion: minimize dependencies and keep modules focused.
6. Clean Code principles, but non-dogmatic and context-aware.
7. Clean Architecture when the system warrants it; avoid forcing layers in small scripts.
8. Reusability when there are 2-3 real use cases; avoid speculative abstraction.
9. DRY without sacrificing clarity; refactor only when repetition is costly.
10. Flexibility for likely changes; do not design for hypothetical needs.

## Comments and Docstrings

- Do not add comments or docstrings by default.
- Add comments or docstrings only when strictly necessary to prevent misunderstanding, document a required external contract, or satisfy a project/tooling requirement.
- Prefer clear naming and small refactors over comments.
- When required, follow the language's mainstream documentation/comment style and keep it concise.

## Language-Specific Documentation Conventions

Go
- Use doc comments only for exported identifiers.
- Start the comment with the identifier name.
- Prefer single-line // comments.

Python
- Use Google-style docstrings only for public modules/classes/functions or when required by tooling.
- Keep docstrings minimal and factual.
- Use # comments only when unavoidable.

.NET (C#)
- Use XML doc comments (///) for public APIs when required by project conventions.
- Use <summary>, <param>, <returns>, <exception> as needed.
- Use // comments only when unavoidable.

Terraform
- Prefer HCL attributes like description on variables/outputs instead of comments.
- If necessary, use # (preferred) or // comments.

Bash
- Use # comments only when unavoidable.
- Include a shebang when writing scripts.

Fish
- Use # comments only when unavoidable.
- Prefer function --description "..." when a description is required.

YAML
- Use # comments only when required by tooling or to prevent misunderstanding.

TOML
- Use # comments only when required by tooling or to prevent misunderstanding.

TypeScript
- Use // or /* */ only when unavoidable.
- Use TSDoc/JSDoc for public APIs if required by project conventions.

JavaScript
- Use // or /* */ only when unavoidable.
- Use JSDoc for public APIs if required by project conventions.

Markdown
- Avoid HTML comments unless required by tooling.

SQL Server
- Use -- or /* */ only when unavoidable.
- Avoid comments that restate the query.

PostgreSQL
- Use -- or /* */ only when unavoidable.
- Avoid comments that restate the query.

MongoDB
- In mongosh or JavaScript contexts, use // or /* */ only when unavoidable.
- Do not add comments inside strict JSON documents or JSON pipelines.

## Tooling Preferences

- Python: prefer Ruff for formatting/linting and Ty for type checking; follow project config; add type hints when they improve clarity.
- Go: follow gofmt/goimports and idiomatic Go; keep APIs small and explicit.
- Terraform: prioritize safety and correctness; format and validate before planning; always plan before apply; prefer saved plan files; avoid auto-approve; review destructive changes explicitly; verify results after apply.

## Cloud and DevOps Assumptions

- Default to AWS unless specified; keep cloud-specific code localized to ease a future GCP move.
- Prefer explicit, auditable steps for changes; favor safe defaults and least privilege.
