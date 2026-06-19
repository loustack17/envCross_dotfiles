return {
  "saghen/blink.cmp",
  tag = "v1.10.2",
  dependencies = {
    "L3MON4D3/LuaSnip",
    "Exafunction/windsurf.nvim",
  },
  opts = {
    keymap = {
      preset = "none",
      ["<C-j>"] = { "select_next", "show" },
      ["<C-k>"] = { "select_prev", "fallback" },
      ["<C-l>"] = { "show", "show_documentation", "hide_documentation" },
      ["<C-e>"] = { "hide", "fallback" },
      ["<CR>"] = { "accept", "fallback" },
      ["<Tab>"] = { "select_next", "snippet_forward", "fallback" },
      ["<S-Tab>"] = { "select_prev", "snippet_backward", "fallback" },
    },
    appearance = {
      nerd_font_variant = "mono",
    },
    completion = {
      list = {
        selection = {
          preselect = false,
          auto_insert = false,
        },
      },
      menu = {
        border = "rounded",
        draw = {
          columns = { { "kind_icon" }, { "label", "label_description", gap = 1 }, { "source_name" } },
        },
      },
      documentation = {
        auto_show = false,
        window = {
          border = "rounded",
        },
      },
    },
    snippets = {
      preset = "luasnip",
    },
    sources = {
      default = { "lsp", "path", "snippets", "buffer", "codeium" },
      providers = {
        codeium = { name = "Codeium", module = "codeium.blink", async = true },
        buffer = {
          score_offset = -5,
          opts = {
            get_bufnrs = function()
              return vim.tbl_filter(function(buf)
                return vim.api.nvim_buf_is_loaded(buf) and vim.bo[buf].buftype ~= "nofile" and vim.api.nvim_buf_line_count(buf) < 5000
              end, vim.api.nvim_list_bufs())
            end,
            max_sync_buffer_size = 20000,
            max_async_buffer_size = 200000,
            max_total_buffer_size = 500000,
          },
        },
      },
    },
    fuzzy = {
      implementation = "prefer_rust_with_warning",
    },
  },
  opts_extend = { "sources.default" },
}
