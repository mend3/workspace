# Internal Notes

## Utils

- [Ctop](https://github.com/bcicen/ctop)
- [Awesome Docker](https://github.com/veggiemonk/awesome-docker/blob/master/README.md)
- [Lazy Docker](https://github.com/jesseduffield/lazydocker#installation)

## MySQL

Grant privileves to a user:

```bash
GRANT ALL PRIVILEGES ON *.* TO '$MYSQL_USER$'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```


## Cuda WSL

[Install on WSL](https://docs.nvidia.com/cuda/wsl-user-guide/index.html#installing-docker)

[Nvidia Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html#installing-the-nvidia-container-toolkit)


## Shell Scripts

```bash

# install and enable autoenv
curl -#fLo- 'https://raw.githubusercontent.com/hyperupcall/autoenv/main/scripts/install.sh' | sh

# install live server
pnpm add -g http-server

# serve local build as nginx
http-server dist/app -P "http://localhost:4200?" -p 4200

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

# check gpu compatibility on docker
docker run --rm --runtime=nvidia --gpus all ubuntu nvidia-smi

# setup local docker registry
docker run -d -p 5000:5000 --restart=always --name registry registry:2

# run java image
docker run --rm --interactive --tty openjdk:7u211-jre-alpine java -v

# list all docker images in a table format
docker images --format "table {{.ID}}\t{{.Tag}}\t{{.Repository}}"

# list all docker containers in a table format
docker ps --format "table {{.ID}}\t{{.Image}}\t{{.Command}}\t{{.CreatedAt}}\t{{.Status}}\t{{.Ports}}\t{{.Names}}"

# generate AI context based on local files
docker compose -f docker-compose.yml -f tools/docker-compose.yml up ai-context

#or
docker compose -f ./docker-compose.yml -f tools/docker-compose.yml build ai-context
docker create --name context-container ai-context 
docker cp context-container:/app/.cache/output.txt .cache/output.txt
docker rm context-container

# Convert docker-compose files to k8s deployments using konvert (k8s)
kompose convert -f ./docker-compose.yml

# Convert docker-compose files to k8s deployments using docker compose-bridge plugin (k8s)
compose-bridge convert -f ./docker-compose.yml
```

## Utils and extras

### zsh

https://gist.github.com/n1snt/454b879b8f0b7995740ae04c5fb5b7df

### nvm-auto-use

https://github.com/Sparragus/zsh-auto-nvm-use

### fzf-tab

https://gist.github.com/seungjulee/d72883c193ac630aac77e0602cb18270

### PowerLine Fonts

[Official Repository](https://github.com/powerline/fonts?tab=readme-ov-file)

