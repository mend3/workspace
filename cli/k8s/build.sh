#!/bin/bash

set -e # Exit on first error

# === LOAD ENVIRONMENT VARIABLES ===
source .env.sh

# === BUILD & LOAD DOCKER IMAGES ===
eval $(minikube -p "${NAMESPACE}" docker-env)

build_and_load_image "extalia-nginx" "latest"
build_and_load_image "sws-nginx" "latest"

# ./docker-build.sh nginx latest
# ./docker-build.sh api latest

eval $(minikube -p "${NAMESPACE}" docker-env --unset)
