#!/bin/sh
TARGET=hapiproject/hapi:latest # hapiproject/hapi:latest-tomcat
NAME=test-hapi-srv             # test-hapi-srv-tomcat

# Pull the image if it does not exist
if [ -z "$(docker images -q $TARGET 2>/dev/null)" ]; then
    docker pull $TARGET
fi

# Start the container if it is not running
docker start $NAME ||
    docker run -p 8080:8080 \
        -v "$(pwd)/configs:/configs" \
        -e "--spring.config.location=file:///configs/application.yml" \
        --name $NAME $TARGET
