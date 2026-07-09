# Neovim Minimalization Design

## Goals

- Preserve useful workflows and recently added behavior.
- Remove duplicated work, inactive configuration, repeated defaults, and obsolete integrations.
- Keep plugin configuration short and readable.
- Use Mason as the editor tooling source.
- Add reference highlighting.
- Replace the buffer-centric top bar with a minimal rounded workspace tabline.

## Appearance

- TokyoNight is the default Neovim colorscheme.
- Catppuccin remains available for dynamic theme switching.
- Lualine always uses its Seoul256 theme and rounded statusline sections.
- Tabby replaces Bufferline.
- Tabby displays native tabs as workspaces with rounded `` and `` edges.
- Active tabs use a soft TokyoNight accent; inactive tabs use low-contrast backgrounds.
- The tabline omits diagnostics, close buttons, buffer counters, and other badges.

## Plugins

### Add

- `RRethy/vim-illuminate`
- `nanozuki/tabby.nvim`

Illuminate uses its defaults and loads on normal file buffers. Tabby receives only the renderer and mappings required for the approved workspace design.

### Remove

- `akinsho/bufferline.nvim`
- Unused `telescope-fzf-native.nvim`
- Duplicate Typst compilation outside Tinymist
- Obsolete or inactive plugin configuration confirmed by inspection

### Preserve

- Mason, mason-lspconfig, and nvim-lspconfig
- Blink, LuaSnip, and Windsurf
- Treesitter, Conform, and nvim-lint
- DAP, Trouble, Flash, UFO, and Fidget
- Octo, render-markdown, VimTeX, Yazi, LazyGit, and visual-multi

Fidget moves off the legacy release. Plugins without evidence of redundancy remain installed, with default values removed from local configuration.

## Configuration Cleanup

- Preserve custom behavior, mappings, formatter choices, and safety limits.
- Remove tutorial comments, commented-out code, empty tables, and repeated plugin defaults.
- Keep one owner for each behavior.
- Keep filetype-specific configuration only when it differs intentionally from upstream defaults.
- Preserve the unified Mason-only LSP table.
- Remove duplicate formatter, wrapping, and filetype behavior.

## Correctness Fixes

- Use the OS path separator for `.dotnet/tools`.
- Fix the upward window-resize mapping.
- Make Mason DAP executables and Debugpy paths cross-platform.
- Handle empty Python executable lookup results.
- Avoid force-deleting modified buffers.

## Tab Workflow

- Native Neovim tabs represent workspaces.
- Tabby shows workspace tabs instead of every open buffer.
- Existing Bufferline navigation mappings are removed.
- Minimal native-tab mappings cover previous tab, next tab, new tab, and close tab.
- Buffer closing remains available through normal Neovim commands and existing workflows.

## Verification

- Start Neovim headlessly without configuration errors.
- Validate every Lazy plugin spec.
- Confirm all configured LSP commands resolve inside Mason.
- Confirm Illuminate loads and exposes its default mappings.
- Confirm Tabby loads while Bufferline is absent.
- Confirm TokyoNight is the startup colorscheme and Lualine uses Seoul256.
- Validate DAP adapter paths on Windows and Linux path construction.
- Check duplicate mappings and autocmds.
- Review the final diff for preservation of user-added behavior.
