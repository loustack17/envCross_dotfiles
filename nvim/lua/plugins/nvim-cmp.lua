-- lua/plugins/nvim-cmp.lua
return {
  "hrsh7th/nvim-cmp",
  dependencies = {
    "L3MON4D3/LuaSnip",
    "hrsh7th/cmp-buffer",
    "hrsh7th/cmp-nvim-lsp",
    "hrsh7th/cmp-path",
    "hrsh7th/cmp-cmdline",
    "saadparwaiz1/cmp_luasnip",
    "zbirenbaum/copilot-cmp",
  },


  opts = function()
    local cmp = require("cmp")
    local luasnip = require("luasnip")


    local has_words_before = function()
      unpack = unpack or table.unpack
      local line, col = unpack(vim.api.nvim_win_get_cursor(0))
      if col == 0 then
        return false
      end
      local current_line = vim.api.nvim_buf_get_lines(0, line - 1, line, true)[1]
      return current_line:sub(col, col):match("%s") == nil
    end

    return {
      preselect = "item",
      completion = {
        autocomplete = { cmp.TriggerEvent.TextChanged },
        completeopt = "menu,menuone,noinsert",
        keyword_length = 3,
      },

      sources = cmp.config.sources({
        { name = "copilot" },
        { name = "nvim_lsp" },
        { name = "luasnip" },
        { name = "path" },
        {
          name = "buffer",
          option = {
            get_bufnrs = function()
              return vim.api.nvim_list_bufs()
            end,
          },
        },
      }),

      snippet = {
        expand = function(args)
          luasnip.lsp_expand(args.body)
        end,
      },

      mapping = cmp.mapping.preset.insert({
        -- Tab: confirm selection, jump snippets, or trigger completion_preview
        ["<Tab>"] = cmp.mapping(function(fallback)
          if cmp.visible() then
            cmp.confirm({ select = true }) -- 類似 VSCode：Tab 接受目前 suggestion
            return
          end

          local ok_sm, sm = pcall(require, "supermaven-nvim.completion_preview")
          if ok_sm and sm and sm.has_suggestion and sm.has_suggestion() then
            sm.on_accept_suggestion()
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

        -- Shift-Tab: select previous item or jump backwards in snippets
        ["<S-Tab>"] = cmp.mapping(function(fallback)
          if cmp.visible() then
            cmp.select_prev_item()
          elseif luasnip.jumpable(-1) then
            luasnip.jump(-1)
          else
            fallback()
          end
        end, { "i", "s" }),

        -- Enter: confirm selection
        ["<CR>"] = cmp.mapping(function(fallback)
          if cmp.visible() and cmp.get_active_entry() then
            cmp.confirm({ select = false })
          else
            fallback()
          end
        end, { "i", "s" }),

        -- '.': insert dot and confirm suggestion
        ["."] = cmp.mapping(function(fallback)
          if cmp.visible() and cmp.get_active_entry() then
            cmp.confirm({ select = false })
            feedkeys(".")
          else
            fallback()
          end
        end, { "i" }),

        -- Ctrl-j: trigger completion or select next items
        ["<C-j>"] = cmp.mapping(function()
          if not cmp.visible() then
            cmp.complete()
          else
            cmp.select_next_item()
          end
        end, { "i", "s" }),

        -- Ctrl-e: abort completion_preview or close completion menu
        ["<C-e>"] = cmp.mapping.abort(),
      }),
    }
  end,

  -- lazy.nvim standard：use opts to called cmp.setup
  config = function(_, opts)
    local cmp = require("cmp")
    cmp.setup(opts)
  end,
}
