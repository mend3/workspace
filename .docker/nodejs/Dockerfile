ARG NGINX_VERSION=1.19.6
ARG NODE_VERSION=22.14.0
ARG APP
FROM node:${NODE_VERSION}-alpine3.20 AS base
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV NX_DAEMON=false
ENV PATH="${PATH}:./node_modules/.bin"
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN mkdir -p /root/.local/share/applications
RUN mkdir -p /app/.nx
WORKDIR /app

FROM mcr.microsoft.com/devcontainers/typescript-node:22-bullseye AS vscode
ARG APP
ENV PATH="${PATH}:./node_modules/.bin"
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
WORKDIR /app
RUN corepack enable
COPY package.json ./
COPY ./tools/install-dependencies.js ./tools/install-dependencies.js
COPY "./tools/dependencies-$APP.json" "./tools/dependencies-$APP.json"
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm use "${APP}" "true"
