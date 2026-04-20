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
      pattern = { "markdown", "quarto", "rmd", "octo" },
      callback = function(args)
        vim.opt_local.wrap = true
        vim.opt_local.linebreak = true

        vim.keymap.set("n", "<leader>mw", function()
          local wrap = not vim.wo.wrap
          vim.wo.wrap = wrap
          vim.wo.linebreak = wrap
        end, { buffer = args.buf, desc = "Toggle markdown wrap" })

        vim.keymap.set("n", "<leader>mp", function()
          require("render-markdown").toggle()
        end, { buffer = args.buf, desc = "Toggle markdown render" })
      end,
    })
  end,
}
