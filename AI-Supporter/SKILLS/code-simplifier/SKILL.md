---
name: code-simplifier
description: Review recently changed code in three focused passes for reuse, quality, and efficiency, then apply safe behavior-preserving cleanup. Use after implementation, before commit, or when the user asks to simplify, run /simplify, or clean up code while preserving functionality.
---

# Code Simplifier

Use this skill for a cleanup pass on code that was just written or modified.

This shared version is the single canonical workflow for all non-Claude tools that can follow a Claude `/simplify` style workflow. It cannot import Claude's hidden runtime, so it reconstructs the workflow explicitly: three isolated reviewer subagents, one main-agent merge, one main-agent fix pass, then validation.

## Goals

- Preserve behavior, interfaces, outputs, and side effects unless the user explicitly asks for functional changes.
- Improve clarity, consistency, and maintainability.
- Follow project rules from local sources such as `AGENTS.md`, `CLAUDE.md`, repository docs, linters, type checkers, and existing code patterns.
- Focus on touched files or recently modified regions by default.
- Separate findings by review intent before changing code.

## Workflow

1. Identify the changed files or code regions in scope.
2. Run three isolated review passes:
   - `reuse`: look for duplicated logic, missed reuse of existing helpers, and new code that should call established utilities.
   - `quality`: look for naming problems, redundant state, weak structure, unnecessary branching, copy-paste drift, and low-value abstractions.
   - `efficiency`: look for unnecessary work, repeated expensive operations, hot-path bloat, broad updates, and dead code left behind by the change.
3. Spawn exactly three parallel read-only subagents:
   - `reuse-reviewer`
   - `quality-reviewer`
   - `efficiency-reviewer`
   Use the launch briefs in `references/reviewer-briefs.md`.
4. If isolated reviewer subagents are unavailable in the current runtime, stop and say that the strict simplify workflow cannot be executed as specified in this run.
5. Merge the findings. Drop speculative advice, style-only churn, and conflicting recommendations unless one is clearly stronger.
6. If the user asked for review only, stop after the merged findings.
7. Otherwise apply only the fixes that are local, behavior-preserving, and supported by the codebase context.
8. Run the best available validation for the touched scope.
9. Present the result using `references/output-format.md`.

Read `references/reviewer-briefs.md` when you need concrete reviewer scopes or want to launch subagents with consistent prompts.
Read `references/output-format.md` when you need the final report structure.

## Good Changes

- Reduce needless nesting and branching.
- Remove redundant code, dead locals, and low-value abstractions.
- Improve naming when the change is local and clearly safer.
- Extract small helpers when cohesion improves.
- Align code with repository conventions and nearby patterns.
- Replace brittle compact patterns with clearer control flow.

## Avoid

- Broad rewrites outside the active scope.
- Behavioral changes disguised as refactors.
- New abstractions without a concrete maintenance benefit.
- Collapsing code into dense one-liners.
- Chasing fewer lines at the cost of readability.
- Rewriting stable untouched code just for stylistic uniformity.
- Letting review subagents edit files directly.

## Heuristics

- Prefer simplicity that lowers future change cost.
- Keep coupling low and responsibilities focused.
- If a refactor makes debugging or extension harder, back it out.
- When a style tradeoff is unclear, match the surrounding codebase.
- Prefer findings that can be proven from the codebase over generic advice.
- If no meaningful issue is found in a pass, say so explicitly and move on.

## Delegation Rules

- Reviewer subagents are analysis-only. They inspect scope and report findings; they do not patch files.
- Keep each reviewer narrow. Do not ask one reviewer to cover the others' responsibilities.
- The main agent owns all edits, conflict resolution, validation, and the final summary.
- This workflow is strict. A sequential self-review is not equivalent to three isolated reviewers and must not be used as a silent substitute.
- Reuse reviewer context should contain only the scope, changed files, and the review objective. Do not leak the expected answer.
- The point of parallel reviewers is isolation. Each reviewer should receive only task-local scope, repository rules, and one review objective so its judgment is not anchored by the main session's evolving conclusions.
- Do not pre-merge reviewer context. Keep reviewer prompts independent, then merge only after all three reports return.
- If parallel reviewers are unavailable in the current run, stop and state that the workflow could not be executed in strict isolated mode.

## Reviewer Roles

- `reuse-reviewer`: search for missed reuse, duplicated helpers, and inline logic that should use an existing utility.
- `quality-reviewer`: search for clarity, naming, structural, and maintainability issues.
- `efficiency-reviewer`: search for wasted work, broad operations, dead code, and meaningful performance issues left by the change.

## Fixing Rules

- Fix clear issues discovered by the review passes when the fix is local and low risk.
- Leave larger architectural rewrites as findings unless the user explicitly asked for broader refactoring.
- Reuse existing helpers before creating new ones.
- Do not remove abstractions that still carry their weight.
- Do not claim an efficiency win unless the code path actually supports it.
- After patching, quickly re-check whether your fix created a new reuse, quality, or efficiency issue in the touched scope.

## Validation

- Run formatters, linters, tests, or type checks when they are available and relevant.
- If validation cannot be run, state that clearly.

## Output

- Report `reuse`, `quality`, and `efficiency` findings separately.
- Report applied fixes separately from rejected or deferred findings.
- Include validation and deferred findings in the final report.
- If everything is already clean, say that no meaningful simplification issues were found.
