# Windows Codex standalone

Current model, context, and configuration ownership are described in [CLI policy — 2026-09-07](cli-policy-2026-09-07.md). The launcher now requires Python 3.11+ to resolve repository configuration before starting Codex.

Verified on 2026-09-07: standalone and the official stable channel both report `0.153.4`.

## Entry point

The user PATH starts with `D:\Notes\WorkFlow\envCross_dotfiles\scripts\codex-launcher`. Run `codex` normally in a newly opened terminal. Restart the terminal application if a new tab still inherits its old PATH.

`codex.cmd` runs PowerShell 7 with `-NoProfile`, then `codex-launch.ps1`:

1. Fetches the official stable channel on every invocation, including CLI subcommands.
2. Compares it with the standalone executable's version.
3. Runs the official installer only when versions differ, explicitly selecting the fetched stable release.
4. Verifies the installed version before forwarding arguments and the exit status.

The executable is `%LOCALAPPDATA%\Programs\OpenAI\Codex\bin\codex.exe`. It is called by absolute path to avoid recursive launcher calls. Update messages go to stderr, leaving machine-readable stdout intact.

This per-launch update policy is custom, not a claim that Codex's built-in update notification automatically installs releases. The launcher requires network access. Failed checks or updates stop the launch with exit code 1; they do not silently run an older version. An already-running session is not updated in place. Calling the executable directly bypasses the launcher.

## Migration

- Installed using the [official standalone installer](https://chatgpt.com/codex/install.ps1), through PowerShell 7 without loading a profile. See [official CLI documentation](https://developers.openai.com/codex/cli).
- Removed `@openai/codex` through each NVM version's npm: 0.98.0 from Node 24.11.1 and 24.13.0, 0.146.0 from 24.16.0, and 0.146.1 from 24.18.1.
- Moved four Codex-only pnpm 0.153.2 installation directories out of the global directory into `backup/codex-standalone-20260907/`. Shared pnpm caches were not pruned.
- Preserved Node.js, npm, pnpm, NVM, Codex configuration, credentials, agents, and the desktop application's private runtime.
- Removed the obsolete Nushell `--profile windows` wrapper from the repository. The live aliases file was already free of that wrapper when work resumed.
- Guarded PSReadLine prediction parameters in the repository PowerShell profile and the separate Windows PowerShell profile. PowerShell 7 uses the repository profile through its existing symlink.

## Verification

- Fresh Machine + User PATH resolves `codex.cmd` before the standalone executable, with no npm/NVM shim remaining.
- PowerShell 7, Windows PowerShell 5.1, CMD, and Nushell with the live aliases file each returned `codex-cli 0.153.4` through the launcher.
- npm reports no global Codex; pnpm reports no registered global packages. Checked all installed NVM versions for Codex packages and shims.
- Five isolated tests cover argument/exit-code preservation, network failure, invalid release metadata, incomplete update rejection, and successful update with clean stdout.
- Tested the PSReadLine guard against Windows PowerShell's installed module. Full interactive shell profiles and a paid model task were not exercised.

## Recovery

The ignored `backup/codex-standalone-20260907/` directory contains the old user PATH, before/after Windows PowerShell profile, and four pnpm installation directories. Compare against current state before restoring so subsequent edits are preserved. Removed npm packages can be reinstalled at the recorded versions if needed.

To disable automatic startup updating without uninstalling standalone, remove only the launcher directory from User PATH. The standalone executable remains available. Do not remove the desktop application's private runtime or the entire `.codex` directory.
