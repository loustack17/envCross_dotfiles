import importlib.util
import json
import pathlib
import unittest


ROOT = pathlib.Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "merge-opencode-config.py"
CONFIG = ROOT / "ai-assistants" / ".opencode"
SPEC = importlib.util.spec_from_file_location("merge_opencode_config", SCRIPT)
MERGER = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MERGER)


class OpenCodeConfigGenerationTests(unittest.TestCase):
    def render(self, platform):
        common = json.loads((CONFIG / "opencode.json").read_text(encoding="utf-8"))
        platform_config = json.loads((CONFIG / platform).read_text(encoding="utf-8"))
        return json.loads(MERGER.render(common, platform_config))

    def test_windows_active_config_merges_common_and_windows_values(self):
        config = self.render("opencode.windows.json")
        self.assertEqual(config["shell"], "cmd.exe")
        self.assertEqual(config["provider"]["nvidia"]["options"]["apiKey"], "{env:NVIDIA_API_KEY}")
        self.assertNotIn("lsp", config)
        self.assertNotIn("prune", config["compaction"])
        self.assertEqual(config["mcp"]["mem0"]["url"], "https://mcp.mem0.ai/mcp")
        self.assertTrue(config["mcp"]["mem0"]["enabled"])

    def test_linux_active_config_merges_common_and_linux_values(self):
        config = self.render("opencode.linux.json")
        expected_read = {"*": "allow", "*.env": "deny", "*.env.*": "deny", "*.env.example": "allow"}
        self.assertEqual(config["agent"]["build"]["permission"]["read"], expected_read)
        self.assertEqual(config["permission"]["read"], expected_read)
        self.assertNotIn("tools", config["agent"]["build"])
        self.assertEqual(config["mcp"]["code-review-graph"]["enabled"], True)
        self.assertEqual(config["plugin"][0], "superpowers@git+https://github.com/obra/superpowers.git")
        self.assertEqual(config["permission"]["bash"]["git diff*"], "allow")
        self.assertIn("bash", config["lsp"])
        self.assertTrue(config["compaction"]["prune"])

    def test_merge_recurses_through_objects_and_replaces_arrays(self):
        self.assertEqual(
            MERGER.merge(
                {"nested": {"common": 1, "override": 1}, "items": [1]},
                {"nested": {"override": 2, "platform": 3}, "items": [2]},
            ),
            {"nested": {"common": 1, "override": 2, "platform": 3}, "items": [2]},
        )

    def test_installers_render_platform_configs_without_shell_policy(self):
        linux_installer = (ROOT / "install.sh").read_text(encoding="utf-8")
        windows_installer = (ROOT / "install.nu").read_text(encoding="utf-8")
        self.assertIn('"$opencode_root/opencode.linux.json"', linux_installer)
        self.assertIn('"opencode.windows.json"', windows_installer)
        self.assertIn("generated/opencode/opencode.json", linux_installer)
        self.assertIn('path join "opencode" | path join "opencode.json"', windows_installer)
        self.assertIn('"$HOME/.claude/AGENTS.md"', linux_installer)
        self.assertIn('"$HOME/.gemini/GEMINI.md"', linux_installer)
        self.assertIn('path join "AGENTS.md"', windows_installer)
        self.assertIn('dest: ($gemini_home | path join "GEMINI.md")', windows_installer)
        self.assertIn('path join "oh-my-opencode-slim.json"', windows_installer)
        self.assertNotIn("enforce-shell-policy", linux_installer)
        self.assertNotIn("enforce-shell-policy", windows_installer)


if __name__ == "__main__":
    unittest.main()
