[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$SourceHistory,
    [Parameter(Mandatory = $true)]
    [string]$ConfigPath,
    [Parameter(Mandatory = $true)]
    [int]$InstallerPid,
    [string]$BoundaryPath = "D:\ProgramData",
    [string]$NuPath = "",
    [string]$TransactionId = "",
    [switch]$RemoveSource,
    [switch]$TestBoundary,
    [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Add-Type -TypeDefinition @'
using System;
using System.ComponentModel;
using System.IO;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using Microsoft.Win32.SafeHandles;

public sealed class EnvCrossFileRecord
{
    public uint Attributes;
    public uint Links;
    public long Length;
    public uint VolumeSerial;
    public ulong FileIndex;
    public string Hash;
}

public static class EnvCrossNative
{
    public const uint GenericRead = 0x80000000;
    public const uint GenericWrite = 0x40000000;
    public const uint Delete = 0x00010000;
    public const uint FileShareRead = 0x00000001;
    public const uint FileShareWrite = 0x00000002;
    public const uint FileShareDelete = 0x00000004;
    public const uint OpenExisting = 3;
    public const uint CreateNew = 1;
    public const uint FileFlagBackupSemantics = 0x02000000;
    public const uint FileFlagOpenReparsePoint = 0x00200000;
    public const uint MoveFileWriteThrough = 0x00000008;
    public const uint ReplaceFileWriteThrough = 0x00000001;
    public const uint InvalidFileAttributes = 0xFFFFFFFF;

    [StructLayout(LayoutKind.Sequential)]
    private struct ByHandleFileInformation
    {
        public uint FileAttributes;
        public System.Runtime.InteropServices.ComTypes.FILETIME CreationTime;
        public System.Runtime.InteropServices.ComTypes.FILETIME LastAccessTime;
        public System.Runtime.InteropServices.ComTypes.FILETIME LastWriteTime;
        public uint VolumeSerialNumber;
        public uint FileSizeHigh;
        public uint FileSizeLow;
        public uint NumberOfLinks;
        public uint FileIndexHigh;
        public uint FileIndexLow;
    }

    [StructLayout(LayoutKind.Sequential)]
    private struct FileDispositionInfo
    {
        [MarshalAs(UnmanagedType.Bool)]
        public bool DeleteFile;
    }

    [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    private static extern SafeFileHandle CreateFile(
        string name,
        uint access,
        uint share,
        IntPtr security,
        uint creation,
        uint flags,
        IntPtr template);

    [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    private static extern uint GetFileAttributes(string name);

    [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    private static extern bool CreateDirectory(string name, IntPtr security);

    [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    private static extern bool MoveFileEx(string existing, string replacement, uint flags);

    [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    private static extern bool ReplaceFile(
        string replaced,
        string replacement,
        string backup,
        uint flags,
        IntPtr exclude,
        IntPtr reserved);

    [DllImport("kernel32.dll", SetLastError = true)]
    private static extern bool GetFileInformationByHandle(
        SafeFileHandle handle,
        out ByHandleFileInformation information);

    [DllImport("kernel32.dll", SetLastError = true)]
    private static extern bool SetFileInformationByHandle(
        SafeFileHandle handle,
        int informationClass,
        IntPtr information,
        uint size);

    [DllImport("kernel32.dll", SetLastError = true)]
    private static extern bool FlushFileBuffers(SafeFileHandle handle);

    [DllImport("kernel32.dll", SetLastError = true)]
    private static extern bool SetFilePointerEx(
        SafeFileHandle handle,
        long distance,
        out long result,
        uint method);

    [DllImport("kernel32.dll", SetLastError = true)]
    private static extern bool ReadFile(
        SafeFileHandle handle,
        [Out] byte[] buffer,
        uint count,
        out uint read,
        IntPtr overlapped);

    [DllImport("kernel32.dll", SetLastError = true)]
    private static extern bool WriteFile(
        SafeFileHandle handle,
        [In] byte[] buffer,
        uint count,
        out uint written,
        IntPtr overlapped);

    private static Exception LastError(string operation)
    {
        int error = Marshal.GetLastWin32Error();
        return new Win32Exception(error, operation + " (" + error + ")");
    }

    public static uint Attributes(string path)
    {
        return GetFileAttributes(path);
    }

    public static void CreateDirectoryChecked(string path)
    {
        if (!CreateDirectory(path, IntPtr.Zero))
        {
            throw LastError("CreateDirectory");
        }
    }

    public static SafeFileHandle Open(string path, uint access, uint share, uint creation, uint flags)
    {
        SafeFileHandle handle = CreateFile(path, access, share, IntPtr.Zero, creation, flags, IntPtr.Zero);
        if (handle.IsInvalid)
        {
            handle.Dispose();
            throw LastError("CreateFile");
        }
        return handle;
    }

    public static void Move(string source, string destination)
    {
        if (!MoveFileEx(source, destination, MoveFileWriteThrough))
        {
            throw LastError("MoveFileEx");
        }
    }

    public static void Replace(string destination, string replacement, string backup)
    {
        if (!ReplaceFile(destination, replacement, backup, ReplaceFileWriteThrough, IntPtr.Zero, IntPtr.Zero))
        {
            throw LastError("ReplaceFile");
        }
    }

    private static ByHandleFileInformation GetInformation(SafeFileHandle handle)
    {
        ByHandleFileInformation information;
        if (!GetFileInformationByHandle(handle, out information))
        {
            throw LastError("GetFileInformationByHandle");
        }
        return information;
    }

    private static string HashHandle(SafeFileHandle handle)
    {
        long ignored;
        if (!SetFilePointerEx(handle, 0, out ignored, 0))
        {
            throw LastError("SetFilePointerEx");
        }
        using (SHA256 sha = SHA256.Create())
        {
            byte[] buffer = new byte[65536];
            while (true)
            {
                uint read;
                if (!ReadFile(handle, buffer, (uint)buffer.Length, out read, IntPtr.Zero))
                {
                    throw LastError("ReadFile");
                }
                if (read == 0)
                {
                    break;
                }
                sha.TransformBlock(buffer, 0, (int)read, buffer, 0);
            }
            sha.TransformFinalBlock(new byte[0], 0, 0);
            if (!SetFilePointerEx(handle, 0, out ignored, 0))
            {
                throw LastError("SetFilePointerEx");
            }
            return BitConverter.ToString(sha.Hash).Replace("-", "");
        }
    }

    public static EnvCrossFileRecord Record(SafeFileHandle handle, bool hash)
    {
        ByHandleFileInformation information = GetInformation(handle);
        EnvCrossFileRecord record = new EnvCrossFileRecord();
        record.Attributes = information.FileAttributes;
        record.Links = information.NumberOfLinks;
        record.Length = ((long)information.FileSizeHigh << 32) | information.FileSizeLow;
        record.VolumeSerial = information.VolumeSerialNumber;
        record.FileIndex = ((ulong)information.FileIndexHigh << 32) | information.FileIndexLow;
        record.Hash = hash ? HashHandle(handle) : "";
        return record;
    }

    public static EnvCrossFileRecord HashPath(string path)
    {
        using (SafeFileHandle handle = Open(path, GenericRead | Delete, FileShareRead, OpenExisting, FileFlagOpenReparsePoint))
        {
            return Record(handle, true);
        }
    }

    public static EnvCrossFileRecord CopyNew(SafeFileHandle source, string destination)
    {
        using (SafeFileHandle target = Open(destination, GenericRead | GenericWrite, 0, CreateNew, FileFlagOpenReparsePoint))
        {
            long ignored;
            if (!SetFilePointerEx(source, 0, out ignored, 0))
            {
                throw LastError("SetFilePointerEx");
            }
            byte[] buffer = new byte[65536];
            while (true)
            {
                uint read;
                if (!ReadFile(source, buffer, (uint)buffer.Length, out read, IntPtr.Zero))
                {
                    throw LastError("ReadFile");
                }
                if (read == 0)
                {
                    break;
                }
                uint written;
                if (!WriteFile(target, buffer, read, out written, IntPtr.Zero))
                {
                    throw LastError("WriteFile");
                }
                if (written != read)
                {
                    throw new IOException("WriteFile wrote a partial buffer");
                }
            }
            if (!FlushFileBuffers(target))
            {
                throw LastError("FlushFileBuffers");
            }
            return Record(target, false);
        }
    }

    public static EnvCrossFileRecord WriteNew(string destination, byte[] data)
    {
        using (SafeFileHandle target = Open(destination, GenericRead | GenericWrite, 0, CreateNew, FileFlagOpenReparsePoint))
        {
            uint offset = 0;
            while (offset < data.Length)
            {
                int remaining = data.Length - (int)offset;
                byte[] chunk = new byte[remaining];
                Buffer.BlockCopy(data, (int)offset, chunk, 0, remaining);
                uint written;
                if (!WriteFile(target, chunk, (uint)remaining, out written, IntPtr.Zero))
                {
                    throw LastError("WriteFile");
                }
                if (written == 0)
                {
                    throw new IOException("WriteFile wrote no bytes");
                }
                offset += written;
            }
            if (!FlushFileBuffers(target))
            {
                throw LastError("FlushFileBuffers");
            }
            return Record(target, false);
        }
    }

    public static void Flush(SafeFileHandle handle)
    {
        if (!FlushFileBuffers(handle))
        {
            throw LastError("FlushFileBuffers");
        }
    }

    public static void DeleteByHandle(SafeFileHandle handle)
    {
        FileDispositionInfo information = new FileDispositionInfo();
        information.DeleteFile = true;
        IntPtr buffer = Marshal.AllocHGlobal(Marshal.SizeOf(typeof(FileDispositionInfo)));
        try
        {
            Marshal.StructureToPtr(information, buffer, false);
            if (!SetFileInformationByHandle(handle, 4, buffer, (uint)Marshal.SizeOf(typeof(FileDispositionInfo))))
            {
                throw LastError("SetFileInformationByHandle");
            }
        }
        finally
        {
            Marshal.FreeHGlobal(buffer);
        }
    }
}
'@

$directoryHandles = New-Object 'System.Collections.Generic.List[Microsoft.Win32.SafeHandles.SafeFileHandle]'
$sourceHandle = $null
$configChanged = $false
$configStage = $null
$configRollback = $null
$configRollbackRecord = $null
$stagedConfigRecord = $null
$historyDestination = $null
$sourceHash = $null

function Throw-Failure([string]$message) {
    throw $message
}

function Get-SidValue([object]$identity) {
    if ($identity -is [System.Security.Principal.SecurityIdentifier]) {
        return $identity.Value
    }
    if ($identity -is [string]) {
        try {
            return ([System.Security.Principal.NTAccount]$identity).Translate([System.Security.Principal.SecurityIdentifier]).Value
        } catch {
            return [string]$identity
        }
    }
    try {
        return $identity.Translate([System.Security.Principal.SecurityIdentifier]).Value
    } catch {
        return [string]$identity.Value
    }
}

function Get-CurrentSid {
    return [System.Security.Principal.WindowsIdentity]::GetCurrent().User.Value
}

function Get-BytesHash([byte[]]$bytes) {
    $sha = [Security.Cryptography.SHA256]::Create()
    try {
        return [BitConverter]::ToString($sha.ComputeHash($bytes)).Replace("-", "")
    } finally {
        $sha.Dispose()
    }
}

function Test-Exists([string]$path) {
    return [EnvCrossNative]::Attributes($path) -ne [EnvCrossNative]::InvalidFileAttributes
}

function Test-Reparse([uint32]$attributes) {
    return (($attributes -band 0x400) -ne 0)
}

function Open-File([string]$path) {
    return [EnvCrossNative]::Open(
        $path,
        [EnvCrossNative]::GenericRead -bor [EnvCrossNative]::Delete,
        [EnvCrossNative]::FileShareRead,
        [EnvCrossNative]::OpenExisting,
        [EnvCrossNative]::FileFlagOpenReparsePoint)
}

function Open-Directory([string]$path) {
    return [EnvCrossNative]::Open(
        $path,
        [EnvCrossNative]::GenericRead,
        [EnvCrossNative]::FileShareRead -bor [EnvCrossNative]::FileShareWrite -bor [EnvCrossNative]::FileShareDelete,
        [EnvCrossNative]::OpenExisting,
        [EnvCrossNative]::FileFlagBackupSemantics -bor [EnvCrossNative]::FileFlagOpenReparsePoint)
}

function Open-FlushFile([string]$path) {
    return [EnvCrossNative]::Open(
        $path,
        [EnvCrossNative]::GenericRead -bor [EnvCrossNative]::GenericWrite,
        [EnvCrossNative]::FileShareRead,
        [EnvCrossNative]::OpenExisting,
        [EnvCrossNative]::FileFlagOpenReparsePoint)
}

function Flush-File([string]$path) {
    $handle = Open-FlushFile $path
    try { [EnvCrossNative]::Flush($handle) } finally { $handle.Dispose() }
}

function Get-FileSecurity([string]$path) {
    return Get-Acl -LiteralPath $path
}

function Get-DirectorySecurity([string]$path) {
    return Get-Acl -LiteralPath $path
}

function Set-DirectorySecurity([string]$path, [System.Security.AccessControl.DirectorySecurity]$security) {
    Set-Acl -LiteralPath $path -AclObject $security
}

function Set-FileSecurity([string]$path, [System.Security.AccessControl.FileSecurity]$security) {
    Set-Acl -LiteralPath $path -AclObject $security
}

function New-ProtectedDirectorySecurity([string]$sid) {
    $security = [System.Security.AccessControl.DirectorySecurity]::new()
    $security.SetAccessRuleProtection($true, $false)
    $security.SetOwner([System.Security.Principal.SecurityIdentifier]::new($sid))
    $inheritance = [System.Security.AccessControl.InheritanceFlags]::ContainerInherit -bor [System.Security.AccessControl.InheritanceFlags]::ObjectInherit
    foreach ($principal in @($sid, "S-1-5-18", "S-1-5-32-544")) {
        $rule = [System.Security.AccessControl.FileSystemAccessRule]::new(
            [System.Security.Principal.SecurityIdentifier]::new($principal),
            [System.Security.AccessControl.FileSystemRights]::FullControl,
            $inheritance,
            [System.Security.AccessControl.PropagationFlags]::None,
            [System.Security.AccessControl.AccessControlType]::Allow)
        $security.AddAccessRule($rule)
    }
    return $security
}

function New-ProtectedFileSecurity([string]$sid) {
    $security = [System.Security.AccessControl.FileSecurity]::new()
    $security.SetAccessRuleProtection($true, $false)
    $security.SetOwner([System.Security.Principal.SecurityIdentifier]::new($sid))
    foreach ($principal in @($sid, "S-1-5-18", "S-1-5-32-544")) {
        $rule = [System.Security.AccessControl.FileSystemAccessRule]::new(
            [System.Security.Principal.SecurityIdentifier]::new($principal),
            [System.Security.AccessControl.FileSystemRights]::FullControl,
            [System.Security.AccessControl.AccessControlType]::Allow)
        $security.AddAccessRule($rule)
    }
    return $security
}

function Get-AclRules($security) {
    return @($security.GetAccessRules($true, $true, [System.Security.Principal.SecurityIdentifier]))
}

function Get-RuleAccessMask($rule) {
    $accessMask = $rule.PSObject.Properties["AccessMask"]
    if ($null -ne $accessMask) {
        return [int64]$rule.AccessMask
    }
    return [int64]$rule.FileSystemRights
}

function Convert-GenericMask([int64]$accessMask) {
    [uint32]$mask = [uint32]$accessMask
    [uint32]$specific = $mask -band 0x0FFFFFFF
    if (($mask -band 0x10000000) -ne 0) { $specific = $specific -bor 0x001F01FF }
    if (($mask -band 0x80000000) -ne 0) { $specific = $specific -bor 0x00120089 }
    if (($mask -band 0x40000000) -ne 0) { $specific = $specific -bor 0x00120116 }
    if (($mask -band 0x20000000) -ne 0) { $specific = $specific -bor 0x001200A0 }
    return $specific
}

function Test-DangerousMask([int64]$accessMask) {
    [uint32]$mask = Convert-GenericMask $accessMask
    if (($mask -band 0x00010000) -ne 0) { return $true }
    if (($mask -band 0x00000040) -ne 0) { return $true }
    if (($mask -band 0x00040000) -ne 0) { return $true }
    if (($mask -band 0x00080000) -ne 0) { return $true }
    if (($mask -band 0x000301BF) -eq 0x000301BF) { return $true }
    if (($mask -band 0x001F01FF) -eq 0x001F01FF) { return $true }
    return $false
}

function Assert-BoundaryAcl([string]$path, [string]$currentSid, [string]$expectedOwnerSid) {
    $security = Get-DirectorySecurity $path
    if (-not $security.AreAccessRulesProtected) {
        Throw-Failure "Boundary ACL is inheriting: $path"
    }
    if ((Get-SidValue $security.Owner) -ne $expectedOwnerSid) {
        Throw-Failure "Boundary owner is not expected: $path"
    }
    $allowed = @($currentSid, "S-1-5-18", "S-1-5-32-544")
    foreach ($rule in (Get-AclRules $security)) {
        if ($rule.AccessControlType -ne [System.Security.AccessControl.AccessControlType]::Allow) {
            continue
        }
        if (-not (Test-DangerousMask (Get-RuleAccessMask $rule))) {
            continue
        }
        $sid = Get-SidValue $rule.IdentityReference
        $inheritOnly = (($rule.PropagationFlags -band [System.Security.AccessControl.PropagationFlags]::InheritOnly) -ne 0)
        if ($sid -eq "S-1-3-0" -and $inheritOnly) {
            continue
        }
        if ($sid -notin $allowed) {
            Throw-Failure "Boundary ACL grants dangerous rights to ${sid}: $path"
        }
    }
}

function Assert-ManagedAcl([string]$path, [string]$currentSid, [bool]$directory) {
    $security = if ($directory) { Get-DirectorySecurity $path } else { Get-FileSecurity $path }
    if (-not $security.AreAccessRulesProtected) {
        Throw-Failure "Managed ACL is inheriting: $path"
    }
    $expected = @($currentSid, "S-1-5-18", "S-1-5-32-544")
    $seen = @{}
    foreach ($rule in (Get-AclRules $security)) {
        $sid = Get-SidValue $rule.IdentityReference
        if ($rule.AccessControlType -ne [System.Security.AccessControl.AccessControlType]::Allow -or $rule.IsInherited -or $sid -notin $expected) {
            Throw-Failure "Managed ACL contains an unexpected rule: $path"
        }
        if ((Convert-GenericMask (Get-RuleAccessMask $rule)) -ne 0x001F01FF) {
            Throw-Failure "Managed ACL does not grant full control: $path"
        }
        if ($seen.ContainsKey($sid)) {
            Throw-Failure "Managed ACL contains duplicate rules: $path"
        }
        $seen[$sid] = $true
    }
    foreach ($sid in $expected) {
        if (-not $seen.ContainsKey($sid)) {
            Throw-Failure "Managed ACL is missing ${sid}: $path"
        }
    }
}

function Assert-Owner([string]$path, [string]$sid, [bool]$directory) {
    $security = if ($directory) { Get-DirectorySecurity $path } else { Get-FileSecurity $path }
    if ((Get-SidValue $security.Owner) -ne $sid) {
        Throw-Failure "Foreign owner: $path"
    }
}

function Assert-TrustedSourceOwner([string]$path, [string]$currentSid) {
    $owner = Get-SidValue (Get-FileSecurity $path).Owner
    if ($owner -notin @($currentSid, "S-1-5-18", "S-1-5-32-544")) {
        Throw-Failure "Untrusted repository history owner: $path"
    }
}

function Ensure-DirectoryComponent([string]$path, [string]$sid, [bool]$boundary, [string]$boundaryOwnerSid = "S-1-5-18") {
    $created = $false
    if (-not (Test-Exists $path)) {
        [EnvCrossNative]::CreateDirectoryChecked($path)
        $created = $true
    }
    $attributes = [EnvCrossNative]::Attributes($path)
    if ($attributes -eq [EnvCrossNative]::InvalidFileAttributes -or (Test-Reparse $attributes) -or (($attributes -band 0x10) -eq 0)) {
        Throw-Failure "Unsafe directory component: $path"
    }
    $handle = Open-Directory $path
    $script:directoryHandles.Add($handle)
    if ($boundary) {
        Assert-BoundaryAcl $path $sid $boundaryOwnerSid
    } else {
        if ($created) {
            Set-DirectorySecurity $path (New-ProtectedDirectorySecurity $sid)
        } else {
            Assert-Owner $path $sid $true
        }
        Assert-ManagedAcl $path $sid $true
    }
    return $handle
}

function Get-PathRecord([string]$path, [bool]$hash) {
    $handle = Open-File $path
    try {
        return [EnvCrossNative]::Record($handle, $hash)
    } finally {
        $handle.Dispose()
    }
}

function Assert-SafeHistoryFile([string]$path, [string]$sid) {
    $attributes = [EnvCrossNative]::Attributes($path)
    if ($attributes -eq [EnvCrossNative]::InvalidFileAttributes -or (Test-Reparse $attributes) -or (($attributes -band 0x10) -ne 0)) {
        Throw-Failure "Unsafe history destination: $path"
    }
    $record = Get-PathRecord $path $true
    if ($record.Links -ne 1) {
        Throw-Failure "History destination is hardlinked: $path"
    }
    Assert-Owner $path $sid $false
    Assert-ManagedAcl $path $sid $false
    return $record
}

function Set-StageFileAcl([string]$path, [string]$sid) {
    Set-FileSecurity $path (New-ProtectedFileSecurity $sid)
    Flush-File $path
}

function Remove-PathByRecord([string]$path, $expected) {
    if ($env:ENVCROSS_DOTFILES_TEST_FAIL_ROLLBACK_REMOVAL -eq "1" -and $path.EndsWith(".rollback", [StringComparison]::OrdinalIgnoreCase)) {
        Throw-Failure "Injected rollback removal failure"
    }
    $handle = Open-File $path
    try {
        $verifyHash = -not [string]::IsNullOrWhiteSpace([string]$expected.Hash)
        $actual = [EnvCrossNative]::Record($handle, $verifyHash)
        if ($actual.VolumeSerial -ne $expected.VolumeSerial -or $actual.FileIndex -ne $expected.FileIndex -or $actual.Length -ne $expected.Length -or ($verifyHash -and $actual.Hash -ne $expected.Hash)) {
            Throw-Failure "Path identity changed: $path"
        }
        [EnvCrossNative]::DeleteByHandle($handle)
    } finally {
        $handle.Dispose()
    }
}

function Assert-NuProcesses([int[]]$allowed) {
    $unexpected = @(
        [System.Diagnostics.Process]::GetProcessesByName("nu") |
            Where-Object { $_.Id -notin $allowed }
    )
    if ($unexpected.Count -gt 0) {
        $ids = ($unexpected | ForEach-Object Id) -join ","
        $unexpected | ForEach-Object { $_.Dispose() }
        Throw-Failure "Refusing migration while other Nushell processes are active: $ids"
    }
}

function Get-InstallerNuProcessIds([int]$installerPid, [string]$nuPath, [bool]$testBoundary) {
    $allowed = New-Object 'System.Collections.Generic.List[int]'
    $allowed.Add($installerPid)
    try {
        $current = Get-CimInstance Win32_Process -Filter "ProcessId = $installerPid" -ErrorAction Stop
    } catch {
        if ($testBoundary) { return [int[]]$allowed.ToArray() }
        throw
    }
    $resolvedNuPath = [IO.Path]::GetFullPath($nuPath)
    if (-not $testBoundary -and -not [StringComparer]::OrdinalIgnoreCase.Equals([IO.Path]::GetFullPath([string]$current.ExecutablePath), $resolvedNuPath)) {
        Throw-Failure "Installer PID is not the expected Nushell executable"
    }
    $marker = "\apps\nu\"
    $markerIndex = $resolvedNuPath.IndexOf($marker, [StringComparison]::OrdinalIgnoreCase)
    if ($markerIndex -ge 0 -and [int]$current.ParentProcessId -gt 0) {
        $expectedShim = Join-Path $resolvedNuPath.Substring(0, $markerIndex) "shims\nu.exe"
        $parentId = [int]$current.ParentProcessId
        $parent = Get-CimInstance Win32_Process -Filter "ProcessId = $parentId" -ErrorAction SilentlyContinue
        if ($null -ne $parent -and [StringComparer]::OrdinalIgnoreCase.Equals([IO.Path]::GetFullPath([string]$parent.ExecutablePath), [IO.Path]::GetFullPath($expectedShim))) {
            $allowed.Add($parentId)
        }
    }
    return [int[]]$allowed.ToArray()
}

function Quote-ProcessArgument([string]$value) {
    return '"' + ($value -replace '(\\*)"', '$1$1\"' -replace '(\\+)$', '$1$1') + '"'
}

function Invoke-NuVerifier([string]$config, [string]$expected, [int[]]$installerPids, [string]$nuPath, [string]$workingDirectory, [string]$stateRoot) {
    if ($env:ENVCROSS_DOTFILES_TEST_FAIL_VERIFICATION -eq "1") {
        Throw-Failure "Injected Nushell verification failure"
    }
    $start = New-Object System.Diagnostics.ProcessStartInfo
    $start.FileName = $nuPath
    $start.Arguments = "--no-history --config $(Quote-ProcessArgument $config) -c $(Quote-ProcessArgument '$nu.history-path')"
    $start.WorkingDirectory = $workingDirectory
    $start.UseShellExecute = $false
    $start.CreateNoWindow = $true
    $start.RedirectStandardOutput = $true
    $start.RedirectStandardError = $true
    $start.EnvironmentVariables["ENVCROSS_STATE_ROOT"] = $stateRoot
    $process = New-Object System.Diagnostics.Process
    $process.StartInfo = $start
    if (-not $process.Start()) {
        Throw-Failure "Failed to start Nushell verifier"
    }
    try {
        $verifierPid = $process.Id
        Assert-NuProcesses @($installerPids + $verifierPid)
        $stdout = $process.StandardOutput.ReadToEnd()
        $stderr = $process.StandardError.ReadToEnd()
        $process.WaitForExit()
        if ($process.ExitCode -ne 0) {
            Throw-Failure "Nushell verifier failed: $stderr"
        }
        $reported = @($stdout -split "`r?`n" | Where-Object { $_.Trim().Length -gt 0 } | ForEach-Object { $_.Trim() } | Select-Object -Last 1)
        if ($reported.Count -ne 1 -or [StringComparer]::OrdinalIgnoreCase.Equals([IO.Path]::GetFullPath($reported[0]), [IO.Path]::GetFullPath($expected)) -eq $false) {
            Throw-Failure "Nushell reported an unexpected history path: $stdout"
        }
    } finally {
        $process.Dispose()
    }
    Assert-NuProcesses $installerPids
}

function Restore-Config([string]$path, [string]$stage, [string]$rollback, $stagedRecord, $rollbackRecord) {
    $current = Get-PathRecord $path $true
    if ($current.VolumeSerial -ne $stagedRecord.VolumeSerial -or $current.FileIndex -ne $stagedRecord.FileIndex -or $current.Length -ne $stagedRecord.Length -or $current.Hash -ne $stagedRecord.Hash) {
        Throw-Failure "Refusing config rollback after an unexpected replacement: $path"
    }
    if (Test-Exists $stage) {
        Throw-Failure "Config rollback staging path is occupied: $stage"
    }
    [EnvCrossNative]::Replace($path, $rollback, $stage)
    $restored = Get-PathRecord $path $true
    if ($restored.VolumeSerial -ne $rollbackRecord.VolumeSerial -or $restored.FileIndex -ne $rollbackRecord.FileIndex -or $restored.Length -ne $rollbackRecord.Length -or $restored.Hash -ne $rollbackRecord.Hash) {
        Throw-Failure "Config rollback identity verification failed: $path"
    }
    Remove-PathByRecord $stage $stagedRecord
}

try {
    if ([string]::IsNullOrWhiteSpace($BoundaryPath)) {
        Throw-Failure "Windows state boundary is missing"
    }
    if ([string]::IsNullOrWhiteSpace($TransactionId)) {
        $TransactionId = [Guid]::NewGuid().ToString()
    }
    if ($DryRun) {
        Write-Output "Dry run: no Nushell history state changed"
        exit 0
    }

    $currentSid = Get-CurrentSid
    if ([string]::IsNullOrWhiteSpace($NuPath)) {
        $nuCommand = Get-Command nu.exe -ErrorAction Stop
        $NuPath = $nuCommand.Source
    }
    $allowedNuPids = Get-InstallerNuProcessIds $InstallerPid $NuPath ([bool]$TestBoundary)
    Assert-NuProcesses $allowedNuPids

    $boundaryAttributes = [EnvCrossNative]::Attributes($BoundaryPath)
    if ($boundaryAttributes -eq [EnvCrossNative]::InvalidFileAttributes -or (Test-Reparse $boundaryAttributes) -or (($boundaryAttributes -band 0x10) -eq 0)) {
        Throw-Failure "Windows state boundary is not a real directory: $BoundaryPath"
    }
    $boundaryOwnerSid = "S-1-5-18"
    $liveBoundary = [IO.Path]::GetFullPath("D:\ProgramData").TrimEnd("\")
    $resolvedBoundary = [IO.Path]::GetFullPath($BoundaryPath).TrimEnd("\")
    if ($TestBoundary) {
        if ([StringComparer]::OrdinalIgnoreCase.Equals($resolvedBoundary, $liveBoundary)) {
            Throw-Failure "Test boundary cannot be the live D drive state path"
        }
        $boundaryOwnerSid = $currentSid
    } elseif (-not [StringComparer]::OrdinalIgnoreCase.Equals($resolvedBoundary, $liveBoundary)) {
        Throw-Failure "Live state boundary must be D:\ProgramData"
    }
    if ($TestBoundary) {
        $boundaryHandle = Ensure-DirectoryComponent $BoundaryPath $currentSid $true $boundaryOwnerSid
    } else {
        $boundarySecurity = Get-DirectorySecurity $BoundaryPath
        if ((Get-SidValue $boundarySecurity.Owner) -notin @("S-1-5-18", "S-1-5-32-544")) {
            Throw-Failure "D drive state boundary has an untrusted owner"
        }
        $volume = Get-Volume -DriveLetter D -ErrorAction Stop
        if ($volume.FileSystem -ne "NTFS" -or $volume.DriveType -ne "Fixed") {
            Throw-Failure "D drive state boundary must be on fixed NTFS storage"
        }
        $boundaryHandle = Open-Directory $BoundaryPath
        $script:directoryHandles.Add($boundaryHandle)
    }
    $applicationRoot = Join-Path $BoundaryPath "envCross_dotfiles"
    $usersRoot = Join-Path $applicationRoot "users"
    $sidRoot = Join-Path $usersRoot $currentSid
    $nushellRoot = Join-Path $sidRoot "nushell"
    Ensure-DirectoryComponent $applicationRoot $currentSid $false | Out-Null
    Ensure-DirectoryComponent $usersRoot $currentSid $false | Out-Null
    Ensure-DirectoryComponent $sidRoot $currentSid $false | Out-Null
    Ensure-DirectoryComponent $nushellRoot $currentSid $false | Out-Null
    $historyDestination = Join-Path $nushellRoot "history.txt"

    $sourcePath = $SourceHistory
    if (-not $TestBoundary -and -not (Test-Exists $sourcePath)) {
        $legacyHistory = Join-Path $env:ProgramData "envCross_dotfiles\users\$currentSid\nushell\history.txt"
        if (Test-Exists $legacyHistory) { $sourcePath = $legacyHistory }
    }
    $sourceExists = Test-Exists $sourcePath
    if ($sourceExists) {
        $sourceAttributes = [EnvCrossNative]::Attributes($sourcePath)
        if ((Test-Reparse $sourceAttributes) -or (($sourceAttributes -band 0x10) -ne 0)) {
            Throw-Failure "History source is not a regular file: $sourcePath"
        }
        $sourceHandle = Open-File $sourcePath
        $sourceRecord = [EnvCrossNative]::Record($sourceHandle, $true)
        if ($sourceRecord.Links -ne 1) {
            Throw-Failure "History source is hardlinked: $sourcePath"
        }
        Assert-TrustedSourceOwner $sourcePath $currentSid
        $sourceHash = $sourceRecord.Hash
    }

    $historyStage = "$historyDestination.envCross-$TransactionId.stage"
    $historyRollback = "$historyDestination.envCross-$TransactionId.rollback"
    if ((Test-Exists $historyStage) -or (Test-Exists $historyRollback)) {
        Throw-Failure "History migration artifact already exists"
    }

    $destinationExists = Test-Exists $historyDestination
    if ($destinationExists) {
        $destinationRecord = Assert-SafeHistoryFile $historyDestination $currentSid
        if ($sourceExists -and $destinationRecord.Hash -ne $sourceHash) {
            Throw-Failure "Protected history differs from repository history"
        }
    } else {
        if ($sourceExists) {
            [EnvCrossNative]::CopyNew($sourceHandle, $historyStage) | Out-Null
        } else {
            [EnvCrossNative]::WriteNew($historyStage, [byte[]]@()) | Out-Null
        }
        Set-StageFileAcl $historyStage $currentSid
        $stagedHistoryRecord = Assert-SafeHistoryFile $historyStage $currentSid
        $expectedHistoryHash = if ($sourceExists) { $sourceHash } else { (Get-PathRecord $historyStage $true).Hash }
        if ($stagedHistoryRecord.Hash -ne $expectedHistoryHash) {
            Throw-Failure "Staged history verification failed"
        }
        [EnvCrossNative]::Move($historyStage, $historyDestination)
        $destinationRecord = Assert-SafeHistoryFile $historyDestination $currentSid
        if ($destinationRecord.Hash -ne $expectedHistoryHash) {
            Throw-Failure "Protected history verification failed"
        }
    }

    $historyBlockTemplate = @'
let envcross_system_root = ($env.SYSTEMROOT? | default "")
let envcross_whoami = ($envcross_system_root | path join "System32" | path join "whoami.exe")
let envcross_user_sid = (^$envcross_whoami /user /fo csv /nh | str trim | str replace --regex '^"[^"]+","([^"]+)"$' '$1')
let envcross_state_root = '__ENVCROSS_STATE_ROOT__'
if ($envcross_system_root | is-empty) or ($envcross_user_sid | is-empty) or ($envcross_state_root | is-empty) or (($envcross_user_sid | str starts-with "S-") == false) {
    error make {msg: "Unable to resolve the protected Nushell history path"}
}
$env.config.history.path = ($envcross_state_root | path join "users" | path join $envcross_user_sid | path join "nushell" | path join "history.txt")
'@.Trim().Replace("`r`n", "`n")
    $historyBlock = $historyBlockTemplate.Replace("__ENVCROSS_STATE_ROOT__", $applicationRoot.Replace("'", "''"))
    $environmentHistoryBlock = @'
let envcross_system_root = ($env.SYSTEMROOT? | default "")
let envcross_whoami = ($envcross_system_root | path join "System32" | path join "whoami.exe")
let envcross_user_sid = (^$envcross_whoami /user /fo csv /nh | str trim | str replace --regex '^"[^"]+","([^"]+)"$' '$1')
let envcross_state_root = ($env.ENVCROSS_STATE_ROOT? | default 'D:\ProgramData\envCross_dotfiles')
if ($envcross_system_root | is-empty) or ($envcross_user_sid | is-empty) or ($envcross_state_root | is-empty) or (($envcross_user_sid | str starts-with "S-") == false) {
    error make {msg: "Unable to resolve the protected Nushell history path"}
}
$env.config.history.path = ($envcross_state_root | path join "users" | path join $envcross_user_sid | path join "nushell" | path join "history.txt")
'@.Trim().Replace("`r`n", "`n")
    $legacyHistoryBlock = @'
let envcross_user_sid = (^powershell.exe -NoProfile -Command "[Security.Principal.WindowsIdentity]::GetCurrent().User.Value" | str trim)
let envcross_programdata = ($env.PROGRAMDATA? | default "")
if ($envcross_user_sid | is-empty) or ($envcross_programdata | is-empty) {
    error make {msg: "Unable to resolve the protected Nushell history path"}
}
$env.config.history.path = ($envcross_programdata | path join "envCross_dotfiles" | path join "users" | path join $envcross_user_sid | path join "nushell" | path join "history.txt")
'@.Trim().Replace("`r`n", "`n")
    $pathWhoamiHistoryBlock = @'
let envcross_user_sid = (^whoami /user /fo csv /nh | str trim | str replace --regex '^"[^"]+","([^"]+)"$' '$1')
let envcross_programdata = ($env.PROGRAMDATA? | default "")
if ($envcross_user_sid | is-empty) or ($envcross_programdata | is-empty) or (($envcross_user_sid | str starts-with "S-") == false) {
    error make {msg: "Unable to resolve the protected Nushell history path"}
}
$env.config.history.path = ($envcross_programdata | path join "envCross_dotfiles" | path join "users" | path join $envcross_user_sid | path join "nushell" | path join "history.txt")
'@.Trim().Replace("`r`n", "`n")
    $programDataHistoryBlock = @'
let envcross_system_root = ($env.SYSTEMROOT? | default "")
let envcross_whoami = ($envcross_system_root | path join "System32" | path join "whoami.exe")
let envcross_user_sid = (^$envcross_whoami /user /fo csv /nh | str trim | str replace --regex '^"[^"]+","([^"]+)"$' '$1')
let envcross_programdata = ($env.PROGRAMDATA? | default "")
if ($envcross_system_root | is-empty) or ($envcross_user_sid | is-empty) or ($envcross_programdata | is-empty) or (($envcross_user_sid | str starts-with "S-") == false) {
    error make {msg: "Unable to resolve the protected Nushell history path"}
}
$env.config.history.path = ($envcross_programdata | path join "envCross_dotfiles" | path join "users" | path join $envcross_user_sid | path join "nushell" | path join "history.txt")
'@.Trim().Replace("`r`n", "`n")
    if (-not (Test-Exists $ConfigPath)) {
        Throw-Failure "Nushell config is missing: $ConfigPath"
    }
    $configAttributes = [EnvCrossNative]::Attributes($ConfigPath)
    if ((Test-Reparse $configAttributes) -or (($configAttributes -band 0x10) -ne 0)) {
        Throw-Failure "Nushell config is not a regular file: $ConfigPath"
    }
    $configRecord = Get-PathRecord $ConfigPath $true
    if ($configRecord.Links -ne 1) {
        Throw-Failure "Nushell config is hardlinked: $ConfigPath"
    }
    $configBytes = [IO.File]::ReadAllBytes($ConfigPath)
    $configText = [Text.Encoding]::UTF8.GetString($configBytes)
    $normalizedConfig = $configText.Replace("`r`n", "`n").TrimEnd()
    $hasHistoryBlock = $normalizedConfig.IndexOf($historyBlock, [StringComparison]::Ordinal) -ge 0
    $baseConfigText = $normalizedConfig
    $hasObsoleteHistoryBlock = $false
    foreach ($obsoleteHistoryBlock in @($environmentHistoryBlock, $legacyHistoryBlock, $pathWhoamiHistoryBlock, $programDataHistoryBlock)) {
        if ($baseConfigText.IndexOf($obsoleteHistoryBlock, [StringComparison]::Ordinal) -ge 0) {
            $baseConfigText = $baseConfigText.Replace($obsoleteHistoryBlock, "")
            $hasObsoleteHistoryBlock = $true
        }
    }
    if (-not $hasHistoryBlock -or $hasObsoleteHistoryBlock) {
        $newline = if ($configText.Contains("`r`n")) { "`r`n" } else { "`n" }
        $baseConfigText = $baseConfigText.TrimEnd()
        $newConfigText = $baseConfigText.Replace("`n", $newline) + $newline + $newline + ($historyBlock -replace "`n", $newline) + $newline
        $configStage = Join-Path (Split-Path -Parent $ConfigPath) ".$(Split-Path -Leaf $ConfigPath).envCross-$TransactionId.stage"
        $configRollback = Join-Path (Split-Path -Parent $ConfigPath) ".$(Split-Path -Leaf $ConfigPath).envCross-$TransactionId.rollback"
        if ((Test-Exists $configStage) -or (Test-Exists $configRollback)) {
            Throw-Failure "Nushell config migration artifact already exists"
        }
        $expectedConfigBytes = [Text.Encoding]::UTF8.GetBytes($newConfigText)
        $expectedConfigHash = Get-BytesHash $expectedConfigBytes
        [EnvCrossNative]::WriteNew($configStage, $expectedConfigBytes) | Out-Null
        Set-StageFileAcl $configStage $currentSid
        Flush-File $configStage
        $stagedConfigRecord = Get-PathRecord $configStage $true
        if ($stagedConfigRecord.Length -ne $expectedConfigBytes.Length -or $stagedConfigRecord.Hash -ne $expectedConfigHash) {
            Throw-Failure "Staged Nushell config verification failed"
        }
        $originalConfigRecord = $configRecord
        [EnvCrossNative]::Replace($ConfigPath, $configStage, $configRollback)
        $configChanged = $true
        if ($env:ENVCROSS_DOTFILES_TEST_MUTATE_CONFIG_BACKUP -eq "1") {
            $mutated = [IO.File]::ReadAllBytes($configRollback)
            if ($mutated.Length -gt 0) { $mutated[0] = $mutated[0] -bxor 1 }
            [IO.File]::WriteAllBytes($configRollback, $mutated)
        }
        $configRollbackRecord = Get-PathRecord $configRollback $true
        if ($configRollbackRecord.VolumeSerial -ne $originalConfigRecord.VolumeSerial -or $configRollbackRecord.FileIndex -ne $originalConfigRecord.FileIndex -or $configRollbackRecord.Length -ne $originalConfigRecord.Length -or $configRollbackRecord.Hash -ne $originalConfigRecord.Hash) {
            Restore-Config $ConfigPath $configStage $configRollback $stagedConfigRecord $configRollbackRecord
            $configChanged = $false
            Throw-Failure "Nushell config changed during atomic replacement"
        }
        $liveConfigRecord = Get-PathRecord $ConfigPath $true
        if ($liveConfigRecord.VolumeSerial -ne $stagedConfigRecord.VolumeSerial -or $liveConfigRecord.FileIndex -ne $stagedConfigRecord.FileIndex -or $liveConfigRecord.Hash -ne $stagedConfigRecord.Hash) {
            Throw-Failure "Live Nushell config verification failed"
        }
    }

    Invoke-NuVerifier $ConfigPath $historyDestination $allowedNuPids $NuPath (Split-Path -Parent $ConfigPath) $applicationRoot
    Assert-NuProcesses $allowedNuPids
    $finalDestination = Assert-SafeHistoryFile $historyDestination $currentSid
    if ($sourceExists) {
        $finalSource = [EnvCrossNative]::Record($sourceHandle, $true)
        if ($finalSource.Length -ne $finalDestination.Length -or $finalSource.Hash -ne $finalDestination.Hash -or $finalSource.Hash -ne $sourceHash) {
            Throw-Failure "Final history verification failed"
        }
    }
    if ($configChanged) {
        Remove-PathByRecord $configRollback $configRollbackRecord
        $configChanged = $false
    }
    if ($sourceExists -and $RemoveSource) {
        [EnvCrossNative]::DeleteByHandle($sourceHandle)
        $sourceHandle.Dispose()
        $sourceHandle = $null
        if (Test-Exists $sourcePath) {
            Throw-Failure "Repository history removal verification failed"
        }
    }
    Write-Output $historyDestination
} catch {
    $failure = "$($_.Exception.Message) at line $($_.InvocationInfo.ScriptLineNumber)"
    if ($configChanged -and $null -ne $configRollbackRecord) {
        try {
            Restore-Config $ConfigPath $configStage $configRollback $stagedConfigRecord $configRollbackRecord
        } catch {
            $failure = "$failure; config rollback failed: $($_.Exception.Message)"
        }
    }
    Write-Error $failure
    exit 1
} finally {
    if ($null -ne $sourceHandle) {
        $sourceHandle.Dispose()
    }
    foreach ($handle in $directoryHandles) {
        $handle.Dispose()
    }
}
