ENV_FILE ?= .env.sh
ENV_SOURCE = ./$(ENV_FILE) &&
# make up ENV_FILE=.env.staging.sh

CONTAINER_RUNTIME ?= docker
PROFILE ?= nvidia
TARGET ?= "*" ## Target (service name) for docker compose

# Compose file groups
COMMON_FILES = -f docker-compose.yml \
  -f browser/docker-compose.yml

define compose_graph
	$(ENV_SOURCE) $(CONTAINER_RUNTIME) compose -p ${NAMESPACE} --profile $(PROFILE) $(1) config > compose.yaml && \
	docker run --rm -it -v .:/in wst24365888/compose-viz --simple --no-ports --legend compose.yaml
endef

define compose_up
	$(ENV_SOURCE) $(CONTAINER_RUNTIME) compose -p ${NAMESPACE} --profile $(PROFILE) $(1) up --renew-anon-volumes --remove-orphans -V -d --force-recreate --build traefik $(2)
endef

define compose_down
	$(ENV_SOURCE) $(CONTAINER_RUNTIME) compose -p ${NAMESPACE} --profile $(PROFILE) $(1) down
endef

define compose_stop
	$(ENV_SOURCE) $(CONTAINER_RUNTIME) compose -p ${NAMESPACE} --profile $(PROFILE) $(1) stop
endef

define compose_build
	$(ENV_SOURCE) $(CONTAINER_RUNTIME) compose -p ${NAMESPACE} --profile $(PROFILE) $(1) build --pull --force-rm $(2)
endef

define compose_bridge
	compose-bridge convert $(1)
endef

.PHONY: help
help: ## Display help for each make command
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
	awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

.PHONY: clean
clean: ## Clean cache folders
	sudo rm -rf .cache && mkdir -p .cache

.PHONY: mcp
mcp: ## Starts MCP servers
	$(call compose_up,$(COMMON_FILES),mcp-*)

.PHONY: ai-context
ai-context: ## Starts the workspace context generation
	$(call compose_up,$(COMMON_FILES),ai-context)

.PHONY: ai-local
ai-local: ## Starts local ai stack, including n8n and supabase
	$(call compose_up,$(COMMON_FILES),n8n studio)

.PHONY: homelab
homelab: ## Starts homelab services
	$(call compose_up,$(COMMON_FILES),wordpress firefly docmost precis waha)

.PHONY: up
up: ## Starts defined services
	$(call compose_up,$(COMMON_FILES),$(TARGET))

.PHONY: down
down: ## Removes and stops defined services
	$(call compose_down,$(COMMON_FILES),$(TARGET))

.PHONY: stop
stop: ## Stops defined services
	$(call compose_stop,$(COMMON_FILES))

.PHONY: build
build: ## Build Docker images for defined services
	$(call compose_build,$(COMMON_FILES),$(TARGET))

.PHONY: graph
graph: ## Show the docker compose graph for defined services
	$(call compose_graph,$(COMMON_FILES))

.PHONY: minikube
minikube:  ## Start minikube cluster and the whole namespace (k8s)
	./k8s/cli/minikube.sh

.PHONY: minikube-down
minikube-down:  ## Drops minikube cluster
	minikube delete --all --purge

.PHONY: dashboard
dashboard:  ## Open minikube dashboard (k8s)
	minikube dashboard
