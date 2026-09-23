return {
  {
    "nvim-treesitter/nvim-treesitter",
    branch = "main",
    lazy = false,
    build = function()
      assert(require("nvim-treesitter").update(nil, { max_jobs = 1 }):wait(300000), "Tree-sitter parser update failed")
    end,
  },
  {
    "MeanderingProgrammer/treesitter-modules.nvim",
    dependencies = { "nvim-treesitter/nvim-treesitter" },
    lazy = false,
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
        "markdown",
        "markdown_inline",
        "c_sharp",
        "go",
        "powershell",
        "python",
        "nu",
      },
      sync_install = false,
      auto_install = false,
      install_options = { max_jobs = 1 },
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
      require("treesitter-modules").setup(opts)
      vim.treesitter.language.register("markdown", "octo")
      vim.treesitter.language.register("markdown", "octo_panel")
    end,
  },
}
