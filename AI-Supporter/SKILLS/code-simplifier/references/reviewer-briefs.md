# Reviewer Briefs

Use these briefs when you want a consistent three-pass simplify workflow.

Launch the three reviewers in parallel when the runtime supports subagents. Keep them read-only and task-local.

## Shared Setup

- Scope the review to touched files or the user-provided diff unless asked otherwise.
- Read enough surrounding code to understand local conventions before reporting issues.
- Do not edit files in reviewer passes.
- Report findings concisely with file path, approximate location, issue, and suggested direction.
- If nothing meaningful is found, say so explicitly.
- Reviewer isolation matters. Do not include the main agent's tentative conclusions, merged findings, or preferred fixes in the reviewer prompt.

Each reviewer prompt should include:
- the changed files or diff summary
- any repo rule sources that matter, such as `AGENTS.md`
- the instruction to stay within its single review dimension
- the instruction to avoid edits

Suggested reviewer names:
- `reuse-reviewer`
- `quality-reviewer`
- `efficiency-reviewer`

## Reuse Review

Focus only on reuse and duplication.

Look for:
- newly written helpers that duplicate existing helpers
- inline logic that should call an existing utility
- repeated parsing, normalization, mapping, or validation patterns
- copy-paste variants that should share one local helper

Ignore:
- naming-only concerns
- generic style opinions
- speculative performance advice

Prompt template:

Review the changed scope for REUSE issues only. Read the touched files and enough nearby code to understand local helpers and conventions. Look for duplicated logic, new code that should use an existing utility, and copy-paste variants that should share one local helper. Do not edit files. Report concise findings with file, approximate location, issue, and suggested direction. If nothing meaningful is found, say "No reuse issues found."

## Quality Review

Focus only on code quality and maintainability.

Look for:
- unnecessary branching or nesting
- redundant state or temporary variables
- weak names
- copy-paste drift
- stringly typed control flow
- leaky abstractions
- dead locals, dead helpers, and stale comments left by the change

Ignore:
- purely stylistic differences that match nearby code
- performance concerns unless they clearly hurt maintainability too

Prompt template:

Review the changed scope for QUALITY issues only. Read the touched files and enough nearby code to understand local conventions. Look for weak naming, unnecessary branching, redundant state, copy-paste drift, stringly typed control flow, leaky abstractions, and dead code left behind by the change. Do not edit files. Report concise findings with file, approximate location, issue, and suggested direction. If nothing meaningful is found, say "No quality issues found."

## Efficiency Review

Focus only on meaningful efficiency and cleanup issues.

Look for:
- repeated expensive work
- unnecessary allocations or conversions
- broad updates where a narrower operation exists
- synchronous work that should clearly be deferred or avoided
- dead code or unused imports left behind after the change

Ignore:
- micro-optimizations without evidence
- architecture proposals that exceed the touched scope

Prompt template:

Review the changed scope for EFFICIENCY issues only. Read the touched files and enough nearby code to understand execution paths. Look for repeated expensive work, unnecessary allocations or conversions, broad operations that could be narrower, synchronous work that should clearly be avoided, and dead code or unused imports left behind by the change. Do not edit files. Report concise findings with file, approximate location, issue, and suggested direction. If nothing meaningful is found, say "No efficiency issues found."
