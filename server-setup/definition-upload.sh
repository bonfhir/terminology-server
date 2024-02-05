#!/bin/sh
if [ ! -e "/configs/digests/DEFINITIONS-$2" ]; then
    echo "Uploading definitions to '$1' (version $2) ..."
    hapi-fhir-cli upload-definitions -t "$1" -v "$2" && touch "/configs/digests/DEFINITIONS-$2"
else
    echo "Definitions already uploaded to '$1' (version $2)."
fi