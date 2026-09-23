import argparse
import json
import os
import pathlib
import tempfile


def merge(common, platform):
    result = dict(common)
    for key, value in platform.items():
        if isinstance(value, dict) and isinstance(result.get(key), dict):
            result[key] = merge(result[key], value)
        else:
            result[key] = value
    return result


def render(common, platform):
    return json.dumps(merge(common, platform), ensure_ascii=False, indent=2) + "\n"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("common", type=pathlib.Path)
    parser.add_argument("platform", type=pathlib.Path)
    parser.add_argument("output", type=pathlib.Path)
    args = parser.parse_args()

    common = json.loads(args.common.read_text(encoding="utf-8"))
    platform = json.loads(args.platform.read_text(encoding="utf-8"))
    merged = render(common, platform)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    if args.output.is_symlink():
        raise SystemExit(f"output must not be a symlink: {args.output}")

    fd, temporary = tempfile.mkstemp(prefix=".opencode.", suffix=".tmp", dir=args.output.parent)
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
