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
docker start $NAME

# TODO: wait for the container to become ready
sleep 10

# import definitions
docker exec -it $NAME scripts/upload-definitions.sh "$URL" "$VERSION"

# import terminologies
# TODO: check if enabled in code-systems.yml
docker exec -it $NAME scripts/import-icd10-cm.sh
docker exec -it $NAME scripts/import-icd10.sh
docker exec -it $NAME scripts/import-loinc.sh
docker exec -it $NAME scripts/import-snomed.sh
