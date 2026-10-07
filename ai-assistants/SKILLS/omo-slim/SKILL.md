---
name: omo-slim
description: Coordinate bounded coding work with specialized agents in Claude Code or Codex. Use for explicit OMO requests or material tasks that benefit from independent exploration, research, implementation, design, or review.
---

# OMO Slim

Keep orchestration in the main conversation. Use the host's native agent tools and available specialist definitions. No OpenCode plugin or subscription is required.

## Routing

| Responsibility | Claude Code | Codex |
|---|---|---|
| Codebase exploration | explorer | explorer |
| Official documentation and external research | librarian | researcher |
| Architecture, difficult debugging, independent review | oracle | reviewer |
| Bounded implementation and fixes | fixer | worker |
| UI, UX, accessibility, visual implementation | designer | designer |

## Workflow

1. Inspect the request, project instructions, current changes, and relevant implementation. Define a verifiable success condition.
2. Handle trivial or tightly sequential work directly. Delegate only independent, bounded tasks that benefit from separate context or parallelism.
3. Give each specialist its objective, relevant context, exact file or module ownership, constraints, and required evidence. Specialists must not create further agents.
4. Prefer parallel exploration and research. Serialize overlapping writes. Keep architecture, integration, conflict resolution, and final acceptance in the main conversation.
5. Verify important specialist findings before using them. Pass only accepted evidence and necessary context to subsequent specialists.
6. For material changes, use an independent reviewer when that adds useful confidence. Resolve concrete findings and run the smallest relevant checks without suppressing failures.
7. Report the result, validation, remaining uncertainty, and material rollback information. Preserve unrelated user work and do not commit, push, publish, or change external services unless requested.

## Operating Boundaries

- Delegate through native runtime controls; do not launch nested CLI sessions as a substitute for subagents.
- Use the configured agent model and permissions. Do not override them merely to imitate another platform.
- Treat tool allowlists, permission controls, and filesystem sandboxes as separate mechanisms. A prompt requesting read-only behavior does not enforce it.
- Do not use durable memory without an explicit request or a task requiring prior durable context.
- Keep long logs and exploration in specialist context. Return concise evidence, file references or source links, checks, and unresolved issues.
- If a specialist is unavailable, perform its bounded work in the main conversation and report any material capability gap.
