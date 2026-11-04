[CmdletBinding()]
param(
    [switch]$FromEnvironment,
    [string]$ProjectId
)

# Stores the Bitwarden Secrets Manager machine token and project ID with DPAPI
# (readable only by this Windows user). -FromEnvironment migrates a plaintext
# BWS_ACCESS_TOKEN user environment variable and then removes it.
$ErrorActionPreference = "Stop"
$store = Join-Path $env:LOCALAPPDATA "envcross\bws.clixml"

if (-not (Get-Command bws -ErrorAction SilentlyContinue)) {
    throw "bws is not installed. Run: scoop install bitwarden-secrets-manager-cli"
}

if ($FromEnvironment) {
    $plain = [Environment]::GetEnvironmentVariable("BWS_ACCESS_TOKEN", "User")
    if (-not $plain) { throw "No BWS_ACCESS_TOKEN user environment variable to migrate." }
    $token = ConvertTo-SecureString $plain -AsPlainText -Force
} else {
    $token = Read-Host "Bitwarden machine access token" -AsSecureString
}

$env:BWS_ACCESS_TOKEN = [Net.NetworkCredential]::new("", $token).Password
try {
    if (-not $ProjectId -and -not $FromEnvironment) {
        $ProjectId = Read-Host "Bitwarden project ID (blank to auto-detect)"
    }
    if (-not $projectId) {
        $projects = @(bws project list --output json | ConvertFrom-Json)
        if ($LASTEXITCODE -ne 0) { throw "bws could not list projects with this token." }
        if ($projects.Count -ne 1) { throw "The token can read $($projects.Count) projects; enter the project ID explicitly." }
        $projectId = $projects[0].id
    }
    bws project get $projectId --output none
    if ($LASTEXITCODE -ne 0) { throw "bws could not read project $projectId with this token." }
} finally {
    Remove-Item Env:BWS_ACCESS_TOKEN -ErrorAction SilentlyContinue
}

New-Item -ItemType Directory -Force -Path (Split-Path $store) | Out-Null
[pscredential]::new($projectId, $token) | Export-Clixml -LiteralPath $store
if ($FromEnvironment) {
    [Environment]::SetEnvironmentVariable("BWS_ACCESS_TOKEN", $null, "User")
    Write-Host "Removed the plaintext BWS_ACCESS_TOKEN user environment variable."
}
Write-Host "Bitwarden Secrets Manager configured for project $projectId."
