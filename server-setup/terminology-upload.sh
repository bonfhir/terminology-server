#!/bin/sh
SERVER_URL=$1
DATA_TYPE=$2
DATA_VERSION=$3
DATA_SOURCE=$4

digest=$(md5sum $DATA_SOURCE | awk '{ print $1 }')
if [ ! -e "/configs/digests/$digest" ]; then
    echo "Uploading terminology '$DATA_TYPE' from source '$DATA_SOURCE' into '$SERVER_URL' (version '$DATA_VERSION') ..."
    hapi-fhir-cli upload-terminology -d "$DATA_SOURCE" -v "$DATA_VERSION" -t "$SERVER_URL" -u "$DATA_TYPE" && touch "/configs/digests/$digest"
else
    echo "Terminology '$DATA_TYPE' from source '$DATA_SOURCE' into '$SERVER_URL' (version '$DATA_VERSION') already uploaded."
fi
