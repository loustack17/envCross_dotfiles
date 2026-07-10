# Neovim Minimalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce a smaller Neovim configuration with preserved workflows, TokyoNight startup colors, Seoul256 Lualine, a rounded Tabby workspace bar, Illuminate references, Mason-only LSPs, and cross-platform DAP paths.

**Architecture:** Keep one focused Lazy spec per plugin responsibility. Upstream defaults remain implicit. Native tabs become workspaces through Tabby, while Mason remains the only executable source for editor tooling.

**Tech Stack:** Neovim 0.12, Lua, lazy.nvim, Mason, nvim-lspconfig, Tabby, vim-illuminate

---

### Task 1: Protect the Baseline

**Files:**
- Inspect: `nvim/init.lua`
- Inspect: `nvim/lua/config/*.lua`
- Inspect: `nvim/lua/plugins/*.lua`
- Inspect: `nvim/lazy-lock.json`

- [ ] **Step 1: Record the current Neovim diff**

Run:

```powershell
git diff -- nvim
git status --short
```

Expected: the user-added Lualine design and unified LSP changes are visible and no unrelated files are staged.

- [ ] **Step 2: Verify the current configuration starts**

Run:

```powershell
nvim --headless "+lua print(vim.version().major .. '.' .. vim.version().minor)" +qa
```

Expected: exit code `0` and version `0.12`.

- [ ] **Step 3: Commit only after all later tasks**

No baseline commit is created because the working tree contains related uncommitted work that must remain intact.

### Task 2: Replace Bufferline and Add Illuminate

**Files:**
- Delete: `nvim/lua/plugins/bufferline.lua`
- Create: `nvim/lua/plugins/tabby.lua`
- Create: `nvim/lua/plugins/illuminate.lua`
- Modify: `nvim/lua/config/options.lua`

- [ ] **Step 1: Add a failing plugin-presence assertion**

Run before editing:

```powershell
nvim --headless "+lua local p=require('lazy.core.config').plugins; assert(p['nanozuki/tabby.nvim']); assert(p['RRethy/vim-illuminate'])" +qa
```

Expected: FAIL because both plugins are absent.

- [ ] **Step 2: Add the minimal Illuminate spec**

Create `nvim/lua/plugins/illuminate.lua`:

```lua
return {
  'RRethy/vim-illuminate',
  event = { 'BufReadPost', 'BufNewFile' },
}
```

- [ ] **Step 3: Replace Bufferline with rounded Tabby workspaces**

Create `nvim/lua/plugins/tabby.lua` with one `tabby.tabline.set()` renderer. Render `line.tabs()` using `` and ``, `tab.name()`, and distinct active/inactive TokyoNight-compatible highlight groups. Add mappings for previous tab, next tab, new tab, and safe tab close. Do not render diagnostics, buffer counts, or close buttons.

- [ ] **Step 4: Remove Bufferline-only options**

Delete `nvim/lua/plugins/bufferline.lua`. Keep `vim.opt.showtabline = 2`. Remove Bufferline commands from mappings and use:

```lua
{ '<S-h>', '<cmd>tabprevious<cr>', desc = 'Previous workspace' }
{ '<S-l>', '<cmd>tabnext<cr>', desc = 'Next workspace' }
{ '<leader>tn', '<cmd>tabnew<cr>', desc = 'New workspace' }
{ '<leader>tc', '<cmd>tabclose<cr>', desc = 'Close workspace' }
```

- [ ] **Step 5: Sync and verify**

Run:

```powershell
nvim --headless "+Lazy! sync" +qa
nvim --headless "+lua local p=require('lazy.core.config').plugins; assert(p['nanozuki/tabby.nvim']); assert(p['RRethy/vim-illuminate']); assert(not p['akinsho/bufferline.nvim'])" +qa
```

Expected: both commands exit `0`.

### Task 3: Simplify Themes, Statusline, Core Settings, and Plugin Specs

**Files:**
- Modify: `nvim/lua/plugins/colorthemes.lua`
- Modify: `nvim/lua/plugins/lualine.lua`
- Modify: `nvim/init.lua`
- Modify: `nvim/lua/config/autocmds.lua`
- Modify: `nvim/lua/config/keymaps.lua`
- Modify: `nvim/lua/config/lazy.lua`
- Modify: `nvim/lua/config/options.lua`
- Modify: `nvim/lua/plugins/*.lua`

- [ ] **Step 1: Make TokyoNight the startup theme**

Keep both TokyoNight and Catppuccin installed. Remove the Catppuccin startup `vim.cmd.colorscheme()` call and apply:

```lua
vim.cmd.colorscheme('tokyonight')
```

Keep Lualine’s `theme = 'seoul256'`.

