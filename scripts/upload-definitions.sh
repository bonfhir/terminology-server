#!/bin/sh
if [ ! -e "configs/DEFINITIONS" ]; then
    echo "Uploading definitions to '$1' (version $2) ..."
    hapi-fhir-cli upload-definitions -t "$1" -v "$2" && touch configs/DEFINITIONS
fi