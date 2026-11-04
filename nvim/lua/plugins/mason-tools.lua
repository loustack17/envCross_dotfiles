return {
  "WhoIsSethDaniel/mason-tool-installer.nvim",
  dependencies = { "mason-org/mason.nvim" },
  opts = {
    ensure_installed = {
      "stylua",
      "tombi",
      "goimports",
      "eslint_d",
      "prettierd",
      "stylelint",
      "sql-formatter",
      "actionlint",
      "js-debug-adapter",
      "debugpy",
      "delve",
    },
  },
}
