return {
  {
    'neovim/nvim-lspconfig',
    dependencies = {
      { 'mason-org/mason.nvim' },
      { 'mason-org/mason-lspconfig.nvim' },
      { 'saghen/blink.cmp' }
    },
    config = function()
      vim.lsp.config('*', {
        capabilities = require('blink.cmp').get_lsp_capabilities()
      })

      local function python_root(bufnr, on_dir)
        local markers = { 'pyproject.toml', 'setup.py', 'setup.cfg', 'requirements.txt', 'Pipfile', 'uv.lock', '.git' }
        local path = vim.api.nvim_buf_get_name(bufnr)
        local root = vim.fs.root(path, markers)
        if root and vim.fs.normalize(root) ~= vim.fs.normalize(vim.fn.expand('~')) then
          on_dir(root)
        end
      end

      for _, server in ipairs({ 'pyright', 'ruff', 'ty' }) do
        vim.lsp.config(server, {
          root_dir = python_root,
        })
      end

      vim.lsp.config('gopls', {
        filetypes = { 'go', 'gomod', 'gowork' },
      })

      vim.lsp.config('tailwindcss', {
        filetypes = {
          'html',
          'css',
          'scss',
          'less',
          'javascript',
          'javascriptreact',
          'typescript',
          'typescriptreact',
          'vue',
          'svelte',
          'templ',
          'heex',
          'htmldjango',
          'eruby',
          'markdown',
          'razor',
        },
      })

      vim.lsp.config('terraformls', {
        init_options = {
          ignoreSingleFileWarning = true,
        },
      })

      vim.lsp.config('yamlls', {
        filetypes = { 'yaml' },
        settings = {
          yaml = {
            format = {
              enable = true,
            },
            keyOrdering = false,
            schemaStore = {
              enable = true,
            },
            validate = true,
          },
        },
      })

      vim.lsp.config('tinymist', {
        cmd = { 'tinymist' },
        filetypes = { 'typst' },
        settings = {
          exportPdf = 'onSave',
        },
      })

      vim.lsp.enable('tinymist')
    end
  },
  {
    "tris203/rzls.nvim",
    dependencies = { "neovim/nvim-lspconfig" },
    ft = "razor",
    config = function()
      require("rzls").setup()
    end,
  },
}
