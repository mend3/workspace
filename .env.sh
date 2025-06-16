#!/bin/bash

# =======================================
# 🚀 PROJECT ENVIRONMENT & UTILITIES
# =======================================

[[ -z "$GITHUB_ACTIONS" ]] && source .env

random_string() {
  local length=${1:-16} # Use provided length or default to 16
  local chars=({a..z} {A..Z} {0..9})
  local result=""

  for ((i = 0; i < length; i++)); do
    local index=$((RANDOM % ${#chars[@]}))
    result+="${chars[$index]}"
  done

  echo "$result"
}

# ===== SECURITY KEYS (GENERATED) =====
export BROWSER_TOKEN=($(random_string 20))
export COOKIE_SECRET=($(random_string 20))
export N8N_ENCRYPTION_KEY=$(random_string 20)

###### GLOBALS ######
export NAMESPACE="$(basename $(pwd))"
export CLUSTER_NAME="${CLUSTER_NAME:-homelab}"
export HELM_RELEASE="${HELM_RELEASE:-workspace}"

###### DATABASE CONNECTIONS ######
# mysql
export MYSQL_DATABASE_URL="mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@${MYSQL_HOST}:3306/${MYSQL_DATABASE}"
# mongodb local
export MONGODB_CONNECTION_STRING="mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_HOSTNAME}:27017/${MONGODB_DATABASE}?authSource=admin"
# postgres
export POSTGRES_CONNECTION_STRING="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"
# pgvector
export PGVECTOR_CONNECTION_STRING="postgresql+psycopg2://${PGVECTOR_USER}:${PGVECTOR_PASSWORD}@${PGVECTOR_HOST}:${PGVECTOR_PORT}/${PGVECTOR_DATABASE}"

###### BROWSER ######
export VNC_PASSWORD="${VNC_PASSWORD}"
export BROWSER_BASE_API_KEY="${BROWSER_BASE_API_KEY}"
export BROWSER_BASE_PROJECT_ID="${BROWSER_BASE_PROJECT_ID}"

###### SCRAPOXY ######
export AUTH_LOCAL_USERNAME=${AUTH_LOCAL_USERNAME}
export AUTH_LOCAL_PASSWORD=${AUTH_LOCAL_PASSWORD}

###### N8N ######
export N8N_LICENSE_KEY=${N8N_LICENSE_KEY}

############
# [required]
# Langfuse credentials
# Each of the secret keys you can set to whatever you want, just make it secure!
# For the encryption key, use the command `openssl rand -hex 32`
#   openssl is available by defualt on Linux/Mac
#   For Windows, you can use the 'Git Bash' terminal installed with git
############

export CLICKHOUSE_PASSWORD="$(openssl rand -hex 32)"
export MINIO_ROOT_PASSWORD="$(openssl rand -hex 32)"
export LANGFUSE_SALT="$(openssl rand -hex 32)"
export NEXTAUTH_SECRET="$(openssl rand -hex 32)"
export ENCRYPTION_KEY="$(openssl rand -hex 32)"
export FRONTEND_JWT_SECRET="$(openssl rand -hex 32)"
export BACKEND_JWT_SECRET="$(openssl rand -hex 32)"

echo -e "✅ Environment loaded: \n\tNamespace '${NAMESPACE}' \n\tCluster '${CLUSTER_NAME}' \n\tHelm '${HELM_RELEASE}'"
