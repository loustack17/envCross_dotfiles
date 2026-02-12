---
name: no-comments
description: "Use whenever writing or editing code or scripts in Go, Python, .NET (C#), Terraform, Bash, Fish, YAML, TOML, TypeScript, JavaScript, Markdown, SQL Server, PostgreSQL, or MongoDB. Apply this as the default policy for all code output: avoid comments and docstrings unless strictly necessary; when required, follow each language's mainstream documentation/comment style."
---

# Minimal Comments Policy

## Core Rules

- Do not add comments or docstrings by default.
- Treat this policy as the default for any code or script output in the supported languages.
- Add comments or docstrings only when they are strictly necessary to prevent misunderstanding, document a required external contract, or satisfy a project/tooling requirement.
- Prefer clearer naming and small refactors over comments.
- When a comment or docstring is required, follow the language's mainstream style and keep it concise.

## Allowed Reasons for Comments or Docstrings

- Public API or exported symbols require documentation per language or existing project conventions.
- Non-obvious behavior, side effects, or constraints that cannot be made clear through naming or structure.
- Safety, security, or compliance warnings that must be visible to maintainers.
- Tooling requirements (e.g., doc generation, lints) that would fail without documentation.

## Language-Specific Style

Go
- Use doc comments only for exported identifiers.
- Start the comment with the identifier name.
- Prefer single-line // comments.

Python
- Use Google-style docstrings only for public modules/classes/functions or when required by tooling.
- Keep docstrings minimal and factual.
- Use # comments only when unavoidable.

.NET (C#)
- Use XML doc comments (///) for public APIs if required by project conventions.
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
