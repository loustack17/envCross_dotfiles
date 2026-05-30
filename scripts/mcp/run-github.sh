#!/usr/bin/env bash
set -euo pipefail
source "/home/lou/Documents/WorkFlow/envCross_dotfiles/scripts/mcp/load-secret.sh"
load_mcp_secret GITHUB_PERSONAL_ACCESS_TOKEN
exec docker run -i --rm -e GITHUB_PERSONAL_ACCESS_TOKEN ghcr.io/github/github-mcp-server
