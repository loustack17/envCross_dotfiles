local LSPS = {
  "lua_ls",
  "rust_analyzer",
  "vtsls",
  "tailwindcss",
  "gopls",
  "ruff",
  "ty",
  "html",
  "emmet_language_server",
  "cssls",
  "terraformls",
  "tflint",
  "jsonls",
  "yamlls",
  "tinymist"
}


return {
  {
    "mason-org/mason.nvim",
    opts = {
      ui = {
        icons = {
          package_installed = "✓",
          package_pending = "➜",
          package_uninstalled = "✗"
        }
      }
    }
  },
  {
    "mason-org/mason-lspconfig.nvim",
    opts = {
      ensure_installed = LSPS,
      automatic_enable = false,
    },
    dependencies = {
      { "mason-org/mason.nvim", opts = {} },
      "neovim/nvim-lspconfig",
    },
    config = function(_, opts)
      require("mason-lspconfig").setup(opts)
      vim.lsp.enable(LSPS)
    end,
  },
}
