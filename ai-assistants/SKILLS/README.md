# Shared Skills

Source of truth for shared skills. Skill directories contain real files so Windows and Linux checkouts remain self-contained.

Installed links:
- `~/.claude/skills`
- `~/.agents/skills`

Installed tools link to this directory; skills do not depend on machine-local plugin cache paths.

Codex discovers these skills globally through `~/.agents/skills`. Codex loads them natively; bundled system skills remain managed by Codex. TypeSafe is stored in `typesafe-ai/` with its upstream license.

Moli skills (`moli-cdp-server/`, `moli-webfetch/`, `moli-websearch/`) are copied from [lexmount/moli](https://github.com/lexmount/moli/tree/main/skills) at commit `31350ab` with the upstream MIT/Apache-2.0 licenses. They need the `moli` binary, which is not committed (~110 MB): `install.sh` / `install.nu` install a pinned, SHA-256-verified release through `scripts/install-moli.sh` and `scripts/windows/install-moli.ps1` (target `moli`). To update, re-copy the skill directories and bump the version and hashes in both scripts.
