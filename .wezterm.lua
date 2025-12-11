-- Pull in the wezterm API
local wezterm = require 'wezterm'
local themes = require 'themes'
local menu = require 'launcher'


-- This will hold the configuration.
local config = wezterm.config_builder()

-- This is where you actually apply your config choices.
local act = wezterm.action

-- For example, changing the initial geometry for new windows:
config.initial_cols = 120
config.initial_rows = 28
config.default_prog = { 'D:/ProgramData/Scoop/apps/nu/current/nu.exe' }
config.launch_menu = menu

-- or, changing the font size and color scheme.
config.font_size = 12
config.font = wezterm.font_with_fallback {
  'SFMono Nerd Font',
  'Hack Nerd Font Mono',
  'JetBrains Mono',
}
themes.apply_catppuccin(config)



-- ======================
--  Zellij style Pane shortcuts
-- ======================
config.keys = {
  -- split Pane
  -- Alt + v：Vertical split
  {
    key = "v",
    mods = "ALT",
    action = wezterm.action.SplitHorizontal { domain = "CurrentPaneDomain" },
  },
  -- Alt + s：horizontal split
  {
    key = "s",
    mods = "ALT",
    action = wezterm.action.SplitVertical { domain = "CurrentPaneDomain" },
  },

  -- Pane focus changing (Alt + h/j/k/l)
  {
    key = "h",
    mods = "ALT",
    action = wezterm.action.ActivatePaneDirection "Left",
  },
  {
    key = "j",
    mods = "ALT",
    action = wezterm.action.ActivatePaneDirection "Down",
  },
  {
    key = "k",
    mods = "ALT",
    action = wezterm.action.ActivatePaneDirection "Up",
  },
  {
    key = "l",
    mods = "ALT",
    action = wezterm.action.ActivatePaneDirection "Right",
  },

  -- Pane Resize (Alt + Shift + H/J/K/L)
  {
    key = "H",
    mods = "ALT|SHIFT",
    action = wezterm.action.AdjustPaneSize { "Left", 3 },
  },
  {
    key = "J",
    mods = "ALT|SHIFT",
    action = wezterm.action.AdjustPaneSize { "Down", 3 },
  },
  {
    key = "K",
    mods = "ALT|SHIFT",
    action = wezterm.action.AdjustPaneSize { "Up", 3 },
  },
  {
    key = "L",
    mods = "ALT|SHIFT",
    action = wezterm.action.AdjustPaneSize { "Right", 3 },
  },

  -- Close Current Pane（Alt + x）
  {
    key = "x",
    mods = "ALT",
    action = wezterm.action.CloseCurrentPane { confirm = true },
  },
}

table.insert(config.keys, {
  key = "Space",
  mods = "ALT",
  action = act.ShowLauncherArgs {
    flags = "LAUNCH_MENU_ITEMS|FUZZY", -- 只顯示 launch_menu 裡的東西
  },
})

-- Finally, return the configuration to wezterm:
return config
