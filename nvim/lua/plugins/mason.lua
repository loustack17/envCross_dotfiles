local LSPS = {
  "lua_ls",
  "rust_analyzer",
  "pyright",
  "ts_ls",     -- JavaScript/TypeScript
  "vtsls",
  "csharp_ls", -- C# primary LSP
  "omnisharp",
  "tailwindcss",
  "gopls",
  "ruff",
  "ty",
  "html",
  "emmet_language_server",
  "cssls",
  "terraformls",
  "tflint"
}


return {
  { -- 1. Mason: LSP/Linter/Formatter Manager
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
  -- 2. Mason Lspconfig & Nvim-Lspconfig Integration
  {
    "mason-org/mason-lspconfig.nvim",
    opts = {
      ensure_installed = LSPS
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
