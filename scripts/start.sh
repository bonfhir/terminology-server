#!/bin/sh
TARGET=terminology-server:latest
NAME=terminology-server

# Build the image if it does not exist
if [ -z "$(docker images -q $TARGET 2>/dev/null)" ]; then
    docker build -t $TARGET .
fi

# Create the container if it is not running
if [ -z "$(docker ps -q -f name=$NAME 2>/dev/null)" ]; then
    docker run -it -d \
        -p 8080:8080 \
        -v "$(pwd)/mounts/configs:/configs" \
        -v "$(pwd)/mounts/terminologies/data:/terminologies/data" \
        --name $NAME $TARGET
fi

# Start the container
echo "Starting container '$NAME' ..."
docker start $NAME
