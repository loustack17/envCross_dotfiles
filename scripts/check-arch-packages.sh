#!/usr/bin/env bash
# Verifies every package in config/targets.manifest exists in the Arch repos
# (pacman -Si, needs a synced database) or the AUR (RPC). Used by CI.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source "$REPO_ROOT/scripts/lib/targets.sh"
load_install_targets

official=()
aur=()
for entry in "${TOOLS[@]}"; do
    IFS='|' read -r _ _ pkg is_aur _ _ <<< "$entry"
    [[ -n "$pkg" ]] || continue
    IFS=',' read -ra pkgs <<< "$pkg"
    if [[ "$is_aur" == "true" ]]; then aur+=("${pkgs[@]}"); else official+=("${pkgs[@]}"); fi
done

missing=()
for pkg in "${official[@]}"; do
    pacman -Si "$pkg" >/dev/null 2>&1 || missing+=("$pkg (official)")
done

if ((${#aur[@]})); then
    query="$(printf '&arg[]=%s' "${aur[@]}")"
    found="$(curl -fsS "https://aur.archlinux.org/rpc/v5/info?${query#&}" | jq -r '.results[].Name')"
    for pkg in "${aur[@]}"; do
        grep -qx "$pkg" <<< "$found" || missing+=("$pkg (AUR)")
    done
fi

printf 'Checked %d official and %d AUR packages.\n' "${#official[@]}" "${#aur[@]}"
if ((${#missing[@]})); then
    printf 'Missing: %s\n' "${missing[@]}" >&2
    exit 1
fi
