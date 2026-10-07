import argparse
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
from uuid import UUID


CONFIG = Path(__file__).resolve().parents[1] / "references/bitwarden.json"


def bitwarden_environment():
    environment = os.environ.copy()
    if not environment.get("BWS_ACCESS_TOKEN") and os.name != "nt" and shutil.which("secret-tool"):
        result = subprocess.run(
            ["secret-tool", "lookup", "service", "envcross-secrets", "key", "bws-access-token"],
            capture_output=True, text=True, timeout=30,
        )
        if result.returncode == 0 and result.stdout.strip():
            environment["BWS_ACCESS_TOKEN"] = result.stdout.strip()
    return environment


def retrieve_key():
    config = json.loads(CONFIG.read_text(encoding="utf-8"))
    secret_id = str(UUID(config["secret_id"]))
    if not shutil.which("bws"):
        raise RuntimeError("Bitwarden Secrets Manager CLI (bws) is unavailable.")
    result = subprocess.run(
        ["bws", "secret", "get", secret_id, "--output", "json"],
        env=bitwarden_environment(), capture_output=True, text=True, timeout=45,
    )
    if result.returncode:
        raise RuntimeError("Bitwarden retrieval failed. Check machine-account authentication and secret access.")
    secret = json.loads(result.stdout)
    if secret.get("id") != secret_id:
        raise RuntimeError("Bitwarden returned an unexpected secret.")
    value = secret.get("value")
    if not isinstance(value, str) or not value.strip():
        raise RuntimeError("The TypeSafe secret is empty.")
    return value


def main(argv=None):
    parser = argparse.ArgumentParser(description="Run a TypeSafe command with its API key from Bitwarden.")
    parser.add_argument("--check", action="store_true")
    parser.add_argument("command", nargs=argparse.REMAINDER)
    args = parser.parse_args(argv)
    command = args.command
    if command[:1] == ["--"]:
        command = command[1:]
    if (args.check and command) or (not args.check and not command):
        parser.error("Use --check or -- command [args...].")
    try:
        key = retrieve_key()
        if args.check:
            print("TypeSafe API key retrieved from Bitwarden; value not displayed.")
            return 0
        environment = os.environ.copy()
        environment["TYPESAFE_API_KEY"] = key
        for name in ("BWS_ACCESS_TOKEN", "JEV_API_KEY", "BW_SESSION"):
            environment.pop(name, None)
        return subprocess.run(command, env=environment).returncode
    except RuntimeError as error:
        print(str(error), file=sys.stderr)
    except (OSError, ValueError, KeyError, TypeError, subprocess.SubprocessError):
        print("TypeSafe credential loading or command execution failed; secret details suppressed.", file=sys.stderr)
    return 125


if __name__ == "__main__":
    sys.exit(main())
