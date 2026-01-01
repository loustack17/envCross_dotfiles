#!/usr/bin/env sh
set -e

DRY_RUN=0

for arg in "$@"; do
  case $arg in
    --dry-run|-n)
      DRY_RUN=1
      shift
      ;;
    *)
      ;;
  esac
done

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
BACKUP_ROOT="$REPO_ROOT/backup/$(date +%Y%m%d-%H%M%S)"
CONFIG_HOME="${XDG_CONFIG_HOME:-$HOME/.config}"

info () { printf '[INFO ] %s\n' "$1"; }
warn () { printf '[WARN ] %s\n' "$1"; }

backup_if_exists () {
  SRC="$1"
  NAME="$2"

  if [ ! -e "$SRC" ]; then
    return
  fi

  if [ "$DRY_RUN" -eq 1 ]; then
    SAFE_NAME=$(printf '%s' "$NAME" | tr '/\\:*?"<>| ' '_')
    DEST="$BACKUP_ROOT/$SAFE_NAME"
    info "DryRun: Backup $SRC -> $DEST"
    return
  fi

  mkdir -p "$BACKUP_ROOT"
  SAFE_NAME=$(printf '%s' "$NAME" | tr '/\\:*?"<>| ' '_')
  DEST="$BACKUP_ROOT/$SAFE_NAME"

  info "Backup $NAME -> $DEST"
  cp -a "$SRC" "$DEST"
}

link_safe () {
  SRC="$1"
  DEST="$2"
  NAME="$3"

  if [ ! -e "$SRC" ]; then
    warn "Source not found, skip: $NAME ($SRC)"
    return
  fi

  if [ "$DRY_RUN" -eq 1 ]; then
    info "DryRun: Link $SRC -> $DEST"
    return
  fi

  if [ -e "$DEST" ] || [ -L "$DEST" ]; then
    backup_if_exists "$DEST" "$NAME"
    rm -rf "$DEST"
  fi

  mkdir -p "$(dirname "$DEST")"
  ln -s "$SRC" "$DEST"

  info "Linked: $NAME -> $DEST"
}

link_safe "$REPO_ROOT/nushell" "$CONFIG_HOME/nushell" "Nushell"
link_safe "$REPO_ROOT/nvim" "$CONFIG_HOME/nvim" "Neovim"
link_safe "$REPO_ROOT/yazi" "$CONFIG_HOME/yazi" "Yazi"
link_safe "$REPO_ROOT/wezterm" "$CONFIG_HOME/wezterm" "WezTerm directory"
link_safe "$REPO_ROOT/lazygit" "$CONFIG_HOME/lazygit" "Lazygit"

if [ -f "$REPO_ROOT/.wezterm.lua" ]; then
  link_safe "$REPO_ROOT/.wezterm.lua" "$HOME/.wezterm.lua" "WezTerm main config"
fi

info "Done."
