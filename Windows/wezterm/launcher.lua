local wezterm = require 'wezterm'
local launch_menu = {
	{
		label = 'NuShell',
		args = { 'D:/ProgramData/Scoop/apps/nu/current/nu.exe' },
	},
	{
		label = 'PowerShell 7',
		args = { 'D:/Program Files/PowerShell/7/pwsh.exe', '-NoLogo' },
	},
	{
		label = 'Command Prompt (CMD)',
		args = { 'cmd.exe' },
	},
	{
		label = 'Git Bash',
		args = { 'D:/ProgramData/Scoop/apps/git/current/bin/sh.exe' },
	},
}

return launch_menu
