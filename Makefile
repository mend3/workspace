ENV_FILE ?= .env.sh
ENV_SOURCE = ./$(ENV_FILE) &&
# make up ENV_FILE=.env.staging.sh

CONTAINER_RUNTIME ?= docker
PROFILE ?= gpu-nvidia
TARGET ?= "*" ## Target (service name) for docker compose

# Compose file groups
COMMON_FILES = -f ./docker-compose.yml \
  -f ./browser/docker-compose.yml \
  -f ./shared/monitor.compose.yml

EXTALIA_FILES = $(COMMON_FILES) \
  -f ./deployment/extalia/docker-compose.yml \
  -f ./deployment/extalia/web/prod.compose.yml \
  -f ./deployment/extalia/web/docker-compose.yml

SWS_FILES = $(COMMON_FILES) \
  -f ./deployment/sws/docker-compose.yml

AI_FILES = $(COMMON_FILES) \
  -f ./python/docker-compose.yml \
  -f ./shared/mcp.compose.yml \
  -f ./shared/vendors.compose.yml \
  -f ./vendors/local-ai-packaged/docker-compose.yml

HOMELAB_FILES = $(COMMON_FILES) \
  $(AI_FILES) \
  -f ./shared/homelab.compose.yml

ALL_FILES = $(COMMON_FILES) \
  $(SWS_FILES) \
  $(AI_FILES) \
  $(HOMELAB_FILES)

# Generic compose commands
define compose_up
	$(ENV_SOURCE) $(CONTAINER_RUNTIME) compose -p ${NAMESPACE} --profile $(PROFILE) $(1) up --remove-orphans --renew-anon-volumes -V traefik $(2)
endef

define compose_down
	$(ENV_SOURCE) $(CONTAINER_RUNTIME) compose -p ${NAMESPACE} --profile $(PROFILE) $(1) down
endef

define compose_stop
	$(ENV_SOURCE) $(CONTAINER_RUNTIME) compose -p ${NAMESPACE} --profile $(PROFILE) $(1) stop
endef

define compose_build
	$(ENV_SOURCE) $(CONTAINER_RUNTIME) compose -p ${NAMESPACE} --profile $(PROFILE) $(1) build --no-cache --pull --force-rm $(2)
endef

define compose_bridge
	compose-bridge convert $(1)
endef

define kompose
	kompose convert $(1)
endef

.PHONY: help
help: ## Display help for each make command
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
	awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

.PHONY: clean
clean: ## Clean cache folders
	sudo rm -rf .cache && mkdir -p .cache

.PHONY: extalia
extalia: ## Starts Extalia compound (http + java)
	$(call compose_up,$(EXTALIA_FILES),-d extalia-*)

.PHONY: extalia-dev
extalia-dev: ## Starts Extalia service in development mode
	$(call compose_up,$(EXTALIA_FILES),-d dev-extalia-*)

.PHONY: sws
sws: ## Starts SWS service
	$(call compose_up,$(SWS_FILES),-d sws-*)

.PHONY: sws-dev
sws-dev: ## Starts SWS service in development mode
	$(call compose_up,$(SWS_FILES),-d dev-sws-*)

.PHONY: mcp
mcp: ## Starts MCP server
	$(call compose_up,$(AI_FILES),ollama-gpu mcp-*)

.PHONY: ai-context
ai-context: ## Starts only the AI context services
	$(call compose_up,$(AI_FILES),ollama-gpu ai-context)

.PHONY: homelab
homelab: ## Starts all homelab services
	$(call compose_up,$(ALL_FILES),ollama-gpu mcp-* $(TARGET))

.PHONY: up
up: ## Starts all defined services
	$(call compose_up,$(ALL_FILES),ollama-gpu $(TARGET))

.PHONY: down
down: ## Stops and removes all services
	$(call compose_down,$(ALL_FILES))

.PHONY: stop
stop: ## Stops and removes all services
	$(call compose_stop,$(ALL_FILES))

.PHONY: build
build: ## Build all Docker images
	$(call compose_build,$(ALL_FILES),$(TARGET))

.PHONY: minikube
minikube:  ## Start minikube cluster and the whole namespace (k8s)
	./cli/k8s/minikube.sh

.PHONY: minikube-down
minikube-down:  ## Drops minikube cluster
	minikube delete --all --purge

.PHONY: dashboard
dashboard:  ## Open minikube dashboard (k8s)
	minikube dashboard

.PHONY: konvert
konvert:  ## Convert docker-compose files to k8s deployments using konvert (k8s)
	$(call konvert,$(ALL_FILES))

.PHONY: convert
convert:  ## Convert docker-compose files to k8s deployments using docker compose-bridge plugin (k8s)
	$(call compose_bridge,$(ALL_FILES))
