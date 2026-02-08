return {
  -- UI & Editor Enhancements
  {
    "catppuccin/nvim",
    name = "catppuccin",
    priority = 1000,

    config = function()
      require("catppuccin").setup({
        flavour = "mocha",
      })

      vim.cmd.colorscheme "catppuccin-mocha"
    end,
  }, -- Color scheme
  {
    "folke/which-key.nvim",
    event = "VeryLazy",
    opts = {
    },
    keys = {
      {
        "<leader>?",
        function()
          require("which-key").show({ global = false })
        end,
        desc = "Buffer Local Keymaps (which-key)",
      },
    },
  },
  -- Fuzzy Finding (Telescope)
  {
    "nvim-telescope/telescope.nvim",
    dependencies = { "nvim-lua/plenary.nvim" },
    -- Lazy loaded by keymap (example)
    keys = {
      { "<leader>ff", "<cmd>Telescope find_files<cr>", desc = "Find Files" },
      { "<leader>fg", "<cmd>Telescope live_grep<cr>",  desc = "Live Grep" },
      { "<leader>fb", "<cmd>Telescope buffers<cr>",    desc = "Find Buffers" }
    },
  },
  {
    'nvim-telescope/telescope-fzf-native.nvim',
    build = 'cmake -S. -Bbuild -DCMAKE_BUILD_TYPE=Release && cmake --build build --config Release --target install'
  },
  -- Auto-session (Session Management)
  {
    "rmagatti/auto-session",
    lazy = false, -- Must load immediately to restore session
    init = function()
      -- If Neovim is started with a directory arg (e.g., from yazi), disable auto-session restore/save
      local arg0 = vim.fn.argv(0)
      if arg0 ~= "" and vim.fn.isdirectory(arg0) == 1 then
        vim.g.auto_session_enabled = false
      end
    end,
    opts = {
      suppressed_dirs = { "~/", "~/Projects", "~/Downloads", "/" },
    }
  },
  -- Commenting
  {
    'numToStr/Comment.nvim',
    -- Lazy loaded by keymap (example)
    keys = {
      { "<leader>/", "gcc", mode = "n", desc = "Toggle Comment (line)" },
      { "<leader>/", "gc",  mode = "v", desc = "Toggle Comment (visual)" },
    },
    opts = {}
  },
  -- Git Plugins
  {
    "f-person/git-blame.nvim",
    event = "VeryLazy", -- Load after core setup
    opts = {
      enabled = true,
      message_template = " <summary> • <date> • <author> • <<sha>>",
      date_format = "%m-%d-%Y %H:%M:%S",
      virtual_text_column = 1,
    },
  },
  {
    "L3MON4D3/LuaSnip",
    -- follow latest release.
    version = "v2.*", -- Replace <CurrentMajor> by the latest released major (first number of latest release)
    dependencies = {
      { 'rafamadriz/friendly-snippets' },
    },
    -- install jsregexp (optional!).
    build = "make install_jsregexp",
    config = function()
      require("luasnip.loaders.from_vscode").lazy_load()
    end,
  },
  {
    'windwp/nvim-autopairs',
    event = "InsertEnter",
    config = true
    -- use opts = {} for passing setup options
    -- this is equivalent to setup({}) function
  },
  {
    'mg979/vim-visual-multi',
    init = function()
      vim.g.VM_maps = {
        -- VSCode-style Ctrl+D to add next occurrence
        ['Find Under'] = '<C-d>',
        ['Find Subword Under'] = '<C-d>',
        -- Add cursors vertically (Ctrl+Alt+Up/Down in VSCode)
        -- Using Ctrl+Shift+Up/Down as alternative since Ctrl+Alt often conflicts
        ['Add Cursor Down'] = '<C-S-Down>',
        ['Add Cursor Up'] = '<C-S-Up>',
        -- Alternative: also bind to Ctrl+Shift+j/k for terminal compatibility
        ['Select Cursor Down'] = '<C-S-j>',
        ['Select Cursor Up'] = '<C-S-k>',
      }
      -- Enable mouse support for adding cursors
      vim.g.VM_mouse_mappings = 1
      -- Show warnings
      vim.g.VM_show_warnings = 1
    end,
  },
  'nanotee/zoxide.vim',
}
