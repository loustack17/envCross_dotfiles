return {
  "mfussenegger/nvim-lint",
  event = { "BufReadPost", "BufNewFile" },
  config = function()
    local lint = require("lint")
    local group = vim.api.nvim_create_augroup("workflow-actionlint", { clear = true })

    local function lint_workflow()
      local path = vim.api.nvim_buf_get_name(0):gsub("\\", "/")
      if path:match("/%.github/workflows/.*%.ya?ml$") then
        lint.try_lint("actionlint")
      end
    end

    vim.api.nvim_create_autocmd({ "BufEnter", "BufWritePost", "InsertLeave" }, {
      group = group,
      callback = lint_workflow,
    })

    lint_workflow()
  end,
}
