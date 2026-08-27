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
    ("hooks", "state"),
    ("marketplaces", "openai-bundled"),
    ("marketplaces", "openai-primary-runtime"),
)

RUNTIME_PLUGIN_SUFFIX = "@openai-primary-runtime"


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


def runtime_text(output, durable_leaves):
    if not output.exists() or output.is_symlink():
        return "", ""
    existing = tomllib.loads(output.read_text(encoding="utf-8"))
    root_lines = []
    table_lines = []
    paths = list(RUNTIME_PATHS)
    plugins = existing.get("plugins", {})
    if isinstance(plugins, dict):
        paths.extend(
            ("plugins", name)
            for name, value in sorted(plugins.items())
            if name.endswith(RUNTIME_PLUGIN_SUFFIX)
            and isinstance(value, dict)
            and isinstance(value.get("enabled"), bool)
        )
    for path in paths:
        value = get_path(existing, path)
        if value is None:
            continue
        if len(path) == 2 and path[0] == "plugins":
            value = {"enabled": value["enabled"]}
        selected_leaves = leaves(value, path)
        overlap = selected_leaves & durable_leaves
        if overlap:
            names = ", ".join(".".join(item) for item in sorted(overlap))
            raise SystemExit(f"runtime state conflicts with durable config: {names}")
        if len(path) == 1:
            root_lines.append(f"{key_text(path[0])} = {value_text(value)}")
        else:
            table_lines.extend(render_table(path, value))
            table_lines.append("")
    return "\n".join(root_lines), "\n".join(table_lines).rstrip()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("common", type=pathlib.Path)
    parser.add_argument("platform", type=pathlib.Path)
    parser.add_argument("output", type=pathlib.Path)
    args = parser.parse_args()

    common_text = args.common.read_text(encoding="utf-8")
    platform_text = args.platform.read_text(encoding="utf-8")
    common = tomllib.loads(common_text)
    platform = tomllib.loads(platform_text)
    overlap = leaves(common) & leaves(platform)
    if overlap:
        names = ", ".join(".".join(path) for path in sorted(overlap))
        raise SystemExit(f"duplicate config ownership: {names}")

    durable_leaves = leaves(common) | leaves(platform)
    runtime_root, runtime_tables = runtime_text(args.output, durable_leaves)
    merged = ""
    if runtime_root:
        merged += runtime_root + "\n"
    merged += common_text.rstrip() + "\n\n" + platform_text.lstrip().rstrip()
    if runtime_tables:
        merged += "\n\n" + runtime_tables
    merged += "\n"
    tomllib.loads(merged)
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
