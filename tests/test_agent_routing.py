import pathlib
import tomllib
import unittest


ROOT = pathlib.Path(__file__).resolve().parents[1] / "ai-assistants"
READ_ONLY_ROLES = {"explorer", "researcher", "reviewer"}


class AgentRoutingTests(unittest.TestCase):
    def test_codex_multi_agent_is_enabled_with_a_subagent_default(self):
        config = tomllib.loads((ROOT / ".codex/config.toml").read_text())
        self.assertTrue(config["features"]["multi_agent"])
        self.assertTrue(config["agents"]["enabled"])
        for key in ("model", "model_reasoning_effort"):
            self.assertTrue(config[key])
        self.assertTrue(config["agents"]["default_subagent_model"])

    def test_codex_roles_are_complete_and_read_only_where_expected(self):
        roles = sorted((ROOT / ".codex/agents").glob("*.toml"))
        self.assertTrue(roles)
        for path in roles:
            with self.subTest(role=path.stem):
                role = tomllib.loads(path.read_text())
                self.assertEqual(role["name"], path.stem)
                self.assertTrue(role["model"])
                self.assertTrue(role["model_reasoning_effort"])
                expected = "read-only" if path.stem in READ_ONLY_ROLES else "workspace-write"
                self.assertEqual(role["sandbox_mode"], expected)


if __name__ == "__main__":
    unittest.main()
