Param(
    [switch]$DryRun,
    [switch]$NoBackup
)

# Parse arguments for Unix-style flags
foreach ($arg in $args) {
    if ($arg -eq "--dry-run" -or $arg -eq "-n") {
        $DryRun = $true
    }
    if ($arg -eq "--no-backup") {
        $NoBackup = $true
    }
}

$ErrorActionPreference = "Stop"

# Repo root (folder where this script is located)
$ScriptPath = $MyInvocation.MyCommand.Path
$RepoRoot   = Split-Path -Parent $ScriptPath

$Timestamp  = Get-Date -Format "yyyyMMdd-HHmmss"
$BackupRoot = Join-Path $RepoRoot "backup\$Timestamp"

function Info($msg) {
    Write-Host "[INFO ] $msg"
}

function Warn($msg) {
    Write-Host "[WARN ] $msg" -ForegroundColor Yellow
}

function Backup-IfExists($Path, $Name) {
    if ($NoBackup) { return }

    if (-not (Test-Path $Path)) { return }

    if (-not (Test-Path $BackupRoot)) {
        New-Item -Path $BackupRoot -ItemType Directory | Out-Null
    }

    $SafeName = ($Name -replace '[\\/:*?"<>| ]', '_')
    $Dest     = Join-Path $BackupRoot $SafeName

    if ($DryRun) {
        Info "DryRun: Backup $Path -> $Dest"
        return
    }

    Info "Backup $Name -> $Dest"

    $DestParent = Split-Path $Dest -Parent
    if (-not (Test-Path $DestParent)) {
        New-Item -ItemType Directory -Path $DestParent | Out-Null
    }

    Copy-Item $Path -Destination $Dest -Recurse -Force
}

function Copy-DirectorySafe($Source, $Dest, $Name) {
    if (-not (Test-Path $Source)) {
        Warn "Source not found, skip: $Name ($Source)"
        return
    }

    if ($DryRun) {
        Info "DryRun: Copy $Source -> $Dest"
        return
    }

    if (Test-Path $Dest) {
        Info "Remove old: $Dest"
        Remove-Item -Recurse -Force $Dest
    }

    Info "Install: $Name"
    New-Item -ItemType Directory -Path $Dest -Force | Out-Null
    Copy-Item $Source -Destination $Dest -Recurse -Force
}

function Copy-FileSafe($Source, $Dest, $Name) {
    if (-not (Test-Path $Source)) {
        Warn "Source not found, skip: $Name ($Source)"
        return
    }

    if ($DryRun) {
        Info "DryRun: Copy $Source -> $Dest"
        return
    }

    if (Test-Path $Dest) {
        Backup-IfExists $Dest ($Name + "_file")
        Remove-Item -Force $Dest
    }

    Info "Install: $Name"

    $Parent = Split-Path $Dest -Parent
    if (-not (Test-Path $Parent)) {
        New-Item -ItemType Directory -Path $Parent | Out-Null
    }

    Copy-Item $Source -Destination $Dest -Force
}

Info "Repo: $RepoRoot"
Info "HOME: $env:USERPROFILE"
Info "APPDATA: $env:APPDATA"
Info "LOCALAPPDATA: $env:LOCALAPPDATA"
Write-Host ""

# Backup existing configs
Info "Starting backup..."
Backup-IfExists "$env:APPDATA\nushell" "nushell"
Backup-IfExists "$env:LOCALAPPDATA\nvim" "nvim"
Backup-IfExists "$env:APPDATA\yazi" "yazi"
Backup-IfExists "$env:USERPROFILE\.config\wezterm" "wezterm"
Backup-IfExists "$env:LOCALAPPDATA\lazygit" "lazygit"

if (Test-Path "$env:USERPROFILE\.wezterm.lua") {
    Backup-IfExists "$env:USERPROFILE\.wezterm.lua" "wezterm_lua"
}

Write-Host ""

# Install configs
Info "Installing new configs..."

Copy-DirectorySafe "$RepoRoot\nushell" "$env:APPDATA\nushell" "Nushell"
Copy-DirectorySafe "$RepoRoot\nvim" "$env:LOCALAPPDATA\nvim" "Neovim"
Copy-DirectorySafe "$RepoRoot\yazi" "$env:APPDATA\yazi" "Yazi"
Copy-DirectorySafe "$RepoRoot\wezterm" "$env:USERPROFILE\.config\wezterm" "WezTerm directory"
Copy-DirectorySafe "$RepoRoot\lazygit" "$env:LOCALAPPDATA\lazygit" "Lazygit"

if (Test-Path "$RepoRoot\.wezterm.lua") {
    Copy-FileSafe "$RepoRoot\.wezterm.lua" "$env:USERPROFILE\.wezterm.lua" "WezTerm main config"
}

Write-Host ""
Info "Done."
