#!/bin/bash
set -e # Exit on first error

# === LOAD ENVIRONMENT VARIABLES ===
source .env.sh

# Default values
MYSQL_ROOT_PASSWORD=$(echo -n "$MYSQL_ROOT_PASSWORD" | base64)
MYSQL_PASSWORD=$(echo -n "$MYSQL_PASSWORD" | base64)
GF_SECURITY_ADMIN_PASSWORD=$(echo -n "$GF_SECURITY_ADMIN_PASSWORD" | base64)
MYSQL_DATABASE_URL=$(echo -n "mysql://$MYSQL_USER:$MYSQL_PASSWORD@mysql:3306/$MYSQL_DATABASE")
MYSQL_DATA_SOURCE_NAME=$(echo -n "exporter:$MYSQL_EXPORTER_PASSWORD@(mysql:3306)/${MYSQL_DATABASE}")

kubectl config set-context --current --namespace=${NAMESPACE}

create_secret_if_missing "grafana-admin-credentials" "${NAMESPACE}" \
  "admin-user=${GF_SECURITY_ADMIN_USER}" \
  "admin-password=${GF_SECURITY_ADMIN_PASSWORD}"

log "Apply global secrets..."
kubectl create secret generic global-secrets \
  --from-literal=mysql_database_url=$MYSQL_DATABASE_URL \
  --from-literal=mysql_data_source_name=$MYSQL_DATA_SOURCE_NAME \
  --from-literal=mysql_root_password=$MYSQL_ROOT_PASSWORD \
  --from-literal=mysql_password=$MYSQL_PASSWORD \
  --from-literal=mysql_exporter_password=$MYSQL_EXPORTER_PASSWORD \
  --from-literal=mysql_user=$MYSQL_USER \
  --from-literal=mysql_database=$MYSQL_DATABASE \
  --from-literal=maxminddb_user_id=$MAXMINDDB_ACCOUNT_ID \
  --from-literal=gf_security_admin_user=$GF_SECURITY_ADMIN_USER \
  --from-literal=gf_security_admin_password=$GF_SECURITY_ADMIN_PASSWORD \
  --dry-run=client -o yaml | kubectl label -f - --local --dry-run=client -o yaml "k8s=${K8S_VERSION}" "env=${NODE_ENV}" |
  kubectl -n ${NAMESPACE} apply -f -

# echo "# Apply certificate secrets..."
# kubectl create secret tls tls-secret \
#   --cert=.certs/selfsigned.crt \
#   --key=.certs/selfsigned.key \
#   --dry-run=client -o yaml \
#   | kubectl label -f - --local --dry-run=client -o yaml "k8s=${K8S_VERSION}" "nginx=${NGINX_VERSION}" "env=${NODE_ENV}" \
#   | kubectl -n ${NAMESPACE} apply -f -

log "Apply application environment variables..."
kubectl create secret generic workspace-env --from-env-file=.env \
  --dry-run=client -o yaml | kubectl label -f - --local --dry-run=client -o yaml "k8s=${K8S_VERSION}" "env=${NODE_ENV}" |
  kubectl -n ${NAMESPACE} apply -f -

# echo "# Apply MySQL Exporter secrets..."
# kubectl create configmap mysql-exporter --from-file=config.my-cnf \
#   --dry-run=client -o yaml | kubectl label -f - --local --dry-run=client -o yaml "k8s=${K8S_VERSION}" "env=${NODE_ENV}" \
#   | kubectl -n ${NAMESPACE} apply -f -

log "Secrets phase done."
