#!/bin/sh

# Usage: ./remove_docker_images_by_prefix.sh myprefix

PREFIX="$1"

if [ -z "$PREFIX" ]; then
  echo "❌ Usage: $0 <image-name-prefix>"
  exit 1
fi

echo "🔍 Searching for images with prefix: '$PREFIX'..."

# Get matching image IDs (exclude intermediate <none>)
IMAGES=$(docker images --format '{{.Repository}}:{{.Tag}} {{.ID}}' \
  | grep "^$PREFIX" \
  | awk '{print $2}')

if [ -z "$IMAGES" ]; then
  echo "✅ No images found with prefix '$PREFIX'"
  exit 0
fi

echo "🗑 Removing the following image IDs:"
echo "$IMAGES"

# Remove each image ID
for id in $IMAGES; do
  echo "➡️ Removing image ID: $id"
  docker rmi -f "$id"
done

echo "✅ Done."
