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

-- Lsp
vim.api.nvim_create_autocmd('LspAttach', {
  desc = 'LSP actions',
  callback = function(event)
    local opts = { buffer = event.buf }

    vim.keymap.set('n', 'K', '<cmd>lua vim.lsp.buf.hover()<cr>', opts)
    vim.keymap.set('n', 'gd', '<cmd>lua vim.lsp.buf.definition()<cr>', opts)
    vim.keymap.set('n', 'gD', '<cmd>lua vim.lsp.buf.declaration()<cr>', opts)
    vim.keymap.set('n', 'gi', '<cmd>lua vim.lsp.buf.implementation()<cr>', opts)
    vim.keymap.set('n', 'go', '<cmd>lua vim.lsp.buf.type_definition()<cr>', opts)
    vim.keymap.set('n', 'gr', '<cmd>lua vim.lsp.buf.references()<cr>', opts)
    vim.keymap.set('n', 'gs', '<cmd>lua vim.lsp.buf.signature_help()<cr>', opts)
    vim.keymap.set('n', '<F2>', '<cmd>lua vim.lsp.buf.rename()<cr>', opts)
    vim.keymap.set({ 'n', 'x' }, '<F3>', '<cmd>lua vim.lsp.buf.format({async = true})<cr>', opts)
    vim.keymap.set('n', '<F4>', '<cmd>lua vim.lsp.buf.code_action()<cr>', opts)
    vim.keymap.set({ 'n', 'v' }, '<C-.>', vim.lsp.buf.code_action, opts)
    vim.keymap.set('i', '<C-.>', function()
      vim.schedule(vim.lsp.buf.code_action)
    end, opts)
  end,
})


-- fidget
local group = vim.api.nvim_create_augroup("CodeCompanionFidget", { clear = true })
local cc_handle = nil

vim.api.nvim_create_autocmd("User", {
    pattern = "CodeCompanionRequest*",
    group = group,
    callback = function(ev)
        if ev.match == "CodeCompanionRequestStarted" then
            -- create a new progress handle
            cc_handle = progress.handle.create({
                lsp_client = "codecompanion",
                message = "CodeCompanion request",
            })
        elseif ev.match == "CodeCompanionRequestFinished" then
            -- end this progress
            if cc_handle then
                cc_handle:finish()
                cc_handle = nil
            end
        end
    end,
})
