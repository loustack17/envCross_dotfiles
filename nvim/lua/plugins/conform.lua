return {
  'stevearc/conform.nvim',
  event = { "BufWritePre" },
  cmd = { "ConformInfo" },
  opts = {
    formatters_by_ft = {
      lua = { "stylua" },
      yaml = { "yq" },
      toml = { "tombi" },
      -- Conform will run multiple formatters sequentially
      python = function(bufnr)
        if require("conform").get_formatter_info("ruff_format", bufnr).available then
          return { "ruff_format" }
        else
          return { "isort", "black" }
        end
      end,
      go = { "goimports", "gofmt" },
      -- You can customize some of the format options for the filetype (:help conform.format)
      ["*"] = { "prettierd", "prettier" },
      ["_"] = { "trim_whitespace" },
      -- Conform will run the first available formatter
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
      -- These options will be passed to conform.format()
      timeout_ms = 500,
      lsp_format = "fallback",
    },
    -- Set the log level. Use `:ConformInfo` to see the location of the log file.
    log_level = vim.log.levels.ERROR,
    -- Conform will notify you when a formatter errors
    notify_on_error = true,
    -- Conform will notify you when no formatters are available for the buffer
    notify_no_formatters = true,
    formatters = {
      yq = {
        command = "yq",
        args = { "eval", ".", "-" },
        stdin = true,
      },
    },
  },
}
