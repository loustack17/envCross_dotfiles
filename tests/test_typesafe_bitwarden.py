import contextlib
import importlib.util
import io
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest import mock


ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location(
    "typesafe_bitwarden", ROOT / "ai-assistants/SKILLS/typesafe-ai/scripts/with-bitwarden.py"
)
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)
SECRET_ID = "a422228e-c585-43d9-a7e6-b4db0165831f"


class TypeSafeBitwardenTests(unittest.TestCase):
    def test_injects_only_into_child_and_preserves_arguments_and_exit_code(self):
        environment = {"BWS_ACCESS_TOKEN": "machine-token", "JEV_API_KEY": "stale", "TYPESAFE_API_KEY": "old"}
        with mock.patch.dict(os.environ, environment, clear=True), mock.patch.object(MODULE, "retrieve_key", return_value="fresh-key") as retrieve, mock.patch.object(MODULE.subprocess, "run", return_value=subprocess.CompletedProcess([], 7)) as run:
            self.assertEqual(MODULE.main(["--", "python", "file with spaces.py"]), 7)
            retrieve.assert_called_once_with()
            self.assertEqual(run.call_args.args[0], ["python", "file with spaces.py"])
            child = run.call_args.kwargs["env"]
            self.assertEqual(child["TYPESAFE_API_KEY"], "fresh-key")
            self.assertNotIn("BWS_ACCESS_TOKEN", child)
            self.assertNotIn("JEV_API_KEY", child)
            self.assertEqual(dict(os.environ), environment)

    def test_check_never_prints_key_or_starts_child(self):
        output = io.StringIO()
        with mock.patch.object(MODULE, "retrieve_key", return_value="private-key"), mock.patch.object(MODULE.subprocess, "run") as run, contextlib.redirect_stdout(output):
            self.assertEqual(MODULE.main(["--check"]), 0)
            run.assert_not_called()
        self.assertNotIn("private-key", output.getvalue())

    def test_failed_retrieval_never_starts_child(self):
        error = io.StringIO()
        with mock.patch.object(MODULE, "retrieve_key", side_effect=RuntimeError("Bitwarden retrieval failed.")), mock.patch.object(MODULE.subprocess, "run") as run, contextlib.redirect_stderr(error):
            self.assertEqual(MODULE.main(["--", "python", "example.py"]), 125)
            run.assert_not_called()

    def test_gets_pinned_secret_and_rejects_wrong_empty_or_failed_response(self):
        with tempfile.TemporaryDirectory() as folder:
            config = Path(folder) / "bitwarden.json"
            config.write_text(json.dumps({"secret_id": SECRET_ID, "secret_name": "JEV_API_KEY"}), encoding="utf-8")
            valid = {"id": SECRET_ID, "key": "JEV_API_KEY", "value": "private-key"}
            cases = [(valid, 0, True), ({**valid, "id": "other"}, 0, False), ({**valid, "key": "TYPESAFE_API_KEY"}, 0, True), ({**valid, "value": ""}, 0, False), (valid, 1, False)]
            for secret, code, accepted in cases:
                with self.subTest(secret=secret["key"], code=code, accepted=accepted), mock.patch.object(MODULE, "CONFIG", config), mock.patch.object(MODULE.shutil, "which", return_value="bws"), mock.patch.object(MODULE, "bitwarden_environment", return_value={"BWS_ACCESS_TOKEN": "machine-token"}), mock.patch.object(MODULE.subprocess, "run", return_value=subprocess.CompletedProcess([], code, json.dumps(secret), "private-error")) as run:
                    if accepted:
                        self.assertEqual(MODULE.retrieve_key(), "private-key")
                    else:
                        with self.assertRaises(RuntimeError) as caught:
                            MODULE.retrieve_key()
                        self.assertNotIn("private", str(caught.exception))
                    self.assertEqual(run.call_args.args[0], ["bws", "secret", "get", SECRET_ID, "--output", "json"])


if __name__ == "__main__":
    unittest.main()
