#!/bin/bash
set -e # Exit on first error

# === LOAD ENVIRONMENT VARIABLES ===
source .env.sh

# Check if the correct number of arguments is provided
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <docker-compose-service-name> <tag>"
    exit 1
fi

SERVICE_NAME=$1
IMAGE_TAG=$2

IMAGE_NAME="${NAMESPACE}-${SERVICE_NAME}:${IMAGE_TAG}"

# Main script execution
if image_exists; then
    echo "Docker image ${IMAGE_NAME} already exists. Skipping build."
else
    build_image
fi
