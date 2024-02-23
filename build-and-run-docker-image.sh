#!/bin/bash
docker image build "$(pwd)" -t bonfhir/terminology-server:temp
docker run --rm -it \
  -p 8080:8080 \
  -p 9001:9001 \
  -v "$(pwd)/mounts/configs:/configs" \
  -v "$(pwd)/mounts/terminologies/data:/terminologies/data" \
  bonfhir/terminology-server:temp
