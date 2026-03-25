#!/usr/bin/env bash

set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

REPO_ROOT="$repo_root"
source "$repo_root/scripts/lib/targets.sh"
load_install_targets

declare -A referenced_tops=()
declare -A referenced_paths=()

while IFS='|' read -r name cmd pkg is_aur src dst; do
    [[ -n "$src" ]] || continue
    case "$src" in
        Linux-config/*|Linux-local-share/*)
            root="${src%%/*}"
            rel="${src#${root}/}"
            top="${rel%%/*}"
            referenced_tops["$root/$top"]=1
            referenced_paths["$src"]=1
            ;;
    esac
done < <(printf '%s\n' "${TOOLS[@]}")

status=0

for path in "${!referenced_paths[@]}"; do
    if [[ ! -e "$path" ]]; then
        printf 'missing source: %s\n' "$path" >&2
        status=1
    fi
done

for path in AI-Supporter/AGENTS.md AI-Supporter/SKILLS; do
    if [[ ! -e "$path" ]]; then
        printf 'missing shared ai path: %s\n' "$path" >&2
        status=1
    fi
done

for root in Linux-config Linux-local-share; do
    [[ -d "$root" ]] || continue
    while IFS= read -r entry; do
        key="$root/$entry"
        if [[ -z "${referenced_tops[$key]:-}" ]]; then
            printf 'unreferenced top-level path: %s\n' "$key" >&2
            status=1
        fi
    done < <(find "$root" -mindepth 1 -maxdepth 1 -printf '%f\n' | sort)
done

exit "$status"
