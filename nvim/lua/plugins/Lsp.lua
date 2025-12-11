return {
  -- LSP Management (Mason and Lspconfig)
  {
    'neovim/nvim-lspconfig',
    dependencies = {
      { 'mason-org/mason.nvim' },
      { 'mason-org/mason-lspconfig.nvim' },
      { 'hrsh7th/nvim-cmp' },
      { 'hrsh7th/cmp-buffer' },
      { 'hrsh7th/cmp-nvim-lsp' }
    },
    config = function()
      local lspconfig_defaults = require('lspconfig').util.default_config
      lspconfig_defaults.capabilities = vim.tbl_deep_extend(
        'force',
        lspconfig_defaults.capabilities,
        require('cmp_nvim_lsp').default_capabilities()
      )

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
    end
    -----------
  },
  -- Roslyn.nvim (C# Code Actions)
  {
    "seblyng/roslyn.nvim",
    dependencies = { "neovim/nvim-lspconfig" },
    ft = "cs", -- Only load for C# files

    config = function()
      require("roslyn").setup({
        server_path = vim.fn.expand("~/.local/share/nvim/mason/bin/roslyn_nvim"),

        enable_code_actions = true,
        enable_fix_all = true,
        enable_organize_imports = true,
      })

      local lspconfig = require("lspconfig")
      lspconfig.csharp_ls.setup {}
    end,
  },
  -- 4. NEW: Rizin/Rada2 LSP Client
  {
    "tris203/rzls.nvim",
    dependencies = { "neovim/nvim-lspconfig" },
    ft = "rizin", -- Only load for Rizin filetype
    config = function()
      require("rzls").setup()
    end,
  },
  -- 5. LSP UI Enhancements
  {
    "onsails/lspkind.nvim",
    opts = {
      symbol_map = {
        Copilot = "",
      },
    }
  }
}
