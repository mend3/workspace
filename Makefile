ENV_FILE ?= .env.sh
ENV_SOURCE = ./$(ENV_FILE) &&
# make up ENV_FILE=.env.staging.sh

CONTAINER_RUNTIME ?= docker
PROFILE ?= nvidia
TARGET ?= "*" ## Target (service name) for docker compose

# Positional CLI syntax:  make <command> <service-name>... [profile]
# The first goal is the command verb; everything after it is positional —
# bare service name(s) become TARGET, and a hardware-profile word
# (nvidia/cpu/amd) becomes PROFILE. `ollama` is profile-gated and `precis`
# hard-depends on it, so a profile is mandatory; default is nvidia.
#   make up                       -> all services,        profile=nvidia (default)
#   make up traefik               -> TARGET=traefik,       profile=nvidia
#   make up traefik cpu           -> TARGET=traefik,       profile=cpu
#   make up mcp-qdrant qdrant     -> TARGET="mcp-qdrant qdrant"
#   make build PROFILE=amd        -> explicit var still works (overrides word)
# NOTE: `make up --profile nvidia` is NOT valid — GNU make rejects `--profile`
# as an unknown flag. Pass the profile as a bare word or via PROFILE=.
HW_PROFILES = nvidia cpu amd
# Produtos = stacks irmãos que rodam DENTRO da infra do mend3 (ver alvo `product`)
PRODUCTS = datahouse extalia e7 lumi hub
POSITIONAL = $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
ifneq ($(filter $(HW_PROFILES),$(POSITIONAL)),)
PROFILE := $(filter $(HW_PROFILES),$(POSITIONAL))
endif
ifneq ($(filter-out $(HW_PROFILES) $(PRODUCTS),$(POSITIONAL)),)
TARGET := $(filter-out $(HW_PROFILES) $(PRODUCTS),$(POSITIONAL))
endif

# Mapa produto -> diretório + profiles padrão (usados pelo alvo `product`).
# Profiles extras podem ser passados posicionalmente (ex.: make product extalia prod).
PRODUCT = $(filter $(PRODUCTS),$(MAKECMDGOALS))
PRODUCT_PROFILES = $(foreach p,$(filter-out product $(PRODUCTS) $(HW_PROFILES),$(MAKECMDGOALS)),--profile $(p))
dir_datahouse = ../datahouse
dir_extalia   = ../extalia
dir_e7        = ../e7-companion
dir_lumi      = ../lumi
dir_hub       = ../hub
defprof_datahouse =
defprof_extalia   = --profile dev
defprof_e7        =
defprof_lumi      = --profile app --profile infra
defprof_hub       =

.DEFAULT_GOAL := help

# Compose file groups (browser/* is pulled in via include: in docker-compose.yml)
COMMON_FILES = -f docker-compose.yml

define compose_graph
	$(ENV_SOURCE) $(CONTAINER_RUNTIME) compose -p ${NAMESPACE} --profile $(PROFILE) $(1) config > compose.yaml && \
	docker run --rm -it -v .:/in wst24365888/compose-viz --simple --no-ports --legend compose.yaml
endef

define compose_up
	$(ENV_SOURCE) $(CONTAINER_RUNTIME) compose -p ${NAMESPACE} --profile $(PROFILE) $(1) up --renew-anon-volumes --remove-orphans -V -d --force-recreate traefik $(2)
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
mcp: ## Sobe os servidores MCP do shared/mcp (profile mcp)
	$(ENV_SOURCE) $(CONTAINER_RUNTIME) compose -p ${NAMESPACE} --profile $(PROFILE) --profile mcp $(COMMON_FILES) \
		up -d --build --remove-orphans $$(grep -hoE '^  mcp-[a-z0-9-]+:' shared/mcp/docker-compose.yml vendors/mcp.compose.yml | tr -d ' :')

.PHONY: product
product: ## Sobe um produto na infra: make product <datahouse|extalia|e7|lumi> [profiles...]
	@docker network inspect workspace >/dev/null 2>&1 || { echo ">> rede 'workspace' ausente — rode 'make up nvidia' no mend3 primeiro"; exit 1; }
	@test -n "$(PRODUCT)" || { echo "uso: make product <$(PRODUCTS)> [profiles extras]"; exit 1; }
	cd $(dir_$(PRODUCT)) && $(CONTAINER_RUNTIME) compose $(if $(strip $(PRODUCT_PROFILES)),$(PRODUCT_PROFILES),$(defprof_$(PRODUCT))) up -d --build --remove-orphans

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

# Swallow positional words (service names + profile) as no-op goals so make
# doesn't try to build them as real targets. They're already consumed above
# into TARGET / PROFILE. Defined last so the default goal stays `help`.
.PHONY: $(POSITIONAL)
$(POSITIONAL):
	@:
