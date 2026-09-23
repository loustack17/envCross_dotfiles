import argparse
import json
import os
import pathlib
import re
import tempfile
import tomllib


def leaves(value, prefix=()):
    if isinstance(value, dict):
        result = set()
        for key, child in value.items():
            result.update(leaves(child, prefix + (key,)))
        return result
    return {prefix}


RUNTIME_PATHS = (
    ("notify",),
    ("mcp_servers", "node_repl"),
    ("mcp_servers", "cua_repl"),
    ("hooks", "state"),
    ("marketplaces", "openai-bundled"),
    ("marketplaces", "openai-primary-runtime"),
    ("desktop",),
    ("tui",),
    ("apps",),
)

RUNTIME_PLUGIN_SUFFIXES = ("@openai-primary-runtime", "@openai-bundled")


def get_path(value, path):
    for key in path:
        if not isinstance(value, dict) or key not in value:
            return None
        value = value[key]
    return value


def key_text(key):
    if re.fullmatch(r"[A-Za-z0-9_-]+", key):
        return key
    return json.dumps(key, ensure_ascii=False)


def value_text(value):
    if isinstance(value, bool):
        return str(value).lower()
    if isinstance(value, str):
        return json.dumps(value, ensure_ascii=False)
    if isinstance(value, list):
        return "[" + ", ".join(value_text(item) for item in value) + "]"
    if isinstance(value, (int, float)):
        return str(value)
    raise TypeError(type(value).__name__)


def render_table(path, value):
    lines = [f"[{'.'.join(key_text(key) for key in path)}]"]
    children = []
    for key, child in value.items():
        if isinstance(child, dict):
            children.append((key, child))
        else:
            lines.append(f"{key_text(key)} = {value_text(child)}")
    for key, child in children:
        lines.extend(("", *render_table(path + (key,), child)))
    return lines


def merge_missing(target, source):
    for key, value in source.items():
        if key not in target:
            target[key] = value
        elif isinstance(target[key], dict) and isinstance(value, dict):
            merge_missing(target[key], value)


def merge_overwriting(target, source):
    for key, value in source.items():
        if key in target and isinstance(target[key], dict) and isinstance(value, dict):
            merge_overwriting(target[key], value)
        else:
            target[key] = value


def runtime_values(source):
    selected = {}
    paths = list(RUNTIME_PATHS)
    plugins = source.get("plugins", {})
    if isinstance(plugins, dict):
        paths.extend(
            ("plugins", name)
            for name, value in sorted(plugins.items())
            if name.endswith(RUNTIME_PLUGIN_SUFFIXES)
            and isinstance(value, dict)
            and isinstance(value.get("enabled"), bool)
        )
    for path in paths:
        value = get_path(source, path)
        if value is None:
            continue
        if len(path) == 2 and path[0] == "plugins":
            value = {"enabled": value["enabled"]}
        current = selected
        for key in path[:-1]:
            current = current.setdefault(key, {})
        current[path[-1]] = value
    projects = source.get("projects", {})
    if isinstance(projects, dict):
        for name, value in projects.items():
            if isinstance(value, dict) and value.get("trust_level") in {"trusted", "untrusted"}:
                selected.setdefault("projects", {})[name] = {"trust_level": value["trust_level"]}
    return selected


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("common", type=pathlib.Path)
    parser.add_argument("platform", type=pathlib.Path)
    parser.add_argument("output", type=pathlib.Path)
    parser.add_argument("--runtime-source", type=pathlib.Path)
    args = parser.parse_args()

    common_text = args.common.read_text(encoding="utf-8")
    platform_text = args.platform.read_text(encoding="utf-8")
    common = tomllib.loads(common_text)
    platform = tomllib.loads(platform_text)
    overlap = leaves(common) & leaves(platform)
    if overlap:
        names = ", ".join(".".join(path) for path in sorted(overlap))
        raise SystemExit(f"duplicate config ownership: {names}")

    config = common
    merge_missing(config, platform)
    if args.runtime_source and args.runtime_source.is_symlink() and not args.runtime_source.exists():
        raise SystemExit(f"runtime source is a broken symlink: {args.runtime_source}")
    source = args.runtime_source if args.runtime_source and args.runtime_source.exists() else args.output
    if source.exists():
        if source.is_symlink() and source.resolve().parent != args.output.resolve().parent:
            raise SystemExit(f"runtime source must link within generated config directory: {source}")
        runtime = tomllib.loads(source.read_text(encoding="utf-8"))
        selected = runtime_values(runtime)
        merge_missing(config, selected)
        for key in ("desktop", "projects", "plugins"):
            if key in selected:
                merge_overwriting(config[key], selected[key])
    root = []
    tables = []
    for key, value in config.items():
        if isinstance(value, dict):
            tables.extend(render_table((key,), value))
            tables.append("")
        else:
            root.append(f"{key_text(key)} = {value_text(value)}")
    merged = "\n".join(root + ([""] if root and tables else []) + tables).rstrip() + "\n"
    if tomllib.loads(merged) != config:
        raise SystemExit("rendered config differs from merged values")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    if args.output.is_symlink():
        raise SystemExit(f"output must not be a symlink: {args.output}")

    fd, temporary = tempfile.mkstemp(prefix=".config.", suffix=".tmp", dir=args.output.parent)
    try:
        with os.fdopen(fd, "w", encoding="utf-8", newline="\n") as handle:
            handle.write(merged)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temporary, args.output)
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)


if __name__ == "__main__":
    main()
