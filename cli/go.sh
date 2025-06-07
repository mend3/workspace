#!/bin/bash

set -e

# Go version to install
GO_VERSION="1.22.2"
GO_TARBALL="go$GO_VERSION.linux-amd64.tar.gz"
GO_URL="https://go.dev/dl/$GO_TARBALL"

echo "📥 Downloading Go $GO_VERSION..."
curl -LO "$GO_URL"

echo "📦 Removing old Go (if any)..."
sudo rm -rf /usr/local/go

echo "📂 Installing Go to /usr/local..."
sudo tar -C /usr/local -xzf "$GO_TARBALL"

# Detect shell config file
SHELL_NAME=$(basename "$SHELL")
if [[ "$SHELL_NAME" == "zsh" ]]; then
  SHELL_RC="$HOME/.zshrc"
else
  SHELL_RC="$HOME/.bashrc"
fi

echo "🔧 Adding Go to PATH in $SHELL_RC..."
{
  echo 'export PATH=$PATH:/usr/local/go/bin'
  echo 'export GOPATH=$HOME/go'
  echo 'export PATH=$PATH:$GOPATH/bin'
} >> "$SHELL_RC"

echo "📂 Creating GOPATH structure..."
mkdir -p "$HOME/go/{bin,src,pkg}"

echo "🧹 Cleaning up..."
rm -f "$GO_TARBALL"

echo "✅ Go $GO_VERSION installed. Restart your shell or run: source $SHELL_RC"
