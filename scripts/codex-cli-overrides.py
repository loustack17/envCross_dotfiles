import argparse
import importlib.util
import json
import pathlib
import tomllib


ROOT = pathlib.Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("merge_config", ROOT / "scripts/merge-codex-config.py")
merge = importlib.util.module_from_spec(spec)
spec.loader.exec_module(merge)


def inline(value):
    if isinstance(value, dict):
        return "{" + ",".join(f"{merge.key_text(k)}={inline(v)}" for k, v in value.items()) + "}"
    if isinstance(value, list):
        return "[" + ",".join(inline(v) for v in value) + "]"
    return merge.value_text(value)


def build(home, profile=None):
    source = ROOT / "ai-assistants/.codex"
    common = tomllib.loads((source / "config.toml").read_text(encoding="utf-8"))
    windows = tomllib.loads((source / "windows.config.toml").read_text(encoding="utf-8"))
    overlap = merge.leaves(common) & merge.leaves(windows)
    if overlap:
        raise ValueError(f"Duplicate configuration ownership: {sorted(overlap)}")

    def combine(a, b):
        for key, value in b.items():
            if isinstance(value, dict) and isinstance(a.get(key), dict):
                combine(a[key], value)
            else:
                a[key] = value

    combine(common, windows)
    if profile:
        if profile not in common.get("profiles", {}):
            raise ValueError(f"Profile is not managed by this repository: {profile}")
        combine(common, common["profiles"][profile])
    live_path = home / ".codex/config.toml"
    live = tomllib.loads(live_path.read_text(encoding="utf-8")) if live_path.exists() else {}
    for name in live.get("mcp_servers", {}):
        if name not in common["mcp_servers"]:
            common["mcp_servers"][name] = {"enabled": False}
    common["notify"] = []
    disabled = []
    for directory in (home / ".codex/skills", home / ".agents/skills"):
        if directory.exists():
            disabled.extend({"path": str(path), "enabled": False} for path in directory.rglob("SKILL.md"))
    common.setdefault("skills", {})["config"] = disabled
    return [part for key, value in common.items() for part in ("-c", f"{merge.key_text(key)}={inline(value)}")]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--home", type=pathlib.Path, default=pathlib.Path.home())
    parser.add_argument("--profile")
    args = parser.parse_args()
    print(json.dumps(build(args.home, args.profile), ensure_ascii=True))


if __name__ == "__main__":
    main()
