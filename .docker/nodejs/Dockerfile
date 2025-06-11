ARG NODE_VERSION
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
