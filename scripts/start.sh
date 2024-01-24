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
docker exec -it $NAME scripts/upload-definitions.sh \
    "$URL" \
    "$VERSION"

# import SNOMED CT
if [ ! -e "configs/SNOMED" ]; then
    docker exec -it $NAME scripts/import.sh \
        terminologies/data/SnomedCT_ManagedServiceUS_PRODUCTION_US1000124_20230901T120000Z.zip \
        "$VERSION" \
        $URL \
        "http://snomed.info/sct" && touch configs/SNOMED
fi

# import LOINC
if [ ! -e "configs/LOINC" ]; then
    docker exec -it $NAME scripts/import.sh \
        terminologies/data/Loinc_2.72.zip \
        "$VERSION" \
        $URL \
        "http://loinc.org" && touch configs/LOINC
fi

# import ICD-10
if [ ! -e "configs/ICD-10" ]; then
    docker exec -it $NAME scripts/import.sh \
        "terminologies/data/icdClaML2019ens.zip" \
        "$VERSION" \
        $URL \
        "http://hl7.org/fhir/sid/icd-10" && touch configs/ICD-10
fi

# import ICD-10-CM
if [ ! -e "configs/ICD-10-CM" ]; then
    docker exec -it $NAME scripts/import.sh \
        "terminologies/data/icd10cm_tabular_2021.xml" \
        "$VERSION" \
        $URL \
        "http://hl7.org/fhir/sid/icd-10-cm" && touch configs/ICD-10-CM
fi
