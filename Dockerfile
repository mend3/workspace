ARG NGINX_VERSION
ARG NODE_VERSION
ARG NODE_ENV
ARG APP
FROM node:${NODE_VERSION}-alpine3.20 AS base
ENV NX_DAEMON=false
ENV PATH="${PATH}:./node_modules/.bin"
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN mkdir -p /root/.local/share/applications
RUN mkdir -p /app/.nx
WORKDIR /app

FROM base AS prod-deps
ARG APP
RUN npm install -g pnpm
ENV NODE_ENV=production
COPY package.json ./
COPY ./cli/install-dependencies.js ./cli/install-dependencies.js
COPY "./cli/dependencies-$APP.json" "./cli/dependencies-$APP.json"
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm use "${APP}"
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i --prefer-offline -P --ignore-scripts

FROM prod-deps AS dev-deps
ENV NODE_ENV=development
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i --prefer-offline --ignore-scripts

FROM dev-deps AS build
ARG APP
ARG NODE_ENV
COPY vitest.workspace.ts .
COPY babel.config.json .
COPY tsconfig.base.json .
COPY nx.json .
COPY global.d.ts .
COPY ./packages ./packages
COPY "./apps/$APP" "./apps/$APP"
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm nx build "$APP" --configuration="$NODE_ENV" --verbose

FROM dev-deps AS dev
ARG APP
WORKDIR /app
COPY . .
CMD ["nx", "serve", "$APP", "--verbose"]

FROM prod-deps AS dist
ARG APP
WORKDIR /app
COPY --from=prod-deps /app/prod_modules ./node_modules
COPY --from=build /app/dist ./dist
CMD [ "node", " --trace-deprecation", "./dist/$APP/main.js" ]

# nginx section
ARG APP
ARG NGINX_VERSION
FROM nginx:${NGINX_VERSION}-alpine AS nginx
ENV NGINX_VERSION=${NGINX_VERSION}
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist/app/ /usr/share/nginx/html/

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
