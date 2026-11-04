alias ytlow  = mpv --profile=low
alias ytmed  = mpv --profile=medium
alias ythigh = mpv --profile=high
alias lg = lazygit
alias sql = ^sqlit

const envcross_with_secrets = 'D:\Notes\WorkFlow\envCross_dotfiles\scripts\windows\with-secrets.ps1'
def --wrapped with-secrets [...command] { ^pwsh -NoProfile -File $envcross_with_secrets ...$command }
def --wrapped opencode [...args] { with-secrets opencode ...$args }
