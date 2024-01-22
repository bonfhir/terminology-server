#!/bin/sh
hapi-fhir-cli upload-terminology \
    -d data/icd10cm-tabular-2023.xml \
    -v r4 \
    -t "http://localhost:8080/fhir" \
    -u "http://hl7.org/fhir/sid/icd-10-cm"
