return {
  "hrsh7th/nvim-cmp",
  dependencies = {
    "L3MON4D3/LuaSnip",
    "onsails/lspkind.nvim",
    "hrsh7th/cmp-buffer",
    "hrsh7th/cmp-nvim-lsp",
    "hrsh7th/cmp-path",
    "hrsh7th/cmp-cmdline",
    "saadparwaiz1/cmp_luasnip",
  },
  opts = function()
    local cmp = require("cmp")
    local luasnip = require("luasnip")
    local lspkind = require("lspkind")

    local function has_words_before()
      local line, col = unpack(vim.api.nvim_win_get_cursor(0))
      if col == 0 then
        return false
      end
      local current_line = vim.api.nvim_buf_get_lines(0, line - 1, line, true)[1]
      return current_line:sub(col, col):match("%s") == nil
    end

    local function loaded_buffers()
      return vim.tbl_filter(function(buf)
        return vim.api.nvim_buf_is_loaded(buf) and vim.api.nvim_buf_line_count(buf) < 5000
      end, vim.api.nvim_list_bufs())
    end

    return {
      preselect = cmp.PreselectMode.None,
      completion = {
        autocomplete = { cmp.TriggerEvent.TextChanged },
        completeopt = "menu,menuone,noinsert,noselect",
        keyword_length = 2,
      },
      performance = {
        debounce = 80,
        throttle = 40,
        fetching_timeout = 120,
        max_view_entries = 40,
      },
      window = {
        completion = cmp.config.window.bordered(),
        documentation = cmp.config.window.bordered(),
      },
      sources = cmp.config.sources({
        { name = "codeium", keyword_length = 3, priority = 700 },
        { name = "nvim_lsp", priority = 1000 },
        { name = "luasnip", priority = 750 },
        { name = "path", priority = 500 },
        {
          name = "buffer",
          keyword_length = 4,
          priority = 250,
          option = {
            get_bufnrs = loaded_buffers,
          },
        },
      }),
      snippet = {
        expand = function(args)
          luasnip.lsp_expand(args.body)
        end,
      },
      formatting = {
        format = lspkind.cmp_format({
          mode = "symbol_text",
          maxwidth = 50,
          ellipsis_char = "...",
        }),
      },
      mapping = cmp.mapping.preset.insert({
        ["<C-l>"] = cmp.mapping.complete(),
        ["<C-e>"] = cmp.mapping.abort(),
        ["<CR>"] = cmp.mapping.confirm({ select = false }),
        ["<C-j>"] = cmp.mapping(function()
          if cmp.visible() then
            cmp.select_next_item({ behavior = cmp.SelectBehavior.Select })
            return
          end
          cmp.complete()
        end, { "i", "s" }),
        ["<C-k>"] = cmp.mapping(function(fallback)
          if cmp.visible() then
            cmp.select_prev_item({ behavior = cmp.SelectBehavior.Select })
            return
          end
          fallback()
        end, { "i", "s" }),
        ["<Tab>"] = cmp.mapping(function(fallback)
          if cmp.visible() then
            cmp.select_next_item()
            return
          end
          if luasnip.expand_or_jumpable() then
            luasnip.expand_or_jump()
            return
          end
          if has_words_before() then
            cmp.complete()
            return
          end
          fallback()
        end, { "i", "s" }),
        ["<S-Tab>"] = cmp.mapping(function(fallback)
          if cmp.visible() then
            cmp.select_prev_item()
            return
          end
          if luasnip.jumpable(-1) then
            luasnip.jump(-1)
            return
          end
          fallback()
        end, { "i", "s" }),
      }),
    }
  end,
  config = function(_, opts)
    require("cmp").setup(opts)
  end,
}
