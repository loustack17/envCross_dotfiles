---
name: code-simplifier
description: Use after implementation, before commit, after AI-generated code, or when the user asks to simplify, clean up, run /simplify, reduce complexity, or preserve behavior while improving maintainability.
---

# Simplify

Review changed files for reuse, quality, and efficiency. Fix issues found.

## Phase 1: Scope

Run `git diff` (or `git diff HEAD` if staged). If no changes, review recently modified files from this session.

## Phase 2: Spawn Three Reviewers in Parallel

Spawn all three as subagents in a single parallel dispatch — use whatever delegation tool your runtime provides (Agent, delegate_task, etc.). Pass the full diff to each. If subagent spawning is unavailable, stop with: "Cannot run: subagent spawning unavailable in this runtime."

Each agent reports ONLY findings in its own dimension. Cross-dimension findings must be ignored.

### Agent 1 — Reuse
- Existing utilities/helpers that could replace new code (utility dirs, shared modules, adjacent files)
- New functions duplicating existing functionality — suggest the existing one
- Inline logic where utilities exist: string manipulation, path handling, env checks, type guards

### Agent 2 — Quality
- **Redundant state**: duplicates existing state, derivable values, observers/effects that could be direct calls
- **Parameter sprawl**: new params instead of restructuring
- **Copy-paste with slight variation**: near-duplicates that should share an abstraction
- **Leaky abstractions**: exposing internals that should be encapsulated
- **Stringly-typed**: raw strings where constants/enums/branded types exist
- **Unnecessary JSX nesting**: wrapper elements adding no layout value (when JSX is present)
- **Nested conditionals**: ternary chains (`a ? x : b ? y : ...`), nested if/else, switch 3+ deep — flatten with early returns, guards, or lookup
- **Unnecessary comments**: explaining WHAT, narration, task references — keep only non-obvious WHY (constraints, invariants, workarounds)

### Agent 3 — Efficiency
- **Unnecessary work**: redundant computation, repeated reads, duplicate API calls, N+1
- **Missed concurrency**: independent ops run sequentially
- **Hot-path bloat**: blocking work added to startup or per-request/render paths
- **Recurring no-op updates**: state updates in polling/intervals/handlers firing unconditionally — add change-detection guard. Wrappers with updater/reducer callbacks must honor same-reference returns or callers' early-return no-ops are silently defeated
- **Unnecessary existence checks** (TOCTOU): operate directly, handle errors
- **Memory**: unbounded structures, missing cleanup, listener leaks
- **Overly broad operations**: full files when partial needed

## Phase 3: Fix and Report

Aggregate findings, fix each directly. Skip false positives without arguing.

Report in four sections: **Findings** (per-dimension), **Applied Fixes**, **Validation** (what ran, or why not), **Deferred** (skipped + reason).
