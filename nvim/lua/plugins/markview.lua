return {
  "OXY2DEV/markview.nvim",
  lazy = false,
  ft = { "markdown", "octo" },
  opts = {
    preview = {
      icon_provider = "internal",
    },
  },
  config = function(_, opts)
    require("markview").setup(opts)
  end,
}
