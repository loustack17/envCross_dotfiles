return {
    "nvim-neo-tree/neo-tree.nvim",
    branch = "v3.x",
    dependencies = {
        "nvim-lua/plenary.nvim",
        "nvim-tree/nvim-web-devicons",
        "MunifTanjim/nui.nvim",
    },
    config = function()
        require("neo-tree").setup({
            close_if_last_window = true,
            popup_border_style = "rounded",

            enable_git_status = true,
            enable_diagnostics = true,

            default_component_configs = {
                indent = {
                    indent_size = 2,
                    padding = 0,
                    with_markers = true,
                    highlight = "NeoTreeIndentMarker",
                },

                icon = {
                    folder_closed = "",
                    folder_open = "",
                    folder_empty = "",
                },

                git_status = {
                    symbols = {
                        added     = "",
                        modified  = "",
                        deleted   = "",
                        renamed   = "",
                        untracked = "",
                        ignored   = "",
                        unstaged  = "",
                        staged    = "",
                        conflict  = "",
                    },
                },
            },

            -- Right side show filesystem
            window = {
                position = "right",
                width = 35,
                mappings = {
                    ["<space>"] = "toggle_node",
                    ["<cr>"]    = "open",
                    ["l"]       = "open",
                    ["h"]       = "close_node",
                    ["s"]       = "open_split",
                    ["v"]       = "open_vsplit",
                    ["t"]       = "open_tabnew",
                    ["P"]       = "toggle_preview",
                    ["q"]       = "close_window",
                },
            },

            filesystem = {
                filtered_items = {
                    visible = false,
                    hide_dotfiles = true,
                    hide_gitignored = true,
                },
                follow_current_file = {
                    enabled = true,
                },
                group_empty_dirs = true,
                hijack_netrw_behavior = "open_default",
            },

            buffers = {
                follow_current_file = { enabled = true },
            },

            git_status = {
                window = {
                    position = "float",
                },
            },
        })

        vim.keymap.set("n", "<leader>e", ":Neotree toggle right<CR>", { desc = "Toggle Neo-tree" })
        vim.keymap.set("n", "<leader>o", ":Neotree focus right<CR>", { desc = "Focus Neo-tree" })
    end,
}
