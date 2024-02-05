## Running the development Docker

### download & mount code system sources

_mounts/terminologies/icd10cm-tabular-2023.xml_

### declare your code systems

- `id`: the code-system identifier
- `version`: code system FHIR version
- `source`: the mounted code-system source file

_mounts/configs/code-systems.yml_
```
server:
  url: http://localhost:8080/fhir
code-systems:
  - id: http://hl7.org/fhir/sid/icd-10-cm
    version: r4
    source: icd10cm-tabular-2023.xml
```

### build & run the docker image

`./build-and-run-docker-image.sh`

## Running HAPI server from source

### Install prerequisites

```
brew install maven
```

### Clone the Starter project

```
git clone git@github.com:hapifhir/hapi-fhir-jpaserver-starter.git
```

### Run the HAPI server using Jetty

```
cd hapi-fhir-jpaserver-starter
mvn -Pjetty jetty:run
```
