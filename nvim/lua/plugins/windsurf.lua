return {
  "Exafunction/windsurf.nvim",
  dependencies = {
    "nvim-lua/plenary.nvim",
  },
  config = function()
    require("codeium").setup({
      enable_cmp_source = false,
      virtual_text = {
        enabled = true,
        manual = false,
        filetypes = {
          python = true,
          markdown = false,
          typescript = true,
          go = true,
          lua = true,
          rust = true,
          sh = true,
          javascript = true,
          javascriptreact = true,
          typescriptreact = true,
          json = true,
          yaml = true,
          html = true,
          css = true,
          all = false,
        },
        default_filetype_enabled = true,
        idle_delay = 350,
        virtual_text_priority = 65535,
        map_keys = true,
        accept_fallback = nil,
        key_bindings = {
          accept = "<Tab>",
          accept_word = false,
          accept_line = false,
          clear = false,
          next = "<M-]>",
          prev = "<M-[>",
        }
      }
    })
    local virtual_text = require("codeium.virtual_text")
    local get_completion_text = virtual_text.get_completion_text
    virtual_text.get_completion_text = function()
      return get_completion_text():gsub("\r\n", "\n"):gsub("\r", "")
    end
  end
}
