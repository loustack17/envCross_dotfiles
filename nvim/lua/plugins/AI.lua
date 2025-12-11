return {
  {
    "olimorris/codecompanion.nvim",
    opts = {
      strategies = {
        chat = {
          adapter = "copilot",
          model = "claude sonnet 4.5",
        },
        inline = {
          adapter = "copilot",
          model = "claude sonnet 4.5",
        },
        cmd = {
          adapter = "copilot",
          model = "claude sonnet 4.5",
        }
      },
      opts = {
        log_level = "WARM", -- or "TRACE"
      },
      extensions = {
        mcphub = {
          callback = "mcphub.extensions.codecompanion",
          opts = {
            make_vars = true,
            make_slash_commands = true,
            show_result_in_chat = true,
          },
        },
      },
      display = {
        action_palette = {
          width = 95,
          height = 10,
          prompt = "Prompt ",                   -- Prompt used for interactive LLM calls
          provider = "telescope",               -- telescope|mini_pick|snacks|default
          opts = {
            show_default_actions = true,        -- Show the default actions in the action palette?
            show_default_prompt_library = true, -- Show the default prompt library in the action palette?
            title = "CodeCompanion actions",    -- The title of the action palette
          },
        },
        chat = {
          -- Change the default icons
          icons = {
            buffer_pin = " ",
            buffer_watch = "👀 ",
          },

          -- Alter the sizing of the debug window
          debug_window = {
            ---@return number|fun(): number
            width = vim.o.columns - 5,
            ---@return number|fun(): number
            height = vim.o.lines - 2,
          },
          -- Options to customize the UI of the chat buffer
          window = {
            layout = "vertical", -- float|vertical|horizontal|buffer
            position = 'left',   -- left|right|top|bottom (nil will default depending on vim.opt.splitright|vim.opt.splitbelow)
            border = "single",
            height = 0.8,
            width = 0.3,
            relative = "editor",
            full_height = true, -- when set to false, vsplit will be used to open the chat buffer vs. botright/topleft vsplit
            sticky = false,     -- when set to true and `layout` is not `"buffer"`, the chat buffer will remain opened when switching tabs
            opts = {
              breakindent = true,
              cursorcolumn = false,
              cursorline = false,
              foldcolumn = "0",
              linebreak = true,
              list = false,
              numberwidth = 1,
              signcolumn = "no",
              spell = false,
              wrap = true,
            },
          },
        },
      }
    },
    dependencies = {
      "nvim-lua/plenary.nvim",
      "ravitemer/mcphub.nvim"
    },
  },
  {
    "ravitemer/mcphub.nvim",
    dependencies = { "nvim-lua/plenary.nvim" },
    build = "pnpm install -g mcp-hub@latest",
    config = function()
      require("mcphub").setup()
    end,
  },
  {
    "MeanderingProgrammer/render-markdown.nvim",
    ft = { "codecompanion" }
  },
  {
    "OXY2DEV/markview.nvim",
    lazy = false,
    opts = {
      preview = {
        filetypes = { "markdown", "norg", "rmd", "org" },
        ignore_buftypes = {},
      },
    },
  },
  {
    "echasnovski/mini.diff",
    config = function()
      local diff = require("mini.diff")
      diff.setup({
        -- Disabled by default
        source = diff.gen_source.none(),
      })
    end,
  },
  {
    "HakonHarnes/img-clip.nvim",
    opts = {
      filetypes = {
        codecompanion = {
          prompt_for_file_name = false,
          template = "[Image]($FILE_PATH)",
          use_absolute_path = true,
        },
      },
    },
  },
}
