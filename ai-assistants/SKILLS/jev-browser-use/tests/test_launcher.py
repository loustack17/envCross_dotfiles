import importlib.util
import io
import json
import os
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

SPEC = importlib.util.spec_from_file_location("local_jev_launcher", Path(__file__).resolve().parents[1] / "run.py")
launcher = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(launcher)


def request():
    return {"url": "https://example.com/", "goal": "Read the example page", "allow_hosts": ["example.com"],
            "expect": "Example Domain"}


class LauncherTests(unittest.TestCase):
    def test_request_cannot_override_browser_or_enable_text_model(self):
        for key in ("cdp", "chrome_path", "text_backend", "never_click"):
            with self.subTest(key=key), self.assertRaises(ValueError):
                launcher.arguments({**request(), key: "override"})

    def test_exact_host_and_independent_outcome_required(self):
        for changes in ({"allow_hosts": []}, {"allow_hosts": ["other.example"]}, {"expect": ""},
                        {"url": "https://user:password@example.com/"}, {"url": "file:///private"},
                        {"url": "http://127.0.0.1/", "allow_hosts": ["127.0.0.1"]},
                        {"url": "http://localhost/", "allow_hosts": ["localhost"]},
                        {"url": "http://192.168.1.1/", "allow_hosts": ["192.168.1.1"]},
                        {"url": "https://example.com:8443/"}):
            with self.subTest(changes=changes), self.assertRaises(ValueError):
                launcher.arguments({**request(), **changes})

    def test_budget_cannot_be_unbounded(self):
        for ticks in (0, -1, 11, True):
            with self.subTest(ticks=ticks), self.assertRaises(ValueError):
                launcher.arguments({**request(), "max_ticks": ticks})

    def test_text_model_disabled_and_known_text_preserved(self):
        args = launcher.arguments({**request(), "values": {"Query": "backend=a"}})
        self.assertIn("--no-text-backend", args)
        self.assertIn("Query=backend=a", args)
        self.assertNotIn("--cdp", args)

    def test_bws_token_and_unrelated_credentials_do_not_reach_worker(self):
        environment = {"BWS_ACCESS_TOKEN": "test-bws", "OPENAI_API_KEY": "test-other", "PATH": "test-path",
                       "BU_CDP_WS": "ws://unrelated", "TEXT_MODEL_API_KEY": "test-text"}
        with patch.dict(os.environ, environment, clear=True), patch.object(launcher.sys, "argv", ["run.py"]), \
                patch.object(launcher.sys, "stdin", io.StringIO(json.dumps(request()))), \
                patch.object(Path, "is_file", return_value=True), \
                patch.object(launcher, "ensure_public_destination"), \
                patch.object(launcher.runpy, "run_path", return_value={"retrieve_key": lambda: "test-jev"}), \
                patch.object(launcher.subprocess, "run", return_value=SimpleNamespace(returncode=0)) as child:
            self.assertEqual(launcher.main(), 0)
        env = child.call_args.kwargs["env"]
        self.assertEqual(env["TYPESAFE_API_KEY"], "test-jev")
        self.assertEqual(env["BH_TELEMETRY"], "0")
        for key in ("BWS_ACCESS_TOKEN", "OPENAI_API_KEY", "BU_CDP_WS", "TEXT_MODEL_API_KEY"):
            self.assertNotIn(key, env)
        self.assertNotIn("test-jev", str(child.call_args.args))


if __name__ == "__main__":
    unittest.main()
