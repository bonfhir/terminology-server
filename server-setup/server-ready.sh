#!/bin/bash
# shellcheck disable=SC2091
until $(curl --output /dev/null -X "GET" -H "accept: application/fhir+json" --silent --fail "$1/metadata"); do
    echo "[bonfhir] Waiting for web server to become ready ..."
    sleep 5
done

echo "Web server is ready."
exit 0
