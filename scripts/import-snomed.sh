#!/bin/sh
DATA=terminologies/data/SnomedCT_ManagedServiceUS_PRODUCTION_US1000124_20230901T120000Z.zip
VERSION=r4
TARGET=http://localhost:8080/fhir
URL=http://snomed.info/sct

scripts/import.sh $DATA $VERSION $TARGET $URL
