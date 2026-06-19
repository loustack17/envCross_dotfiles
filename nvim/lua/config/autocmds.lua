vim.api.nvim_create_autocmd("BufWritePost", {
  pattern = "*.typ",
  callback = function()
    vim.cmd("!typst compile %")
  end,
})
