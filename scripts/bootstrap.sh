#!/bin/sh

# wait for the web server to become ready
echo "Waiting for web server to become ready ..."
# shellcheck disable=SC2091
# until $(curl --output /dev/null -X "GET" -H "accept: application/fhir+json" --silent --fail "$URL/metadata"); do
#     printf '.'
#     sleep 5
# done
sleep 10

# import definitions
if [ ! -e "configs/DEFINITIONS" ]; then
    scripts/upload-definitions.sh \
        "$1" \
        "$2" && touch configs/DEFINITIONS
fi
