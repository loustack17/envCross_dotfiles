[CmdletBinding()]
param(
    [switch]$Force,
    [switch]$DryRun
)

# Installs a pinned, checksum-verified Moli release for the shared moli-* skills.
# To upgrade: bump $Version and both hashes (also in install-moli.sh).
$ErrorActionPreference = "Stop"
$Version = "v1.1.21"
$Hashes = @{
    "x86_64-pc-windows-msvc"  = "b0276f850af4d8ce62ea2eea68c018b0292b3abc424d7612c8e96ec19c6009c3"
    "aarch64-pc-windows-msvc" = "1cbc551323fc59ae8c7a3ffe97aea8d2b4e04f91d74464729ac7649786ee20e0"
}

$architecture = [System.Runtime.InteropServices.RuntimeInformation]::OSArchitecture.ToString()
$target = switch ($architecture) {
    "X64" { "x86_64-pc-windows-msvc" }
    "Arm64" { "aarch64-pc-windows-msvc" }
    default { throw "Unsupported Windows architecture: $architecture" }
}
$installDir = Join-Path $env:LOCALAPPDATA "Moli\bin"
$exe = Join-Path $installDir "moli.exe"

function Add-UserPath([string]$Dir) {
    $current = [Environment]::GetEnvironmentVariable("Path", "User")
    $entries = @($current -split ";" | Where-Object { $_ })
    if ($entries -notcontains $Dir) {
        [Environment]::SetEnvironmentVariable("Path", (($entries + $Dir) -join ";"), "User")
        Write-Host "Added $Dir to user PATH (open a new shell to pick it up)"
    }
}

if ((Test-Path -LiteralPath $exe) -and -not $Force) {
    $installed = (& $exe --version 2>$null) -replace "^moli\s+", "v"
    if ($installed -eq $Version) {
        Write-Host "Moli: $Version already installed"
        if (-not $DryRun) { Add-UserPath $installDir }
        exit 0
    }
}
if ($DryRun) {
    Write-Host "Would install: Moli $Version ($target) to $exe"
    exit 0
}

$asset = "moli-$target.zip"
$url = "https://github.com/lexmount/moli/releases/download/$Version/$asset"
$tempDir = Join-Path ([IO.Path]::GetTempPath()) ("moli-install-" + [Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $tempDir | Out-Null
try {
    $archive = Join-Path $tempDir $asset
    Write-Host "Downloading $url"
    Invoke-WebRequest -UseBasicParsing -Uri $url -OutFile $archive
    $actual = (Get-FileHash -Algorithm SHA256 -LiteralPath $archive).Hash.ToLowerInvariant()
    if ($actual -ne $Hashes[$target]) {
        throw "Checksum mismatch for ${asset}: expected $($Hashes[$target]), got $actual"
    }
    $extract = Join-Path $tempDir "package"
    Expand-Archive -LiteralPath $archive -DestinationPath $extract
    $source = Join-Path $extract "moli-$Version-$target\moli.exe"
    if (-not (Test-Path -LiteralPath $source)) { throw "moli.exe not found in $asset" }
    New-Item -ItemType Directory -Force -Path $installDir | Out-Null
    Copy-Item -LiteralPath $source -Destination $exe -Force
    Add-UserPath $installDir
    Write-Host "Installed $(& $exe --version) to $exe"
} finally {
    Remove-Item -LiteralPath $tempDir -Recurse -Force -ErrorAction SilentlyContinue
}
