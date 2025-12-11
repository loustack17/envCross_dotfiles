return {
    "nvim-lualine/lualine.nvim",
    dependencies = { "nvim-tree/nvim-web-devicons" },
    config = function()
        local cc_component = require("config.codecompanion.codecompanion_lualine")

        require("lualine").setup({
            options = {
                theme = "catppuccin", -- 你已經在別處用 catppuccin，這裡順便套用
                icons_enabled = true,
                globalstatus = true,
            },
            sections = {
                lualine_a = { "mode" },
                lualine_b = { "branch", "diff", "diagnostics" },
                lualine_c = { "filename" },

                -- 把 CodeCompanion 的狀態放在右下角，可以照喜好調位置
                lualine_x = {
                    "encoding",
                    "fileformat",
                    "filetype",
                    { cc_component }, -- 這一行就是剛剛新寫的 component
                },
                lualine_y = { "progress" },
                lualine_z = { "location" },
            },
            inactive_sections = {
                lualine_a = {},
                lualine_b = {},
                lualine_c = { "filename" },
                lualine_x = { "location" },
                lualine_y = {},
                lualine_z = {},
            },
            tabline = {},
            extensions = {},
        })
    end,
}
