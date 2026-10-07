# sqlit

Launch with `sql` in Fish (Linux) or Nushell (Windows). This alias runs the installed `sqlit` executable and forwards arguments. The repository Fish/Nushell configuration must be installed or sourced separately; the sqlit-only target does not configure a shell. Restart the shell after updating its configuration.

The native config directory links here on Windows and Linux. Edit `settings.json` and `keymap.json` directly; sqlit also writes its UI preferences and database expansion state here. The directory link preserves native atomic file writes.

Only `keymap.json` and this README are tracked. Settings, connection names, database expansion state, connections, query history, credentials, and other runtime files stay in this directory but are ignored by Git. Password storage remains managed by sqlit and the OS keyring.

Windows: `nu install.nu --only sqlit --no-install`. Linux: `./install.sh --only-sqlit --no-install`. The installed application is reused. Configuration follows `SQLIT_CONFIG_DIR`, otherwise `$XDG_CONFIG_HOME/sqlit`, otherwise `~/.config/sqlit`.

Existing non-empty native configuration directories are never replaced automatically. Close sqlit, move the original directory to a backup location, copy its contents into `sqlit/`, and then run the installer. Preserve existing user files when resolving any conflicts.

[Official configuration and installation](https://github.com/Maxteabag/sqlit#configuration)

[Official Fish aliases](https://fishshell.com/docs/current/cmds/alias.html) · [Official Nushell aliases](https://www.nushell.sh/book/aliases.html)
