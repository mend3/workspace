# install live server
pnpm add -g http-server

# serve local build as nginx
http-server dist/app -P "http://localhost:4200?" -p 4200

# setup local docker registry
docker run -d -p 5000:5000 --restart=always --name registry registry:2

# run java image
docker run --rm --interactive --tty openjdk:7u211-jre-alpine java -v

# snapshot a website
wget --recursive --no-clobber --page-requisites --html-extension --convert-links --restrict-file-names=windows --domains domain.com --no-parent https://domain.com

# generate a tree output from the root directory
find . -maxdepth 4 -path ./.nx -prune -o -path ./dist -prune -o -path ./server -prune -o -path ./apps -prune -o -path ./node_modules -prune -o -path ./.git -prune -o -type d -print | sed -e "s/[^-][^\/]*\// |/g" -e "s/|\([^ ]\)/|-\1/" > tree.txt

# list all docker images in a table format
docker images --format "table {{.ID}}\t{{.Tag}}\t{{.Repository}}"

# list all docker containers in a table format
docker ps --format "table {{.ID}}\t{{.Image}}\t{{.Command}}\t{{.CreatedAt}}\t{{.Status}}\t{{.Ports}}\t{{.Names}}"

# zip a folder excluding certain directories
zip -r folder.zip folder -x "*node_modules*" "*/.next*" "*/.git"
