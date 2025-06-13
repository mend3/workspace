CONTAINER_RUNTIME ?= docker
PROFILE ?= gpu
TARGET ?= "*" ## Target (service name) for docker compose

# Compose file groups
COMMON_FILES = -f ./docker-compose.yml -f ./shared/monitor.compose.yml -f ./shared/docker-compose.yml
EXTALIA_FILES = $(COMMON_FILES) \
  -f ./extalia/docker-compose.yml \
  -f ./extalia/web/prod.compose.yml \
  -f ./extalia/web/docker-compose.yml

MCP_FILES = $(COMMON_FILES) \
  -f ./python/docker-compose.yml \
  -f ./browser/docker-compose.yml \
  -f ./vendors/docker-compose.yml \
  -f ./mcp/docker-compose.yml

ALL_FILES = $(COMMON_FILES) \
  $(EXTALIA_FILES) \
  $(MCP_FILES) \
  -f ./sws/docker-compose.yml

# Generic compose commands
define compose_up
	$(CONTAINER_RUNTIME) compose --profile $(PROFILE) $(1) up --build --remove-orphans --renew-anon-volumes --force-recreate -V $(2)
endef

define compose_down
	$(CONTAINER_RUNTIME) compose --profile $(PROFILE) $(1) down --remove-orphans
endef

define compose_build
	$(CONTAINER_RUNTIME) compose --profile $(PROFILE) $(1) build --pull --force-rm $(2)
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
	$(call compose_up,$(EXTALIA_FILES),-d traefik extalia-*)

.PHONY: extalia-dev
extalia-dev: ## Starts Extalia development server
	$(call compose_up,$(EXTALIA_FILES),dev-extalia-*)

.PHONY: sws
sws: ## Starts SWS service
	$(call compose_up,$(ALL_FILES),-d traefik sws-*)

.PHONY: mcp
mcp: ## Starts MCP server
	$(call compose_up,$(MCP_FILES),ai-context mcp-*)

.PHONY: ai-context
ai-context: ## Starts only the AI context services
	$(call compose_up,$(COMMON_FILES) -f ./python/docker-compose.yml,ai-context)

.PHONY: up
up: ## Starts all defined services
	$(call compose_up,$(ALL_FILES),-d traefik $(TARGET))

.PHONY: down
down: ## Stops and removes all services
	$(call compose_down,$(ALL_FILES))

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
