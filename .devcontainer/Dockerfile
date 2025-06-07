FROM mcr.microsoft.com/devcontainers/typescript-node:22-bullseye AS vscode

ENV PATH="${PATH}:./node_modules/.bin"
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

# Install pnpm globally as root
RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm add -g pnpm

# Set permissions for the node user
RUN chown -R node:node /usr/local /usr/local/bin

USER node