## using Loinc v 2.72,
## breaking changes in v 2.73
## MultiAxialHierarchy/ becomes ComponentHierarchyBySystem/
hapi-fhir-cli upload-terminology -d data/Loinc_2.72.zip -v r4 -t "http://localhost:8080/fhir" -u "http://loinc.org"