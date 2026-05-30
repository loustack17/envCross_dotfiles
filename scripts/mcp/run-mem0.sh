#!/usr/bin/env bash
set -euo pipefail
source "/home/lou/Documents/WorkFlow/envCross_dotfiles/scripts/mcp/load-secret.sh"
load_mcp_secret MEM0_API_KEY
load_mcp_secret MEM0_AUTHORIZATION
if [[ -z "${MEM0_AUTHORIZATION:-}" && -n "${MEM0_API_KEY:-}" ]]; then
    export MEM0_AUTHORIZATION="Bearer ${MEM0_API_KEY}"
elif [[ "${MEM0_AUTHORIZATION:-}" == Token\ * ]]; then
    export MEM0_AUTHORIZATION="Bearer ${MEM0_AUTHORIZATION#Token }"
fi
bin="${MCP_NODE_PREFIX:-$HOME/.local/share/mcp-node}/node_modules/.bin/mcp-remote"
if [[ -x "$bin" ]]; then
    exec "$bin" "https://mcp.mem0.ai/mcp/" --host 127.0.0.1 --header "Authorization:${MEM0_AUTHORIZATION}"
fi
exec npx -y mcp-remote "https://mcp.mem0.ai/mcp/" --host 127.0.0.1 --header "Authorization:${MEM0_AUTHORIZATION}"
