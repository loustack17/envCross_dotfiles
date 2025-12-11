return {
    "romgrk/barbar.nvim",
    -- Dependencies for rich display (icons and git status)
    dependencies = {
        "nvim-tree/nvim-web-devicons", 
        "lewis6991/gitsigns.nvim",    
    },

    opts = {
        animation = true,
        insert_at_start = true,
    },
    
    -- Custom Keymaps for Buffer Switching 
    keys = {
        { "<A-p>", "<Cmd>BufferPrevious<CR>", desc = "Previous Buffer" },
        { "<A-n>", "<Cmd>BufferNext<CR>", desc = "Next Buffer" },
        { "<A-c>", "<Cmd>BufferClose<CR>", desc = "Close Current Buffer" },
    },
}