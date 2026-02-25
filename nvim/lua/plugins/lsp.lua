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

      -- Configure tinymist for Typst
      vim.lsp.config('tinymist', {
        cmd = { 'tinymist' },
        filetypes = { 'typst' },
        settings = {
          exportPdf = 'onSave', -- or 'onType' for real-time preview
        },
      })

      vim.lsp.enable('tinymist')
    end
    -----------
  },
  -- Razor Language Server (ASP.NET Razor/Blazor)
  {
    "tris203/rzls.nvim",
    dependencies = { "neovim/nvim-lspconfig" },
    ft = "razor",
    config = function()
      require("rzls").setup()
    end,
  },
}
