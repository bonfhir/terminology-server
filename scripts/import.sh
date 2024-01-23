#!/bin/sh
echo "Uploading terminology '$4' from source '$1' into '$3' (version '$2') ..."
hapi-fhir-cli upload-terminology -d "$1" -v "$2" -t "$3" -u "$4"
