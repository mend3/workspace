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

