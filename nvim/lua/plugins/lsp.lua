local servers = {
  lua_ls = { 'lua-language-server' },
  rust_analyzer = { 'rust-analyzer' },
  vtsls = { 'vtsls', '--stdio' },
  tailwindcss = { 'tailwindcss-language-server', '--stdio' },
  gopls = { 'gopls' },
  pyright = { 'pyright-langserver', '--stdio' },
  ruff = { 'ruff', 'server' },
  ty = { 'ty', 'server' },
  html = { 'vscode-html-language-server', '--stdio' },
  emmet_language_server = { 'emmet-language-server', '--stdio' },
  cssls = { 'vscode-css-language-server', '--stdio' },
  terraformls = {
    'terraform-ls',
    'serve',
    init_options = {
      ignoreSingleFileWarning = true,
    },
  },
  tflint = { 'tflint', '--langserver' },
  jsonls = { 'vscode-json-language-server', '--stdio' },
  yamlls = {
    'yaml-language-server',
    '--stdio',
    settings = {
      yaml = {
        keyOrdering = false,
        schemaStore = {
          enable = true,
        },
      },
    },
  },
  tinymist = {
    'tinymist',
    settings = {
      exportPdf = 'onSave',
    },
  },
}

return {
  {
    'neovim/nvim-lspconfig',
    dependencies = {
      {
        'mason-org/mason.nvim',
        opts = {
          ui = {
            icons = {
              package_installed = '✓',
              package_pending = '➜',
              package_uninstalled = '✗',
            },
          },
        },
      },
      'mason-org/mason-lspconfig.nvim',
      'saghen/blink.cmp',
    },
    config = function()
      local mason_bin = vim.fn.stdpath('data') .. '/mason/bin/'
      local suffix = vim.fn.has('win32') == 1 and '.cmd' or ''
      local names = vim.tbl_keys(servers)

      table.sort(names)
      vim.lsp.config('*', {
        capabilities = require('blink.cmp').get_lsp_capabilities(),
      })

      for name, config in pairs(servers) do
        local options = vim.deepcopy(config)
        local command = {}

        while options[1] do
          table.insert(command, table.remove(options, 1))
        end

        command[1] = mason_bin .. command[1] .. suffix
        options.cmd = command
        vim.lsp.config(name, options)
      end

      require('mason-lspconfig').setup({
        ensure_installed = names,
        automatic_enable = names,
      })
    end,
  },
}
