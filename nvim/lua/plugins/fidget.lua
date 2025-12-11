return {
    "j-hui/fidget.nvim",
    tag = "legacy",
    event = "VeryLazy",


    opts = {

    },

    -- 2) config do 2 things：
    --    a. call fidget.setup(opts)
    --    b. create CodeCompanion ↔ fidget integration
    config = function(_, opts)
        -- a. 用 opts 啟動 fidget
        require("fidget").setup(opts)

        -- b. CodeCompanion ↔ fidget.nvim integration
        local ok, progress = pcall(require, "fidget.progress")
        if not ok then
            return
        end


        if type(progress.handle) ~= "table" or type(progress.handle.create) ~= "function" then
            return
        end

        local group = vim.api.nvim_create_augroup("CodeCompanionFidget", { clear = true })

        local cc_handle = nil

        vim.api.nvim_create_autocmd("User", {
            pattern = "CodeCompanionRequest*",
            group = group,
            callback = function(ev)
                if ev.match == "CodeCompanionRequestStarted" then
                    -- create a new progress handle
                    cc_handle = progress.handle.create({
                        lsp_client = "codecompanion",
                        message = "CodeCompanion request",
                    })
                elseif ev.match == "CodeCompanionRequestFinished" then
                    -- end this progress
                    if cc_handle then
                        cc_handle:finish()
                        cc_handle = nil
                    end
                end
            end,
        })
    end,
}
