import pathlib
import unittest


SKILLS = pathlib.Path(__file__).resolve().parents[1] / "ai-assistants" / "SKILLS"


def load_tests(loader, tests, pattern):
    for directory in sorted(SKILLS.glob("*/tests")):
        tests.addTests(loader.discover(str(directory), top_level_dir=str(directory)))
    return tests
