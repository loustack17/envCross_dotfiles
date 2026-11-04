import ipaddress
import json
import os
import runpy
import shutil
import socket
import subprocess
import sys
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parent
REPO = ROOT / "vendor/jev-ultrafast"
PYTHON = REPO / ".venv" / ("Scripts/python.exe" if os.name == "nt" else "bin/python")
RUNNER = ROOT / "scripts/jev_browser_agent.py"
BWS_WRAPPER = ROOT.parent / "typesafe-ai/scripts/with-bitwarden.py"
WINDOWS_BRAVE = [Path(base) / "BraveSoftware/Brave-Browser/Application/brave.exe"
                 for base in (os.environ.get("PROGRAMFILES"), os.environ.get("LOCALAPPDATA")) if base]
BROWSER = next((path for path in WINDOWS_BRAVE if path.is_file()), Path("/unavailable-browser")) if os.name == "nt" else Path(
    next((path for name in ("brave-browser", "brave", "chromium", "google-chrome") if (path := shutil.which(name))), "/unavailable-browser"))
RUNTIME = Path(os.environ.get("LOCALAPPDATA") or Path.home() / ".local/state") / "jev-browser-use"
PROCESS_ENV = {
    "PATH", "SYSTEMROOT", "WINDIR", "TEMP", "TMP", "LOCALAPPDATA", "APPDATA",
    "HOME", "LANG", "LC_ALL", "XDG_RUNTIME_DIR", "USERPROFILE", "COMSPEC", "PATHEXT", "PROGRAMFILES", "PROGRAMFILES(X86)", "PROGRAMDATA",
}


def is_ip_literal(host):
    try:
        ipaddress.ip_address(host)
    except ValueError:
        return False
    return True


def arguments(request):
    permitted = {"url", "goal", "allow_hosts", "values", "expect", "expect_fields", "max_ticks"}
    if not isinstance(request, dict) or set(request) - permitted:
        raise ValueError("Unsupported request fields")
    url, goal = request.get("url", ""), request.get("goal", "")
    parsed = urlsplit(url)
    hosts = request.get("allow_hosts", [])
    if parsed.scheme not in {"http", "https"} or parsed.username or parsed.password:
        raise ValueError("Use an HTTP(S) URL without credentials")
    if parsed.port not in {None, 80 if parsed.scheme == "http" else 443}:
        raise ValueError("Use the standard public web port")
    if not parsed.hostname or "." not in parsed.hostname or parsed.hostname.endswith((".localhost", ".local", ".internal")):
        raise ValueError("Use a public hostname")
    try:
        address = ipaddress.ip_address(parsed.hostname)
    except ValueError:
        address = None
    if address is not None and not address.is_global:
        raise ValueError("Private destinations are not supported")
    if not isinstance(hosts, list) or not hosts or parsed.hostname not in hosts:
        raise ValueError("An explicit matching host allowlist is required")
    if any(not isinstance(host, str) or any(c in host for c in "/:* ,") or "." not in host.strip(".")
           or host.endswith((".localhost", ".local", ".internal")) or is_ip_literal(host) for host in hosts):
        raise ValueError("Use exact public hostnames")
    if not isinstance(goal, str) or not goal.strip() or len(goal) > 2000:
        raise ValueError("Supply a bounded goal")
    ticks = request.get("max_ticks", 8)
    if type(ticks) is not int or not 1 <= ticks <= 10:
        raise ValueError("max_ticks must be between 1 and 10")
    if not request.get("expect") and not request.get("expect_fields"):
        raise ValueError("An independent expected result is required")
    args = ["--url", url, "--goal", goal, "--allow-hosts", ",".join(hosts),
            "--chrome-path", str(BROWSER), "--max-ticks", str(ticks), "--no-text-backend", "--json"]
    if request.get("expect"):
        if not isinstance(request["expect"], str):
            raise ValueError("expect must be text")
        args += ["--expect", request["expect"]]
    for name, flag in (("values", "--text"), ("expect_fields", "--expect-field")):
        values = request.get(name, {})
        if not isinstance(values, dict) or len(values) > 12:
            raise ValueError("Use a small field-value map")
        for label, value in values.items():
            if not label.strip() or "=" in label or not isinstance(value, str) or len(value) > 2000:
                raise ValueError("Invalid field value")
            args += [flag, f"{label}={value}"]
    return args


def ensure_public_destination(url):
    parsed = urlsplit(url)
    addresses = socket.getaddrinfo(parsed.hostname, parsed.port or (443 if parsed.scheme == "https" else 80))
    if not addresses or any(not ipaddress.ip_address(item[4][0]).is_global for item in addresses):
        raise ValueError("The destination resolves to a non-public address")


def main():
    if not PYTHON.is_file() or not BROWSER.is_file():
        raise RuntimeError("The verified Python environment or browser is missing")
    request = json.load(sys.stdin)
    argv = arguments(request)
    if sys.argv[1:] == ["--worker"]:
        return runpy.run_path(str(RUNNER))["main"](argv)
    if sys.argv[1:]:
        raise ValueError("Pass the request as JSON on stdin")
    ensure_public_destination(request["url"])
    key = runpy.run_path(str(BWS_WRAPPER))["retrieve_key"]()
    env = {name: value for name, value in os.environ.items() if name.upper() in PROCESS_ENV}
    env.update(TYPESAFE_API_KEY=key, PYTHONUTF8="1", BH_TELEMETRY="0",
               BROWSER_HARNESS_TELEMETRY="0", ANONYMIZED_TELEMETRY="false",
               BH_HOME=str(RUNTIME), JEV_ULTRAFAST_REPO=str(REPO))
    return subprocess.run([str(PYTHON), str(Path(__file__).resolve()), "--worker"],
                          input=json.dumps(request), text=True, env=env, cwd=ROOT, check=False,
                          creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0).returncode


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (OSError, ValueError, RuntimeError, KeyError, TypeError, subprocess.SubprocessError) as error:
        print(json.dumps({"verified": False, "error": type(error).__name__}), file=sys.stderr)
        sys.exit(2)
