#!/bin/bash

set -e # Exit on first error

# === LOAD ENVIRONMENT VARIABLES ===
source .env.sh

# Create sws-keys secret if missing
create_secret_if_missing "sws-keys" "${NAMESPACE}" \
  "OPENAI_API_KEY=${OPENAI_API_KEY}" \
  "COOKIE_SECRET=${COOKIE_SECRET}"

# === DEPLOY K8S RESOURCES ===
log "🚀 Deploying Kubernetes resources..."
kubectl -n "${NAMESPACE}" apply -f ./k8s/ || error_exit "Failed to deploy K8S resources."

log "🎯 Deployment finished successfully!"
