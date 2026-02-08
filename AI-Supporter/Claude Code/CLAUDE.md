# Coding Style Preferences

Applies to all code or script writing. Priority order (aligned with mainstream North American engineering practices):

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

Additional consensus:
- Prefer clear naming and small refactors over comments.
- Add comments or docstrings only when strictly necessary and follow language conventions.
- Abstractions and layering must reduce coupling and improve maintainability, not just follow patterns.

Language and tooling preferences:
- Python: prefer Ruff for formatting/linting and Ty for type checking; follow project config; add type hints when they improve clarity.
- Go: follow gofmt/goimports and idiomatic Go; keep APIs small and explicit.
- Terraform: prioritize safety and correctness; format and validate before planning; always plan before apply; prefer saved plan files; avoid auto-approve; review destructive changes explicitly; verify results after apply.

Cloud and DevOps assumptions:
- Default to AWS unless specified; keep cloud-specific code localized to ease a future GCP move.
- Prefer explicit, auditable steps for changes; favor safe defaults and least privilege.
