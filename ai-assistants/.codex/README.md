# Codex

Edit `config.toml` here for shared defaults. Windows links `C:\ProgramData\OpenAI\Codex\config.toml` to it; Linux links `/etc/codex/config.toml` to it. Codex reads its official system layer automatically, then its local user layer. There is no custom merge, generated configuration, CLI override builder, or launch wrapper.

The writable user config also lives in this repository: `local/windows/config.toml` on Windows and `local/linux/config.toml` on Linux. Link `~/.codex/config.toml` to that host's file. The `local/` directory is ignored by Git because it holds project trust, hook approval, desktop state, and machine paths. Keep the shared defaults in `config.toml`; a user value overrides the corresponding system default. System defaults apply to all Codex users on that computer; anyone permitted to edit this repository can change those defaults. Do not share one writable user file between operating systems or accounts.

The official `[windows]` table contains Windows-specific options, including `sandbox`; it is not a general-purpose OS override block. Codex has no documented automatic Windows/Linux configuration include. Common model, agent, UI, and MCP settings apply to both hosts. Windows uses the official recommended elevated sandbox; use the native unelevated fallback only when administrator permissions or elevated setup are unavailable. Linux uses Codex's native Linux sandbox. No invented `[linux]` table or platform merge is used.

The shared source excludes machine-specific project trust records, desktop application state, unused plugin registrations, and legacy UI toggles. Authentication remains in its existing native location. Keep hook definitions linked at `~/.codex/hooks.json`; their approval state is stored in the linked user config. Review and approve changed hooks through `/hooks` or the desktop hook browser.

Keep the default model in `config.toml`. Switch models with the native `/model` picker or `codex --model MODEL`; no model profile files are needed.

Shared skills use the official `~/.agents/skills` user location; Codex manages its bundled `~/.codex/skills/.system` locally.

Edit native agent definitions directly in `agents/`; shared coordination and instructions live in `../SKILLS/omo-slim/` and `../AGENTS.md`. MCP uses the native `[mcp_servers]` configuration. Linux can invoke the official executable from Fish without the former secret/provider shell wrapper.

Apply links once with `nu install.nu --no-install --only codex` on Windows, or the existing repository Linux installer. System paths may require administrator privileges; Linux commits user links first, then applies the system link separately with `sudo` and a GNU numbered backup. A user-link failure leaves the system config unchanged. If the final system operation fails, user links remain committed; restore the numbered system backup before retrying. The installer links a host user config only when its source already exists; it does not invent an empty file or a dangling link. Before migrating an existing regular user config, back it up and preserve its complete contents in the host source. Later shared configuration edits need no reapplication. Run the official executable directly; its installation and updates use the official distribution.

Official references:

- [Configuration basics](https://developers.openai.com/codex/config-basic/)
- [Official loader: Windows and Unix system paths](https://github.com/openai/codex/blob/main/codex-rs/config/src/loader/mod.rs)
- [Official config writer: follows symlink targets](https://github.com/openai/codex/blob/main/codex-rs/core/src/config/edit.rs)
- [Official symlink write test (Unix)](https://github.com/openai/codex/blob/main/codex-rs/core/src/config/edit_tests.rs)
- [Hook definitions and trust](https://developers.openai.com/codex/hooks)
- [Native model switching](https://developers.openai.com/codex/cli/reference)
- [Windows-only sandbox setting](https://developers.openai.com/codex/config-reference/#windows-sandbox)
- [Native agents](https://developers.openai.com/codex/multi-agent/)
- [MCP configuration](https://developers.openai.com/codex/mcp/)

Reviewed against the current official manual on 2026-10-07. Verify loading with `codex features list` and `codex mcp list`; these checks do not send a model request.

Windows configuration loading and native `config/batchWrite` through the user symlink are verified; hook trust and shared defaults remain unchanged. Linux runtime, sandbox, MCP executables, and authentication have not been tested on a Linux host. Linux needs `uvx` on PATH for Code Review Graph and its own Mem0 authorization. Launching from Fish does not require a configuration wrapper.
