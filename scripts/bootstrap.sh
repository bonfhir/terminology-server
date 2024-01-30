#!/bin/sh

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
URL="http://localhost:8080/fhir"  # should be provided by configuration
FHIR_VERSION="r4"

# wait for the web server to become ready
$DIR/ready.sh "$URL"

# import definitions
$DIR/upload-definitions.sh "$URL" "$FHIR_VERSION"

# import code systems
$DIR/ingest-code-systems