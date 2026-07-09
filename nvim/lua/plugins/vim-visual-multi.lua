return {
	"mg979/vim-visual-multi",
	init = function()
		vim.g.VM_maps = {
			-- VSCode-style Ctrl+D to add next occurrence
			["Find Under"] = "<C-d>",
			["Find Subword Under"] = "<C-d>",

			-- Add cursors vertically (Ctrl+Alt+Up/Down in VSCode)
			["Add Cursor Down"] = "<C-A-Down>",
			["Add Cursor Up"] = "<C-A-Up>",

			["Select Cursor Down"] = "<C-A-j>",
			["Select Cursor Up"] = "<C-A-k>",
		}
		-- Enable mouse support for adding cursors
		vim.g.VM_mouse_mappings = 1
		-- Show warnings
		vim.g.VM_show_warnings = 1
	end,
}
