#!/bin/bash

set -e # Exit on first error

# === LOAD ENVIRONMENT VARIABLES ===
source .env.sh

helm repo add kubernetes-dashboard https://kubernetes.github.io/dashboard/
helm repo add kedacore https://kedacore.github.io/charts
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts

kubectl get namespace "keda" &>/dev/null || {
  log "🔹 Creating namespace 'keda'..."
  helm install keda kedacore/keda -n keda --create-namespace || error_exit "Failed to install Keda."
  log "✅ Namespace 'keda' created."
}

kubectl get namespace "kubernetes-dashboard" &>/dev/null || {
  log "🔹 Creating namespace 'kubernetes-dashboard'..."
  helm upgrade --install kubernetes-dashboard kubernetes-dashboard/kubernetes-dashboard --create-namespace -n kubernetes-dashboard || error_exit "Failed to install kubernetes-dashboard."
  log "✅ Namespace 'kubernetes-dashboard' created."
}

helm repo update
# helm install -n ${NAMESPACE} k6-operator grafana/k6-operator
# helm install -n ${NAMESPACE} fluentd fluent/fluentd
# helm install -n ${NAMESPACE} prometheus-node-exporter prometheus-community/prometheus-node-exporter
# helm install -n ${NAMESPACE} prometheus-mysql-exporter prometheus-community/prometheus-mysql-exporter
# helm install -n ${NAMESPACE} prometheus-nginx-exporter prometheus-community/prometheus-nginx-exporter
# helm install -n ${NAMESPACE} prometheus-redis-exporter prometheus-community/prometheus-redis-exporter

log "🚀 Helm phase complete."
