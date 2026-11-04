import pathlib
import tomllib
import unittest


ROOT = pathlib.Path(__file__).resolve().parents[1] / "ai-assistants"


class AgentRoutingTests(unittest.TestCase):
    def test_codex_defaults(self):
        config = tomllib.loads((ROOT / ".codex/config.toml").read_text())
        self.assertEqual(config["model"], "gpt-6-sol")
        self.assertEqual(config["model_reasoning_effort"], "medium")
        self.assertTrue(config["features"]["multi_agent"])
        self.assertTrue(config["agents"]["enabled"])
        self.assertEqual(config["agents"]["default_subagent_model"], "gpt-6-luna")
        self.assertEqual(config["agents"]["default_subagent_reasoning_effort"], "high")
        self.assertEqual(config["agents"]["max_concurrent_threads_per_session"], 4)
        self.assertIn("mem0", config["mcp_servers"])
        self.assertTrue(config["mcp_servers"]["mem0"]["enabled"])

    def test_codex_role_routing_and_permissions(self):
        expected = {
            "explorer": ("gpt-6-luna", "high", "read-only"),
            "researcher": ("gpt-6-luna", "high", "read-only"),
            "worker": ("gpt-6-luna", "high", "workspace-write"),
            "reviewer": ("gpt-6-sol", "medium", "read-only"),
            "designer": ("gpt-6-luna", "high", "workspace-write"),
        }
        self.assertEqual(
            {path.stem for path in (ROOT / ".codex/agents").glob("*.toml")},
            set(expected),
        )
        for name, values in expected.items():
            with self.subTest(role=name):
                role = tomllib.loads((ROOT / f".codex/agents/{name}.toml").read_text())
                self.assertEqual(role["name"], name)
                self.assertEqual(
                    tuple(role[key] for key in ("model", "model_reasoning_effort", "sandbox_mode")),
                    values,
                )



if __name__ == "__main__":
    unittest.main()
