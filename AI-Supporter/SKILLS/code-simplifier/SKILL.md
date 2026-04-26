---
name: code-simplifier
description: Use after implementation, before commit, after AI-generated code, or when the user asks to simplify, clean up, run /simplify, reduce complexity, or preserve behavior while improving maintainability.
---

# Code Simplifier

Post-change cleanup workflow for behavior-preserving simplification.

## Goals

- Preserve behavior unless the user explicitly requested a functional change.
- Improve clarity, reuse, quality, and meaningful efficiency within the touched scope.
- Follow repository rules, `AGENTS.md`, and nearby code patterns.
- Prefer small local improvements over broad rewrites.

## Scope

Default scope:
1. Current git diff.
2. If no git diff exists, recently touched files in this session.
3. If neither is available, ask for target files.

Do not scan the whole repository unless needed to verify reuse or impact.

## Workflow

1. Identify the changed files or target scope.
2. Inspect the diff and nearby code enough to understand local conventions.
3. Run three isolated review passes:
   - `reuse`
   - `quality`
   - `efficiency`
4. Use subagents when available:
   - `@reuse-reviewer`
   - `@quality-reviewer`
   - `@efficiency-reviewer`
5. Prefer parallel execution. If parallel execution is unavailable, run the three passes sequentially while keeping each pass isolated.
6. Use the briefs in `references/reviewer-briefs.md`.
7. Merge findings. Drop style churn, speculation, duplicates, weak advice, and broad rewrites.
8. If the user asked for review only, report findings and stop.
9. Otherwise apply only local, behavior-preserving fixes.
10. Run the smallest meaningful validation for the touched scope.
11. Format the final report with `references/output-format.md`.

## Rules

- Reviewers inspect only. They do not edit files.
- Keep each reviewer limited to its own objective.
- The main agent owns edits, conflict resolution, validation, and the final report.
- Reuse existing helpers before adding new abstractions.
- Do not broaden scope for stylistic consistency alone.
- Do not claim efficiency wins without a real code-path reason.
- Do not introduce behavior changes unless explicitly requested.
- If a pass finds nothing meaningful, say so and move on.

## Good Fixes

- Remove duplicated or dead code.
- Improve local naming and structure.
- Reduce needless branching or nesting.
- Replace brittle compact code with clearer flow.
- Extract small helpers when cohesion improves.
- Remove stale comments and obvious comments.
- Keep necessary comments that explain non-obvious constraints.

## Avoid

- Broad rewrites
- Hidden behavior changes
- New abstractions without payoff
- Dense one-liners that reduce readability
- Reformat-only churn.
- Changes outside touched scope unless required for correctness.

## Output

- Separate `reuse`, `quality`, and `efficiency` findings.
- Separate applied fixes from deferred findings.
- State validation results or why validation could not run.
