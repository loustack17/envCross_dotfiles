#!/usr/bin/env bash

set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
rules_src="$repo_root/Linux-system/udev/rules.d"
rules=()
target_user="${SUDO_USER:-${USER:-}}"

if [[ ! -d "$rules_src" ]]; then
    printf 'missing rules directory: %s\n' "$rules_src" >&2
    exit 1
fi

shopt -s nullglob
for rule in "$rules_src"/*.rules; do
    rules+=("$rule")
done
shopt -u nullglob

if [[ ${#rules[@]} -eq 0 ]]; then
    printf 'no rule files found in %s\n' "$rules_src" >&2
    exit 1
fi

if [[ -n "$target_user" && "$target_user" != "root" ]]; then
    sudo groupadd -f nuphy
    sudo usermod -aG nuphy "$target_user"
fi

for rule in "${rules[@]}"; do
    sudo install -Dm644 "$rule" "/etc/udev/rules.d/$(basename "$rule")"
done

sudo udevadm control --reload-rules
sudo udevadm trigger --subsystem-match=hidraw

printf 'Installed %d udev rule file(s).\n' "${#rules[@]}"
printf 'Reconnect affected devices. Re-login may be required for new group membership.\n'
