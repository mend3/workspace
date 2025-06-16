#!/bin/sh

PATTERN="$1"
OUTFILE="images_full.json"

docker images --format '{{json .}}' | \
jq -c --arg pat "$PATTERN" '
  if $pat == "" 
    or (((.Repository // "") + ":" + (.Tag // "")) | tostring | test($pat)) 
  then . else empty end
' | jq -s '.' > "$OUTFILE"

echo "✅ Exported filtered images info to $OUTFILE"
