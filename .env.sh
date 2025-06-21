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

###### GLOBALS ######
export NAMESPACE="$(basename $(pwd))"
export CLUSTER_NAME="${CLUSTER_NAME:-workspace}"
export HELM_RELEASE="${HELM_RELEASE:-homelab}"

###### DATABASE CONNECTIONS ######
# mysql
export MYSQL_DATABASE_URL="mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@${MYSQL_HOST}:3306/${MYSQL_DATABASE}"
# mongodb local
export MONGODB_CONNECTION="mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_HOSTNAME}:27017/${MONGODB_DATABASE}?authSource=admin"
# postgres
export POSTGRES_CONNECTION_STRING="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"
# pgvector
export PGVECTOR_CONNECTION_STRING="postgresql+psycopg2://${PGVECTOR_USER}:${PGVECTOR_PASSWORD}@${PGVECTOR_HOST}:${PGVECTOR_PORT}/${PGVECTOR_DATABASE}"


echo -e "✅ Environment loaded: \n\tNamespace '${NAMESPACE}' \n\tCluster '${CLUSTER_NAME}' \n\tHelm '${HELM_RELEASE}'"
