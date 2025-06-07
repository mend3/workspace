CONTAINER_RUNTIME ?= "docker"
PROFILE ?= "global"
TARGET?="*" ## Target for L2, can be "extalia" or "docs"

.PHONY: help
help: ## Display help for each make command
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: extalia
extalia:  ## Starts Extalia server
	 $(CONTAINER_RUNTIME) compose -f ./docker-compose.yml \
   -f ./extalia/docker-compose.yml \
    up --remove-orphans --renew-anon-volumes --build --force-recreate -V --force-recreate l2-$(TARGET)

.PHONY: mcp
mcp:  ## Starts mcp server
	 $(CONTAINER_RUNTIME) compose -f ./docker-compose.yml \
   -f ./tools/docker-compose.yml \
   -f ./mcp/docker-compose.yml \
    up --remove-orphans --renew-anon-volumes --build --force-recreate -V --force-recreate ai-context mcp-*

.PHONY: up
up:  ## Run selected target
	$(CONTAINER_RUNTIME) compose -f ./docker-compose.yml \
   -f ./tools/docker-compose.yml \
   -f ./mcp/docker-compose.yml \
   -f ./browser/docker-compose.yml \
   -f ./extalia/docker-compose.yml \
   -f ./shared/docker-compose.yml \
    up --remove-orphans --renew-anon-volumes --build --force-recreate -V --force-recreate $(TARGET)

.PHONY: down
down:  ## Drops everything (docker)
	$(CONTAINER_RUNTIME) compose -f ./docker-compose.yml \
   -f ./tools/docker-compose.yml \
   -f ./mcp/docker-compose.yml \
   -f ./browser/docker-compose.yml \
   -f ./extalia/docker-compose.yml \
   -f ./shared/docker-compose.yml \
    down -v --remove-orphans

.PHONY: local-context
local-context:  ## Generate AI Context based on local repo
	$(CONTAINER_RUNTIME) compose -f ./docker-compose.yml build ai-context && \
  docker create --name context-container ${PROFILE}-ai-context  && \
  docker cp context-container:/app/.cache/ai-context.txt .cache/ai-context.txt && \
  docker rm context-container

.PHONY: bump_submodules
bump_submodules:  ## Bump submodules to latest commit
	./cli/bump_submodules.sh

.PHONY: k6
k6:  ## Run k6 tests (k8s)
	./cli/k6.sh

.PHONY: konvert
konvert:  ## Convert docker-compose files to k8s deployments using konvert (k8s)
	kompose convert -f ./docker-compose.yml -f \
    ./docker/http.compose.yml -f \
    ./docker/k6.compose.yml -f \
    ./docker/java.compose.yml -f

.PHONY: convert
convert:  ## Convert docker-compose files to k8s deployments using docker compose-bridge plugin (k8s)
	compose-bridge convert -f ../../docker-compose.yml -f \
    ./docker/http.compose.yml -f \
    ./docker/k6.compose.yml -f \
    ./docker/java.compose.yml -f
