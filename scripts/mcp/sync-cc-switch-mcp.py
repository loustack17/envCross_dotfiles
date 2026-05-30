#!/usr/bin/env python3
import json
import os
import re
import sqlite3
from pathlib import Path

repo = Path(__file__).resolve().parents[2]
source = repo / "ai-assistants" / "mcp" / "cc-switch-mcp.json"
db_path = Path(os.environ.get("CC_SWITCH_DB", Path.home() / ".cc-switch" / "cc-switch.db"))
secret_re = re.compile(r"^\$\{env:([A-Za-z_][A-Za-z0-9_]*)\}$")
apps = ("claude", "codex", "gemini", "opencode", "hermes")


def resolve(value, existing=None):
    if isinstance(value, str):
        match = secret_re.match(value)
        if not match:
            return value
        env = os.environ.get(match.group(1))
        if env:
            return env
        return existing if isinstance(existing, str) and not secret_re.match(existing) else value
    if isinstance(value, list):
        old = existing if isinstance(existing, list) else []
        return [resolve(item, old[index] if index < len(old) else None) for index, item in enumerate(value)]
    if isinstance(value, dict):
        old = existing if isinstance(existing, dict) else {}
        return {key: resolve(item, old.get(key)) for key, item in value.items()}
    return value


def flags(enabled):
    enabled_set = set(enabled)
    return {app: int(app in enabled_set) for app in apps}


def main():
    data = json.loads(source.read_text())
    conn = sqlite3.connect(db_path)
    try:
        existing = {
            row[0]: json.loads(row[1])
            for row in conn.execute("SELECT id, server_config FROM mcp_servers")
        }
        for server_id, entry in data["servers"].items():
            config = resolve(entry["config"], existing.get(server_id))
            enabled = flags(entry.get("enabled", []))
            conn.execute(
                """
                INSERT INTO mcp_servers (
                    id, name, server_config,
                    enabled_claude, enabled_codex, enabled_gemini, enabled_opencode, enabled_hermes
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                    name = excluded.name,
                    server_config = excluded.server_config,
                    enabled_claude = excluded.enabled_claude,
                    enabled_codex = excluded.enabled_codex,
                    enabled_gemini = excluded.enabled_gemini,
                    enabled_opencode = excluded.enabled_opencode,
                    enabled_hermes = excluded.enabled_hermes
                """,
                (
                    server_id,
                    entry["name"],
                    json.dumps(config, separators=(",", ":")),
                    enabled["claude"],
                    enabled["codex"],
                    enabled["gemini"],
                    enabled["opencode"],
                    enabled["hermes"],
                ),
            )
        conn.commit()
    finally:
        conn.close()


if __name__ == "__main__":
    main()
