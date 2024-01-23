#!/bin/sh
DATA=terminologies/data/Loinc_2.72.zip
VERSION=r4
TARGET="http://localhost:8080/fhir"
URL="http://loinc.org"

scripts/import.sh $DATA $VERSION $TARGET $URL
