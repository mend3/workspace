#!/bin/bash

BASE_DIR="${1:-.}"
BASE_DIR="$(cd "$BASE_DIR" && pwd)"

echo -e "\n📁 Scanning for Git repositories in subfolders of: \033[1m$BASE_DIR\033[0m\n"

# Collect submodule paths
SUBMODULE_PATHS=$(find "$BASE_DIR" -type f -name ".gitmodules" -exec awk '/path = / {print $3}' {} + | sed "s|^|$BASE_DIR/|")
SUBMODULE_REGEX=$(printf "|^%s" $SUBMODULE_PATHS | cut -c 2-)

# Counters
updated=0
skipped_submodule=0
skipped_unstaged=0
failed_other=0

# Use process substitution to avoid subshell
while read -r gitdir; do
    repo_dir="$(dirname "$gitdir")"

    # Skip submodules
    if echo "$repo_dir" | grep -qE "$SUBMODULE_REGEX"; then
        echo -e "🔁 \033[2mSkipping submodule:\033[0m $repo_dir"
        ((skipped_submodule++))
        continue
    fi

    echo -e "\n🚀 \033[1mUpdating repo:\033[0m $repo_dir"
    cd "$repo_dir" || continue

    # Try pulling, capture output and exit code
    output=$(git pull --rebase 2>&1)
    exit_code=$?

    if [[ $exit_code -eq 0 ]]; then
        if echo "$output" | grep -q "Already up to date"; then
            echo -e "✅ \033[32mAlready up to date.\033[0m"
        else
            echo -e "✅ \033[32mUpdated successfully.\033[0m"
        fi
        ((updated++))
    elif echo "$output" | grep -q "You have unstaged changes"; then
        echo -e "⚠️  \033[33mSkipped due to unstaged changes.\033[0m"
        echo -e "\033[2m$output\033[0m"
        ((skipped_unstaged++))
    else
        echo -e "❌ \033[31mGit pull failed:\033[0m"
        echo -e "\033[2m$output\033[0m"
        ((failed_other++))
    fi
done < <(find "$BASE_DIR" -mindepth 2 -type d -name ".git")

# Final summary
echo -e "\n✅ \033[1mUpdate Summary\033[0m"
echo -e " - Successfully updated:  \033[32m$updated\033[0m"
echo -e " - Skipped (unstaged):   \033[33m$skipped_unstaged\033[0m"
echo -e " - Skipped submodules:   \033[33m$skipped_submodule\033[0m"
echo -e " - Failed (other errors):\033[31m$failed_other\033[0m"
echo -e " - Root directory skipped: \033[2m1 (always skipped)\033[0m\n"
