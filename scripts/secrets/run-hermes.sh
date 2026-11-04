#!/usr/bin/env bash
set -euo pipefail
if [[ -z "${BWS_SECRETS_INJECTED:-}" ]]; then
    exec "$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)/run.sh" -- "$0" "$@"
fi
for arg in "$@"; do
    if [[ "$arg" == "trainer" && -n "${TRAINER_SLACK_APP_TOKEN:-}" ]]; then
        export SLACK_APP_TOKEN="$TRAINER_SLACK_APP_TOKEN"
        break
    fi
done
exec hermes "$@"
