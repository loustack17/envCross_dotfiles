return { 
    -- Treesitter: Syntax Highlighting & Parsing
    "nvim-treesitter/nvim-treesitter", 
    branch = 'master', 
    lazy = false, 
    build = ":TSUpdate",
    config = function()
        require("nvim-treesitter.configs").setup ({
            ensure_installed = { 
			"javascript",
			"angular",
			"typescript",
			"bash",
			"c_sharp",
			"go",
			"powershell",
			"python"
		    },
            sync_install = false,    -- Install asynchronously
            highlight = { enable = true },
            indent = { enable = true },
			auto_install = false,
			highlight = { enable = true, additional_vim_regex_highlighting = false },
			incremental_selection = {
				enable = true,
				keymaps = {
				  init_selection = "<C-n>",
				  node_incremental = "<C-n>",
				  scope_incremental = "<C-s>",
				  node_decremental = "<C-m>",
			    }
            }
	   })
	end
}