#!/usr/bin/env bash
# Installs a pinned, checksum-verified Moli release for the shared moli-* skills.
# To upgrade: bump VERSION and the hashes (also in windows/install-moli.ps1).
# Usage: install-moli.sh [--force] [--dry-run]
set -euo pipefail

VERSION="v1.1.21"
INSTALL_DIR="${MOLI_INSTALL_DIR:-$HOME/.local/bin}"
FORCE=false
DRY_RUN=false
for arg in "$@"; do
    case "$arg" in
        --force) FORCE=true ;;
        --dry-run) DRY_RUN=true ;;
        *) echo "Unknown option: $arg" >&2; exit 2 ;;
    esac
done

case "$(uname -s)-$(uname -m)" in
    Linux-x86_64)
        target="x86_64-unknown-linux-gnu"
        sha="048d9e482b6c618af08b17eb19200ea65b1b2fafd39975e5b9de19a60653ed8f" ;;
    Linux-aarch64)
        target="aarch64-unknown-linux-gnu"
        sha="8375ab2aeb3b5ca139701d854eeda1aa2abf01b09ad19aae24dabb8c8ce0b1fa" ;;
    *) echo "Unsupported platform: $(uname -s)-$(uname -m)" >&2; exit 1 ;;
esac

bin="$INSTALL_DIR/moli"
if [[ -x "$bin" && "$FORCE" != true ]] && [[ "$("$bin" --version 2>/dev/null)" == "moli ${VERSION#v}" ]]; then
    echo "Moli: $VERSION already installed"
    exit 0
fi
if [[ "$DRY_RUN" == true ]]; then
    echo "Would install: Moli $VERSION ($target) to $bin"
    exit 0
fi

asset="moli-$target.tar.gz"
url="https://github.com/lexmount/moli/releases/download/$VERSION/$asset"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

echo "Downloading $url"
curl --proto '=https' --tlsv1.2 -fsSL -o "$tmp/$asset" "$url"
echo "$sha  $tmp/$asset" | sha256sum -c --quiet -
tar -xzf "$tmp/$asset" -C "$tmp"
mkdir -p "$INSTALL_DIR"
install -m 0755 "$tmp/moli-$VERSION-$target/moli" "$bin"
echo "Installed $("$bin" --version) to $bin"
