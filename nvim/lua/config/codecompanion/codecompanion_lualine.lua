-- lua/config/codecompanion_lualine.lua
local Component = require("lualine.component"):extend()

Component.processing = false
Component.spinner_index = 1

local spinner_symbols = {
    "⠋", "⠙", "⠹", "⠸",
    "⠼", "⠴", "⠦", "⠧",
    "⠇", "⠏",
}
local spinner_symbols_len = #spinner_symbols

-- 初始化：註冊 CodeCompanion Request 的事件
function Component:init(options)
    Component.super.init(self, options)

    local group = vim.api.nvim_create_augroup("CodeCompanionLualine", { clear = true })

    vim.api.nvim_create_autocmd("User", {
        pattern = "CodeCompanionRequest*",
        group = group,
        callback = function(ev)
            if ev.match == "CodeCompanionRequestStarted" then
                self.processing = true
            elseif ev.match == "CodeCompanionRequestFinished" then
                self.processing = false
            end
            -- redraw statusline
            vim.cmd("redrawstatus")
        end,
    })
end

-- 從 CodeCompanion 的 global metadata 取資料
local function get_cc_meta()
    -- 官方文件：_G.codecompanion_chat_metadata[bufnr] 會放 adapter, tokens, cycles 等資訊
    -- https://github.com/olimorris/codecompanion.nvim/blob/main/doc/codecompanion.txt
    local meta_tbl = _G.codecompanion_chat_metadata
    if not meta_tbl then
        return nil
    end

    local bufnr = vim.api.nvim_get_current_buf()
    local meta = meta_tbl[bufnr]
    if not meta then
        return nil
    end

    local adapter = meta.adapter or {}
    local name = adapter.name or ""
    local model = adapter.model or ""

    return {
        name = name,
        model = model,
        tokens = meta.tokens or 0,
        cycles = meta.cycles or 0,
        context_items = meta.context_items or 0,
    }
end

-- 每次 statusline 更新時會呼叫
function Component:update_status()
    -- 只在 CodeCompanion 的 chat buffer 顯示；其他檔案就空字串
    if vim.bo.filetype ~= "codecompanion" then
        return ""
    end

    local parts = {}

    -- 1) spinner / completed 狀態
    if self.processing then
        self.spinner_index = (self.spinner_index % spinner_symbols_len) + 1
        table.insert(parts, spinner_symbols[self.spinner_index])
    else
        -- 這裡你可以換成自己喜歡的 icon
        table.insert(parts, "") -- "Completed"
    end

    -- 2) CodeCompanion 的 metadata
    local meta = get_cc_meta()
    if meta then
        -- 類似官方影片中的：「Copilot (gpt-4.1) | 469 tok | 11 cycles」
        local model_str = ""
        if meta.name ~= "" or meta.model ~= "" then
            model_str = string.format("%s (%s)", meta.name, meta.model)
        end

        local info = string.format(
            "%s  |  %d tok  |  %d cycles  |  ctx:%d",
            model_str,
            meta.tokens,
            meta.cycles,
            meta.context_items
        )

        table.insert(parts, info)
    end

    return table.concat(parts, "  ")
end

return Component
