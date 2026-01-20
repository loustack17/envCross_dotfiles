vim.g.loaded_netrw = 1
vim.g.loaded_netrwPlugin = 1

require("config.options")
require("config.lazy")
-- require("config.avante.config")
require("config.codecompanion.mapping")
vim.lsp.enable('pyright')
-- For init.lua
-- detect OS
local is_windows = vim.loop.os_uname().sysname:find("Windows") ~= nil

if is_windows then
  -- Windows use Nushell
  vim.opt.shell = "nu"
else
  -- Linux use Fish
  -- Make sure fish exists
  if vim.fn.executable("fish") == 1 then
    vim.opt.shell = "fish"
  else
    vim.opt.shell = "bash" -- second choice
  end
end


-- vim.opt.shellcmdflag = "-NoLogo -NoProfile -Command"
vim.opt.shellquote = ""
vim.opt.shellxquote = ""
vim.api.nvim_set_option("clipboard", "unnamed")
vim.opt.clipboard = "unnamedplus"
