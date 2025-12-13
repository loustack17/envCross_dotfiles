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
    end,
}
