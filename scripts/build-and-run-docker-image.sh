#!/bin/bash
docker image build "$(pwd)" -t bonfhir/terminology-server:temp
docker run --rm -it bonfhir/terminology-server:temp