- [ ] **Step 2: Simplify Lualine without changing its approved appearance**

Remove commented dependencies, placeholder comments, `icons_enabled = true`, empty `tabline`, empty `extensions`, and empty sections that have no visual effect. Preserve Seoul256, rounded separators, centered spacing, filename, branch, filetype, progress, and location.

- [ ] **Step 3: Remove duplicated core settings**

Keep the FileType autocmd as the owner of `formatoptions`. Remove the duplicate global `formatoptions` mutations. Remove the Typst compile autocmd because Tinymist owns PDF export. Fix `rk` to:

```lua
vim.keymap.set('n', 'rk', '<C-w>-', { desc = 'Resize window up' })
```

Build `.dotnet/tools` PATH with:

```lua
vim.env.PATH = dotnet_tools .. (vim.fn.has('win32') == 1 and ';' or ':') .. vim.env.PATH
```

- [ ] **Step 4: Remove confirmed fluff across plugin specs**

Apply these bounded removals:

- Remove `telescope-fzf-native.nvim` because its extension is never loaded.
- Remove repeated defaults, tutorial comments, commented-out code, and empty option tables.
- Remove duplicate `lsp_format` ownership in Conform.
- Remove the `legacy` tag from Fidget.
- Keep Flash, Trouble, UFO, Octo, render-markdown, VimTeX, Yazi, LazyGit, visual-multi, Zoxide, Blink, Windsurf, Treesitter, lint, and indent behavior.
- Keep only Markdown as the explicit Windsurf disabled filetype; preserve the CRLF completion fix.
- Preserve all formatter selections, completion mappings, large-buffer limits, GitHub workflows, and document rendering behavior.

- [ ] **Step 5: Verify themes and mappings**

Run:

```powershell
nvim --headless "+lua assert(vim.g.colors_name == 'tokyonight'); assert(vim.fn.maparg('rk','n') ~= '')" +qa
```

Expected: exit code `0`.

### Task 4: Keep Mason LSP and Fix Cross-Platform DAP

**Files:**
- Modify: `nvim/lua/plugins/lsp.lua`
- Modify: `nvim/lua/plugins/nvim-dap.lua`

- [ ] **Step 1: Preserve mason-lspconfig responsibilities**

Keep `mason-lspconfig.nvim` because it maps LSP config names to Mason packages, installs `ensure_installed`, and enables newly installed servers. Keep the single server table and absolute Mason commands.

- [ ] **Step 2: Add platform-aware Mason helpers**

Use one suffix helper for Mason commands:

```lua
local is_windows = vim.fn.has('win32') == 1
local suffix = is_windows and '.cmd' or ''
local function mason_bin(name)
  return vim.fn.stdpath('data') .. '/mason/bin/' .. name .. suffix
end
```

For Debugpy use `venv/Scripts/python.exe` on Windows and `venv/bin/python` elsewhere.

- [ ] **Step 3: Fix Python fallback**

Replace boolean chaining on `vim.fn.exepath()` with explicit empty-string checks:

```lua
local python = vim.fn.exepath(is_windows and 'python' or 'python3')
return python ~= '' and python or 'python'
```

- [ ] **Step 4: Verify Mason-only LSPs and DAP paths**

Run:

```powershell
nvim --headless "+lua vim.schedule(function() local root=vim.fn.stdpath('data')..'/mason/bin/'; for _,name in ipairs({'lua_ls','rust_analyzer','vtsls','gopls','pyright','ruff','ty','html','cssls','jsonls','yamlls','tinymist'}) do local c=vim.lsp.config[name]; assert(c and vim.startswith(c.cmd[1],root),name) end; vim.cmd('qa') end)"
```

Expected: exit code `0`.

### Task 5: Final Review

**Files:**
- Review: `nvim/**`

- [ ] **Step 1: Check syntax and startup**

Run:

```powershell
nvim --headless "+checkhealth vim.lsp" +qa
git diff --check
```

Expected: no configuration error and no whitespace errors.

- [ ] **Step 2: Check duplicate ownership**

Run:

```powershell
rg "bufferline|typst compile|tag = ['\"]legacy|telescope-fzf-native|catppuccin-mocha" nvim
```

Expected: no Bufferline, duplicate Typst compile, legacy Fidget, or unused FZF references. Catppuccin may appear only as an available colorscheme dependency.

- [ ] **Step 3: Review scope**

Run:

```powershell
git diff --stat -- nvim
git diff -- nvim
git status --short
```

Expected: only approved Neovim simplification and pre-existing related dotfile changes remain.

- [ ] **Step 4: Commit after user approval**

Stage only the reviewed files and use a concise commit without attribution.
