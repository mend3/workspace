#!/bin/bash

# Usage: ./add-submodules.sh submodules.txt

set -euo pipefail

if [[ $# -gt 0 && -f "$1" ]]; then
    INPUT_FILE="$1"
    exec <"$INPUT_FILE"
elif [[ -t 0 ]]; then
    echo "❌ No input provided. Usage: ./add-submodules.sh [file] or pipe data into it."
    exit 1
fi

if [[ ! -f "$INPUT_FILE" ]]; then
    echo "❌ File not found: $INPUT_FILE"
    exit 1
fi

while IFS='|' read -r path name url; do
    # Trim whitespace
    path="$(echo "$path" | xargs)"
    name="$(echo "$name" | xargs)"
    url="$(echo "$url" | xargs)"

    if [[ -z "$url" ]]; then
        echo "⚠️ Skipping '$path' (no URL provided)"
        continue
    fi

    echo "🔗 Adding submodule '$name' at '$path' from '$url'"
    git submodule add "$url" "$path"
done <"$INPUT_FILE"

echo "✅ Done adding submodules."
