return {
  "MeanderingProgrammer/render-markdown.nvim",
  ft = { "markdown", "quarto", "rmd", "octo" },
  dependencies = {
    "nvim-treesitter/nvim-treesitter",
    "nvim-tree/nvim-web-devicons",
  },
  opts = {
    file_types = { "markdown", "quarto", "rmd", "octo" },
    pipe_table = {
      style = "full",
      cell = "padded",
      min_width = 8,
    },
    quote = {
      repeat_linebreak = false,
    },
  },
  config = function(_, opts)
    require("render-markdown").setup(opts)

    vim.api.nvim_create_autocmd("FileType", {
      pattern = { "markdown", "quarto", "rmd", "octo", "octo_panel" },
      callback = function(args)
        vim.opt_local.wrap = true
        vim.opt_local.linebreak = true
      end,
    })
  end,
}
