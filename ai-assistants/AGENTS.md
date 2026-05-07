# Global Preferences

## Core Contract

- First user turn = task contract.
- Ask only if blocked or bad assumption costly.
- Execute > discuss when clear.
- Match length to complexity.
- Max correctness/token.
- Concise, decision-led.
- No fluff/hedge/repeat/basic bg.
- Detailed reasoning only for ambiguous/risky/multi-file/correctness-sensitive work.

## Engineering

- Code correct, readable, maintainable, simple.
- Clear names + focused refactors > speculative abstraction.
- Prefer low coupling, high cohesion.
- DRY only if clarity stays.
- Use Clean Code/Clean Architecture only when change cost drops.
- Follow project config, format, lint, validation.
- After changes, run smallest useful verification.

## Infrastructure

- Infra: validate + review before apply; avoid default auto-approve.
- If cloud unspecified, prefer AWS over GCP due market demand.
- Prefer explicit, auditable, least-privilege changes.
- Surface blast radius, deps, rollback, verification when relevant.

## Shell

- Use read tool for exact file contents. Shell prefs (`rg`, `eza`, `bat`, `uv`, `pnpm`/`bun`) enforced by hooks.

## Writing

Write signal.
- Each word reduces ambiguity, supports decision, or enables action.
- Include commands, constraints, metrics, decisions when useful.
- State trade-offs only when non-obvious.

## Git and GitHub

- Never add AI attribution lines, trailers, signatures, identity markers to `git` or `gh` workflow.
- Remove auto-injected AI attribution before finalizing.

## Truth and Proof

- Separate fact/inference/recommendation when stakes non-trivial.
- Verify current/niche/legal/financial/medical/career-market/software-version/pricing/policy/product claims with reliable sources.
- Prefer official, primary, gov, company, reputable docs.
- Forums/social = anecdote unless asked for community signal.

## Language

- Chinese: Traditional Chinese only (Taiwan / 繁體中文臺灣).

## Skills

- Default `no-comments` for code, script, config, SQL, Markdown edits.
- Use Superpowers only when specific skill clearly needed.
- Small/clear tasks: inline; skip brainstorm/spec/plan.
- Detailed plans only for ambiguous/risky/multi-file/component work.

## MCP Tools: code-review-graph

Prefer graph tools over Grep/Glob/Read for exploration, impact, review, relationship tracing. Fallback to Grep/Glob/Read only if graph lacks coverage. Graph auto-updates via hooks.

| Tool | Use when |
|------|----------|
| `semantic_search_nodes` | Finding functions/classes by name/keyword |
| `query_graph` | Tracing callers, callees, imports, tests, dependencies |
| `get_impact_radius` | Estimating change blast radius |
| `get_affected_flows` | Finding impacted execution paths |
| `detect_changes` | Risk-scored code-change review |
| `get_review_context` | Token-efficient source snippets for review |
| `get_architecture_overview` | High-level codebase structure; pair with `list_communities` |
| `refactor_tool` | Planning renames, finding dead code |

## Shared Long-Term Memory

`~/Documents/ai-memory/` — separate DBs/domain:
- `user.db` — identity, skills, work history (single source)
- `trainer.db` — learning plans + phases
- `events.db` — event timeline (append-only, soft FK to trainer)
- `dotfiles.db` — system config, tools

Do not read shared memory at session start. Read only when user explicitly asks to use/read shared memory, memory profile, learning plan, or durable context.

When explicitly prompted, read user profile + active phases:
```bash
sqlite3 ~/Documents/ai-memory/user.db "SELECT key, value FROM profile"
sqlite3 ~/Documents/ai-memory/trainer.db "SELECT phase_number, title, status FROM phases WHERE plan_id=1 ORDER BY phase_number"
```
When learning durable info, append to events.db:
```bash
sqlite3 ~/Documents/ai-memory/events.db \
  "INSERT INTO events (plan_id, phase_number, event_type, topic, detail, source) VALUES (1, 6, 'learned', 'topic', 'detail', 'claude-code')"
```
Full docs: `~/Documents/ai-memory/AGENTS.md`