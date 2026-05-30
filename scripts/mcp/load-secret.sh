load_mcp_secret() {
    local key="$1"
    local secrets="${MCP_SECRETS_FILE:-$HOME/.config/mcp/secrets.env}"
    local line value
    [[ -f "$secrets" ]] || return 0
    line=$(grep -m1 -E "^[[:space:]]*${key}=" "$secrets" || true)
    [[ -n "$line" ]] || return 0
    value="${line#*=}"
    value="${value%$'\r'}"
    value="${value%\"}"
    value="${value#\"}"
    value="${value%\'}"
    value="${value#\'}"
    export "$key=$value"
}
