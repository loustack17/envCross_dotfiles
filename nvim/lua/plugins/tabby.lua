local function tab_highlights()
	local normal = vim.api.nvim_get_hl(0, { name = "Normal", link = false })
	local fill_group = vim.api.nvim_get_hl(0, { name = "TabLineFill", link = false })
	local active_group = vim.api.nvim_get_hl(0, { name = "TabLineSel", link = false })
	local inactive_group = vim.api.nvim_get_hl(0, { name = "TabLine", link = false })
	local fill = {
		fg = fill_group.fg or normal.fg,
		bg = fill_group.bg or normal.bg,
	}
	local active = {
		fg = active_group.fg or normal.fg,
		bg = active_group.bg or normal.bg,
		style = "bold",
	}
	local inactive = {
		fg = inactive_group.fg or normal.fg,
		bg = inactive_group.bg or fill.bg,
	}

	return fill, active, inactive
end

return {
	"nanozuki/tabby.nvim",
	lazy = false,
	opts = {
		line = function(line)
			local fill, active, inactive = tab_highlights()

			return {
				line.tabs().foreach(function(tab)
					local hl = tab.is_current() and active or inactive

					return {
						" " .. tab.number() .. " " .. tab.name() .. " ",
						hl = hl,
						margin = " ",
					}
				end),
				hl = fill,
			}
		end,
	},
}
