#!/bin/bash

set -e # Exit on first error

# === LOAD ENVIRONMENT VARIABLES ===
source .env.sh

# === CONFIGURE MINIKUBE, HELM & DEPLOY CLUSTER ===
check_dependency "minikube"
check_dependency "kubectl"
check_dependency "helm"

start_minikube

minikube -p ${NAMESPACE} addons enable ingress

create_namespace "${NAMESPACE}"

kubectl config set-context --current --namespace=${NAMESPACE}

log "🌐 Cluster phase complete."

# helm is in separate file so we can helm without recreating the whole cluster
./k8s/cli/helm.sh

# build is in separate file so we can build without recreating the whole cluster
# ./k8s/cli/build.sh

# generate secrets on the fly based on env vars
./k8s/cli/secrets.sh

# deploy is in separate file so we can deploy without recreating the whole cluster
# ./k8s/cli/deploy.sh
