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
      -- Set default capabilities for ALL LSP servers
      -- (replaces the old lspconfig.util.default_config.capabilities pattern)
      vim.lsp.config('*', {
        capabilities = require('cmp_nvim_lsp').default_capabilities()
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
