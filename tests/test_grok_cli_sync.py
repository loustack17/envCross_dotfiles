import importlib.util
import os
import pathlib
import tempfile
import tomllib
import unittest
from unittest import mock

ROOT = pathlib.Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("grok_sync", ROOT / "scripts/sync-grok-cli.py")
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


class GrokSyncTests(unittest.TestCase):
    def test_preserves_provider_and_ui_while_removing_stale_tools(self):
        with tempfile.TemporaryDirectory() as folder:
            home = pathlib.Path(folder)
            path = home / ".grok/config.toml"
            path.parent.mkdir()
            backup_root = home / "state" / "backups" / "grok"
            original = '[ui]\ncustom="keep"\n[model.custom]\nmodel="keep"\n[mcp_servers.mem0]\nurl="https://example.test"\n'
            path.write_text(original)
            MODULE.synchronize(home, backup_root=backup_root)
            data = tomllib.loads(path.read_text())
            self.assertEqual(data["ui"], {"custom": "keep"})
            self.assertEqual(data["model"], {"custom": {"model": "keep"}})
            self.assertEqual(set(data["mcp_servers"]), {"code-review-graph", "mem0"})
            self.assertEqual(data["mcp_servers"]["mem0"]["url"], "https://mcp.mem0.ai/mcp")
            self.assertTrue(data["subagents"]["enabled"])
            self.assertEqual(data["subagents"]["sampling_limit"], 2)
            self.assertEqual(len(list(backup_root.iterdir())), 1)
            first = path.read_bytes()
            MODULE.synchronize(home, backup_root=backup_root)
            self.assertEqual(path.read_bytes(), first)
            self.assertEqual(len(list(backup_root.iterdir())), 1)

    @unittest.skipUnless(os.name == "nt", "Windows backup policy")
    def test_default_backup_root_rejects_c_drive(self):
        with mock.patch.dict(os.environ, {"ENVCROSS_STATE_ROOT": r"C:\backups"}):
            with self.assertRaises(ValueError):
                MODULE.default_backup_root()


if __name__ == "__main__":
    unittest.main()
