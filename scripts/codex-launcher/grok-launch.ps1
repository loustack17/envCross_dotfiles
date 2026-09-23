#requires -Version 7.0
$ErrorActionPreference = 'Stop'
$grokArguments = @($args)
$syncScript = Join-Path $PSScriptRoot '../sync-grok-cli.py'
& python $syncScript --home $env:USERPROFILE
if ($LASTEXITCODE -ne 0) {
    [Console]::Error.WriteLine('Grok was not started: repository configuration sync failed.')
    exit 1
}
& (Join-Path $env:USERPROFILE '.grok/bin/grok.exe') @grokArguments
exit $LASTEXITCODE
