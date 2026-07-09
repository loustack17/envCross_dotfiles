return {
  "mikavilpas/yazi.nvim",
  version = "*",
  lazy = false,
  dependencies = {
    { "nvim-lua/plenary.nvim", lazy = true },
  },
  opts = {
    open_for_directories = true,
    keymaps = {
      show_help = "<f1>",
    },
  },
}
