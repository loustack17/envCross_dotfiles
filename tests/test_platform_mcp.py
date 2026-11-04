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



if __name__ == "__main__":
    unittest.main()
