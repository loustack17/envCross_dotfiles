import pathlib
import subprocess
import sys
import tempfile
import tomllib
import unittest


ROOT = pathlib.Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "merge-codex-config.py"
CONFIG = ROOT / "ai-assistants" / ".codex"


class CodexConfigGenerationTests(unittest.TestCase):
    def render(self, platform):
        temporary = tempfile.TemporaryDirectory()
        self.addCleanup(temporary.cleanup)
        output = pathlib.Path(temporary.name) / "config.toml"
        subprocess.run(
            [sys.executable, SCRIPT, CONFIG / "config.toml", CONFIG / platform, output],
            check=True,
        )
        return tomllib.loads(output.read_text(encoding="utf-8"))

    def test_windows_active_config_contains_common_and_windows_values(self):
        config = self.render("windows.config.toml")
        self.assertTrue(config["mcp_servers"]["mem0"]["enabled"])
        self.assertEqual(config["windows"]["sandbox"], "elevated")
        self.assertNotIn("model_provider", config)
        self.assertNotIn(
            "base_url",
            config["model_providers"]["cc-switch-official"],
        )
        self.assertIn(r"d:\notes\workflow\envcross_dotfiles", config["projects"])
        self.assertNotIn("/home/lou/Documents/WorkFlow/envCross_dotfiles", config["projects"])

    def test_linux_active_config_contains_common_and_linux_values(self):
        config = self.render("linux.config.toml")
        self.assertTrue(config["mcp_servers"]["mem0"]["enabled"])
        self.assertIn("/home/lou/Documents/WorkFlow/envCross_dotfiles", config["projects"])
        self.assertNotIn("windows", config)

    def test_duplicate_leaf_is_rejected_without_replacing_output(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = pathlib.Path(temporary)
            common = root / "common.toml"
            platform = root / "platform.toml"
            output = root / "output.toml"
            common.write_text('model = "a"\n', encoding="utf-8")
            platform.write_text('model = "b"\n', encoding="utf-8")
            output.write_text("preserve\n", encoding="utf-8")
            result = subprocess.run(
                [sys.executable, SCRIPT, common, platform, output],
                capture_output=True,
                text=True,
            )
            self.assertNotEqual(result.returncode, 0)
            self.assertEqual(output.read_text(encoding="utf-8"), "preserve\n")

    def test_only_allowlisted_runtime_state_is_preserved(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = pathlib.Path(temporary)
            common = root / "common.toml"
            platform = root / "platform.toml"
            output = root / "output.toml"
            common.write_text('model = "gpt-5.6-sol"\n', encoding="utf-8")
            platform.write_text('[windows]\nsandbox = "elevated"\n', encoding="utf-8")
            output.write_text(
                'model_provider = "unsafe"\n'
                'notify = ["runtime.exe", "turn-ended"]\n'
                '[model_providers.unsafe]\nbase_url = "http://127.0.0.1:1"\n'
                '[mcp_servers.node_repl]\ncommand = "node_repl.exe"\n'
                '[hooks.state."hook"]\ntrusted_hash = "sha256:test"\n'
                '[marketplaces.openai-bundled]\nsource_type = "local"\nsource = "runtime"\n'
                '[marketplaces.openai-primary-runtime]\nsource_type = "local"\nsource = "primary"\n'
                '[plugins."documents@openai-primary-runtime"]\nenabled = true\nunsafe = "drop"\n'
                '[plugins."unknown@third-party"]\nenabled = true\n',
                encoding="utf-8",
            )
            subprocess.run([sys.executable, SCRIPT, common, platform, output], check=True)
            config = tomllib.loads(output.read_text(encoding="utf-8"))
            self.assertNotIn("model_provider", config)
            self.assertNotIn("model_providers", config)
            self.assertEqual(config["notify"], ["runtime.exe", "turn-ended"])
            self.assertEqual(config["mcp_servers"]["node_repl"]["command"], "node_repl.exe")
            self.assertEqual(config["hooks"]["state"]["hook"]["trusted_hash"], "sha256:test")
            self.assertEqual(config["marketplaces"]["openai-bundled"]["source"], "runtime")
            self.assertEqual(
                config["marketplaces"]["openai-primary-runtime"]["source"],
                "primary",
            )
            self.assertEqual(
                config["plugins"]["documents@openai-primary-runtime"],
                {"enabled": True},
            )
            self.assertNotIn("unknown@third-party", config.get("plugins", {}))


if __name__ == "__main__":
    unittest.main()
