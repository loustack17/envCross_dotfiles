import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]


class SqlitMigrationTests(unittest.TestCase):
    def test_windows_preserves_existing_data_without_backups(self):
        nu = shutil.which("nu")
        if os.name != "nt" or not nu:
            self.skipTest("Windows and Nushell required")
        for filename in ("connections.json", ".private-state"):
            with self.subTest(filename=filename), tempfile.TemporaryDirectory() as folder:
                config = Path(folder) / "sqlit"
                config.mkdir()
                original = config / filename
                original.write_bytes(b"existing user data\n")
                result = subprocess.run(
                    [nu, str(ROOT / "install.nu"), "--only", "sqlit", "--no-install", "--no-backup"],
                    cwd=ROOT,
                    env={**os.environ, "SQLIT_CONFIG_DIR": str(config)},
                    capture_output=True,
                    text=True,
                    timeout=60,
                )
                self.assertNotEqual(result.returncode, 0, result.stdout)
                self.assertIn("Existing sqlit config contains user data", result.stdout + result.stderr)
                self.assertFalse(config.is_symlink())
                self.assertEqual(original.read_bytes(), b"existing user data\n")
                self.assertEqual(sorted(path.name for path in config.iterdir()), [filename])

    def test_linux_preserves_existing_data_without_backups(self):
        bash = shutil.which("bash")
        if os.name == "nt":
            candidate = Path("D:/ProgramData/Scoop/apps/git/current/bin/bash.exe")
            bash = str(candidate) if candidate.exists() else None
        if not bash:
            self.skipTest("Bash required")

        def bash_path(path):
            resolved = Path(path).resolve()
            if os.name == "nt":
                return f"/{resolved.drive[0].lower()}{resolved.as_posix()[2:]}"
            return str(resolved)

        for filename in ("connections.json", ".private-state"):
            with self.subTest(filename=filename), tempfile.TemporaryDirectory() as folder:
                config = Path(folder) / "sqlit"
                config.mkdir()
                original = config / filename
                original.write_bytes(b"existing user data\n")
                home = Path(folder) / "home"
                home.mkdir()
                fake_bin = Path(folder) / "bin"
                fake_bin.mkdir()
                for name in ("pacman", "stow"):
                    command = fake_bin / name
                    command.write_text("#!/usr/bin/env bash\nexit 0\n", encoding="utf-8")
                    command.chmod(0o755)
                result = subprocess.run(
                    [bash, "--noprofile", "--norc", "-c", 'export PATH="$TEST_BIN:$PATH"; bash "$TEST_INSTALLER" --only-sqlit --no-install --no-backup'],
                    cwd=ROOT,
                    env={
                        **os.environ,
                        "HOME": bash_path(home),
                        "XDG_CONFIG_HOME": bash_path(home / ".config"),
                        "XDG_STATE_HOME": bash_path(home / ".local/state"),
                        "SQLIT_CONFIG_DIR": bash_path(config),
                        "TEST_BIN": bash_path(fake_bin),
                        "TEST_INSTALLER": bash_path(ROOT / "install.sh"),
                    },
                    capture_output=True,
                    text=True,
                    timeout=60,
                )
                self.assertNotEqual(result.returncode, 0, result.stdout)
                self.assertIn("Existing sqlit config contains user data", result.stdout + result.stderr)
                self.assertFalse(config.is_symlink())
                self.assertEqual(original.read_bytes(), b"existing user data\n")
                self.assertEqual(sorted(path.name for path in config.iterdir()), [filename])


if __name__ == "__main__":
    unittest.main()
