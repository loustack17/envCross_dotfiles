vim.g.loaded_netrw = 1
vim.g.loaded_netrwPlugin = 1

require("config.options")
require("config.lazy")
-- require("config.avante.config")
require("config.codecompanion.mapping")
vim.lsp.enable('pyright')
-- For init.lua
vim.opt.shell = "nu"
-- vim.opt.shellcmdflag = "-NoLogo -NoProfile -Command"
vim.opt.shellquote = ""
vim.opt.shellxquote = ""
vim.api.nvim_set_option("clipboard", "unnamed")
