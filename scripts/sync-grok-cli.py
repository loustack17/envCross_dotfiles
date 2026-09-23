import argparse
import importlib.util
import os
import pathlib
import re
import tempfile
import time
import tomllib


ROOT = pathlib.Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("overrides", ROOT / "scripts/codex-cli-overrides.py")
FORMAT = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(FORMAT)


def default_backup_root():
    if os.name == "nt":
        root = pathlib.Path(os.environ.get("ENVCROSS_STATE_ROOT", r"D:\ProgramData\envCross_dotfiles"))
        if not root.is_absolute() or root.drive.casefold() == "c:":
            raise ValueError("Grok backup root must be absolute and outside C:")
        return root / "backups" / "grok"
    return pathlib.Path(os.environ.get("XDG_STATE_HOME", pathlib.Path.home() / ".local/state")) / "envcross" / "backups" / "grok"


def synchronize(home, backup_root=None):
    path = home / ".grok/config.toml"
    original = path.read_bytes() if path.exists() else b""
    live = tomllib.loads(original.decode("utf-8"))
    source = tomllib.loads((ROOT / "ai-assistants/.grok/config.toml").read_text(encoding="utf-8"))
    for key in ("compat", "skills", "subagents", "mcp_servers"):
        live[key] = source[key]
    bundled = home / ".grok/bundled/skills"
    disabled = set(live["skills"].get("disabled", []))
    if bundled.exists():
        for skill in bundled.rglob("SKILL.md"):
            match = re.search(r'^name:\s*[\"\x27]?([^\r\n\"\x27]+)', skill.read_text(encoding="utf-8"), re.MULTILINE)
            disabled.add(match.group(1).strip() if match else skill.parent.name)
    live["skills"]["disabled"] = sorted(disabled)
    live.setdefault("models", {})["default_reasoning_effort"] = source["models"]["default_reasoning_effort"]
    live.setdefault("plugins", {})["disabled"] = sorted(set(live.get("plugins", {}).get("disabled", [])) | set(source["plugins"]["disabled"]))
    if original and live == tomllib.loads(original.decode("utf-8")):
        return
    text = "\n".join(f"{FORMAT.merge.key_text(k)} = {FORMAT.inline(v)}" for k, v in live.items()) + "\n"
    tomllib.loads(text)
    path.parent.mkdir(parents=True, exist_ok=True)
    if original:
        backup = backup_root or default_backup_root()
        backup.mkdir(parents=True, exist_ok=True)
        (backup / f"before-repo-sync-{time.time_ns()}.toml").write_bytes(original)
    descriptor, temporary = tempfile.mkstemp(prefix=".repo-config-", suffix=".toml", dir=path.parent)
    try:
        with os.fdopen(descriptor, "w", encoding="utf-8") as output:
            output.write(text)
        if (path.read_bytes() if path.exists() else b"") != original:
            raise RuntimeError("Grok configuration changed concurrently; not overwriting it")
        os.replace(temporary, path)
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--home", type=pathlib.Path, default=pathlib.Path.home())
    synchronize(parser.parse_args().home)
