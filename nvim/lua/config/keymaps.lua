local map = vim.keymap.set

-- Window resize
map("n", "rh", "<C-w><", { desc = "Resize window left" })
map("n", "rj", "<C-w>+", { desc = "Resize window down" })
map("n", "rk", "<C-w>-", { desc = "Resize window up" })
map("n", "rl", "<C-w>>", { desc = "Resize window right" })

-- Move lines
map("n", "<A-Down>", ":m .+1<CR>==", { desc = "Move line down" })
map("n", "<A-Up>", ":m .-2<CR>==", { desc = "Move line up" })
map("n", "<A-j>", ":m .+1<CR>==", { desc = "Move line down" })
map("n", "<A-k>", ":m .-2<CR>==", { desc = "Move line up" })
map("n", "<leader>j", ":m .+1<CR>==", { desc = "Move line down" })
map("n", "<leader>k", ":m .-2<CR>==", { desc = "Move line up" })

-- Diagnostics
map("n", "[d", vim.diagnostic.goto_prev, { desc = "Previous diagnostic" })
map("n", "]d", vim.diagnostic.goto_next, { desc = "Next diagnostic" })
map("n", "<leader>dd", vim.diagnostic.open_float, { desc = "Line diagnostic" })
map("n", "<leader>dq", vim.diagnostic.setqflist, { desc = "Diagnostics quickfix" })

-- Delete and cut behavior
map({ "n", "v" }, "d", '"_d', { desc = "Delete to black hole register" })
map({ "n", "v" }, "dd", '"_dd', { desc = "Delete line to black hole register" })
map({ "n", "v" }, "x", "d", { desc = "Cut" })
map("n", "xx", "dd", { desc = "Cut line" })

-- Move visual selections
map("v", "<A-Down>", ":m '>+1<CR>gv=gv", { desc = "Move selection down" })
map("v", "<A-Up>", ":m '<-2<CR>gv=gv", { desc = "Move selection up" })
map("v", "<A-j>", ":m '>+1<CR>gv=gv", { desc = "Move selection down" })
map("v", "<A-k>", ":m '<-2<CR>gv=gv", { desc = "Move selection up" })
map("v", "<leader>j", ":m '>+1<CR>gv=gv", { desc = "Move selection down" })
map("v", "<leader>k", ":m '<-2<CR>gv=gv", { desc = "Move selection up" })

-- Move current line from insert mode
map("i", "<A-Down>", "<Esc>:m .+1<CR>==gi", { desc = "Move line down" })
map("i", "<A-Up>", "<Esc>:m .-2<CR>==gi", { desc = "Move line up" })
map("i", "<A-j>", "<Esc>:m .+1<CR>==gi", { desc = "Move line down" })
map("i", "<A-k>", "<Esc>:m .-2<CR>==gi", { desc = "Move line up" })

-- AI completion
map("i", "<Tab>", function()
  return require("codeium.virtual_text").accept()
end, { silent = true, expr = true, script = true, nowait = true, desc = "Accept AI completion" })
map("i", "<M-]>", function()
  require("codeium.virtual_text").cycle_completions(1)
end, { silent = true, desc = "Next AI completion" })
map("i", "<M-[>", function()
  require("codeium.virtual_text").cycle_completions(-1)
end, { silent = true, desc = "Previous AI completion" })

-- Tabs and workspaces
map("n", "H", "<Cmd>tabprevious<CR>", { desc = "Previous workspace" })
map("n", "L", "<Cmd>tabnext<CR>", { desc = "Next workspace" })
map("n", "<leader>tn", "<Cmd>tabnew<CR>", { desc = "New workspace" })
map("n", "<leader>tc", "<Cmd>tabclose<CR>", { desc = "Close workspace" })

-- File manager
map({ "n", "v" }, "<leader>e", "<Cmd>Yazi<CR>", { desc = "Open yazi at current file" })
map({ "n", "v" }, "<leader>o", "<Cmd>Yazi<CR>", { desc = "Open yazi at current file" })
map({ "n", "v" }, "<leader>-", "<Cmd>Yazi<CR>", { desc = "Open yazi at current file" })
map("n", "<leader>cw", "<Cmd>Yazi cwd<CR>", { desc = "Open yazi in cwd" })

-- Git
map("n", "<leader>lg", "<Cmd>LazyGit<CR>", { desc = "LazyGit" })

-- Search
map("n", "<leader>ff", "<Cmd>Telescope find_files<CR>", { desc = "Find files" })
map("n", "<leader>fg", "<Cmd>Telescope live_grep<CR>", { desc = "Live grep" })
map("n", "<leader>fb", "<Cmd>Telescope buffers<CR>", { desc = "Find buffers" })

-- Keymap help
map("n", "<leader>?", function()
  require("which-key").show({ global = false })
end, { desc = "Buffer local keymaps" })

