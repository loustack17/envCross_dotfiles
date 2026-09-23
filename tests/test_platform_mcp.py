import json
import pathlib
import subprocess
import sys
import tempfile
import unittest


ROOT = pathlib.Path(__file__).resolve().parents[1]


class PlatformMcpTests(unittest.TestCase):
    def test_zed_mcp_is_platform_specific_and_mem0_remains_enabled(self):
        common = ROOT / "zed" / "settings.json"
        self.assertNotIn("context_servers", json.loads(common.read_text(encoding="utf-8")))
        with tempfile.TemporaryDirectory(dir=ROOT) as directory:
            output = pathlib.Path(directory) / "settings.json"
            for platform in ("windows", "linux"):
                subprocess.run(
                    [sys.executable, str(ROOT / "scripts" / "merge-json.py"), str(common), str(ROOT / "zed" / f"platform.{platform}.json"), str(output)],
                    check=True,
                )
                settings = json.loads(output.read_text(encoding="utf-8"))
                self.assertIn("mem0", settings["context_servers"])
                if platform == "windows":
                    self.assertEqual(settings["context_servers"]["mem0"]["url"], "https://mcp.mem0.ai/mcp")
                    self.assertEqual(settings["context_servers"]["code-review-graph"]["command"], r"D:\ProgramData\Scoop\shims\uvx.exe")
                    self.assertNotIn("/home/lou", output.read_text(encoding="utf-8"))
                else:
                    self.assertIn("firecrawl", settings["context_servers"])

    def test_hermes_mcp_is_platform_specific_and_mem0_remains_enabled(self):
        common = ROOT / "ai-assistants" / ".hermes" / "config.yaml"
        self.assertNotIn("\nmcp_servers:", common.read_text(encoding="utf-8"))
        with tempfile.TemporaryDirectory(dir=ROOT) as directory:
            output = pathlib.Path(directory) / "config.yaml"
            for platform in ("windows", "linux"):
                subprocess.run(
                    [sys.executable, str(ROOT / "scripts" / "render-hermes-config.py"), str(common), str(common.parent / f"mcp.{platform}.yaml"), str(output)],
                    check=True,
                )
                rendered = output.read_text(encoding="utf-8")
                self.assertEqual(rendered.count("\nmcp_servers:"), 1)
                self.assertIn("  mem0:\n", rendered)
                if platform == "windows":
                    self.assertIn("    auth: oauth", rendered)
                    self.assertIn(r"command: D:\ProgramData\Scoop\shims\uvx.exe", rendered)
                    self.assertNotIn("/home/lou", rendered)
                else:
                    self.assertIn("run-mem0.sh", rendered)


if __name__ == "__main__":
    unittest.main()
