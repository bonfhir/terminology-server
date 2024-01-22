#!/bin/sh
VERSION=r4
TARGET="http://localhost:8080/fhir"

hapi-fhir-cli upload-definitions \
    -t $TARGET \
    -v $VERSION
