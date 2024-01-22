#!/bin/sh
hapi-fhir-cli upload-terminology \
    -d data/Loinc_2.76.zip \
    -v r4 \
    -t "http://localhost:8080/fhir" \
    -u "http://loinc.org"
