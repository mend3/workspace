#!/bin/bash

# Usage: ./add_submodules.sh submodules.txt
# or
# ./find_submodules.sh | ./add_submodules.sh

set -euo pipefail

if [[ $# -gt 0 && -f "$1" ]]; then
    INPUT_FILE="$1"
    exec <"$INPUT_FILE"
elif [[ -t 0 ]]; then
    echo "❌ No input provided. Usage: ./add_submodules.sh [file] or pipe data into it."
    exit 1
fi

while IFS= read -r line; do
    # Skip lines without a pipe
    [[ "$line" != *"|"* ]] && continue

    IFS='|' read -r path name url <<< "$line"

    # Trim whitespace
    path="$(echo "$path" | xargs)"
    name="$(echo "$name" | xargs)"
    url="$(echo "$url" | xargs)"

    if [[ -z "$url" ]]; then
        echo "⚠️  Skipping '$path' (no URL provided)"
        continue
    fi

    echo "🔗 Adding submodule '$name' at '$path' from '$url'"
    git submodule add "$url" "$path"

done

echo "✅ Done adding submodules."
