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
      -- 1) merge cmp capabilities
      lspconfig_defaults.capabilities = vim.tbl_deep_extend(
        'force',
        lspconfig_defaults.capabilities,
        require('cmp_nvim_lsp').default_capabilities()
      )

      -- -- 2) add foldingRange capability (ufo + LSP folding needs this)
      -- lspconfig_defaults.capabilities.textDocument = lspconfig_defaults.capabilities.textDocument or {}
      -- lspconfig_defaults.capabilities.textDocument.foldingRange = {
      --   dynamicRegistration = false,
      --   lineFoldingOnly = true,
      -- }
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
}
