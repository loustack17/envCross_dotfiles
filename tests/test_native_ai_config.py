import json
import pathlib
import tomllib
import unittest


ROOT = pathlib.Path(__file__).resolve().parents[1]


class NativeAIConfigTests(unittest.TestCase):
    def test_claude_hooks_use_direct_executables_and_no_custom_statusline(self):
        settings = json.loads((ROOT / "ai-assistants/.claude/settings.json").read_text(encoding="utf-8"))
        self.assertNotIn("statusLine", settings)
        for event in settings["hooks"].values():
            for matcher in event:
                for hook in matcher["hooks"]:
                    self.assertEqual(hook["command"], "code-review-graph")
                    self.assertIsInstance(hook["args"], list)
                    self.assertNotIn("shell", hook)

    def test_codex_uses_one_shared_config_without_model_profiles(self):
        source = ROOT / "ai-assistants/.codex"
        settings = tomllib.loads((source / "config.toml").read_text(encoding="utf-8"))
        self.assertNotIn("profiles", settings)
        self.assertNotIn("profile", settings)
        self.assertEqual(settings["windows"]["sandbox"], "elevated")
        self.assertEqual(list(source.glob("*.config.toml")), [])

    def test_installers_link_both_native_config_sources_without_generators(self):
        windows = (ROOT / "install.nu").read_text(encoding="utf-8")
        linux = (ROOT / "install.sh").read_text(encoding="utf-8")
        for text in (windows, linux):
            self.assertNotIn("merge-codex-config", text)
            self.assertNotIn("generated_codex", text)
            self.assertNotIn("platform-command", text)
        self.assertIn('{src: $codex_config, dest: ($codex_system_home | path join "config.toml")', windows)
        self.assertNotIn('{src: $codex_config, dest: ($codex_home | path join "config.toml")', windows)
        self.assertIn('path join ".codex" "local" "windows" "config.toml"', windows)
        self.assertIn('"$codex_user_source" "$HOME/.codex/config.toml"', linux)
        self.assertIn('if [[ -f "$codex_user_source" ]]; then', linux)
        self.assertIn('/ai-assistants/.codex/local/', (ROOT / ".gitignore").read_text())
        self.assertNotIn("Codex user config must be a local regular file", windows + linux)
        self.assertIn('"$codex_system_source" /etc/codex/config.toml', linux)
        self.assertNotIn('"$REPO_ROOT/ai-assistants/.codex/config.toml" "$HOME/.codex/config.toml"', linux)


if __name__ == "__main__":
    unittest.main()
