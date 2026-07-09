return {
	{
		"folke/which-key.nvim",
		event = "VeryLazy",
		opts = {},
	},
	{
		"nvim-telescope/telescope.nvim",
		cmd = "Telescope",
		dependencies = { "nvim-lua/plenary.nvim" },
	},
	{
		"rmagatti/auto-session",
		lazy = false,
		init = function()
			local arg0 = vim.fn.argv(0)
			if arg0 ~= "" and vim.fn.isdirectory(arg0) == 1 then
				vim.g.auto_session_enabled = false
			end
		end,
		opts = {
			suppressed_dirs = { "~/", "~/Projects", "~/Downloads", "/" },
		},
	},
	{
		"numToStr/Comment.nvim",
		lazy = true,
		opts = {},
	},
	{
		"f-person/git-blame.nvim",
		event = "VeryLazy",
		opts = {
			enabled = true,
			message_template = " <summary> • <date> • <author> • <<sha>>",
			date_format = "%m-%d-%Y %H:%M:%S",
			virtual_text_column = 1,
		},
	},
	{
		"L3MON4D3/LuaSnip",
		version = "v2.*",
		dependencies = {
			{ "rafamadriz/friendly-snippets" },
		},
		build = "make install_jsregexp",
		config = function()
			require("luasnip.loaders.from_vscode").lazy_load({
				paths = { vim.fn.stdpath("data") .. "/lazy/friendly-snippets" },
			})
		end,
	},
	{
		"windwp/nvim-autopairs",
		event = "InsertEnter",
		config = true,
	},
	"nanotee/zoxide.vim",
}
