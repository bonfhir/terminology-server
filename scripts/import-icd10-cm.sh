#!/bin/sh
VERSION=r4
DATA="terminologies/data/icd10cm_tabular_2021.xml"
TARGET="http://localhost:8080/fhir"
URL="http://hl7.org/fhir/sid/icd-10-cm"

scripts/import.sh $DATA $VERSION $TARGET $URL
