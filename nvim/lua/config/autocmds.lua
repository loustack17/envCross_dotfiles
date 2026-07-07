vim.api.nvim_create_autocmd("BufWritePost", {
  pattern = "*.typ",
  callback = function()
    vim.cmd("!typst compile %")
  end,
})

vim.api.nvim_create_autocmd("FileType", {
  pattern = "*",
  callback = function()
    vim.opt_local.formatoptions:remove({ "t", "c", "a" })
    vim.opt_local.formatoptions:append({ "q", "j" })
  end,
})
