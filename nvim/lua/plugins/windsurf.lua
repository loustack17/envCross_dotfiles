return {
  "Exafunction/windsurf.nvim",
  dependencies = {
    "nvim-lua/plenary.nvim",
  },
  config = function()
    require("codeium").setup({
      enable_cmp_source = false,
      virtual_text = {
        enabled = false,
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
        idle_delay = 75,
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
  end
}
