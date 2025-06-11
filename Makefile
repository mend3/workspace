CONTAINER_RUNTIME ?= "docker"
PROFILE ?= "global"
TARGET?="*" ## Target (service name) for docker compose

.PHONY: help
help: ## Display help for each make command
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: extalia
extalia:  ## Starts Extalia server
	 $(CONTAINER_RUNTIME) compose -f ./docker-compose.yml \
   -f ./extalia/docker-compose.yml \
   -f ./extalia/web/docker-compose.yml \
   -f ./extalia/web/docker/prod.compose.yml \
    up --remove-orphans --renew-anon-volumes --build --force-recreate -V --force-recreate -d gameserver

.PHONY: mcp
mcp:  ## Starts mcp server
	 $(CONTAINER_RUNTIME) compose -f ./docker-compose.yml \
   -f ./tools/docker-compose.yml \
   -f ./shared/monitor.compose.yml \
   -f ./vendors/docker-compose.yml \
   -f ./mcp/docker-compose.yml \
    up --remove-orphans --renew-anon-volumes --build --force-recreate -V --force-recreate ai-context mcp-$(TARGET)

.PHONY: up
up:  ## Run selected target
	$(CONTAINER_RUNTIME) compose -f ./docker-compose.yml \
   -f ./tools/docker-compose.yml \
   -f ./mcp/docker-compose.yml \
   -f ./vendors/docker-compose.yml \
   -f ./shared/monitor.compose.yml \
   -f ./browser/docker-compose.yml \
   -f ./sws/docker-compose.yml \
   -f ./extalia/docker-compose.yml \
   -f ./extalia/web/docker-compose.yml \
   -f ./extalia/web/docker/prod.compose.yml \
   -f ./shared/docker-compose.yml \
    up --remove-orphans --renew-anon-volumes --build --force-recreate -V --force-recreate $(TARGET)

.PHONY: down
down:  ## Drops everything (docker)
	$(CONTAINER_RUNTIME) compose -f ./docker-compose.yml \
   -f ./tools/docker-compose.yml \
   -f ./mcp/docker-compose.yml \
   -f ./vendors/docker-compose.yml \
   -f ./shared/monitor.compose.yml \
   -f ./browser/docker-compose.yml \
   -f ./sws/docker-compose.yml \
   -f ./extalia/docker-compose.yml \
   -f ./extalia/web/docker-compose.yml \
   -f ./extalia/web/docker/prod.compose.yml \
   -f ./shared/docker-compose.yml \
    down -v --remove-orphans

.PHONY: bump_submodules
bump_submodules:  ## Bump submodules to latest commit
	./cli/bump_submodules.sh

.PHONY: clean
clean:  ## Clean cache folders
	sudo rm -rf .cache && mkdir -p .cache

.PHONY: ai-context
ai-context: ## Bump submodules to latest commit
	$(CONTAINER_RUNTIME) compose -f ./docker-compose.yml \
   -f ./tools/docker-compose.yml \
   -f ./mcp/docker-compose.yml \
   -f ./vendors/docker-compose.yml \
   -f ./shared/monitor.compose.yml \
   -f ./browser/docker-compose.yml \
   -f ./sws/docker-compose.yml \
   -f ./extalia/docker-compose.yml \
   -f ./extalia/web/docker-compose.yml \
   -f ./extalia/web/docker/prod.compose.yml \
   -f ./shared/docker-compose.yml \
    up --remove-orphans --renew-anon-volumes --build --force-recreate -V --force-recreate \
    ai-context

.PHONY: build
build: ## Bump submodules to latest commit
	$(CONTAINER_RUNTIME) compose -f ./docker-compose.yml \
   -f ./browser/docker-compose.yml \
   -f ./tools/docker-compose.yml \
   -f ./shared/docker-compose.yml \
   -f ./shared/monitor.compose.yml \
   -f ./mcp/docker-compose.yml \
   -f ./vendors/docker-compose.yml \
   -f ./sws/docker-compose.yml \
   -f ./extalia/docker-compose.yml \
   -f ./extalia/web/docker-compose.yml \
   -f ./extalia/web/docker/prod.compose.yml \
    build --pull --no-cache --force-rm $(TARGET)
