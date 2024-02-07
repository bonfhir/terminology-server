#!/bin/sh

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
URL=$($DIR/get-server-url.ts)

# wait for the web server to become ready
$DIR/server-ready.sh "$URL"

# setup hapi server with code systems & definitions
$DIR/setup-terminologies.ts