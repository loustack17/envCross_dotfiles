# Model routing — 2026-09-05

Superseded by [CLI policy — 2026-09-07](cli-policy-2026-09-07.md) after the user reported excessive quota consumption.

## Scope

Codex CLI multi-agent routing and the OMO Slim `opencode-go` preset only. Other OMO presets, core context, permissions, skills, MCP configuration, plugin versions, and CLI binaries are unchanged by this update.

## Codex

| Role | Model | Reasoning |
| --- | --- | --- |
| Main | GPT-6 Astra | high |
| Oracle | GPT-6 Astra | xhigh |
| Council | GPT-5.6 Sol | high |
| Infra-builder | GPT-5.6 Terra | high |
| Coding-expert, designer | GPT-5.6 Luna | high |
| Fixer, trainer, unspecified subagent | GPT-5.6 Luna | medium |
| Explorer, librarian, observer | GPT-5.6 Luna | low |

Concurrency remains four. Role permissions and instructions are unchanged. Higher concurrency reduces elapsed time in suitable tasks, not necessarily total tokens. Enabling agents does not require delegating every task.

The Astra migration preserves the repository's main/oracle reasoning levels. Lowering Luna effort is a workload-based recommendation: locating code or collecting status should not default to maximum reasoning. This is not a measured guarantee of unchanged quality. Escalate difficult work to the appropriate implementation or oracle role when the narrow role cannot establish the answer.

The live Windows config already selected Astra at medium effort but lacked the repository's agent defaults. Only its main reasoning and feature/agent defaults were synchronized; unrelated live settings were preserved. The agents directory is a symlink to the repository.

## OpenCode Go

| Role | Model | Variant |
| --- | --- | --- |
| Orchestrator | Kimi K3 | provider default |
| Oracle | Qwen3.8 Max | xhigh |
| Librarian, explorer | GLM-5.3-Flash | low |
| Designer | Kimi K2.7 Code | provider default |
| Fixer | GPT-5.6 Luna | medium |

Kimi K3 remains the main model to avoid simultaneously changing the main model and worker effort without task-level evaluation. This is a quality-preserving migration hypothesis, not evidence that Kimi is the cheapest or best orchestrator. Kimi K2.7 Code also remains unchanged; a newer version alone is insufficient reason to replace it.

Qwen3.8 Max exposes `low`, `medium`, and `xhigh`; the former `max` setting did not match the installed provider catalog. Kimi K2.7 Code exposes no named variants. Omitted variants mean provider defaults, not disabled reasoning.

Removed inactive `council` and `observer` entries from this preset. In installed OMO Slim 2.0.5, Council is disabled without top-level `council` member configuration. `councillor` is an internal role, not a replacement spelling for Council. Observer is disabled by default and handles visual analysis, unlike Codex's monitoring Observer. No council fan-out was enabled. Original entries remain in the local backup.

Existing custom OpenCode Markdown agents are outside this change and retain their model-inheritance behavior. `mix` and `gpt` presets are unchanged; their older variants were not repaired as part of this Go-only scope.

## Evidence and limits

- [OpenAI Astra migration guidance](https://developers.openai.com/api/docs/guides/latest-model): migrate to `gpt-6-astra`, preserve existing reasoning effort except none/minimal, and validate task behavior. The reported lower output-token use concerns particular evaluations, not a universal saving or this repository's workload.
- [Codex configuration schema](https://developers.openai.com/codex/config-schema.json): confirms the default-subagent model, effort, enabled flag, and concurrent-thread keys used here.
- [OpenCode Go documentation](https://opencode.ai/docs/go/): model availability, endpoints, and model-dependent subscription allowances. Public token prices alone do not establish Go quota consumption; illustrative request counts use different token mixes and are not head-to-head benchmarks.
- Installed OpenCode 1.18.13: refreshed model catalog and resolved agent configuration corroborate every active Go model/variant. Neither the Go catalog nor this installation's OpenAI catalog listed Astra.
- Installed OMO Slim 2.0.5: JSON schema and bundled implementation corroborate preset application and disabled-role behavior. The cached `@latest` copy is a different package; it was not assumed to be active.
- Codex CLI on PATH is 0.147.0. Its refreshed catalog did not list Astra; doctor advertised 0.153.4. The CLI binary was not upgraded. Astra endpoint execution and role discovery by a newer CLI remain unverified; setting a model name alone does not prove runtime compatibility. Other Codex runtimes may use different binaries/catalogs.

## Verification and rollback

- Four routing tests, four config-generation tests, and six ownership tests passed.
- Installed OMO JSON schema validation passed.
- All six active Go agents matched `opencode debug config` and the refreshed provider variant catalog.
- Live Codex routing fields match the repository; its agent directory resolves to the repository.
- Structural comparison confirmed unrelated live Codex values and non-Go presets were preserved. Deployment checked the original file hash before replacement and the resulting hash afterward.
- `git diff --check` passed. No commit or push was made.
- No paid model task, multi-agent delegation, Mem0 call, or task-level A/B benchmark was run. Existing doctor warnings about MCP environment and thread inventory were not repaired in this model-routing change; the non-interactive terminal also reports `TERM=dumb`.

Local ignored backup: `backup/model-routing-20260905-142741/`. It contains the prior Go config and prior live Codex config; do not commit it because live configuration may contain private values. Roll back only changed routing fields after comparing with current files, rather than overwriting subsequent user edits. Repository Codex role originals are also available in Git history.

To measure savings, run the same representative locating, small-fix, feature, and architecture tasks against before/after configurations. Compare accepted correctness first, then total input/output/reasoning tokens, retries, latency, and actual provider quota. No percentage saving is claimed before that comparison.
