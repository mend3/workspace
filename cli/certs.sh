#!/usr/bin/env bash

set -euo pipefail

CERT_DIR=".docker/traefik/certs"
DOMAINS=(
  "workspace.com"
  "extalia.workspace.com"
  "extalia-api.workspace.com"
  "extalia-gameserver.workspace.com"
  "sws.workspace.com"
)

# Check mkcert is installed
if ! command -v mkcert &> /dev/null; then
  echo "❌ mkcert not found. Please install it first:"
  echo "  - macOS: brew install mkcert"
  echo "  - Linux: https://github.com/FiloSottile/mkcert"
  echo "  - Windows: choco install mkcert"
  exit 1
fi

# Initialize mkcert CA if not already done
if [ ! -f "$(mkcert -CAROOT)/rootCA-key.pem" ]; then
  echo "📜 Installing local CA..."
  mkcert -install
else
  echo "✅ Local CA already installed."
fi

# Create cert directory
mkdir -p "$CERT_DIR"
cd "$CERT_DIR"

# Generate certs with SAN support
echo "🔐 Generating cert for: ${DOMAINS[*]}"
mkcert -cert-file workspace.com.crt -key-file workspace.com.key "${DOMAINS[@]}"

echo "✅ Certificates created:"
ls -lh workspace.com.*

echo "📂 Output directory: $CERT_DIR"
