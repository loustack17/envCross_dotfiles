vim.g.loaded_netrw = 1
vim.g.loaded_netrwPlugin = 1

require("config.options")
require("config.lazy")
require("config.keymaps")

-- detect OS
local is_windows = vim.loop.os_uname().sysname:find("Windows") ~= nil

if is_windows then
  vim.opt.shell = "nu"
  vim.opt.shellquote = ""
  vim.opt.shellxquote = ""
else
  if vim.fn.executable("fish") == 1 then
    vim.opt.shell = "fish"
  else
    vim.opt.shell = "bash"
  end
end

vim.opt.clipboard = "unnamedplus"
