return {
  "pwntester/octo.nvim",
  cmd = "Octo",
  dependencies = {
    "nvim-lua/plenary.nvim",
    "nvim-telescope/telescope.nvim",
    "nvim-tree/nvim-web-devicons",
  },
  opts = {
    picker = "telescope",
    enable_builtin = true,
  },
  config = function(_, opts)
    require("octo").setup(opts)

    local augroup = vim.api.nvim_create_augroup("octo_readability", { clear = true })
    vim.api.nvim_create_autocmd("FileType", {
      group = augroup,
      pattern = { "octo", "octo_panel" },
      callback = function()
        vim.opt_local.breakindent = true
        vim.opt_local.conceallevel = 2
        vim.opt_local.concealcursor = "nc"
        vim.opt_local.foldlevel = 99
      end,
    })
  end,
}
