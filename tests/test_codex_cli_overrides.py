import importlib.util
import pathlib
import tempfile
import tomllib
import unittest


ROOT = pathlib.Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("overrides", ROOT / "scripts/codex-cli-overrides.py")
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


class CliOverrideTests(unittest.TestCase):
    def resolve(self, home, profile=None):
        args = MODULE.build(home, profile)
        self.assertTrue(all(flag == "-c" for flag in args[::2]))
        return tomllib.loads("\n".join(args[1::2]))

    def test_stale_cc_switch_mcp_and_model_do_not_win(self):
        with tempfile.TemporaryDirectory() as folder:
            home = pathlib.Path(folder)
            (home / ".codex").mkdir()
            (home / ".codex/config.toml").write_text(
                'model="gpt-6-astra"\n[mcp_servers.linux-only]\ncommand="/home/lou/test"\n'
            )
            original = (home / ".codex/config.toml").read_bytes()
            config = self.resolve(home)
            self.assertEqual(config["model"], "gpt-6-sol")
            self.assertFalse(config["mcp_servers"]["linux-only"]["enabled"])
            self.assertTrue(config["mcp_servers"]["code-review-graph"]["enabled"])
            self.assertIn("used-tokens", config["tui"]["status_line"])
            self.assertEqual((home / ".codex/config.toml").read_bytes(), original)

    def test_global_skills_are_disabled_without_disabling_project_discovery(self):
        with tempfile.TemporaryDirectory() as folder:
            home = pathlib.Path(folder)
            skill = home / ".agents/skills/example/SKILL.md"
            skill.parent.mkdir(parents=True)
            skill.write_text("example")
            config = self.resolve(home)
            self.assertEqual(config["skills"]["config"], [{"path": str(skill), "enabled": False}])
            self.assertFalse(config["skills"]["bundled"]["enabled"])
            self.assertFalse(config["features"]["plugins"])
            self.assertTrue(skill.exists())

    def test_explicit_astra_profile_preserves_multi_agents(self):
        with tempfile.TemporaryDirectory() as folder:
            config = self.resolve(pathlib.Path(folder), "astra")
            self.assertEqual(config["model"], "gpt-6-astra")
            self.assertEqual(config["model_reasoning_effort"], "low")
            self.assertTrue(config["agents"]["enabled"])
            self.assertTrue(config["features"]["multi_agent"])

    def test_unknown_profile_is_not_silently_ignored(self):
        with self.assertRaises(ValueError):
            MODULE.build(pathlib.Path("missing-home"), "missing")


if __name__ == "__main__":
    unittest.main()
