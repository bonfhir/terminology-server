#!/bin/bash

VERSION=$(cat $(pwd)/VERSION)
echo "Building version $VERSION"
docker image build "$(pwd)" -t bonfhir/terminology-server:$VERSION -t bonfhir/terminology-server:latest