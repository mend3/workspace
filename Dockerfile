# Vscode image
FROM mcr.microsoft.com/devcontainers/typescript-node:22-bullseye AS vscode
ARG APP
ENV PATH="${PATH}:./node_modules/.bin"
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Chrome image (Google Chrome 102.0.5005.61)
ARG NODE_VERSION
FROM node:${NODE_VERSION}-alpine3.20 AS google-chrome
ENV CHROME_VERSION "google-chrome-stable"
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
RUN apt-get update; apt-get clean
# Install wget.
RUN apt-get install -y wget
RUN apt-get install -y gnupg
# Set the Chrome repo.
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list
# Install Chrome.
RUN apt-get update && apt-get -y install google-chrome-stable

# # Create a non-root user
RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
  && mkdir -p /home/pptruser/Downloads \
  && chown -R pptruser:pptruser /home/pptruser

# Set the non-root user as default
USER pptruser
