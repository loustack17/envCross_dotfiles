#!/usr/bin/env bash

declare -ga TOOLS=()
declare -ga TOOL_NAMES=()
declare -gA TOOL_SCOPE=()
declare -gA TOOL_GROUP=()

targets_manifest_error() {
    printf 'target manifest error: %s\n' "$1" >&2
    return 1
}

expand_target_value() {
    local value="$1"
    local config_home="${XDG_CONFIG_HOME:-$HOME/.config}"

    value="${value//\$HOME/$HOME}"
    value="${value//\$CONFIG_HOME/$config_home}"

    printf '%s' "$value"
}

validate_target_group() {
    case "$1" in
        utilities|core|niri|config|ai) return 0 ;;
    esac

    targets_manifest_error "unsupported group '$1'"
}

validate_target_scope() {
    case "$1" in
        linux|shared|ai) return 0 ;;
    esac

    targets_manifest_error "unsupported scope '$1'"
}

load_install_targets() {
    local include_scopes="${1:-linux,shared,ai}"
    local manifest="${TARGET_MANIFEST_PATH:-$REPO_ROOT/config/targets.manifest}"
    local wanted=",${include_scopes},"
    local line line_no=0 delimiters
    local group scope name cmd pkg is_aur src dst
    local -A seen_names=()

    [[ -f "$manifest" ]] || targets_manifest_error "missing manifest: $manifest"

    TOOLS=()
    TOOL_NAMES=()
    TOOL_SCOPE=()
    TOOL_GROUP=()

    while IFS= read -r line || [[ -n "$line" ]]; do
        ((line_no += 1))
        [[ -z "$line" || "${line:0:1}" == "#" ]] && continue

        delimiters="${line//[^|]/}"
        [[ ${#delimiters} -eq 7 ]] || targets_manifest_error "line $line_no must contain 8 fields"

        IFS='|' read -r group scope name cmd pkg is_aur src dst <<< "$line"

        validate_target_group "$group"
        validate_target_scope "$scope"
        [[ -n "$name" ]] || targets_manifest_error "line $line_no is missing a target name"
        [[ "$is_aur" == "true" || "$is_aur" == "false" ]] || targets_manifest_error "line $line_no has invalid is_aur '$is_aur'"
        [[ -z "${seen_names[$name]:-}" ]] || targets_manifest_error "duplicate target name '$name'"

        seen_names["$name"]=1
        src="$(expand_target_value "$src")"
        dst="$(expand_target_value "$dst")"

        [[ "$wanted" == *",$scope,"* ]] || continue

        TOOLS+=("$name|$cmd|$pkg|$is_aur|$src|$dst")
        TOOL_NAMES+=("$name")
        TOOL_SCOPE["$name"]="$scope"
        TOOL_GROUP["$name"]="$group"
    done < "$manifest"
}

join_targets_by_group() {
    local group="$1"
    local names=()
    local name
    local index

    for name in "${TOOL_NAMES[@]}"; do
        [[ "${TOOL_GROUP[$name]}" == "$group" ]] || continue
        names+=("$name")
    done

    for index in "${!names[@]}"; do
        [[ "$index" -gt 0 ]] && printf ', '
        printf '%s' "${names[$index]}"
    done
}
