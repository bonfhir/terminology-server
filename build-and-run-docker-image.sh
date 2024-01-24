#!/bin/bash
docker run --rm -it $(docker image build -q - < Dockerfile)