# Runs a command with the Bitwarden Secrets Manager project's secrets as
# environment variables, like scripts/secrets/run.sh on Linux. The BWS token
# itself is never passed to the command.
# Usage: with-secrets.ps1 <command> [args...]
$ErrorActionPreference = "Stop"
if ($args.Count -eq 0) { Write-Error "Usage: with-secrets.ps1 <command> [args...]"; exit 2 }

$store = Join-Path $env:LOCALAPPDATA "envcross\bws.clixml"
if (-not (Test-Path -LiteralPath $store)) {
    Write-Error "Bitwarden is not configured. Run scripts\windows\secrets-configure.ps1."
    exit 1
}

if (-not $env:BWS_SECRETS_INJECTED) {
    $credential = Import-Clixml -LiteralPath $store
    $env:BWS_ACCESS_TOKEN = ConvertFrom-SecureString -SecureString $credential.Password -AsPlainText
    try {
        $json = bws secret list $credential.UserName --output json
        if ($LASTEXITCODE -ne 0) { Write-Error "Bitwarden secret retrieval failed."; exit 1 }
    } finally {
        Remove-Item Env:BWS_ACCESS_TOKEN -ErrorAction SilentlyContinue
    }
    foreach ($secret in ($json | ConvertFrom-Json)) {
        if ($secret.key -match '^[A-Za-z_][A-Za-z0-9_]*$') {
            Set-Item -LiteralPath "Env:$($secret.key)" -Value $secret.value
        }
    }
    $env:BWS_SECRETS_INJECTED = "1"
}

$command, $rest = $args
& $command @rest
exit $LASTEXITCODE
