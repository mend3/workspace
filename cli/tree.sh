#!/bin/bash
BLACKLIST=("node_modules" ".git" "dist" "build" "coverage" "vendor" "bower_components" "tmp" "temp" ".tmp" "logs" "log" "cache" ".cache")

is_blacklisted() {
  local name="$1"
  for item in "${BLACKLIST[@]}"; do
    if [[ "$name" == "$item" ]]; then
      return 0 # true
    fi
  done
  return 1 # false
}

print_tree() {
  local dir="$1"
  local prefix="$2"
  local depth="$3"
  local max_depth=3

  if [ "$depth" -gt "$max_depth" ]; then
    return
  fi

  local entries=()
  while IFS= read -r entry; do
    local name=$(basename "$entry")
    # Ignore entries that start with a dot
    [[ "$name" == .* ]] && continue
    is_blacklisted "$name" && continue
    entries+=("$entry")
  done < <(find "$dir" -mindepth 1 -maxdepth 1 | sort)

  local count=${#entries[@]}
  for i in "${!entries[@]}"; do
    local entry="${entries[$i]}"
    local name=$(basename "$entry")
    local connector="├──"
    [ $((i + 1)) -eq $count ] && connector="└──"

    echo "${prefix}${connector} $name"
    if [ -d "$entry" ]; then
      local new_prefix="$prefix"
      [ $((i + 1)) -eq $count ] && new_prefix+="    " || new_prefix+="│   "
      print_tree "$entry" "$new_prefix" $((depth + 1))
    fi
  done
}

echo "."
print_tree "." "" 1
