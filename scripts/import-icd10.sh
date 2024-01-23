#!/bin/sh
VERSION=r4
DATA="terminologies/data/icdClaML2019ens.zip"
TARGET="http://localhost:8080/fhir"
URL="http://hl7.org/fhir/sid/icd-10"

scripts/import.sh $DATA $VERSION $TARGET $URL
