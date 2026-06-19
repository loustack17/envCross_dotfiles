vim.opt.textwidth = 120
vim.opt.tabstop = 2
vim.opt.shiftwidth = 2
vim.opt.softtabstop = 2
vim.opt.expandtab = true
vim.opt.completeopt = { "menu", "menuone", "noselect" }
vim.opt.updatetime = 250
vim.opt.timeoutlen = 500
vim.opt.showmode = false
vim.opt.cursorline = true
vim.opt.showtabline = 2
vim.opt.termguicolors = true
vim.opt.number = true
vim.opt.relativenumber = false
vim.opt.signcolumn = "yes"
vim.opt.fillchars = vim.opt.fillchars + {
  foldopen = "v",
  foldclose = ">",
  foldsep = " ",
  fold = " ",
}

vim.diagnostic.config({
  severity_sort = true,
  update_in_insert = false,
  virtual_text = false,
  signs = true,
  underline = true,
  float = {
    border = "rounded",
    focusable = false,
    source = "if_many",
  },
})

vim.lsp.log.set_level(vim.log.levels.OFF)
