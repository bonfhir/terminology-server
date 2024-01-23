#!/bin/sh
echo "Uploading definitions to '$1' (version $2) ..."
hapi-fhir-cli upload-definitions -t "$1" -v "$2"
