import os
import pathlib
import sys
import tempfile


base_path, mcp_path, output_path = map(pathlib.Path, sys.argv[1:])
base = base_path.read_text(encoding="utf-8")
mcp = mcp_path.read_text(encoding="utf-8")
if "\nmcp_servers:" in base or not mcp.startswith("mcp_servers:\n"):
    raise ValueError("Hermes MCP section must exist only in the platform file")
output_path.parent.mkdir(parents=True, exist_ok=True)
with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=output_path.parent, delete=False) as temporary:
    temporary.write(base.rstrip() + "\n" + mcp)
    temporary_path = pathlib.Path(temporary.name)
os.replace(temporary_path, output_path)
