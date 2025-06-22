# 🛠️ mend3 Workspace

A complete local development environment powered by Docker, Kubernetes, AI tooling, and modern observability stacks.

---

- [🛠️ mend3 Workspace](#️-mend3-workspace)
  - [📋 Requirements](#-requirements)
  - [🌐 Domain Routing with Traefik](#-domain-routing-with-traefik)
  - [🤖 Ollama Model Pull List](#-ollama-model-pull-list)
  - [🐳 Docker Tips](#-docker-tips)
  - [☸️ Kubernetes \& Minikube](#️-kubernetes--minikube)
    - [Install Minikube](#install-minikube)
    - [Kompose](#kompose)
    - [Cleanup](#cleanup)
    - [Helm Chart Installation](#helm-chart-installation)
  - [🔒 TLS Certificates (mkcert)](#-tls-certificates-mkcert)
  - [🌿 Terraform on AWS](#-terraform-on-aws)
    - [Create Remote State](#create-remote-state)
  - [🔐 AWS ECR Kubernetes Secret](#-aws-ecr-kubernetes-secret)
  - [📈 Monitoring Stack (Local)](#-monitoring-stack-local)
    - [Dashboards](#dashboards)
  - [🧠 AI Context \& MCP](#-ai-context--mcp)
  - [🔍 Useful Commands](#-useful-commands)
  - [🧪 Git \& Submodules](#-git--submodules)
  - [🧩 WSL Enhancements](#-wsl-enhancements)
  - [⚙️ GPU Support on WSL](#️-gpu-support-on-wsl)
  - [Submodules](#submodules)
    - [Self Owned](#self-owned)
    - [Brain](#brain)
    - [Third Party Repositories](#third-party-repositories)

---

## 📋 Requirements

Ensure the following tools are installed before proceeding:

| Tool                                                 | Version    | Notes                                                |
| ---------------------------------------------------- | ---------- | ---------------------------------------------------- |
| Node.js                                              | 22.15+     | [Install Node.js](https://nodejs.org/)               |
| Python                                               | 3.12+      | [Install Python](https://www.python.org/)            |
| Make                                                 | Latest     | GNU Make                                             |
| Docker                                               | Latest     | [Install Docker](https://www.docker.com/)            |
| Docker Compose                                       | Latest     | [See docs](https://docs.docker.com/compose/install/) |
| [Minikube](https://minikube.sigs.k8s.io/docs/start/) | (Optional) | For local Kubernetes setup                           |
| [Kompose](https://kompose.io/getting-started/)       | (Optional) | For local Kubernetes/docker-compsoe setup            |
| [Helm](https://helm.sh/docs/intro/install/)          | 3.x+       | Required if using Minikube                           |
| jq                                                   | Latest     | `sudo apt install -y jq`                             |

---

## 🌐 Domain Routing with Traefik

Once services are running, you can access local domains like:

```ts
127.0.0.1 dashboard.workspace.com
127.0.0.1 graphiti.workspace.com
127.0.0.1 supabase.workspace.com
127.0.0.1 browserless.workspace.com
127.0.0.1 selenoid.workspace.com
127.0.0.1 brightdata.workspace.com
127.0.0.1 scrapoxy.workspace.com
127.0.0.1 wallos.workspace.com
127.0.0.1 rss.workspace.com
127.0.0.1 docmost.workspace.com
127.0.0.1 firefly.workspace.com
127.0.0.1 homarr.workspace.com
127.0.0.1 home.workspace.com
127.0.0.1 wordpress.workspace.com
127.0.0.1 phpbb.workspace.com
127.0.0.1 prometheus.workspace.com
127.0.0.1 grafana.workspace.com
127.0.0.1 n8n.workspace.com
127.0.0.1 langfuse.workspace.com
127.0.0.1 minio.workspace.com
```

> Traefik handles routing using Docker labels. See: [Traefik Docker Provider Docs](https://doc.traefik.io/traefik/routing/providers/docker/)

---

## 🤖 Ollama Model Pull List

For local LLM inference:

| Usage           | Model Name                                                   |
| --------------- | ------------------------------------------------------------ |
| Embedding (n8n) | `all-minilm:l6-v2`, `sentence-transformers/all-MiniLM-L6-v2` |
| General Chat    | `qwen2.5:7b-instruct-q4_K_M`, `gemma:7b`                     |
| Code Assistants | `deepseek-code:6.7b`                                         |

---

## 🐳 Docker Tips

```sh
# List images and containers
docker images
docker ps

# Start local Docker registry
docker run -d -p 5000:5000 --restart=always --name registry registry:2
```

---

## ☸️ Kubernetes & Minikube

### Install Minikube

```bash
curl -LO https://github.com/kubernetes/minikube/releases/latest/download/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube && rm minikube-linux-amd64
```

### Kompose

```bash
curl -L https://github.com/kubernetes/kompose/releases/download/v1.34.0/kompose-linux-amd64 -o kompose
chmod +x kompose
sudo mv ./kompose /usr/local/bin/kompose
```

### Cleanup

```bash
# Delete all non-default namespaces
kubectl delete ns $(kubectl get ns --no-headers | awk '$1 !~ /^(default|kube.*)/ {print $1}')

# Remove all Helm releases
helm list -A -q | xargs -n1 -I {} helm uninstall {} --namespace $(helm list -A | awk '{print $2}' | tail -n +2)
```

### Helm Chart Installation

```bash
helm package ./k8s/helm
helm install my-app ./k8s/helm --namespace dev --create-namespace
```

---

## 🔒 TLS Certificates (mkcert)

```bash
# Install mkcert
sudo apt install libnss3-tools -y
curl -LO https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64
chmod +x mkcert-v1.4.4-linux-amd64
sudo mv mkcert-v1.4.4-linux-amd64 /usr/local/bin/mkcert
mkcert -install

# Generate wildcard certs
mkcert -cert-file ./traefik/certs/workspace.com.crt -key-file ./traefik/certs/workspace.com.key workspace.com '*.workspace.com'
```

---

## 🌿 Terraform on AWS

### Create Remote State

```bash
aws s3api create-bucket --bucket my-tf-state --region us-east-1
aws s3api put-bucket-versioning --bucket my-tf-state --versioning-configuration Status=Enabled

aws dynamodb create-table \
  --table-name my-tf-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST
```

---

## 🔐 AWS ECR Kubernetes Secret

```bash
aws ecr get-login-password --region us-east-1 | \
kubectl create secret docker-registry ecr-secret \
  --docker-server=ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com \
  --docker-username=AWS \
  --docker-password=$(aws ecr get-login-password --region us-east-1) \
  --docker-email=you@example.com \
  --namespace dev \
  --dry-run=client -o yaml | kubectl apply -f -
```

---

## 📈 Monitoring Stack (Local)

| Tool       | URL                                                                |
| ---------- | ------------------------------------------------------------------ |
| Grafana    | [http://grafana.workspace.com](http://grafana.workspace.com)       |
| Prometheus | [http://prometheus.workspace.com](http://prometheus.workspace.com) |
| Loki       | [http://loki.workspace.com](http://loki.workspace.com)             |

### Dashboards

- [14057](https://grafana.com/grafana/dashboards/14057-mysql/)
- [1860](https://grafana.com/grafana/dashboards/1860-node-exporter-full/)
- [14314](https://grafana.com/grafana/dashboards/14314-kubernetes-nginx-ingress-controller-nextgen-devops-nirvana/)
- [7249](https://grafana.com/grafana/dashboards/7249-kubernetes-cluster/)
- [13577](https://grafana.com/grafana/dashboards/13577-9108-9109-nginx/)

---

## 🧠 AI Context & MCP

```bash
# Generate AI Context index
make ai-context

# Start MCP servers
make mcp
```

---

## 🔍 Useful Commands

```bash
# Grant full access to MySQL user
GRANT ALL PRIVILEGES ON *.* TO 'user'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;

# Create project folder tree
find . -maxdepth 4 -type d -print | sed -e "s/[^-][^\/]*\// |/g" -e "s/|\([^ ]\)/|-\1/" > tree.txt

# Snapshot an entire website
wget --recursive --no-clobber --page-requisites --html-extension --convert-links --restrict-file-names=windows --domains domain.com --no-parent https://domain.com

# Serve static dist folder locally
pnpm add -g http-server
http-server dist -P "http://localhost:4200?" -p 4200
```

---

## 🧪 Git & Submodules

```bash
# Add a submodule
git submodule add https://github.com/user/repo path/to/submodule

# Initialize and update submodules
git submodule update --init --recursive
```

---

## 🧩 WSL Enhancements

Suggested tools:

- [`ctop`](https://github.com/bcicen/ctop) — container top
- [`autoenv`](https://github.com/hyperupcall/autoenv) — automatic `.env` loader
- [`zsh-auto-nvm-use`](https://github.com/Sparragus/zsh-auto-nvm-use)
- [`fzf-tab`](https://github.com/Aloxaf/fzf-tab)
- [PowerLine Fonts](https://github.com/powerline/fonts?tab=readme-ov-file)
- [Lazy Docker](https://github.com/jesseduffield/lazydocker#installation)
- [Awesome Docker](https://github.com/veggiemonk/awesome-docker/blob/master/README.md)

---

## ⚙️ GPU Support on WSL

```bash
sudo apt install nvidia-container-toolkit
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker

# Test with NVIDIA
docker run --rm --runtime=nvidia --gpus all ubuntu nvidia-smi
```

---

## Submodules

### Self Owned

This are repositories are submodules and may be private to others users.

- [./shared/mcp](git@github.com:mend3/mcp.git)
- [./shared/react-trainee](git@github.com:mend3/react-trainee.git)
- [./shared/typestack](git@github.com:mend3/typestack.git)
- [./browser/use](git@github.com:mend3/browser-use.git)
- [./browser/ui](git@github.com:mend3/browser-ui.git)
- [./deployment/extalia/web](git@github.com:mend3/l2-web.git)
- [./deployment/extalia/java](git@github.com:mend3/extalia.git)
- [./deployment/sws](git@github.com:mendshell/sws.git)

### Brain

This contains lots of documents, link, files and templates.

- [./brain/ai-agents-masterclass](https://github.com/coleam00/ai-agents-masterclass)
- [./brain/ai-agents-ottomator](https://github.com/coleam00/ottomator-agents.git)
- [./brain/system-prompts-and-models-of-ai-tools](https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools.git)
- [./brain/ebooks](https://github.com/sandeep10rana/DevOps.git)

### Third Party Repositories

- [./vendors/mcp-servers](https://github.com/modelcontextprotocol/servers.git)
- [./vendors/sentence-transformers](https://github.com/UKPLab/sentence-transformers.git)
- [./vendors/local-ai-packaged](https://github.com/coleam00/local-ai-packaged.git)
- [./vendors/Archon](https://github.com/coleam00/Archon.git)
- [./vendors/mcp-filesystem](https://github.com/ysthink/Filesystem-MCP-Server-SSE.git)
- [./vendors/mcp-crawl4ai-rag](https://github.com/coleam00/mcp-crawl4ai-rag.git)
- [./vendors/mcp-qdrant](https://github.com/qdrant/mcp-server-qdrant.git)
- [./vendors/supabase](https://github.com/supabase/supabase)
- [./vendors/mcp-supabase](https://github.com/supabase-community/supabase-mcp.git)
- [./vendors/graphiti](https://github.com/getzep/graphiti.git)
- [compose-viz/compose-viz](https://github.com/compose-viz/compose-viz)
  - Tool to generate graph for docker-compose services

---

```txt
                                      _  _
                            _____*~~~  **  ~~~*_____
                         __* ___     |\__/|     ___ *__
                       _*  / 888~~\__(8OO8)__/~~888 \  *_
                     _*   /88888888888888888888888888\   *_
                     *   |8888888888888888888888888888|   *
                    /~*  \8888/~\88/~\8888/~\88/~\8888/  *~
                   /  ~*  \88/   \/   (88)   \/   \88/  *~
                  /    ~*  \/          \/          \/  *~
                 /       ~~*_                      _*~~/
                /            ~~~~~*___ ** ___*~~~~~  /
               /                      ~  ~         /
              /                                  /
             /                                 /
            /                                /
           /                    ___sws___  /
          /                    | ####### |
         /            ___      | ####### |             ____i__
        /  _____p_____l_l____  | ####### |            | ooooo |         qp
i__p__ /  |  ###############  || ####### |__l___xp____| ooooo |      |~~~~|
 oooo |_I_|  ###############  || ####### |oo%Xoox%ooxo| ooooo |p__h__|##%#|
 oooo |ooo|  ###############  || ####### |o%xo%%xoooo%| ooooo |      |#xx%|
 oooo |ooo|  ###############  || ####### |o%ooxx%ooo%%| ooooo |######|x##%|
 oooo |ooo|  ###############  || ####### |oo%%x%oo%xoo| ooooo |######|##%x|
 oooo |ooo|  ###############  || ####### |%x%%oo%/oo%o| ooooo |######|/#%x|
 oooo |ooo|  ###############  || ####### |%%x/oo/xx%xo| ooooo |######|#%x/|
 oooo |ooo|  ###############  || ####### |xxooo%%/xo%o| ooooo |######|#^x#|
 oooo |ooo|  ###############  || ####### |oox%%o/x%%ox| ooooo |~~~$~~|x##/|
 oooo |ooo|  ###############  || ####### |x%oo%x/o%//x| ooooo |_KKKK_|#x/%|
 oooo |ooo|  ###############  || ####### |oox%xo%%oox%| ooooo |_|~|~~|xx%/|
 oooo |oHo|  #####AAAA######  || ##XX### |x%x%WWx%%/ox| ooDoo |_| |Y||xGGx|
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```
