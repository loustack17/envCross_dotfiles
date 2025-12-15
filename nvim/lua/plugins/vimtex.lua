return -- LaTeX support
{ -- LaTeX support
	"lervag/vimtex",
	ft = { "tex" },
	init = function()
		vim.g.vimtex_quickfix_mode = 0
		vim.g.vimtex_log_ignore = {
			"Underfull",
			"Overfull",
		}
		-- latexmk（offical recommended）
		vim.g.vimtex_compiler_method = "latexmk"

		-- default xelatex（Awesome-CV neccessary）
		vim.g.vimtex_compiler_latexmk = {
			executable = "latexmk",
			options = {
				"-xelatex",
				"-interaction=nonstopmode",
				"-file-line-error",
				"-synctex=1",
			},
		}

		-- turn off vimtex' viewer（Windows suggested external viewer）
		vim.g.vimtex_view_method = "general"
		vim.g.vimtex_view_general_viewer = "SumatraPDF.exe"
	end,
}
