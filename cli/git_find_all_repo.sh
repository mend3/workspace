find . -type d -name ".git" -prune | while read gitdir; do
  repo_dir=$(dirname "$gitdir")
  url=$(git -C "$repo_dir" remote get-url origin 2>/dev/null)
  echo "$repo_dir => ${url:-<no origin>}"
done
