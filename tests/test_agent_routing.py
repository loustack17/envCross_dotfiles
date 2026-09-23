import json
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
        self.assertEqual(config["profiles"]["astra"]["model"], "gpt-6-astra")
        self.assertEqual(config["profiles"]["astra"]["model_reasoning_effort"], "low")
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

    def test_openai_preset_is_selected_for_current_workflow(self):
        config = json.loads((ROOT / ".opencode/oh-my-opencode-slim.json").read_text())
        self.assertEqual(config["preset"], "openai")
        preset = config["presets"]["openai"]
        self.assertEqual(preset["orchestrator"]["model"], "openai/gpt-6-sol")
        self.assertEqual(preset["orchestrator"]["variant"], "high")
        self.assertEqual(preset["fixer"]["model"], "openai/gpt-6-luna")

    def test_selected_preset_tool_scope_is_preserved(self):
        config = json.loads((ROOT / ".opencode/oh-my-opencode-slim.json").read_text())
        preset = config["presets"][config["preset"]]
        self.assertEqual(preset["orchestrator"]["skills"], ["*"])
        self.assertEqual(preset["orchestrator"]["mcps"], ["*", "!context7"])
        self.assertEqual(preset["librarian"]["mcps"], ["context7", "gh_grep"])
        for role in ("oracle", "explorer", "designer", "fixer"):
            self.assertEqual(preset[role]["mcps"], [])


if __name__ == "__main__":
    unittest.main()
