# env.nu
#
# Installed by:
# version = "0.109.1"
#
# Previously, environment variables were typically configured in `env.nu`.
# In general, most configuration can and should be performed in `config.nu`
# or one of the autoload directories.
#
# This file is generated for backwards compatibility for now.
# It is loaded before config.nu and login.nu
#
# See https://www.nushell.sh/book/configuration.html
#
# Also see `help config env` for more options.
#
# You can remove these comments if you want or leave
# them for future reference.


# Bun global bin
use std "path add"
let bun_bin = ($env.USERPROFILE | path join ".bun" "bin")
path add $bun_bin

path add ("$env.HOME" | path join ".local" "bin")
path add ("$env.LOCALAPPDATA" | path join "Programs" "bun" "bin")

