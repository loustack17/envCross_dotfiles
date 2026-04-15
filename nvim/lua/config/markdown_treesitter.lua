local M = {}

local injection_language_aliases = {
  ex = "elixir",
  pl = "perl",
  sh = "bash",
  ts = "typescript",
  uxn = "uxntal",
}

local function parser_from_markdown_info_string(injection_alias)
  local match = vim.filetype.match({ filename = "a." .. injection_alias })
  return match or injection_language_aliases[injection_alias] or injection_alias
end

function M.setup()
  local query = require("vim.treesitter.query")
  require("nvim-treesitter.query_predicates")
  query.add_directive("set-lang-from-info-string!", function(match, _, bufnr, pred, metadata)
    local node = match[pred[2]]
    if not node then
      return
    end
    local ok, text = pcall(vim.treesitter.get_node_text, node, bufnr)
    if not ok or type(text) ~= "string" or text == "" then
      return
    end
    metadata["injection.language"] = parser_from_markdown_info_string(text:lower())
  end, { force = true, all = false })
end

return M
