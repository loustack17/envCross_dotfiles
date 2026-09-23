#requires -Version 7.0
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$codexArguments = @($args)
$codexExecutable = Join-Path $env:LOCALAPPDATA 'Programs/OpenAI/Codex/bin/codex.exe'

try {
    $release = Invoke-RestMethod -Uri 'https://releases.openai.com/codex/channels/latest' -TimeoutSec 30
    $latest = $release.tag_name -replace '^rust-v', ''
    if ($latest -cnotmatch '^\d+\.\d+\.\d+$') {
        throw 'The official stable release metadata has an unexpected version.'
    }
    $installed = if (Test-Path -LiteralPath $codexExecutable) {
        & $codexExecutable --version
        if ($LASTEXITCODE -ne 0) { throw 'Installed Codex failed its version check.' }
    } else { '' }
    if ($installed.Trim() -ne "codex-cli $latest") {
        [Console]::Error.WriteLine("Updating standalone Codex to $latest...")
        $env:CODEX_NON_INTERACTIVE = '1'
        $env:CODEX_INSTALL_DIR = Split-Path -Parent $codexExecutable
        $installer = Invoke-RestMethod -Uri 'https://chatgpt.com/codex/install.ps1' -TimeoutSec 30
        & ([scriptblock]::Create($installer)) -Release $latest *>&1 |
            ForEach-Object { [Console]::Error.WriteLine($_.ToString()) }
        $installed = & $codexExecutable --version
        if ($LASTEXITCODE -ne 0 -or $installed.Trim() -ne "codex-cli $latest") {
            throw 'Codex did not report the expected version after updating.'
        }
    }
} catch {
    [Console]::Error.WriteLine("Codex was not started: latest-version verification/update failed. $($_.Exception.Message)")
    exit 1
}

$configBuilder = Join-Path $PSScriptRoot '../codex-cli-overrides.py'
$builderArguments = @($configBuilder, '--home', $env:USERPROFILE)
for ($i = 0; $i -lt $codexArguments.Count; $i++) {
    if ($codexArguments[$i] -in @('--profile', '-p') -and $i + 1 -lt $codexArguments.Count) {
        $builderArguments += @('--profile', $codexArguments[$i + 1])
    } elseif ($codexArguments[$i] -like '--profile=*') {
        $builderArguments += @('--profile', $codexArguments[$i].Substring(10))
    }
}
try {
    $configJson = & python @builderArguments
    if ($LASTEXITCODE -ne 0) { throw 'Repository configuration could not be resolved.' }
    $configArguments = @($configJson | ConvertFrom-Json)
} catch {
    [Console]::Error.WriteLine("Codex was not started: $($_.Exception.Message)")
    exit 1
}
& $codexExecutable @configArguments @codexArguments
exit $LASTEXITCODE
