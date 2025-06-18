#!/bin/bash

set -e # Exit on first error

# === LOAD ENVIRONMENT VARIABLES ===
source .env.sh

K6_TEST_MODE="${K6_TEST_MODE:-load}"
K6_TEST_URI="${K6_TEST_URI:-https://nginx:443/api/health}"

kubectl config set-context --current --namespace=${NAMESPACE}

echo "# Generate Secrets for k6..."
kubectl create secret generic k6-secrets \
  --from-literal=k6_test_mode=$K6_TEST_MODE \
  --from-literal=k6_test_uri=$K6_TEST_URI \
  --dry-run=client -o yaml |
  kubectl -n ${NAMESPACE} apply -f -

echo "# Generate ConfigMaps for k6..."
kubectl create configmap k6-script --from-file=script.js="../docker/k6/${K6_TEST_MODE}.js" \
  --dry-run=client -o yaml |
  kubectl label -f - --local --dry-run=client -o yaml "k8s=${K8S_VERSION}" "env=${NODE_ENV}" "mode=${K6_TEST_MODE}" |
  kubectl -n ${NAMESPACE} apply -f -

echo "# Deploy k6 Runner..."
kubectl apply -n ${NAMESPACE} -f ../k8s/tests/
