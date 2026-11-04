# Claude Code

Edit `settings.json` here. `~/.claude/settings.json` links directly to it, and `~/.claude/statusline.sh` links to `statusline.sh` (requires `bash` and `jq`). No settings generation, OS dispatcher, or platform JSON is used. Keep project-specific `autoMode` environments out of these user settings.

Claude stores project trust and its own session/configuration state in the local `~/.claude.json`, which must not be shared or linked into this repository. User settings apply across projects; a project's `.claude/settings.json` provides shared project settings, and `.claude/settings.local.json` provides local overrides. These scopes do not automatically select arbitrary Windows/Linux settings blocks. Supported native tools adapt to the host; an explicit shared setting affects both hosts.

Claude Code selects its supported native tools for the host. Graph hooks use official exec form: `code-review-graph` plus `args`, without a shell script. The installed executable must be available on PATH.

`../SKILLS/claude-tools/` contains the official personal-plugin layout: `.claude-plugin/plugin.json` and `.mcp.json`. The existing `~/.claude/skills` link exposes it as `repo-tools@skills-dir`; Claude loads it without marketplace registration. Start a new session or use `/reload-plugins` after editing MCP definitions. Code Review Graph uses its installed executable; Mem0 uses its maintained hosted endpoint and requires local authentication. freehire uses its account endpoint (`/api/v1/mcp/account`) with browser OAuth; authenticate once per host with `claude mcp login plugin:repo-tools:freehire`. Its public no-account endpoint is `/api/v1/mcp`.

Native subagents are edited in `agents/`. Shared instructions and coordination live in `../AGENTS.md` and `../SKILLS/omo-slim/`. Claude Markdown and Codex TOML definitions have different official formats; there is no custom generator to combine them.

Linux may launch the official CLI from Fish. Claude's native Bash tool supports Bash and Zsh, not Fish. This setup does not introduce an adapter to bypass that limitation. The model uses the official `opus` alias and official Anthropic connection; authentication remains local.

Platform differences come from the native executable and installed tools, rather than separate generated settings:

| Capability | Native Windows | Linux |
| --- | --- | --- |
| User settings | `%USERPROFILE%\.claude\settings.json` | `~/.claude/settings.json` |
| Shell tools | PowerShell; Bash with Git for Windows | Bash or Zsh; CLI may be launched from Fish |
| Native sandbox | Not supported | Supported with required system dependencies |
| Graph hooks and MCP | `code-review-graph` resolved on PATH | Requires its Linux installation on PATH |
| Plugin dependencies | Installed for this host | Must be installed for the Linux host |
| Authentication | Local Claude and MCP credentials | Separate local Claude and MCP credentials |

On Windows, code-review-graph, Mem0 and freehire connect through the repo-tools plugin (verified 2026-11-04). Linux runtime has not been tested; a shared settings file alone does not prove its executables, language servers, browsers, or credentials are available.

`enabledPlugins` lists only enabled plugins; unused plugins are uninstalled rather than kept disabled. Plugins synced from claude.ai and claude.ai connectors are account-managed and are not stored here.

Apply links once with `nu install.nu --no-install --only claude-code` on Windows, or the repository's existing Linux installer. Later settings edits require no installer or copy step. Authentication, caches, and session state stay outside this repository.

Official references:

- [Settings](https://code.claude.com/docs/en/settings)
- [Platform requirements and Windows tools](https://code.claude.com/docs/en/setup#set-up-on-windows)
- [Sandbox platform support](https://code.claude.com/docs/en/sandboxing)
- [Exec-form hooks](https://code.claude.com/docs/en/hooks#exec-form-and-shell-form)
- [Personal plugin auto-loading](https://code.claude.com/docs/en/plugins/create#make-a-plugin-load-in-every-session)
- [Native subagents](https://code.claude.com/docs/en/sub-agents)
- [Skills](https://code.claude.com/docs/en/skills)
- [Supported shell interpreters](https://code.claude.com/docs/en/env-vars)

To check a host, run `claude doctor`, `claude plugin details repo-tools`, and `claude mcp list`. Configuration health does not establish authenticated model access.
