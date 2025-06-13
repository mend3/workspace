#!/bin/bash

set -e  # Exit on first error

# === LOAD ENVIRONMENT VARIABLES ===
source .env.sh

# === CONFIGURE MINIKUBE, HELM & DEPLOY CLUSTER ===
check_dependency "minikube"
check_dependency "kubectl"
check_dependency "helm"

start_minikube

log "🌐 Cluster phase complete."

# helm is in separate file so we can helm without recreating the whole cluster
./cli/k8s/helm.sh

# build is in separate file so we can build without recreating the whole cluster
./cli/k8s/build.sh

# generate secrets on the fly based on env vars
# ./cli/k8s/secrets.sh

# deploy is in separate file so we can deploy without recreating the whole cluster
# ./cli/k8s/deploy.sh
