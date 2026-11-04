import json
import pathlib
import sys


def merge(base, overlay):
    for key, value in overlay.items():
        if isinstance(value, dict) and isinstance(base.get(key), dict):
            merge(base[key], value)
        else:
            base[key] = value
    return base


def expand_home(value):
    if isinstance(value, dict):
        return {key: expand_home(item) for key, item in value.items()}
    if isinstance(value, list):
        return [expand_home(item) for item in value]
    if isinstance(value, str) and value.startswith("~/"):
        return pathlib.Path.home().as_posix() + value[1:]
    return value


base_path, overlay_path, output_path = map(pathlib.Path, sys.argv[1:])
base = json.loads(base_path.read_text())
overlay = json.loads(overlay_path.read_text())
output_path.parent.mkdir(parents=True, exist_ok=True)
output_path.write_text(json.dumps(expand_home(merge(base, overlay)), indent=2) + "\n")
