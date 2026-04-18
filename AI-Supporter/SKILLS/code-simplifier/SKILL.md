---
name: code-simplifier
description: Review recently changed code in three focused passes for reuse, quality, and efficiency, then apply safe behavior-preserving cleanup. Use after implementation, before commit, or when the user asks to simplify, run /simplify, or clean up code while preserving functionality.
---

# Code Simplifier

Use this skill for a post-change cleanup pass.

## Goals

- Preserve behavior unless the user asked for a functional change.
- Improve clarity, reuse, and efficiency in the touched scope.
- Follow repository rules and nearby code patterns.

## Workflow

1. Identify the changed files or target scope.
2. Run exactly three isolated review passes:
   - `reuse`
   - `quality`
   - `efficiency`
3. Launch exactly three parallel read-only reviewers with the briefs in `references/reviewer-briefs.md`.
4. If isolated parallel reviewers are unavailable, stop and say the strict workflow cannot run in this session.
5. Merge the findings. Drop style churn, speculation, and weak advice.
6. If the user asked for review only, stop after reporting findings.
7. Otherwise apply only local, behavior-preserving fixes.
8. Run the best available validation for the touched scope.
9. Format the final report with `references/output-format.md`.

## Rules

- Reviewers inspect only. They do not edit files.
- Keep each reviewer limited to its own objective.
- The main agent owns edits, conflict resolution, validation, and the final report.
- Reuse existing helpers before adding new abstractions.
- Do not broaden scope for stylistic consistency alone.
- Do not claim efficiency wins without a real code-path reason.
- If a pass finds nothing meaningful, say so and move on.

## Good Fixes

- Remove duplicated or dead code.
- Improve local naming and structure.
- Reduce needless branching or nesting.
- Replace brittle compact code with clearer flow.
- Extract small helpers when cohesion improves.

## Avoid

- Broad rewrites
- Hidden behavior changes
- New abstractions without payoff
- Dense one-liners that reduce readability

## Output

- Separate `reuse`, `quality`, and `efficiency` findings.
- Separate applied fixes from deferred findings.
- State validation results or why validation could not run.
