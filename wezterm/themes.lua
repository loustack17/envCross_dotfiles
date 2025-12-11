local wezterm = require 'wezterm'
local config = {}

function config.apply_catppuccin(config)

    local appearance = wezterm.gui.get_appearance()
    if appearance == 'Dark' then
        config.color_scheme = 'Catppuccin Macchiato'
    else
        config.color_scheme = 'Catppuccin Latte'
    end
	
	return config
end

return config