import json
import pathlib
import tomllib
import unittest


ROOT = pathlib.Path(__file__).resolve().parents[1]
CODEX = ROOT / "ai-assistants" / ".codex"


class SecurityDefaultsTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.common = tomllib.loads((CODEX / "config.toml").read_text(encoding="utf-8"))
        cls.windows = tomllib.loads((CODEX / "windows.config.toml").read_text(encoding="utf-8"))
        cls.linux = tomllib.loads((CODEX / "linux.config.toml").read_text(encoding="utf-8"))

    def test_official_provider_has_no_persistent_endpoint_override(self):
        for name, config in (("common", self.common), ("linux", self.linux)):
            self.assertNotIn("openai_base_url", config, name)
            self.assertNotIn("model_providers", config, name)
        self.assertEqual(self.common["model_provider"], "openai")
        self.assertNotIn("model_provider", self.linux)
        self.assertNotIn("openai_base_url", self.windows)
        self.assertNotIn("model_provider", self.windows)
        self.assertNotIn("model_providers", self.windows)

    def test_home_roots_are_not_trusted(self):
        windows_projects = {path.lower() for path in self.windows.get("projects", {})}
        linux_projects = set(self.linux.get("projects", {}))
        self.assertNotIn(r"c:\users\lou", windows_projects)
        self.assertNotIn("/home/lou", linux_projects)

    def test_windows_uses_only_the_platform_sandbox_default(self):
        self.assertEqual(self.windows["windows"]["sandbox"], "unelevated")
        self.assertNotIn("windows", self.common)
        self.assertNotIn("windows", self.linux)
        self.assertEqual(
            self.windows["desktop"]["integratedTerminalShell"],
            "commandPrompt",
        )
        self.assertNotIn("integratedTerminalShell", self.common.get("desktop", {}))
        self.assertNotIn("integratedTerminalShell", self.linux["desktop"])

    def test_durable_common_excludes_application_runtime_state(self):
        self.assertNotIn("notify", self.common)
        self.assertNotIn("node_repl", self.common.get("mcp_servers", {}))
        self.assertNotIn("hooks", self.common)
        self.assertNotIn("openai-bundled", self.common.get("marketplaces", {}))
        self.assertFalse((ROOT / "Windows" / "codex" / "config.toml").exists())

    def test_codex_mcp_defaults_preserve_memory_without_blocking_startup(self):
        servers = self.common["mcp_servers"]
        self.assertTrue(servers["code-review-graph"]["enabled"])
        self.assertFalse(servers["code-review-graph"]["required"])
        self.assertTrue(servers["mem0"]["enabled"])
        self.assertFalse(servers["mem0"]["required"])
        self.assertNotIn("memories", self.common["features"])
        self.assertNotIn("memories", self.common)

    def test_removed_codex_features_are_not_persisted(self):
        self.assertNotIn("js_repl", self.common["features"])

    def test_nushell_history_path_cannot_be_redirected_by_environment(self):
        config = (ROOT / "Windows" / "nushell" / "config.nu").read_text(encoding="utf-8")
        self.assertIn(r"D:\ProgramData\envCross_dotfiles", config)
        self.assertNotIn("ENVCROSS_STATE_ROOT", config)

    def test_cc_switch_preserves_official_codex_auth(self):
        settings = json.loads(
            (ROOT / "ai-assistants" / ".cc-switch" / "settings.json").read_text(
                encoding="utf-8"
            )
        )
        self.assertTrue(settings["preserveCodexOfficialAuthOnSwitch"])

    def test_cc_switch_optional_mcp_defaults_are_off(self):
        catalog = json.loads(
            (ROOT / "ai-assistants" / "mcp" / "cc-switch-mcp.json").read_text(
                encoding="utf-8"
            )
        )["servers"]
        self.assertEqual(catalog["code-review-graph"]["enabled"], ["codex", "opencode"])
        self.assertEqual(
            catalog["mem0"]["enabled"],
            ["claude", "codex", "opencode", "hermes"],
        )
        for name, entry in catalog.items():
            if name in {"code-review-graph", "mem0"}:
                continue
            self.assertTrue(
                set(entry.get("enabled", [])).isdisjoint(
                    {"claude", "codex", "gemini", "hermes"}
                ),
                name,
            )

    def test_graph_hooks_avoid_read_only_shell_churn(self):
        claude = json.loads(
            (ROOT / "ai-assistants" / ".claude" / "settings.json").read_text(
                encoding="utf-8"
            )
        )
        post_tool_use = claude["hooks"]["PostToolUse"]
        self.assertEqual(post_tool_use[0]["matcher"], "Edit|Write")

    def test_shared_skills_do_not_depend_on_windows_local_links(self):
        skills = ROOT / "ai-assistants" / "SKILLS"
        for entry in skills.iterdir():
            self.assertFalse(entry.is_symlink(), entry.name)
        self.assertTrue((skills / "caveman-compress" / "SKILL.md").is_file())


if __name__ == "__main__":
    unittest.main()
