return {
  'stevearc/conform.nvim',
  event = { "BufWritePre" },
  cmd = { "ConformInfo" },
  opts = {
    formatters_by_ft = {
      lua = { "stylua" },
      yaml = { lsp_format = "prefer" },
      toml = { "tombi" },
      python = { "ruff_organize_imports", "ruff_format" },
      go = { "goimports", "gofmt" },
      terraform = { "terraform_fmt" },
      ["terraform-vars"] = { "terraform_fmt" },
      ["_"] = { "trim_whitespace" },
      javascript = { "eslint_d", "prettierd", stop_after_first = true },
      typescript = { "eslint_d", "prettierd", stop_after_first = true },
      sass = { "stylelint" },
      sql = { "sql_formatter" },
      latex = { "latexindent" },
    },
    default_format_opts = {
      lsp_format = "fallback",
    },
    format_on_save = {
      timeout_ms = 500,
    },
    log_level = vim.log.levels.ERROR,
    notify_on_error = false,
    notify_no_formatters = false,
  },
}
