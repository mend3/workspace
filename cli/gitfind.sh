#!/bin/bash

# /**
#     * gitfind.sh - Find Git repositories in a directory and filter by whitelisted directories and users.
#     *
#     * Usage: ./gitfind.sh [root_directory] [dir_whitelist] [user_whitelist]
#     * - root_directory: The base directory to search for Git repositories (default: current directory).
#     * - dir_whitelist: Comma-separated list of directory patterns to include (e.g., "src/*,lib/*").
#     * - user_whitelist: Comma-separated list of GitHub usernames to include (e.g., "user1,user2").
#     */

ROOT_DIR="${1:-.}"
DIR_WHITELIST="${2:-}"
USER_WHITELIST="${3:-}"

# Parse comma-separated lists into arrays
IFS=',' read -ra ALLOWED_DIR_PATTERNS <<< "$DIR_WHITELIST"
IFS=',' read -ra ALLOWED_USERS <<< "$USER_WHITELIST"

matches_dir_whitelist() {
    local path="$1"
    if [[ -z "$DIR_WHITELIST" ]]; then
        return 0  # allow all
    fi
    for pattern in "${ALLOWED_DIR_PATTERNS[@]}"; do
        pattern="$(echo "$pattern" | xargs)"
        if [[ "$pattern" == *"*"* ]]; then
            [[ "$path" == $pattern ]] && return 0
        else
            [[ "$path" == "$pattern" ]] && return 0
        fi
    done
    return 1
}

matches_user_whitelist() {
    local url="$1"
    if [[ -z "$USER_WHITELIST" ]]; then
        return 0  # allow all
    fi
    for user in "${ALLOWED_USERS[@]}"; do
        user="$(echo "$user" | xargs)"
        if [[ "$url" =~ ^(git@|https://)github\.com[:/]"$user"/ ]]; then
            return 0
        fi
    done
    return 1
}

find "$ROOT_DIR" -type d -name ".git" | while read -r gitdir; do
    repo_dir="$(dirname "$gitdir")"
    rel_path=$(realpath --relative-to="$ROOT_DIR" "$repo_dir")
    repo_name="$(basename "$repo_dir")"
    origin_url=$(git -C "$repo_dir" remote get-url origin 2>/dev/null || echo "")

    matches_dir_whitelist "$rel_path" && matches_user_whitelist "$origin_url" && {
        echo "$rel_path | $repo_name | $origin_url"
    }
done
