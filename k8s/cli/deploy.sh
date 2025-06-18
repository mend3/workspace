#!/bin/bash

set -e # Exit on first error

# === LOAD ENVIRONMENT VARIABLES ===
source .env.sh

kubectl config set-context --current --namespace=${NAMESPACE}

create_secret_if_missing "app-keys" "${NAMESPACE}" \
  "OPENAI_API_KEY=${OPENAI_API_KEY}" \
  "COOKIE_SECRET=${COOKIE_SECRET}"

# === DEPLOY K8S RESOURCES ===
log "🚀 Deploying Kubernetes resources..."
kubectl -n "${NAMESPACE}" apply -f ./k8s/ || error_exit "Failed to deploy K8S resources."

log "🎯 Deployment finished successfully!"
