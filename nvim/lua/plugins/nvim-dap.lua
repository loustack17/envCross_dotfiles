return {
	{
		"mfussenegger/nvim-dap",
		lazy = true,
		event = "VeryLazy",
		dependencies = {
			{ "theHamsta/nvim-dap-virtual-text", config = true },
		},
		config = function()
			local dap = require("dap")
			dap.adapters["pwa-node"] = {
				type = "server",
				port = "${port}",
				executable = {
					-- command = "node",
					command = "js-debug-adapter",
					args = {
						-- "C:/Users/Lou/AppData/Local/nvim-data/mason/packages/js-debug-adapter/js-debug/src/dapDebugServer.js",
						"${port}",
					}
				},
			}

			dap.adapters["pwa-chrome"] = {
				type = "server",
				port = "${port}",
				executable = {
					command = "js-debug-adapter",
					args = { "${port}" },
				},
			}

			local js_based_languages = { "typescript", "javascript", "typescriptreact", "javascriptreact" }
			for _, language in ipairs(js_based_languages) do
				dap.configurations[language] = {
					{
						name = "Next.js: debug server",
						type = "pwa-node",
						request = "attach",
						program = "${workspaceFolder}/node_modules/next/dist/bin/next",
						cwd = "${workspaceFolder}",
						port = 9231,
						runtimeExecutable = "node",
						runtimeArgs = {
							"--inspect",
							"${program}",
							"dev"
						},
						skipFiles = {
							"<node_internals>/**",
							"node_modules/**",
						},
						serverReadyAction = {
							action = "debugWithChrome",
							killOnServerStop = true,
							pattern = "- Local:.+(https?://.+)",
							uriFormat = "%s",
							webRoot = "${workspaceFolder}",
						},
						outFiles = { "${workspaceFolder}/dist/**/*.js" },
					},
					{
						name = "Next.js: debug client-side",
						type = "pwa-chrome",
						request = "launch",
						url = "http://localhost:3000",
						webRoot = "${workspaceFolder}",
						sourceMaps = true,
						sourceMapPathOverrides = {
							["webpack://_N_E/*"] = "${webRoot}/*",
						},
					},
				}
			end
		end,
	},
	{
		"rcarriga/nvim-dap-ui",
		lazy = true,
		event = "VeryLazy",
		dependencies = { "mfussenegger/nvim-dap", "nvim-neotest/nvim-nio" },
		config = function()
			local dap, dapui = require("dap"), require("dapui")
			dapui.setup()
			dap.listeners.after.event_initialized["dapui_config"] = function() dapui.open() end
			dap.listeners.before.event_terminated["dapui_config"] = function() dapui.close() end
			dap.listeners.before.event_exited["dapui_config"] = function() dapui.close() end
		end,
	}

}
