require("config.lazy")
-- require("config.avante.config")
require("config.codecompanion.mapping")
vim.lsp.enable('pyright')
-- For init.lua
vim.opt.shell = "pwsh"
vim.opt.shellcmdflag = "-NoLogo -NoProfile -Command"
vim.opt.shellquote = ""
vim.opt.shellxquote = ""
vim.api.nvim_set_option("clipboard", "unnamed")
