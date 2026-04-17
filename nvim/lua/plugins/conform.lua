return {
  'stevearc/conform.nvim',
  event = { "BufWritePre" },
  cmd = { "ConformInfo" },
  opts = {
    formatters_by_ft = {
      lua = { "stylua" },
      yaml = { lsp_format = "prefer" },
      toml = { "tombi" },
      python = function(bufnr)
        if require("conform").get_formatter_info("ruff_format", bufnr).available then
          return { "ruff_format" }
        else
          return { "isort", "black" }
        end
      end,
      go = { "goimports", "gofmt" },
      terraform = { "terraform_fmt" },
      ["terraform-vars"] = { "terraform_fmt" },
      ["_"] = { "trim_whitespace" },
      javascript = { "eslint_d", "prettierd", "prettier", stop_after_first = true },
      typescript = { "eslint_d", "prettierd", "prettier", stop_after_first = true },
      sass = { "stylelint" },
      sql = { "sqlfmt", "sql_formatter" },
      csharp = { "csharpier" },
      latex = { "latexindent" },
    },
    default_format_opts = {
      lsp_format = "fallback",
    },
    format_on_save = {
      timeout_ms = 500,
      lsp_format = "fallback",
    },
    log_level = vim.log.levels.ERROR,
    notify_on_error = true,
    notify_no_formatters = true,
  },
}
