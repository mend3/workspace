# Internal Notes

## Pre-requisites

- Node v22.14+ (and pnpm)
- Python v3.12+ (and pip)
- Make
- Docker

## Ollama

- Use model `all-minilm:l6-v2` as embedding model to read qdrant vector store using n8n.
- Ollama models to pull:
- - `all-minilm:l6-v2` - Embedding model for n8n agents
- - `qwen2.5:7b`
- - `gemma:7b-instruct`
- - `deepseek-code:6.7b`

## Utils

---

## mkcert

### ✅ Step 1: Properly install `mkcert` in WSL (Linux)

If you're in **WSL (Ubuntu or Debian)**, install it via:

```bash
sudo apt install libnss3-tools -y
curl -JLO https://github.com/FiloSottile/mkcert/releases/latest/download/mkcert-v1.4.4-linux-amd64
chmod +x mkcert-v1.4.4-linux-amd64
sudo mv mkcert-v1.4.4-linux-amd64 /usr/local/bin/mkcert
```

> ✅ You can verify with:

```bash
mkcert --version
```

You should see:

```
mkcert v1.4.4
```

---

### ✅ Step 2: Generate certificates (with wildcard correctly quoted)

```bash
mkcert -cert-file traefik/certs/devshell.local.crt -key-file traefik/certs/devshell.local.key \
  devshell.local \
  '*.devshell.local'
```

---

### ✅ Step 3: Trust the local CA (once per system)

You’ll also need to install the local root CA to your trust store:

```bash
mkcert -install

cat $(mkcert -CAROOT)/rootCA.pem
```

---

**WSL Addons:**

- [Ctop](https://github.com/bcicen/ctop)
- [Quick Install ZSH](https://gist.github.com/n1snt/454b879b8f0b7995740ae04c5fb5b7df)
- [zsh-auto-nvm-use](https://github.com/Sparragus/zsh-auto-nvm-use)
- [fzf-tab](https://gist.github.com/seungjulee/d72883c193ac630aac77e0602cb18270)
- [PowerLine Fonts](https://github.com/powerline/fonts?tab=readme-ov-file)

**Docker:**

- [Awesome Docker](https://github.com/veggiemonk/awesome-docker/blob/master/README.md)
- [Lazy Docker](https://github.com/jesseduffield/lazydocker#installation)

**GPU:**

- [Install Cuda on WSL](https://docs.nvidia.com/cuda/wsl-user-guide/index.html#installing-docker)
- [Nvidia Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html#installing-the-nvidia-container-toolkit)
- Check installation and gpu compatibility on docker
  - `docker run --rm --runtime=nvidia --gpus all ubuntu nvidia-smi`

```sh
sudo apt install nvidia-container-toolkit
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker
```

## MCP Servers

```bash
# automatically starts all mcp servers using docker
make mcp
```

## Shell Scripts

```sh

# MYSQL: Grant privileves to a user:
GRANT ALL PRIVILEGES ON *.* TO '$MYSQL_USER$'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;

# install and enable autoenv
curl -#fLo- 'https://raw.githubusercontent.com/hyperupcall/autoenv/main/scripts/install.sh' | sh

# install live server and serve local build as nginx
pnpm add -g http-server && http-server dist -P "http://localhost:4200?" -p 4200

# snapshot a website
wget --recursive --no-clobber --page-requisites --html-extension --convert-links --restrict-file-names=windows --domains domain.com --no-parent https://domain.com

# generate a tree output from the root directory
find . -maxdepth 4 -path ./.nx -prune -o -path ./dist -prune -o -path ./server -prune -o -path ./apps -prune -o -path ./node_modules -prune -o -path ./.git -prune -o -type d -print | sed -e "s/[^-][^\/]*\// |/g" -e "s/|\([^ ]\)/|-\1/" > tree.txt

# zip a folder excluding certain directories
zip -r folder.zip folder -x "*node_modules*" "*/.next*" "*/.git"

# add a git submodule
git submodule add "$url" "$path"

# update all git submodules
git submodule update --init --recursive

# setup local docker registry
docker run -d -p 5000:5000 --restart=always --name registry registry:2

# run java image
docker run --rm --interactive --tty openjdk:7u211-jre-alpine java -v

# list all docker images in a table format
docker images --format "table {{.ID}}\t{{.Tag}}\t{{.Repository}}"

# list all docker containers in a table format
docker ps --format "table {{.ID}}\t{{.Image}}\t{{.Command}}\t{{.CreatedAt}}\t{{.Status}}\t{{.Ports}}\t{{.Names}}"

# generate AI context based on local files
make ai-context

#or
docker compose -f ./docker-compose.yml -f python/docker-compose.yml build service-name
docker create --name tmp-container service-name
docker cp tmp-container:/app/file.txt file.txt
docker rm tmp-container

# Convert docker-compose files to k8s deployments using konvert (k8s)
kompose convert -f ./docker-compose.yml

# Convert docker-compose files to k8s deployments using docker compose-bridge plugin (k8s)
compose-bridge convert -f ./docker-compose.yml
```

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
