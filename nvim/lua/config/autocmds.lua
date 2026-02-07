-- Neo-Tree
vim.api.nvim_create_autocmd("FileType", {
  pattern = { "neo-tree" },
  callback = function()
    vim.opt_local.swapfile = false
    vim.opt_local.bufhidden = "wipe"
  end,
})

vim.api.nvim_create_autocmd("VimEnter", {
  callback = function()
    local arg0 = vim.fn.argv(0)
    if arg0 == "" or vim.fn.isdirectory(arg0) ~= 1 then
      return
    end

    if vim.g.__yazi_dir_bootstrap_done then
      return
    end
    vim.g.__yazi_dir_bootstrap_done = true

    -- If any neo-tree buffer already exists, do not create/open again (prevents E95)
    for _, b in ipairs(vim.api.nvim_list_bufs()) do
      local name = vim.api.nvim_buf_get_name(b)
      if name:find("neo%-tree") then
        return
      end
    end

    vim.cmd("cd " .. vim.fn.fnameescape(arg0))

    local ok, cmd = pcall(require, "neo-tree.command")
    if not ok then
      return
    end

    cmd.execute({
      action = "show",
      source = "filesystem",
      reveal = true,
    })
  end,
})
