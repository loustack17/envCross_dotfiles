vim.opt.textwidth = 120
vim.opt.tabstop = 2      -- Tab 實際寬度
vim.opt.shiftwidth = 2   -- 自動縮排行為用幾個空白
vim.opt.softtabstop = 2  -- 在 insert mode 按 Tab 的寬度
vim.opt.expandtab = true -- 用空白取代 Tab 字元
vim.opt.completeopt = { "menu", "menuone", "noselect" }

vim.o.showtabline = 2
vim.o.termguicolors = true

-- Line numbers
vim.opt.number = true
vim.opt.relativenumber = false

-- Left columns
vim.opt.signcolumn = "yes"
-- vim.opt.foldcolumn = "1"

-- Make fold indicators look like arrows (optional)
vim.opt.fillchars = vim.opt.fillchars + {
  foldopen = "v",
  foldclose = ">",
  foldsep = " ",
  fold = " ",
}

-- vimtex
vim.g.vimtex_compiler_method = "latexmk"
vim.g.vimtex_compiler_latexmk = {
  executable = "latexmk",
  options = {
    "-xelatex",
    "-synctex=1",
    "-interaction=nonstopmode",
  },
}

-- Folding
-- vim.o.statuscolumn = "%l %C"
-- vim.opt.foldmethod = "expr"
-- vim.opt.foldexpr = "nvim_treesitter#foldexpr()"
-- vim.opt.foldenable = true
-- vim.opt.foldlevel = 99
-- vim.opt.foldlevelstart = 99

-- Resize
vim.keymap.set("n", "rh", "<C-w><")
vim.keymap.set("n", "rj", "<C-w>+")
vim.keymap.set("n", "rk", "<C-w>-")
vim.keymap.set("n", "rl", "<C-w>>")

-- Mode: Normal move one line (VSCode-style: Alt+Up/Down)
vim.keymap.set("n", '<A-Down>', ':m .+1<CR>==', { desc = 'Move line down' })
vim.keymap.set("n", '<A-Up>', ':m .-2<CR>==', { desc = 'Move line up' })
vim.keymap.set("n", '<A-j>', ':m .+1<CR>==', { desc = 'Move line down' })
vim.keymap.set("n", '<A-k>', ':m .-2<CR>==', { desc = 'Move line up' })

-- Mode: Visual move block (VSCode-style: Alt+Up/Down)
vim.keymap.set("v", '<A-Down>', ":m '>+1<CR>gv=gv", { desc = 'Move selection down' })
vim.keymap.set("v", '<A-Up>', ":m '<-2<CR>gv=gv", { desc = 'Move selection up' })
vim.keymap.set("v", '<A-j>', ":m '>+1<CR>gv=gv", { desc = 'Move selection down' })
vim.keymap.set("v", '<A-k>', ":m '<-2<CR>gv=gv", { desc = 'Move selection up' })

-- Mode: Insert move line (VSCode-style)
vim.keymap.set("i", '<A-Down>', '<Esc>:m .+1<CR>==gi', { desc = 'Move line down' })
vim.keymap.set("i", '<A-Up>', '<Esc>:m .-2<CR>==gi', { desc = 'Move line up' })
vim.keymap.set("i", '<A-j>', '<Esc>:m .+1<CR>==gi', { desc = 'Move line down' })
vim.keymap.set("i", '<A-k>', '<Esc>:m .-2<CR>==gi', { desc = 'Move line up' })
