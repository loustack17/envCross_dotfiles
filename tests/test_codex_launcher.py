import json
import pathlib
import shutil
import subprocess
import tempfile
import unittest


ROOT = pathlib.Path(__file__).resolve().parents[1]
PWSH = shutil.which("pwsh")


@unittest.skipUnless(PWSH, "PowerShell 7 required")
class CodexLauncherTests(unittest.TestCase):
    def run_launcher(self, mode, arguments=()):
        with tempfile.TemporaryDirectory() as temporary:
            folder = pathlib.Path(temporary)
            mock = folder / "mock.ps1"
            mock.write_text(
                "if ($args[0] -eq '--version') { "
                "if ($env:CODEX_LAUNCH_TEST_UPDATED) { 'codex-cli 2.0.0' } "
                "else { 'codex-cli 1.2.3' }; exit 0 }\n"
                "ConvertTo-Json -Compress -InputObject @($args)\nexit 7\n"
            )
            preamble = {
                "current": "function Invoke-RestMethod { @{ tag_name = 'rust-v1.2.3' } }\n",
                "offline": "function Invoke-RestMethod { throw 'network unavailable' }\n",
                "invalid": "function Invoke-RestMethod { @{ tag_name = 'invalid' } }\n",
                "failed_update": (
                    "function Invoke-RestMethod { param($Uri) "
                    "if ($Uri -like '*install.ps1') { 'param($Release)' } "
                    "else { @{ tag_name = 'rust-v2.0.0' } } }\n"
                ),
                "successful_update": (
                    "function Invoke-RestMethod { param($Uri) "
                    "if ($Uri -like '*install.ps1') { "
                    "'param($Release) $env:CODEX_LAUNCH_TEST_UPDATED = 1' } "
                    "else { @{ tag_name = 'rust-v2.0.0' } } }\n"
                ),
            }[mode]
            source = (ROOT / "scripts/codex-launcher/codex-launch.ps1").read_text()
            source = source.replace(
                "Join-Path $env:LOCALAPPDATA 'Programs/OpenAI/Codex/bin/codex.exe'",
                "'" + mock.as_posix().replace("'", "''") + "'",
            )
            launcher = folder / "launcher.ps1"
            launcher.write_text("function python { '[]'; $global:LASTEXITCODE = 0 }\n" + preamble + source)
            return subprocess.run(
                [PWSH, "-NoProfile", "-File", str(launcher), *arguments],
                capture_output=True,
                encoding="utf-8",
                timeout=20,
            )

    def test_current_version_preserves_arguments_and_exit_status(self):
        result = self.run_launcher("current", ["exec", "two words", "--json", "中文"])
        self.assertEqual(result.returncode, 7, result.stderr)
        self.assertEqual(json.loads(result.stdout), ["exec", "two words", "--json", "中文"])

    def test_network_failure_does_not_launch_old_version(self):
        result = self.run_launcher("offline")
        self.assertEqual(result.returncode, 1)
        self.assertEqual(result.stdout, "")
        self.assertIn("network unavailable", result.stderr)

    def test_invalid_release_is_rejected(self):
        result = self.run_launcher("invalid")
        self.assertEqual(result.returncode, 1)
        self.assertEqual(result.stdout, "")
        self.assertIn("unexpected version", result.stderr)

    def test_incomplete_update_does_not_launch_old_version(self):
        result = self.run_launcher("failed_update")
        self.assertEqual(result.returncode, 1)
        self.assertEqual(result.stdout, "")
        self.assertIn("expected version after updating", result.stderr)

    def test_successful_update_launches_with_clean_stdout(self):
        result = self.run_launcher("successful_update", ["exec", "after update"])
        self.assertEqual(result.returncode, 7, result.stderr)
        self.assertEqual(json.loads(result.stdout), ["exec", "after update"])
        self.assertIn("Updating standalone Codex to 2.0.0", result.stderr)


if __name__ == "__main__":
    unittest.main()
