#!/bin/bash

set -e # Exit on first error

# === LOAD ENVIRONMENT VARIABLES ===
source .env.sh

# === HELM REPOSITORIES & UPDATES ===
log "🔹 Configuring Helm repositories..."
helm repo add kedacore https://kedacore.github.io/charts &
helm repo add grafana https://grafana.github.io/helm-charts &
wait
helm repo update

create_namespace "monitoring"

# Create Grafana credentials secret if missing
create_secret_if_missing "grafana-admin-credentials" "monitoring" \
  "admin-user=${GF_SECURITY_ADMIN_USER}" \
  "admin-password=${GF_SECURITY_ADMIN_PASSWORD}"

install_helm_chart "keda" "kedacore/keda" "monitoring"
install_helm_chart "loki" "grafana/loki-stack" "monitoring" "helm/vendors/loki-values.yaml"

log "##########################"
log "🚀 Charts phase complete."
log "##########################"
