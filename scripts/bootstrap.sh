#!/bin/sh

# wait for the web server to become ready
scripts/ready.sh "$1"

# import definitions
scripts/upload-definitions.sh "$1" "$2" 

# import SNOMED
scripts/import.sh "terminologies/data/SnomedCT_ManagedServiceUS_PRODUCTION_US1000124_20230901T120000Z.zip" "$1" "$2" "http://snomed.info/sct"

# import LOINC
scripts/import.sh "terminologies/data/Loinc_2.72.zip" "$1" "$2" "http://loinc.org"

# import ICD-10-CM
scripts/import.sh "terminologies/data/icd10cm-tabular-April-2024.xml" "$1" "$2" "http://hl7.org/fhir/sid/icd-10-cm"