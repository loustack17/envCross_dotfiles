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
        self.assertEqual(set(config["mcp_servers"]), {"code-review-graph", "mem0"})
        self.assertEqual(config["windows"]["sandbox"], "unelevated")
        self.assertEqual(config["model_provider"], "openai")
        self.assertNotIn("model_providers", config)
        self.assertIn(r"d:\notes\workflow\envcross_dotfiles", config["projects"])
        self.assertNotIn("/home/lou/Documents/WorkFlow/envCross_dotfiles", config["projects"])

    def test_linux_active_config_contains_common_and_linux_values(self):
        config = self.render("linux.config.toml")
        self.assertEqual(set(config["mcp_servers"]), {"code-review-graph", "mem0"})
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

    def test_active_app_state_survives_regeneration_without_overriding_repo(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = pathlib.Path(temporary)
            common = root / "common.toml"
            platform = root / "platform.toml"
            output = root / "output.toml"
            active = root / "active.toml"
            common.write_text(
                'model = "gpt-6-sol"\n[tui]\ntheme = "dracula"\n'
                '[plugins."unified-computer-use@openai-bundled"]\nenabled = true\n',
                encoding="utf-8",
            )
            platform.write_text(
                '[desktop]\nfollowUpQueueMode = "queue"\n'
                '[projects."C:\\\\Users\\\\Lou\\\\work"]\ntrust_level = "trusted"\n',
                encoding="utf-8",
            )
            output.write_text('[desktop]\noldPreference = true\n', encoding="utf-8")
            active.write_text(
                'model = "old-model"\n'
                '[desktop]\nfollowUpQueueMode = "replace"\nconversationDetailMode = "expanded"\n'
                '[tui]\ntheme = "old"\nscreen_reader_detection_done = true\n'
                '[apps.connector_openai_codex_document_control]\nenabled = true\n'
                '[projects."C:\\\\Users\\\\Lou\\\\work"]\ntrust_level = "untrusted"\n'
                '[plugins."unified-computer-use@openai-bundled"]\nenabled = false\n'
                '[mcp_servers.cua_repl]\nenabled = false\n'
                '[mcp_servers.unsafe]\ncommand = "unsafe.exe"\n',
                encoding="utf-8",
            )
            subprocess.run(
                [sys.executable, SCRIPT, common, platform, output, "--runtime-source", active],
                check=True,
            )
            config = tomllib.loads(output.read_text(encoding="utf-8"))
            self.assertEqual(config["model"], "gpt-6-sol")
            self.assertEqual(config["desktop"]["followUpQueueMode"], "replace")
            self.assertEqual(config["desktop"]["conversationDetailMode"], "expanded")
            self.assertNotIn("oldPreference", config["desktop"])
            self.assertEqual(config["tui"]["theme"], "dracula")
            self.assertTrue(config["tui"]["screen_reader_detection_done"])
            self.assertTrue(config["apps"]["connector_openai_codex_document_control"]["enabled"])
            self.assertEqual(len(config["projects"]), 1)
            self.assertEqual(next(iter(config["projects"].values()))["trust_level"], "untrusted")
            self.assertFalse(config["plugins"]["unified-computer-use@openai-bundled"]["enabled"])
            self.assertFalse(config["mcp_servers"]["cua_repl"]["enabled"])
            self.assertNotIn("unsafe", config["mcp_servers"])
            self.assertIn('model = "old-model"', active.read_text(encoding="utf-8"))

    def test_invalid_active_config_does_not_replace_output(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = pathlib.Path(temporary)
            common = root / "common.toml"
            platform = root / "platform.toml"
            output = root / "output.toml"
            active = root / "active.toml"
            common.write_text('model = "gpt-6-sol"\n', encoding="utf-8")
            platform.write_text('[windows]\nsandbox = "unelevated"\n', encoding="utf-8")
            output.write_text("preserve\n", encoding="utf-8")
            active.write_text("invalid = [\n", encoding="utf-8")
            result = subprocess.run(
                [sys.executable, SCRIPT, common, platform, output, "--runtime-source", active],
                capture_output=True,
                text=True,
            )
            self.assertNotEqual(result.returncode, 0)
            self.assertEqual(output.read_text(encoding="utf-8"), "preserve\n")

    def test_linked_active_config_is_not_changed_before_swap(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = pathlib.Path(temporary)
            common = root / "common.toml"
            platform = root / "platform.toml"
            active_target = root / "config.0.toml"
            output = root / "config.1.toml"
            active = root / "active.toml"
            common.write_text('model = "gpt-6-sol"\n', encoding="utf-8")
            platform.write_text('[windows]\nsandbox = "unelevated"\n', encoding="utf-8")
            active_target.write_text('[desktop]\nconversationDetailMode = "expanded"\n', encoding="utf-8")
            try:
                active.symlink_to(active_target)
            except OSError as error:
                self.skipTest(f"symlink unavailable: {error}")
            before = active_target.read_bytes()
            subprocess.run(
                [sys.executable, SCRIPT, common, platform, output, "--runtime-source", active],
                check=True,
            )
            self.assertEqual(active_target.read_bytes(), before)
            config = tomllib.loads(output.read_text(encoding="utf-8"))
            self.assertEqual(config["desktop"]["conversationDetailMode"], "expanded")


if __name__ == "__main__":
    unittest.main()
