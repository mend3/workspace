FROM nginx:1.19.6-alpine AS builder
ENV NGINX_VERSION=${NGINX_VERSION}

FROM builder AS nginx-certs
RUN apk add --no-cache --virtual .build-deps openssl openssl-dev
RUN openssl req -x509 -nodes -days 365 \
  -subj "/C=BR/ST=sws/L=SWS/O=sws/OU=sws/CN=sws" \
  -newkey rsa:2048 -keyout /etc/ssl/private/selfsigned.key \
  -out /etc/ssl/certs/selfsigned.crt
# RUN openssl req -new -nodes -out server.csr -newkey rsa:2048 -keyout /etc/ssl/private/selfsigned.key -config /usr/share/cert/csr.conf
# RUN openssl x509 -req -in server.csr -signkey /etc/ssl/private/selfsigned.key -out /etc/ssl/certs/selfsigned.crt -days 365 -extfile /usr/share/cert/cert.conf
RUN openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048

FROM builder AS nginx
ARG APP
ARG NODE_VERSION
WORKDIR /usr/share/nginx/html
COPY --from=nginx-certs /etc/ssl/private/selfsigned.key /etc/ssl/private/selfsigned.key
COPY --from=nginx-certs /etc/ssl/certs/ /etc/ssl/certs/

FROM builder AS cdn
WORKDIR /usr/share/nginx/cdn
