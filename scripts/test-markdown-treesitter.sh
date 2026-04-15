#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
fixtures_dir="$repo_root/tests/fixtures/markdown"
init_file="$(mktemp /tmp/markdown-treesitter-test.XXXXXX.lua)"
trap 'rm -f "$init_file"' EXIT

cat >"$init_file" <<EOF
vim.opt.runtimepath:append(vim.fn.expand("~/.local/share/nvim/lazy/nvim-treesitter"))
vim.opt.runtimepath:append("$repo_root/nvim")
require("config.markdown_treesitter").setup()
require("nvim-treesitter.configs").setup({
  highlight = { enable = true },
})
EOF

run_case() {
  local file="$1"
  XDG_CACHE_HOME=/tmp XDG_STATE_HOME=/tmp timeout 10s \
    nvim --clean -u "$init_file" -n --headless \
    "+e $file" \
    "+lua vim.treesitter.start(0, 'markdown'); vim.treesitter.get_parser(0, 'markdown'):parse(true); print('OK')" \
    "+qa!" >/tmp/markdown-treesitter-test.out 2>&1
  if ! rg -q '^OK$' /tmp/markdown-treesitter-test.out; then
    cat /tmp/markdown-treesitter-test.out
    return 1
  fi
}

for file in "$fixtures_dir"/*.md; do
  run_case "$file"
  printf 'PASS %s\n' "$(basename "$file")"
done
