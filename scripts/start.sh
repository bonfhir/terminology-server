#!/bin/sh
TARGET=terminology-server:latest
NAME=terminology-server
VERSION=r4
URL="http://localhost:8080/fhir"

# Build the image if it does not exist
if [ -z "$(docker images -q $TARGET 2>/dev/null)" ]; then
    docker build -t $TARGET .
fi

# Create the container if it is not running
if [ -z "$(docker ps -q -f name=$NAME 2>/dev/null)" ]; then
    docker run -it -d \
        -p 8080:8080 \
        -v "$(pwd)/scripts:/scripts" \
        -v "$(pwd)/configs:/configs" \
        -v "$(pwd)/terminologies/data:/terminologies/data" \
        -e "--spring.config.location=file:///configs/application.yml" \
        --name $NAME $TARGET
fi

# Start the container
echo "Starting container '$NAME' ..."
docker start $NAME

# wait for the container to become ready
echo "Waiting for container '$NAME' to become ready ..."
# shellcheck disable=SC2091
until $(curl --output /dev/null -X "GET" -H "accept: application/fhir+json" --silent --fail "$URL/metadata"); do
    printf '.'
    sleep 5
done

# import definitions
if [ ! -e "configs/DEFINITIONS" ]; then
    docker exec -it $NAME scripts/upload-definitions.sh \
        "$URL" \
        "$VERSION" && touch configs/DEFINITIONS
fi
