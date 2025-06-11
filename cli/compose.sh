#!/bin/bash

# Blacklisted directories
EXCLUDE_DIRS=(node_modules tests dist ./vendors .tmp .cache ./browser/ui)

# Build exclusion arguments
EXCLUDE_ARGS=()
for DIR in "${EXCLUDE_DIRS[@]}"; do
  EXCLUDE_ARGS+=(-path "$DIR" -o)
done

# Run find with exclusions
docker compose $(
  find . \( "${EXCLUDE_ARGS[@]}" -false \) -prune -o -type f -name '*compose.yml' -print |
  while read -r file; do
    printf -- '-f %s ' "$file"
  done
) "$@"
