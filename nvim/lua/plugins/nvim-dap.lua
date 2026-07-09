local js_languages = { "typescript", "javascript", "typescriptreact", "javascriptreact" }
local is_windows = vim.fn.has("win32") == 1
local suffix = is_windows and ".cmd" or ""

local function mason_bin(name)
  return vim.fn.stdpath("data") .. "/mason/bin/" .. name .. suffix
end

local function configure_js(dap)
  dap.adapters["pwa-node"] = {
    type = "server",
    port = "${port}",
    executable = {
      command = mason_bin("js-debug-adapter"),
      args = { "${port}" },
    },
  }

  dap.adapters["pwa-chrome"] = {
    type = "server",
    port = "${port}",
    executable = {
      command = mason_bin("js-debug-adapter"),
      args = { "${port}" },
    },
  }

  for _, language in ipairs(js_languages) do
    dap.configurations[language] = {
      {
        name = "Next.js server",
        type = "pwa-node",
        request = "attach",
        program = "${workspaceFolder}/node_modules/next/dist/bin/next",
        cwd = "${workspaceFolder}",
        port = 9231,
        runtimeExecutable = "node",
        runtimeArgs = { "--inspect", "${program}", "dev" },
        skipFiles = { "<node_internals>/**", "node_modules/**" },
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
        name = "Next.js browser",
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
end

local function configure_python(dap)
  local debugpy_python = vim.fn.stdpath("data")
    .. "/mason/packages/debugpy/venv/"
    .. (is_windows and "Scripts/python.exe" or "bin/python")

  dap.adapters.python = {
    type = "executable",
    command = debugpy_python,
    args = { "-m", "debugpy.adapter" },
  }

  dap.configurations.python = {
    {
      name = "Python file",
      type = "python",
      request = "launch",
      program = "${file}",
      console = "integratedTerminal",
      pythonPath = function()
        local python = vim.fn.exepath(is_windows and "python" or "python3")
        return python ~= "" and python or "python"
      end,
    },
  }
end

local function configure_go(dap)
  dap.adapters.go = {
    type = "server",
    port = "${port}",
    executable = {
      command = mason_bin("dlv"),
      args = { "dap", "-l", "127.0.0.1:${port}" },
    },
  }

  dap.configurations.go = {
    {
      name = "Go package",
      type = "go",
      request = "launch",
      program = "${fileDirname}",
    },
  }
end

return {
  "mfussenegger/nvim-dap",
  lazy = true,
  dependencies = {
    { "theHamsta/nvim-dap-virtual-text", opts = {} },
    { "nvim-neotest/nvim-nio" },
    { "rcarriga/nvim-dap-ui", opts = {} },
  },
  config = function()
    local dap = require("dap")
    local dapui = require("dapui")

    configure_js(dap)
    configure_python(dap)
    configure_go(dap)

    dap.listeners.after.event_initialized["dapui_config"] = function()
      dapui.open()
    end
    dap.listeners.before.event_terminated["dapui_config"] = function()
      dapui.close()
    end
    dap.listeners.before.event_exited["dapui_config"] = function()
      dapui.close()
    end
  end,
}
