import pathlib
import re
import subprocess
import unittest


ROOT = pathlib.Path(__file__).resolve().parents[1]
HARDCODED = re.compile(r"/home/lou\b|Documents/WorkFlow/envCross_dotfiles|D:\\Notes\\|D:/Notes/")
TOOL_OWNED = {
    "Linux-config/fish/fish_variables",
    "Linux-config/zellij/config.kdl",
    "tock/tock.yaml",
}


class PortablePathTests(unittest.TestCase):
    def test_tracked_files_do_not_hardcode_repo_or_home_paths(self):
        files = subprocess.run(
            ["git", "ls-files", "-z"], cwd=ROOT, check=True, capture_output=True
        ).stdout.decode("utf-8").split("\0")
        offenders = []
        for name in filter(None, files):
            if name in TOOL_OWNED or name.startswith("tests/"):
                continue
            path = ROOT / name
            if not path.is_file():
                continue
            try:
                text = path.read_text(encoding="utf-8")
            except UnicodeDecodeError:
                continue
            if HARDCODED.search(text):
                offenders.append(name)
        self.assertEqual(offenders, [])

    def test_installers_create_the_repo_anchor(self):
        self.assertIn(
            'create_path_link "$REPO_ROOT" "$HOME/.local/share/envcross"',
            (ROOT / "install.sh").read_text(encoding="utf-8"),
        )
        self.assertIn(
            'dest: ($home | path join ".local" "share" "envcross")',
            (ROOT / "install.nu").read_text(encoding="utf-8"),
        )


if __name__ == "__main__":
    unittest.main()
