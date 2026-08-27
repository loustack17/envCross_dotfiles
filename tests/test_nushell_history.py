import csv
import hashlib
import os
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
HELPER = ROOT / "scripts" / "windows" / "migrate-nushell-history.ps1"


@unittest.skipUnless(os.name == "nt", "Windows-only migration helper")
class NushellHistoryMigrationTests(unittest.TestCase):
    def setUp(self):
        self.powershell = shutil.which("pwsh") or shutil.which("powershell.exe")
        self.nu_launcher = shutil.which("nu.exe") or shutil.which("nu")
        if not self.powershell or not self.nu_launcher:
            self.skipTest("PowerShell and Nushell are required")
        nu_result = subprocess.run(
            [self.nu_launcher, "--no-config-file", "-c", "$nu.current-exe"],
            capture_output=True,
            text=True,
            check=True,
        )
        self.nu = nu_result.stdout.strip()
        self.sid = self._current_sid()

    def _current_sid(self):
        result = subprocess.run(
            ["whoami", "/user", "/fo", "csv", "/nh"],
            capture_output=True,
            text=True,
            check=True,
        )
        rows = list(csv.reader([result.stdout.strip()]))
        self.assertEqual(len(rows), 1)
        self.assertEqual(len(rows[0]), 2)
        self.assertRegex(rows[0][1], r"^S-\d+-\d+(?:-\d+)+$")
        return rows[0][1]

    def _active_nu_ids(self):
        result = subprocess.run(
            [
                self.powershell,
                "-NoProfile",
                "-Command",
                "@(Get-Process -Name nu -ErrorAction SilentlyContinue | ForEach-Object Id) -join ','",
            ],
            capture_output=True,
            text=True,
            check=True,
        )
        value = result.stdout.strip()
        return [] if not value else [int(item) for item in value.split(",")]

    def _skip_if_live_nu(self):
        ids = self._active_nu_ids()
        if ids:
            self.skipTest(f"live Nushell gate is occupied by PIDs {ids}")

    def _prepare_boundary(self, path):
        script = """
$path = $args[0]
$sid = $args[1]
$acl = [System.Security.AccessControl.DirectorySecurity]::new()
$acl.SetAccessRuleProtection($true, $false)
$acl.SetOwner([System.Security.Principal.SecurityIdentifier]::new($sid))
$inheritance = [System.Security.AccessControl.InheritanceFlags]::ContainerInherit -bor [System.Security.AccessControl.InheritanceFlags]::ObjectInherit
foreach ($principal in @($sid, 'S-1-5-18', 'S-1-5-32-544')) {
    $rule = [System.Security.AccessControl.FileSystemAccessRule]::new(
        [System.Security.Principal.SecurityIdentifier]::new($principal),
        [System.Security.AccessControl.FileSystemRights]::FullControl,
        $inheritance,
        [System.Security.AccessControl.PropagationFlags]::None,
        [System.Security.AccessControl.AccessControlType]::Allow)
    $acl.AddAccessRule($rule)
}
Set-Acl -LiteralPath $path -AclObject $acl
"""
        result = subprocess.run(
            [self.powershell, "-NoProfile", "-Command", script.replace("$args[0]", "$env:ENVCROSS_TEST_BOUNDARY_PATH").replace("$args[1]", "$env:ENVCROSS_TEST_BOUNDARY_SID")],
            env={
                **os.environ,
                "ENVCROSS_TEST_BOUNDARY_PATH": str(path),
                "ENVCROSS_TEST_BOUNDARY_SID": self.sid,
            },
            capture_output=True,
            text=True,
        )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def _add_boundary_rule(self, path, sid, rights, inherit_only=False):
        codes = {
            "ChangePermissions": "WDAC",
            "TakeOwnership": "WO",
            "FullControl": "F",
        }
        flags = "(OI)(CI)(IO)" if inherit_only else ""
        result = subprocess.run(
            ["icacls", str(path), "/grant", f"*{sid}:{flags}({codes[rights]})"],
            capture_output=True,
            text=True,
        )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def _fixture(self, source=b"one\ntwo\n", config=None):
        temp = tempfile.TemporaryDirectory(prefix="envcross-nushell-")
        root = Path(temp.name)
        boundary = root / "boundary"
        boundary.mkdir()
        self._prepare_boundary(boundary)
        source_path = root / "history.txt"
        if source is not None:
            source_path.write_bytes(source)
        config_path = root / "config.nu"
        config_path.write_text(
            config or "$env.config.history.path = 'C:\\wrong\\history.txt'\n",
            encoding="utf-8",
            newline="",
        )
        nu_path = Path(self.nu)
        return temp, root, boundary, source_path, config_path, nu_path

    def _run_helper(
        self,
        boundary,
        source,
        config,
        nu_path,
        transaction_id,
        env=None,
        dry_run=False,
        remove_source=False,
    ):
        command = [
            self.powershell,
            "-NoProfile",
            "-ExecutionPolicy",
            "Bypass",
            "-File",
            str(HELPER),
            "-SourceHistory",
            str(source),
            "-ConfigPath",
            str(config),
            "-InstallerPid",
            str(os.getpid()),
            "-BoundaryPath",
            str(boundary),
            "-NuPath",
            str(nu_path),
            "-TransactionId",
            transaction_id,
            "-TestBoundary",
        ]
        if dry_run:
            command.append("-DryRun")
        if remove_source:
            command.append("-RemoveSource")
        process_env = os.environ.copy()
        if env:
            process_env.update(env)
        return subprocess.run(
            command,
            cwd=ROOT,
            env=process_env,
            capture_output=True,
            text=True,
            timeout=60,
        )

    def _destination(self, boundary):
        return boundary / "envCross_dotfiles" / "users" / self.sid / "nushell" / "history.txt"

    def _sha256(self, path):
        return hashlib.sha256(path.read_bytes()).hexdigest().upper()

    def test_success_migrates_bytes_and_injects_whoami_config(self):
        self._skip_if_live_nu()
        temp, root, boundary, source, config, nu_path = self._fixture()
        try:
            transaction_id = "11111111-1111-1111-1111-111111111111"
            result = self._run_helper(boundary, source, config, nu_path, transaction_id)
            destination = self._destination(boundary)
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
            self.assertTrue(source.exists())
            self.assertEqual(self._sha256(source), self._sha256(destination))
            migrated_config = config.read_text(encoding="utf-8")
            self.assertIn('path join "System32"', migrated_config)
            self.assertIn("^$envcross_whoami /user /fo csv /nh", migrated_config)
            self.assertIn(str(boundary / "envCross_dotfiles"), migrated_config)
            self.assertNotIn("ENVCROSS_STATE_ROOT", migrated_config)
            self.assertNotIn("powershell.exe -NoProfile", migrated_config)
            self.assertFalse(Path(f"{destination}.envCross-{transaction_id}.stage").exists())
            self.assertFalse(Path(f"{config}.envCross-{transaction_id}.rollback").exists())
        finally:
            temp.cleanup()

    def test_source_absent_creates_empty_history(self):
        self._skip_if_live_nu()
        temp, root, boundary, source, config, nu_path = self._fixture(source=None)
        try:
            result = self._run_helper(
                boundary,
                source,
                config,
                nu_path,
                "22222222-2222-2222-2222-222222222222",
            )
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
            self.assertFalse(source.exists())
            self.assertEqual(self._destination(boundary).read_bytes(), b"")
            self.assertIn("^$envcross_whoami /user /fo csv /nh", config.read_text(encoding="utf-8"))
        finally:
            temp.cleanup()

    def test_identical_destination_is_accepted_without_overwrite(self):
        self._skip_if_live_nu()
        temp, root, boundary, source, config, nu_path = self._fixture()
        try:
            transaction_id = "33333333-3333-3333-3333-333333333333"
            first = self._run_helper(boundary, source, config, nu_path, transaction_id)
            self.assertEqual(first.returncode, 0, first.stdout + first.stderr)
            destination = self._destination(boundary)
            before = destination.stat().st_mtime_ns
            config_before = config.read_bytes()
            second = self._run_helper(boundary, source, config, nu_path, transaction_id)
            self.assertEqual(second.returncode, 0, second.stdout + second.stderr)
            self.assertEqual(destination.read_bytes(), source.read_bytes())
            self.assertEqual(destination.stat().st_mtime_ns, before)
            self.assertEqual(config.read_bytes(), config_before)
        finally:
            temp.cleanup()

    def test_different_destination_fails_closed(self):
        self._skip_if_live_nu()
        temp, root, boundary, source, config, nu_path = self._fixture(source=b"old\n")
        try:
            transaction_id = "44444444-4444-4444-4444-444444444444"
            first = self._run_helper(boundary, source, config, nu_path, transaction_id)
            self.assertEqual(first.returncode, 0, first.stdout + first.stderr)
            destination = self._destination(boundary)
            source.write_bytes(b"new\n")
            result = self._run_helper(boundary, source, config, nu_path, transaction_id)
            self.assertNotEqual(result.returncode, 0)
            self.assertEqual(destination.read_bytes(), b"old\n")
            self.assertEqual(source.read_bytes(), b"new\n")
        finally:
            temp.cleanup()

    def test_destination_symlink_is_rejected(self):
        self._skip_if_live_nu()
        temp, root, boundary, source, config, nu_path = self._fixture()
        try:
            result = self._run_helper(boundary, source, config, nu_path, "55555555-5555-5555-5555-555555555555")
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
            destination = self._destination(boundary)
            destination.unlink()
            target = root / "outside.txt"
            target.write_bytes(b"outside\n")
            try:
                destination.symlink_to(target)
            except OSError as error:
                self.skipTest(f"symlink creation unavailable: {error}")
            result = self._run_helper(boundary, source, config, nu_path, "66666666-6666-6666-6666-666666666666")
            self.assertNotEqual(result.returncode, 0)
            self.assertEqual(target.read_bytes(), b"outside\n")
            self.assertEqual(source.read_bytes(), b"one\ntwo\n")
        finally:
            temp.cleanup()

    def test_destination_hardlink_is_rejected(self):
        self._skip_if_live_nu()
        temp, root, boundary, source, config, nu_path = self._fixture()
        try:
            result = self._run_helper(boundary, source, config, nu_path, "77777777-7777-7777-7777-777777777777")
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
            destination = self._destination(boundary)
            destination.unlink()
            alias = root / "history-alias.txt"
            alias.write_bytes(b"alias\n")
            try:
                os.link(alias, destination)
            except OSError as error:
                self.skipTest(f"hardlink creation unavailable: {error}")
            result = self._run_helper(boundary, source, config, nu_path, "88888888-8888-8888-8888-888888888888")
            self.assertNotEqual(result.returncode, 0)
            self.assertEqual(alias.read_bytes(), b"alias\n")
            self.assertEqual(source.read_bytes(), b"one\ntwo\n")
        finally:
            temp.cleanup()

    def test_stage_and_rollback_artifacts_are_rejected(self):
        self._skip_if_live_nu()
        temp, root, boundary, source, config, nu_path = self._fixture()
        try:
            transaction_id = "99999999-9999-9999-9999-999999999999"
            result = self._run_helper(boundary, source, config, nu_path, transaction_id)
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
            destination = self._destination(boundary)
            for suffix in ("stage", "rollback"):
                artifact = Path(f"{destination}.envCross-{transaction_id}.{suffix}")
                artifact.write_bytes(b"occupied\n")
                result = self._run_helper(boundary, source, config, nu_path, transaction_id)
                self.assertNotEqual(result.returncode, 0)
                self.assertEqual(artifact.read_bytes(), b"occupied\n")
                artifact.unlink()
            self.assertEqual(source.read_bytes(), destination.read_bytes())
        finally:
            temp.cleanup()

    def test_verifier_failure_restores_config_and_keeps_destination_safe(self):
        self._skip_if_live_nu()
        old_config = b"$env.config.history.path = 'C:\\wrong\\history.txt'\r\n"
        temp, root, boundary, source, config, nu_path = self._fixture(config=old_config.decode())
        try:
            result = self._run_helper(
                boundary,
                source,
                config,
                nu_path,
                "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
                env={"ENVCROSS_DOTFILES_TEST_FAIL_VERIFICATION": "1"},
            )
            self.assertNotEqual(result.returncode, 0)
            self.assertEqual(config.read_bytes(), old_config)
            self.assertEqual(source.read_bytes(), b"one\ntwo\n")
            self.assertEqual(self._sha256(source), self._sha256(self._destination(boundary)))
            self.assertFalse(list(root.glob(".*config.nu.envCross-*.rollback")))
            self.assertFalse(list(root.glob(".*config.nu.envCross-*.stage")))
        finally:
            temp.cleanup()

    def test_remove_source_happens_after_config_commit(self):
        self._skip_if_live_nu()
        temp, root, boundary, source, config, nu_path = self._fixture()
        try:
            result = self._run_helper(
                boundary,
                source,
                config,
                nu_path,
                "dddddddd-dddd-dddd-dddd-dddddddddddd",
                remove_source=True,
            )
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
            self.assertFalse(source.exists())
            self.assertEqual(self._destination(boundary).read_bytes(), b"one\ntwo\n")
            self.assertIn("^$envcross_whoami /user /fo csv /nh", config.read_text(encoding="utf-8"))
        finally:
            temp.cleanup()

    def test_config_commit_failure_restores_config_before_source_removal(self):
        self._skip_if_live_nu()
        old_config = b"$env.config.history.path = 'C:\\wrong\\history.txt'\r\n"
        temp, root, boundary, source, config, nu_path = self._fixture(config=old_config.decode())
        try:
            result = self._run_helper(
                boundary,
                source,
                config,
                nu_path,
                "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
                env={"ENVCROSS_DOTFILES_TEST_FAIL_ROLLBACK_REMOVAL": "1"},
                remove_source=True,
            )
            self.assertNotEqual(result.returncode, 0)
            self.assertEqual(config.read_bytes(), old_config)
            self.assertEqual(source.read_bytes(), b"one\ntwo\n")
            self.assertEqual(self._destination(boundary).read_bytes(), source.read_bytes())
            self.assertFalse(list(root.glob(".*config.nu.envCross-*.stage")))
        finally:
            temp.cleanup()

    def test_concurrent_same_length_config_change_is_preserved(self):
        self._skip_if_live_nu()
        old_config = b"$env.config.history.path = 'C:\\wrong\\history.txt'\r\n"
        expected = bytes((old_config[0] ^ 1,)) + old_config[1:]
        temp, root, boundary, source, config, nu_path = self._fixture(config=old_config.decode())
        try:
            result = self._run_helper(
                boundary,
                source,
                config,
                nu_path,
                "14141414-1414-1414-1414-141414141414",
                env={"ENVCROSS_DOTFILES_TEST_MUTATE_CONFIG_BACKUP": "1"},
                remove_source=True,
            )
            self.assertNotEqual(result.returncode, 0)
            self.assertEqual(config.read_bytes(), expected)
            self.assertEqual(source.read_bytes(), b"one\ntwo\n")
            self.assertEqual(self._destination(boundary).read_bytes(), source.read_bytes())
            self.assertFalse(list(root.glob(".*config.nu.envCross-*.stage")))
            self.assertFalse(list(root.glob(".*config.nu.envCross-*.rollback")))
        finally:
            temp.cleanup()

    def test_boundary_rejects_dangerous_untrusted_rights(self):
        self._skip_if_live_nu()
        for index, rights in enumerate(("ChangePermissions", "TakeOwnership"), start=1):
            with self.subTest(rights=rights):
                temp, root, boundary, source, config, nu_path = self._fixture()
                try:
                    self._add_boundary_rule(boundary, "S-1-1-0", rights)
                    result = self._run_helper(
                        boundary,
                        source,
                        config,
                        nu_path,
                        f"f{index}f{index}f{index}f{index}-ffff-ffff-ffff-ffffffffffff",
                    )
                    self.assertNotEqual(result.returncode, 0)
                    self.assertFalse((boundary / "envCross_dotfiles").exists())
                finally:
                    temp.cleanup()

    def test_boundary_accepts_inherit_only_creator_owner(self):
        self._skip_if_live_nu()
        temp, root, boundary, source, config, nu_path = self._fixture()
        try:
            self._add_boundary_rule(boundary, "S-1-3-0", "FullControl", inherit_only=True)
            result = self._run_helper(
                boundary,
                source,
                config,
                nu_path,
                "abababab-abab-abab-abab-abababababab",
            )
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        finally:
            temp.cleanup()

    def test_hostile_precreated_managed_ancestor_is_rejected(self):
        self._skip_if_live_nu()
        temp, root, boundary, source, config, nu_path = self._fixture()
        try:
            (boundary / "envCross_dotfiles").mkdir()
            result = self._run_helper(
                boundary,
                source,
                config,
                nu_path,
                "cdcdcdcd-cdcd-cdcd-cdcd-cdcdcdcdcdcd",
            )
            self.assertNotEqual(result.returncode, 0)
            self.assertFalse((boundary / "envCross_dotfiles" / "users").exists())
        finally:
            temp.cleanup()

    def test_inheriting_boundary_acl_is_rejected(self):
        self._skip_if_live_nu()
        temp, root, boundary, source, config, nu_path = self._fixture()
        try:
            acl_result = subprocess.run(
                ["icacls", str(boundary), "/inheritance:e"],
                capture_output=True,
                text=True,
            )
            self.assertEqual(acl_result.returncode, 0, acl_result.stdout + acl_result.stderr)
            result = self._run_helper(
                boundary,
                source,
                config,
                nu_path,
                "dededede-dede-dede-dede-dededededede",
            )
            self.assertNotEqual(result.returncode, 0)
            self.assertFalse((boundary / "envCross_dotfiles").exists())
        finally:
            temp.cleanup()

    def test_path_hijacked_whoami_is_not_executed(self):
        self._skip_if_live_nu()
        temp, root, boundary, source, config, nu_path = self._fixture()
        try:
            fake_bin = root / "fake-bin"
            fake_bin.mkdir()
            shutil.copy2(shutil.which("cmd.exe"), fake_bin / "whoami.exe")
            result = self._run_helper(
                boundary,
                source,
                config,
                nu_path,
                "efefefef-efef-efef-efef-efefefefefef",
                env={"PATH": os.pathsep.join((str(fake_bin), os.environ["PATH"]))},
            )
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
            self.assertIn("^$envcross_whoami", config.read_text(encoding="utf-8"))
        finally:
            temp.cleanup()

    def test_dry_run_has_zero_fixture_mutation(self):
        temp, root, boundary, source, config, nu_path = self._fixture()
        try:
            source_before = source.read_bytes()
            config_before = config.read_bytes()
            result = self._run_helper(
                boundary,
                source,
                config,
                nu_path,
                "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
                dry_run=True,
            )
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
            self.assertEqual(source.read_bytes(), source_before)
            self.assertEqual(config.read_bytes(), config_before)
            self.assertFalse((boundary / "envCross_dotfiles").exists())
        finally:
            temp.cleanup()

    def test_active_nu_gate_rejects_competing_process(self):
        if self._active_nu_ids():
            self.skipTest("existing live Nushell process prevents isolated active-process simulation")
        temp, root, boundary, source, config, nu_path = self._fixture()
        process = subprocess.Popen(
            [str(nu_path), "--no-config-file", "-c", "sleep 3sec"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        try:
            result = self._run_helper(
                boundary,
                source,
                config,
                nu_path,
                "cccccccc-cccc-cccc-cccc-cccccccccccc",
            )
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("other Nushell processes", result.stderr)
        finally:
            process.wait(timeout=15)
            temp.cleanup()

    def test_later_installer_link_failure_preserves_history_state(self):
        self._skip_if_live_nu()
        with tempfile.TemporaryDirectory(prefix="envcross-nushell-installer-") as temp_name:
            root = Path(temp_name)
            fixture = root / "repo"
            source_dir = fixture / "Windows" / "nushell"
            helper_dir = fixture / "scripts" / "windows"
            home = root / "home"
            appdata = home / "AppData" / "Roaming"
            active = appdata / "nushell"
            boundary = root / "boundary"
            transaction_id = "12121212-1212-1212-1212-121212121212"
            source_dir.mkdir(parents=True)
            helper_dir.mkdir(parents=True)
            active.mkdir(parents=True)
            boundary.mkdir()
            self._prepare_boundary(boundary)
            history = source_dir / "history.txt"
            history.write_bytes(b"preserve\nthis\n")
            shutil.copy2(ROOT / "Windows" / "nushell" / "config.nu", source_dir / "config.nu")
            shutil.copy2(HELPER, helper_dir / HELPER.name)
            (active / "original.txt").write_text("original\n", encoding="utf-8")
            stage = appdata / f".nushell.envCross-{transaction_id}.stage"
            stage.mkdir()

            installer = (ROOT / "install.nu").read_text(encoding="utf-8")
            installer = installer.replace(
                "let transaction_id = (random uuid | into string)",
                f'let transaction_id = "{transaction_id}"',
                1,
            )
            invocation = "-BoundaryPath $boundary -InstallerPid ($installer_pid | into string) -NuPath $nu.current-exe | complete)"
            injected = "-BoundaryPath $env.ENVCROSS_TEST_BOUNDARY -InstallerPid ($installer_pid | into string) -NuPath $env.ENVCROSS_TEST_NU -TransactionId $env.ENVCROSS_TEST_MIGRATION_ID -TestBoundary | complete)"
            self.assertIn(invocation, installer)
            installer = installer.replace(invocation, injected, 1)
            (fixture / "install.nu").write_text(installer, encoding="utf-8")

            powershell = shutil.which("powershell.exe")
            cmd = shutil.which("cmd.exe")
            self.assertIsNotNone(powershell)
            self.assertIsNotNone(cmd)
            env = os.environ.copy()
            env.update(
                {
                    "USERPROFILE": str(home),
                    "HOME": str(home),
                    "APPDATA": str(appdata),
                    "LOCALAPPDATA": str(home / "AppData" / "Local"),
                    "ENVCROSS_STATE_ROOT": str(boundary / "envCross_dotfiles"),
                    "ENVCROSS_TEST_BOUNDARY": str(boundary),
                    "ENVCROSS_TEST_NU": str(self.nu),
                    "ENVCROSS_TEST_MIGRATION_ID": "13131313-1313-1313-1313-131313131313",
                    "PATH": os.pathsep.join(
                        (
                            str(Path(self.nu).parent),
                            str(Path(self.powershell).parent),
                            str(Path(powershell).parent),
                            str(Path(cmd).parent),
                        )
                    ),
                }
            )
            result = subprocess.run(
                [
                    self.nu,
                    "--no-config-file",
                    str(fixture / "install.nu"),
                    "--only",
                    "nushell",
                    "--no-install",
                    "--no-backup",
                ],
                cwd=fixture,
                env=env,
                capture_output=True,
                text=True,
                timeout=90,
            )

            destination = self._destination(boundary)
            self.assertNotEqual(result.returncode, 0, result.stdout)
            self.assertEqual(history.read_bytes(), b"preserve\nthis\n")
            self.assertTrue(destination.exists(), result.stdout + result.stderr)
            self.assertEqual(destination.read_bytes(), history.read_bytes())
            self.assertEqual((active / "original.txt").read_text(encoding="utf-8"), "original\n")
            self.assertTrue(stage.exists())

    def test_installer_finalization_is_explicit_and_post_commit(self):
        installer = (ROOT / "install.nu").read_text(encoding="utf-8")
        flag = "--finalize-nushell-history"
        finalization = 'if $finalize_nushell_history and (should_install "nushell"'
        self.assertIn(flag, installer)
        self.assertIn("-RemoveSource", installer)
        self.assertIn(finalization, installer)
        self.assertLess(installer.index('event: "run_committed"'), installer.index(finalization))
        self.assertIn("default 'D:\\ProgramData\\envCross_dotfiles'", installer)
        self.assertIn('let backup_root = ($state_root | path join "backups"', installer)
        self.assertIn('let transaction_root = ($state_root | path join "transactions")', installer)
        self.assertIn('let generated_zed_settings = ($state_root | path join "generated"', installer)
        self.assertNotIn('$localappdata | path join "envCross_dotfiles"', installer)


if __name__ == "__main__":
    unittest.main()
