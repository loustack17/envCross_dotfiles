# MCP configuration

Canonical non-secret config lives here.

## Files

| File | Use |
|------|-----|
| `cursor.mcp.json` | Cursor MCP JSON (`mcpServers`) |
| `ide.mcp.json` | VS Code MCP JSON (`servers`) |

## Secret handling

User-managed service secrets live in one Bitwarden Secrets Manager project. Configure its read-only machine account locally:

```fish
scripts/secrets/configure.sh
```

The access token and project ID are stored in the desktop Secret Service keyring. `scripts/secrets/run.sh` retrieves them and uses `bws run` to inject secrets only into the launched process. Tool-owned OAuth sessions remain in their native stores.

On Windows, set the Bitwarden machine-account token once as the `BWS_ACCESS_TOKEN` user environment variable, the bws CLI's standard method; restart running apps (Codex, terminals) to pick it up. Keep that machine account read-only and limited to this project, and revoke the token in Bitwarden if it may have leaked. Nushell's `with-secrets <cmd>` runs `scripts\windows\with-secrets.ps1`, which loads the project's secrets into that command's environment and removes `BWS_ACCESS_TOKEN` before the command starts; the TypeSafe helper does the same.

Every service key comes from this Bitwarden project; only the BWS machine token itself lives outside it. Never store a service key in an environment variable, `.env`, or config file. Both installers install `bws` (Scoop `bitwarden-secrets-manager-cli`, AUR `bws-bin`) and, on Linux, `libsecret`.

Required secret names are `FIRECRAWL_API_KEY`, `MEM0_API_KEY`, `TAVILY_API_KEY`, `GITHUB_PERSONAL_ACCESS_TOKEN`, and `CRAWL4AI_API_TOKEN`.

Codex MCP children lack D-Bus, so wrappers use a local cache:

```fish
scripts/secrets/sync-mcp-env.sh
codex
```

Run the sync command from a desktop session after rotating secrets. `codex` refreshes the cache automatically. Cache path: `~/.cache/envcross/mcp.env` (mode `600`).

Also:

```fish
with-secrets -- <cmd>
```

On Linux, Mem0 uses local stdio through `run-mem0.sh`. Set `MEM0_API_KEY`; the wrapper derives its authorization header without putting the token on the process argv. On Windows, Zed uses the hosted Mem0 endpoint with browser authorization. Sign in to the same Mem0 account when prompted.

Tavily uses local stdio through `run-tavily.sh` so BWS can inject `TAVILY_API_KEY`.

## Apply

```fish
./install.sh --no-install \
  --only-cursor-mcp \
  --only-cursor-user-mcp \
  --only-vscode-mcp
```

## Boundaries

- Cursor uses `mcpServers`; VS Code uses `servers`, so they cannot share one JSON shape.
- Zed uses platform-specific `context_servers` in `zed/platform.linux.json` and `zed/platform.windows.json`; it cannot consume the shared `mcp.json` directly.
- Each tool's MCP servers live in its own repo config: Claude `SKILLS/claude-tools/.mcp.json`, Codex `.codex/config.toml`, Grok `.grok/config.toml`.
- Codex uses the official OpenAI endpoint by default.
- `code-review-graph` is enabled for Claude, Codex and Grok. Firecrawl, Tavily, MarkItDown, Crawl4AI and content-i18n are configured only for the Linux editors (Cursor, VS Code, Zed).
- Mem0 is the shared durable memory provider for Claude, Codex, and Grok. Codex keeps it enabled and non-required so service or quota failures do not block startup.

## Zed Firecrawl / MarkItDown

Use custom stdio servers so Bitwarden can inject secrets through wrapper scripts. If Zed shows duplicate Firecrawl or MarkItDown servers, uninstall the `mcp-server-firecrawl` and `mcp-server-markitdown` extensions from Zed.
