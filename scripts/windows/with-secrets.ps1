# Runs a command with the Bitwarden Secrets Manager project's secrets as
# environment variables, like scripts/secrets/run.sh on Linux. The BWS token
# itself (the BWS_ACCESS_TOKEN user variable) is removed before the command starts.
# Usage: with-secrets.ps1 <command> [args...]
$ErrorActionPreference = "Stop"
if ($args.Count -eq 0) { Write-Error "Usage: with-secrets.ps1 <command> [args...]"; exit 2 }

if (-not $env:BWS_SECRETS_INJECTED) {
    if (-not $env:BWS_ACCESS_TOKEN) {
        Write-Error "BWS_ACCESS_TOKEN is not set. Set it as a user environment variable."
        exit 1
    }
    $json = bws secret list --output json
    if ($LASTEXITCODE -ne 0) { Write-Error "Bitwarden secret retrieval failed."; exit 1 }
    foreach ($secret in ($json | ConvertFrom-Json)) {
        if ($secret.key -match '^[A-Za-z_][A-Za-z0-9_]*$') {
            Set-Item -LiteralPath "Env:$($secret.key)" -Value $secret.value
        }
    }
    $env:BWS_SECRETS_INJECTED = "1"
}
Remove-Item Env:BWS_ACCESS_TOKEN -ErrorAction SilentlyContinue

$command, $rest = $args
& $command @rest
exit $LASTEXITCODE
