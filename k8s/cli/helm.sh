#!/bin/bash

set -e # Exit on first error

# === LOAD ENVIRONMENT VARIABLES ===
source .env.sh

# === HELM REPOSITORIES & UPDATES ===
log "Configuring Helm repositories..."
helm repo add kedacore https://kedacore.github.io/charts &
# helm repo add grafana https://grafana.github.io/helm-charts &
helm repo add kubernetes-dashboard https://kubernetes.github.io/dashboard/ &
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts &
helm repo add traefik https://traefik.github.io/charts

wait

helm repo update

create_namespace "o11y"
create_namespace "tools"

install_helm_chart "traefik" "traefik/traefik" "kube-system"
install_helm_chart "keda" "kedacore/keda" "tools" "" "true"
install_helm_chart "kubernetes-dashboard" "kubernetes-dashboard/kubernetes-dashboard" "tools" "" "true"
# install_helm_chart "loki" "grafana/loki" "o11y" "helm/vendors/loki-values.yaml"
# install_helm_chart "k6-operator" "grafana/k6-operator" "tools" "" "true"
install_helm_chart "prometheus-nginx-exporter" "prometheus-community/prometheus-nginx-exporter" "o11y" "" "true"
install_helm_chart "prometheus-redis-exporter" "prometheus-community/prometheus-redis-exporter" "o11y" "" "true"
install_helm_chart "prometheus-mysql-exporter" "prometheus-community/prometheus-mysql-exporter" "o11y" "" "true"
install_helm_chart "prometheus-node-exporter" "prometheus-community/prometheus-node-exporter" "o11y" "" "true"

install_helm_chart "${HELM_RELEASE}" "./helm" "${NAMESPACE}" "" "true"

log "🚀 Helm phase complete."
