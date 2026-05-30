# MCP configuration

Canonical non-secret config lives here.

## Files

| File | Use |
|------|-----|
| `cursor.mcp.json` | Cursor MCP JSON (`mcpServers`) |
| `ide.mcp.json` | VS Code MCP JSON (`servers`) |
| `cc-switch-mcp.json` | cc-switch MCP catalog seed, no secrets |
| `secrets.env.example` | Local secret env template |

## Secret handling

Do not commit real tokens. Put local secrets in:

```bash
mkdir -p ~/.config/mcp
cp ai-assistants/mcp/secrets.env.example ~/.config/mcp/secrets.env
chmod 600 ~/.config/mcp/secrets.env
```

`run-firecrawl.sh`, `run-github.sh`, and `run-mem0.sh` load `~/.config/mcp/secrets.env` before starting MCP servers. Cursor / VS Code remote headers still need `MEM0_AUTHORIZATION` in the app process environment.

Wrapper scripts parse only the specific variable they need, so values with spaces such as `MEM0_AUTHORIZATION='Token ...'` are safe.

Mem0 uses local stdio (`npx -y @mem0/mcp`) through `run-mem0.sh` to avoid Cursor/Zed OAuth limits. Set `MEM0_API_KEY`; if only `MEM0_AUTHORIZATION='Token ...'` exists, the wrapper derives `MEM0_API_KEY`.

`sync-cc-switch-mcp.py` resolves `${env:NAME}` from environment. If an env var is missing, it preserves the existing cc-switch DB value for that field so stored secrets are not erased.

## Apply

```bash
bash ./install.sh --no-install \
  --only-cursor-mcp \
  --only-cursor-user-mcp \
  --only-vscode-mcp \
  --only-cc-switch

scripts/mcp/sync-cc-switch-mcp.py
```

## Boundaries

- Cursor uses `mcpServers`; VS Code uses `servers`, so they cannot share one JSON shape.
- Zed uses `context_servers` inside `zed/settings.json`; it cannot consume the shared `mcp.json` directly.
- cc-switch app settings are symlinked from `ai-assistants/.cc-switch/settings.json`.
- cc-switch stores MCP servers in `~/.cc-switch/cc-switch.db`, not a symlink-friendly JSON file. The repo manages a seed JSON plus sync script, not the DB or auth files.

## Zed Firecrawl / MarkItDown

Use custom stdio servers, not Zed MCP extensions, so secrets can stay in `~/.config/mcp/secrets.env` through wrapper scripts. If Zed shows duplicate Firecrawl or MarkItDown servers, uninstall the `mcp-server-firecrawl` and `mcp-server-markitdown` extensions from Zed.
