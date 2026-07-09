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
          markdown = false,
        },
        default_filetype_enabled = true,
        idle_delay = 350,
        virtual_text_priority = 65535,
        map_keys = false,
        accept_fallback = nil
      }
    })
    local virtual_text = require("codeium.virtual_text")
    local get_completion_text = virtual_text.get_completion_text
    virtual_text.get_completion_text = function()
      return get_completion_text():gsub("\r\n", "\n"):gsub("\r", "")
    end
  end
}