-- Flash navigation
map({ "n", "x", "o" }, "s", function()
  require("flash").jump()
end, { desc = "Flash" })
map({ "n", "x", "o" }, "S", function()
  require("flash").treesitter()
end, { desc = "Flash treesitter" })
map("o", "r", function()
  require("flash").remote()
end, { desc = "Remote flash" })
map({ "o", "x" }, "R", function()
  require("flash").treesitter_search()
end, { desc = "Treesitter search" })
map("c", "<C-s>", function()
  require("flash").toggle()
end, { desc = "Toggle flash search" })

-- Comments
map("n", "<leader>/", function()
  require("Comment.api").toggle.linewise.current()
end, { desc = "Toggle comment line" })
map("v", "<leader>/", function()
  vim.api.nvim_feedkeys(vim.api.nvim_replace_termcodes("<Esc>", true, false, true), "nx", false)
  require("Comment.api").toggle.linewise(vim.fn.visualmode())
end, { desc = "Toggle comment selection" })

-- Folds
map("n", "zR", function()
  require("ufo").openAllFolds()
end, { desc = "Open all folds" })
map("n", "zM", function()
  require("ufo").closeAllFolds()
end, { desc = "Close all folds" })

-- Debugging
map("n", "<F5>", function()
  require("dap").continue()
end, { desc = "Debug continue" })
map("n", "<F10>", function()
  require("dap").step_over()
end, { desc = "Debug step over" })
map("n", "<F11>", function()
  require("dap").step_into()
end, { desc = "Debug step into" })
map("n", "<F12>", function()
  require("dap").step_out()
end, { desc = "Debug step out" })
map("n", "<leader>db", function()
  require("dap").toggle_breakpoint()
end, { desc = "Debug breakpoint" })
map("n", "<leader>dB", function()
  require("dap").set_breakpoint(vim.fn.input("Condition: "))
end, { desc = "Debug conditional breakpoint" })
map("n", "<leader>dl", function()
  require("dap").run_last()
end, { desc = "Debug run last" })
map("n", "<leader>dr", function()
  require("dap").repl.open()
end, { desc = "Debug REPL" })
map("n", "<leader>du", function()
  require("dapui").toggle()
end, { desc = "Debug UI" })

-- Trouble lists
map("n", "<leader>xx", "<Cmd>Trouble diagnostics toggle<CR>", { desc = "Diagnostics" })
map("n", "<leader>xX", "<Cmd>Trouble diagnostics toggle filter.buf=0<CR>", { desc = "Buffer diagnostics" })
map("n", "<leader>cs", "<Cmd>Trouble symbols toggle focus=false<CR>", { desc = "Symbols" })
map("n", "<leader>cl", "<Cmd>Trouble lsp toggle focus=false win.position=right<CR>", { desc = "LSP references" })
map("n", "<leader>xL", "<Cmd>Trouble loclist toggle<CR>", { desc = "Location list" })
map("n", "<leader>xQ", "<Cmd>Trouble qflist toggle<CR>", { desc = "Quickfix list" })

-- GitHub
map("n", "<leader>gI", "<Cmd>Octo issue list<CR>", { desc = "GitHub issues" })
map("n", "<leader>gP", "<Cmd>Octo pr list<CR>", { desc = "GitHub pull requests" })

-- Filetype-local mappings
vim.api.nvim_create_autocmd("FileType", {
  pattern = { "markdown", "quarto", "rmd", "octo" },
  callback = function(args)
    map("n", "<leader>mw", function()
      local wrap = not vim.wo.wrap
      vim.wo.wrap = wrap
      vim.wo.linebreak = wrap
    end, { buffer = args.buf, desc = "Toggle markdown wrap" })

    map("n", "<leader>mp", function()
      require("render-markdown").toggle()
    end, { buffer = args.buf, desc = "Toggle markdown render" })
  end,
})

-- LSP buffer mappings
vim.api.nvim_create_autocmd("LspAttach", {
  desc = "LSP actions",
  callback = function(event)
    local opts = { buffer = event.buf }

    map("n", "K", vim.lsp.buf.hover, opts)
    map("n", "gd", vim.lsp.buf.definition, opts)
    map("n", "gD", vim.lsp.buf.declaration, opts)
    map("n", "gi", vim.lsp.buf.implementation, opts)
    map("n", "go", vim.lsp.buf.type_definition, opts)
    map("n", "gr", vim.lsp.buf.references, opts)
    map("n", "gs", vim.lsp.buf.signature_help, opts)
    map("n", "<F2>", vim.lsp.buf.rename, opts)
    map("n", "<F4>", vim.lsp.buf.code_action, opts)
    map({ "n", "v" }, "<C-.>", vim.lsp.buf.code_action, opts)
    map({ "n", "x" }, "<S-A-f>", function()
      require("conform").format({ async = true, lsp_format = "fallback" })
    end, { buffer = event.buf, desc = "Format" })
    map("i", "<C-.>", function()
      vim.schedule(vim.lsp.buf.code_action)
    end, opts)
  end,
})
