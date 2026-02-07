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
