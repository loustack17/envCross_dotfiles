def claude-switch [target: string] {
    let base = ($env.USERPROFILE | path join ".claude")

    let source = match $target {
        "claude" => ($base | path join "settings.claude.json")
        "glm"    => ($base | path join "settings.glm.json")
        _ => {
            print "Usage: claude-switch [claude|glm]"
            return
        }
    }

    let dest = ($base | path join "settings.json")

    if not ($source | path exists) {
        print $"Missing file: ($source)"
        return
    }

    cp -f $source $dest
    print $"Switched to ($target)"

    claude
}
