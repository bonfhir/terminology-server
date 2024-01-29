#!/bin/sh
lock=$(md5sum $1 | awk '{ print $1 }')
if [ ! -e "configs/$lock" ]; then
    echo "Uploading terminology '$4' from source '$1' into '$2' (version '$3') ..."
    hapi-fhir-cli upload-terminology -d "$1" -v "$3" -t "$2" -u "$4" && touch "configs/$lock"
fi
