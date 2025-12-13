return {
  "nvim-treesitter/nvim-treesitter",
  branch = "master",
  lazy = false,
  build = ":TSUpdate",
  opts = {
    ensure_installed = {
      "html",
      "htmldjango",
      "css",
      "scss",
      "javascript",
      "angular",
      "typescript",
      "tsx",
      "bash",
      "git_config",
      "gitignore",
      "json",
      "jsonc",
      "markdown",
      "c_sharp",
      "go",
      "powershell",
      "python",
      "nu",
    },
    sync_install = false,
    auto_install = false,

    highlight = {
      enable = true,
      additional_vim_regex_highlighting = false,
    },

    indent = {
      enable = true,
    },

    incremental_selection = {
      enable = true,
      keymaps = {
        init_selection = "<C-n>",
        node_incremental = "<C-n>",
        scope_incremental = "<C-s>",
        node_decremental = "<C-m>",
      },
    },
  },
  config = function(_, opts)
      require("nvim-treesitter.configs").setup(opts)
    end,
}
