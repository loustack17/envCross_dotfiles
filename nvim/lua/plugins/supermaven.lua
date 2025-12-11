return {
    "supermaven-inc/supermaven-nvim",
    event = "InsertEnter",
    opts = {
        keymaps = {
            disable_keymaps = true
        },
        ignore_filetypes = { "gitcommit", "markdown" },
        log_level = "warn",
    },
}
