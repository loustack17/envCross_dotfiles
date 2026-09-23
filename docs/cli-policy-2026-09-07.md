# CLI policy — revised 2026-09-08

Historical snapshot. Current model and agent routing are defined in `ai-assistants/.codex/config.toml`.

This policy supersedes the default routing in `model-routing-2026-09-05.md`.

## Cost controls

- `codex`: GPT-5.6 Terra, medium reasoning, multi-agents enabled.
- `codex --profile astra`: changes only the coordinator to GPT-6 Astra low; multi-agents remain enabled. There is no separate single-agent mode.
- All ten role definitions remain available: oracle Astra low; council Sol high; infra-builder Terra high; coding-expert/designer Luna high; fixer/trainer Luna medium; explorer/librarian/observer Luna low.
- Default subagent fallback is Luna low. Concurrent thread limit is two and V1 nesting limit is one. These limits bound simultaneous work and recursive delegation, not the number of available roles.
- Grok subagents are enabled with sampling limit two. Existing provider/model selection is preserved; Codex role definitions are not claimed to be automatically portable to Grok.

This corrects the previous mistaken single-agent policy. Full role-based delegation is retained, with Astra outside routine work. Concurrency limits do not guarantee lower total tokens, and no percentage saving has been measured. Subscription quota consumption is not interchangeable with token counts or API prices; no causal claim is made that model choice alone explains the reported ten-minute exhaustion.

## Configuration ownership

Windows `codex.cmd` still checks the official stable release before launch. It then runs `scripts/codex-cli-overrides.py`, which reads repository common + Windows configuration and passes explicit `-c` overrides to the native executable. Conflicting ownership fails before launch. Python 3.11+ and PowerShell 7 are required.

This keeps Codex credentials, sessions, and the desktop application's own config in their existing locations. The launcher does not overwrite `~/.codex/config.toml` or modify the CC Switch database. Repository model, statusline, skills, plugin and MCP settings win for CLI launches even if CC Switch rewrites its file. Directly invoking `codex.exe` bypasses this policy. Explicit later CLI overrides can still change it.

The Windows-only duplicate model/effort keys were removed; common configuration owns them. The statusline is read from repository `[tui]`, not inferred from an OS profile filename. The `astra` profile is resolved before building the CLI overrides so the default model cannot mask the explicit profile.

Windows `grok.cmd` synchronizes only repository-managed compatibility, skill, subagent, MCP and default-effort settings before invoking `~/.grok/bin/grok.exe`. Existing UI settings and custom providers are preserved. Changed live files are backed up under `~/.grok/config-backups/`; idempotent launches do not add backups. Direct executable launches bypass synchronization. CC Switch changes during an already-running session were not tested.

## Skills and MCPs

- Code Review Graph is the only enabled MCP in both tested CLI configurations.
- Codex: disable other discovered user MCPs, plugin loading, bundled skills and global skills under `~/.codex/skills` and `~/.agents/skills`. Do not delete installed skills or disable project skill discovery.
- Grok: ignore global skill directories, disable bundled skill names, preserve Claude/Cursor compatibility opt-outs and the existing plugin deny list. Project configuration remains available and can intentionally add project-specific tools.
- CC Switch's database already had only Code Review Graph enabled for Codex/Grok and zero enabled skills. The live Codex file nevertheless contained eight enabled MCP definitions. Its live model/statusline sections were absent. This is observed divergence, not proof of which writer created every stale field.
- Grok's inspection can list discovered plugin components even when their skills are inactive. Do not count that inventory alone as active context.

## Evidence, not a universal zero-skill rule

[Anthropic's context engineering guidance](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) supports minimal, relevant tools and just-in-time retrieval. [Vercel's Next.js evaluation](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals) demonstrates a specific case where always-available compact context outperformed optional skill retrieval; it does not prove all skills are obsolete. [Codex's schema](https://developers.openai.com/codex/config-schema.json) documents the controls used here.

The zero-global-skill configuration is a conservative baseline for this user's workload and quota problem, not a claimed majority vote or proof that modern models inherently know all project rules. Add project-specific capabilities only when there is an identified need, then compare task quality and usage.

## Grok + OpenAI pending authentication

The installed Grok Build 1.0.13 documentation supports custom OpenAI Responses endpoints through `api_backend = "responses"`. See the [official custom-model guide](https://github.com/xai-org/grok-build/blob/main/crates/codegen/xai-grok-pager/docs/user-guide/11-custom-models.md).

This establishes API-protocol support, not built-in ChatGPT subscription OAuth. Installed upstream `grok login --help` exposes xAI OAuth, not a `--codex` option. The community [Open Grok fork](https://github.com/mweinbach/open-grok) explicitly supports `open-grok login --codex` and stores Codex OAuth credentials separately under `~/.opengrok/codex-auth.json`. It can coexist with upstream Grok and is not an official OpenAI or xAI client. This verifies documented support, not a successful login on this machine. No credential was copied, provisioned, exposed, or used; no fork was installed.

## Verification and recovery

- Native Codex app-server `config/read` verified Terra medium and Astra low separately, enabled subagents with concurrency two, the requested statusline, and only Code Review Graph enabled.
- Native `skills/list` returned no enabled skills in the tested repository for both profiles.
- `grok inspect --json` returned zero active skills and only Code Review Graph in the tested repository.
- 24 tests passed: 13 Codex configuration/launcher tests, six ownership tests, four routing tests and one Grok synchronization test.
- No paid inference, quota benchmark, full interactive TUI visual check, or CC Switch toggle during an active session was performed. New sessions are required; existing sessions may retain their model/context.
- Original agent instructions and the 12-rule backup were not removed. Existing user skill deletions were preserved. No commit/push was made.

To undo the CLI override policy, restore the previous launcher revision and the desired repository configuration; compare with subsequent edits first. Grok's pre-sync files are in its config-backups directory. Do not restore a whole file over later credential/provider changes without comparison.
