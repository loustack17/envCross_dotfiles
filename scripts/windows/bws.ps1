# Runs the bws CLI with the machine token from the DPAPI store, for this one call only.
# Usage: bws.ps1 <bws arguments...>   e.g. bws.ps1 secret list
$ErrorActionPreference = "Stop"
$store = Join-Path $env:LOCALAPPDATA "envcross\bws.clixml"
if (-not (Test-Path -LiteralPath $store)) {
    Write-Error "Bitwarden is not configured. Run scripts\windows\secrets-configure.ps1."
    exit 1
}
$env:BWS_ACCESS_TOKEN = (Import-Clixml -LiteralPath $store).GetNetworkCredential().Password
try {
    & bws @args
    exit $LASTEXITCODE
} finally {
    Remove-Item Env:BWS_ACCESS_TOKEN -ErrorAction SilentlyContinue
}
