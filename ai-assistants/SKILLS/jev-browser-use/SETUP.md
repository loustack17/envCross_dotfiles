# Shared Jev runtime

This skill is shared source for local AI tools with skill-reading and command-execution capabilities. Codex and Claude Code currently discover it through the existing `~/.agents/skills` and `~/.claude/skills` links. A browser-only chat cannot directly execute it. Grok currently ignores shared skills and is not automatically enabled by this installation.

## Setup

Requirements: Python 3.12+, uv, BWS machine-account access to the TypeSafe secret configured by the sibling typesafe-ai skill, and Brave on Windows. On Linux the launcher discovers brave-browser, brave, chromium or google-chrome. Linux execution has not been tested here.

The installers run this for you; to create the locked runtime by hand, run from the skill directory:

```sh
uv sync --frozen --no-dev --project vendor/jev-ultrafast
```

Invoke using any Python 3.12+ interpreter, with the absolute path to `run.py` and a JSON request on stdin. The launcher starts the locked virtual-environment interpreter itself. It does not require the parent AI's API key. Jev/TypeSafe API usage still applies separately from the parent AI subscription.

On Windows:

```powershell
$request = '{"url":"https://example.com","goal":"Read Example Domain and stop without clicking.","allow_hosts":["example.com"],"expect":"Example Domain","max_ticks":3}'
$request | python ./run.py
```

On Linux:

```sh
printf '%s' '{"url":"https://example.com","goal":"Read Example Domain and stop without clicking.","allow_hosts":["example.com"],"expect":"Example Domain","max_ticks":3}' | python3 ./run.py
```

The browser uses a fresh profile. Harness state is kept outside the repository in `%LOCALAPPDATA%/jev-browser-use` on Windows or `~/.local/state/jev-browser-use` otherwise. No credentials or virtual environment are committed. Both dotfiles installers create this runtime (target `jev`, after installing `uv`), and the shared skills links already expose the skill.

## Provenance and rollback

Adapter and runner source: [damian87x/jev-browser-use](https://github.com/damian87x/jev-browser-use/tree/2ce6baaada6f265974ad09158d4e425f17332f6c), locally hardened. Adapter license and NOTICE are included.

Vendored Jev source: [browser-use/jev-ultrafast](https://github.com/browser-use/jev-ultrafast/tree/8251e272398011cdef648965204d1c20cd838333), version 0.1.0, with its MIT license and frozen uv.lock. Browser-harness is pinned to 0.1.13 by that lock.

Local modifications preserve the previously verified safety guards and replace machine-specific project paths with skill-relative paths. Original project source and installation records remain available for rollback. No job schedule or normal browser profile is modified.

To disable the shared skill, move only the `jev-browser-use` directory out of SKILLS. Restore the previous Codex-only skill from the installation rollback copy if needed. The frozen dependency environment can be recreated from the vendored source and lock; do not copy it across machines.
