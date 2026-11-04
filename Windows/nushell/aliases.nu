alias ytlow  = mpv --profile=low
alias ytmed  = mpv --profile=medium
alias ythigh = mpv --profile=high
alias lg = lazygit
alias sql = ^sqlit

def --wrapped with-secrets [...command] {
    ^pwsh -NoProfile -File ('~/.local/share/envcross/scripts/windows/with-secrets.ps1' | path expand) ...$command
}
def --wrapped opencode [...args] { with-secrets opencode ...$args }
