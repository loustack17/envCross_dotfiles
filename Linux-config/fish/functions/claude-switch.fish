function claude-switch
    if test (count $argv) -ne 1
        echo "Usage: claude-switch [claude|glm]"
        return 1
    end

    switch $argv[1]
        case claude
            ln -sf ~/.claude/settings.claude.json ~/.claude/settings.json
            echo "Switched to Claude (official)"
        case glm
            ln -sf ~/.claude/settings.glm.json ~/.claude/settings.json
            echo "Switched to GLM (z.ai)"
        case '*'
            echo "Unknown target: $argv[1]"
            return 1
    end

    claude
end
