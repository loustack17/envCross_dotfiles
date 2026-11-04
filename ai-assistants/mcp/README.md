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

Required secret names are `FIRECRAWL_API_KEY`, `MEM0_API_KEY`, `TAVILY_API_KEY`, `GITHUB_PERSONAL_ACCESS_TOKEN`, and `CRAWL4AI_API_TOKEN`.

Codex MCP children lack D-Bus, so wrappers use a local cache:

```fish
scripts/secrets/sync-mcp-env.sh
codex
```

Run the sync command from a desktop session after rotating secrets. `codex` refreshes the cache automatically. Cache path: `~/.cache/envcross/mcp.env` (mode `600`).

Also:

```fish
opencode
with-secrets -- <cmd>
```

Grok Build reads MCP from `~/.grok/config.toml`, `~/.claude.json`, and `~/.mcp.json`. Keep all three aligned with the stdio wrappers.

On Linux, Mem0 uses local stdio through `run-mem0.sh`. Set `MEM0_API_KEY`; the wrapper derives its authorization header without putting the token on the process argv. On Windows, Zed and Hermes use the hosted Mem0 endpoint with browser authorization. Sign in to the same Mem0 account when prompted.

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
- Hermes combines `.hermes/config.yaml` with `.hermes/mcp.linux.yaml` or `.hermes/mcp.windows.yaml` into the active config during installation.
- Each tool's MCP servers live in its own repo config: Claude `SKILLS/claude-tools/.mcp.json`, Codex `.codex/config.toml`, OpenCode `.opencode/opencode.*.json`, Hermes `.hermes/mcp.*.yaml`, Grok `.grok/config.toml`.
- cc-switch is retired because it stored provider keys in plaintext; nothing reads `~/.cc-switch`.
- Codex uses the official OpenAI endpoint by default.
- `code-review-graph` is enabled for Claude, Codex and OpenCode. Firecrawl, Tavily, MarkItDown, Crawl4AI and content-i18n are configured only for OpenCode on Linux.
- Mem0 is the shared durable memory provider for Claude, Codex, OpenCode, and Hermes. Codex keeps it enabled and non-required so service or quota failures do not block startup.

## Zed Firecrawl / MarkItDown

Use custom stdio servers so Bitwarden can inject secrets through wrapper scripts. If Zed shows duplicate Firecrawl or MarkItDown servers, uninstall the `mcp-server-firecrawl` and `mcp-server-markitdown` extensions from Zed.
