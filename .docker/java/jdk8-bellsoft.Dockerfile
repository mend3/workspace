FROM ubuntu:latest

RUN apt-get update && \
    apt-get install -y wget --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

RUN wget --no-check-certificate https://download.bell-sw.com/java/8u452+11/bellsoft-jdk8u452+11-linux-amd64.tar.gz && \
    mkdir -p /opt && \
    tar -xzf bellsoft-jdk8u452+11-linux-amd64.tar.gz -C /opt && \
    rm bellsoft-jdk8u452+11-linux-amd64.tar.gz

# Set environment variables
ENV JAVA_HOME=/opt/jdk8u452
ENV PATH="$JAVA_HOME/bin:$PATH"
ENV CLASSPATH="$CLASSPATH:./libs/*:./config/:."

WORKDIR /app

CMD ["java", "-version"]
