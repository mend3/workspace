FROM openjdk:8-jdk-alpine AS java-base
ENV CLASSPATH="$CLASSPATH:./libs/*:./config/:."
WORKDIR /usr/src/server

FROM java-base AS gameserver
EXPOSE 7777/tcp

FROM java-base AS loginserver
EXPOSE 2106/tcp
EXPOSE 9014/tcp
