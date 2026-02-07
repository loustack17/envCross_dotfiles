-- Resize
vim.keymap.set("n", "rh", "<C-w><")
vim.keymap.set("n", "rj", "<C-w>+")
vim.keymap.set("n", "rk", "<C-w>-")
vim.keymap.set("n", "rl", "<C-w>>")

-- Mode: Normal move one line (VSCode-style: Alt+Up/Down)
vim.keymap.set("n", '<A-Down>', ':m .+1<CR>==', { desc = 'Move line down' })
vim.keymap.set("n", '<A-Up>', ':m .-2<CR>==', { desc = 'Move line up' })
vim.keymap.set("n", '<A-j>', ':m .+1<CR>==', { desc = 'Move line down' })
vim.keymap.set("n", '<A-k>', ':m .-2<CR>==', { desc = 'Move line up' })

-- Mode: Visual move block (VSCode-style: Alt+Up/Down)
vim.keymap.set("v", '<A-Down>', ":m '>+1<CR>gv=gv", { desc = 'Move selection down' })
vim.keymap.set("v", '<A-Up>', ":m '<-2<CR>gv=gv", { desc = 'Move selection up' })
vim.keymap.set("v", '<A-j>', ":m '>+1<CR>gv=gv", { desc = 'Move selection down' })
vim.keymap.set("v", '<A-k>', ":m '<-2<CR>gv=gv", { desc = 'Move selection up' })

-- Mode: Insert move line (VSCode-style)
vim.keymap.set("i", '<A-Down>', '<Esc>:m .+1<CR>==gi', { desc = 'Move line down' })
vim.keymap.set("i", '<A-Up>', '<Esc>:m .-2<CR>==gi', { desc = 'Move line up' })
vim.keymap.set("i", '<A-j>', '<Esc>:m .+1<CR>==gi', { desc = 'Move line down' })
vim.keymap.set("i", '<A-k>', '<Esc>:m .-2<CR>==gi', { desc = 'Move line up' })

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
    vim.keymap.set({ 'n', 'x' }, '<S-A-f>', function() require("conform").format({ async = true, lsp_format = "fallback" }) end, { buffer = event.buf, desc = 'Format (VSCode-style)' })
    vim.keymap.set('n', '<F4>', '<cmd>lua vim.lsp.buf.code_action()<cr>', opts)
    vim.keymap.set({ 'n', 'v' }, '<C-.>', vim.lsp.buf.code_action, opts)
    vim.keymap.set('i', '<C-.>', function()
      vim.schedule(vim.lsp.buf.code_action)
    end, opts)
  end,
})
