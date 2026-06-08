#!/usr/bin/env bash
set -euo pipefail
source "/home/lou/Documents/WorkFlow/envCross_dotfiles/scripts/mcp/load-secret.sh"
if [[ -f "$HOME/.hermes/.env" ]]; then
    set -a
    source "$HOME/.hermes/.env"
    set +a
fi
load_mcp_secret FIRECRAWL_API_KEY
bin="${MCP_NODE_PREFIX:-$HOME/.local/share/mcp-node}/node_modules/.bin/firecrawl-mcp"
if [[ -x "$bin" ]]; then
    exec "$bin"
fi
exec npx -y firecrawl-mcp
