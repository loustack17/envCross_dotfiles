return {
    "akinsho/bufferline.nvim",
    version = "*",
    dependencies = {
        "nvim-tree/nvim-web-devicons",
    },
    event = { "BufReadPost", "BufNewFile" },

    opts = {
        options = {
            close_command = "bdelete! %d",
            diagnostics = "nvim_lsp",
            offsets = {
                {
                    filetype = "neo-tree",
                    text = "File Explorer",
                    highlight = "Directory",
                    separator = true,
                },
            },
            separator_style = "slant",
        },
    },

    keys = {
        { "<S-h>", "<Cmd>BufferLineCyclePrev<CR>", desc = "Previous Buffer" },
        { "<S-l>", "<Cmd>BufferLineCycleNext<CR>", desc = "Next Buffer" },
        { "<A-w>", function()
            local buf = vim.api.nvim_get_current_buf()
            vim.cmd("bnext")
            if vim.api.nvim_get_current_buf() == buf then
                vim.cmd("enew")
            end
            vim.api.nvim_buf_delete(buf, {})
        end, desc = "Close Current Buffer" },
    },
}
