return {
    {
        "zbirenbaum/copilot.lua",
        cmd = "Copilot",
        event = "InsertEnter",
        opts = {
            suggestion = {
                enabled = false, -- Turn off Copilot ghost text, use nvim-cmp instead
                auto_trigger = false,
            },
            panel = {
                enabled = false,
            },
            filetypes = {
                -- allow copilot in all filetypes
                lua = true,
                ["*"] = true,
            },
        },
    },
    {
        "zbirenbaum/copilot-cmp",
        dependencies = { "zbirenbaum/copilot.lua" },
        config = function()
            require("copilot_cmp").setup()
        end,
    }
}
