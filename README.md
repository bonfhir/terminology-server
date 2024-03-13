## Running the development Docker

### download & mount code system sources

_mounts/terminologies/data/icd10cm-tabular-2023.xml_

### declare your code systems

- `id`: the code-system identifier
- `type`: upload-terminology
- `source`: the mounted code-system source file
- `plugin`: the plugin module to use for processing the code-system (optional)

_mounts/configs/bonfhir-hapi.yml_

```yml
server:
  url: http://localhost:8080/fhir
  version: r4
tasks:
  - type: upload-definitions
  - type: upload-terminology
    id: http://hl7.org/fhir/sid/icd-10-cm
    source: icd10cm-tabular-2023.xml
```

_when uploading terminologies, make sure to precede them with a 'upload-definitions' task like in the above example, which prepares the server with the required code definitions_

### build & run the docker image

```sh
./build-and-run-docker-image.sh
```

## Running HAPI server from source

### Install prerequisites

```sh
brew install maven
```

### Clone the Starter project

```sh
git clone git@github.com:hapifhir/hapi-fhir-jpaserver-starter.git
```

### Run the HAPI server using Jetty

```sh
cd hapi-fhir-jpaserver-starter
mvn -Pjetty jetty:run
```

## Integrating custom terminologies

Add a new `upload-terminology` task to the `bonfhir-hapi.yml` configuration file, specifying the `id` of the terminology, the `source` file, and the `plugin` pointing to the module to use for processing the terminology.

```yml
- type: upload-terminology
    id: http://www.nlm.nih.gov/research/umls/rxnorm
    source: RxNorm_full_03042024.zip
    plugin: rxnorm
```

Create a new plugin package for your plugin. You can copy the rxnorm or CPT/HCPCS plugin as base.

```yml
- type: upload-terminology
    id: https://www.cms.gov/Medicare/Coding/HCPCSReleaseCodeSets
    source: 2024_DHS_Code_List_Addendum_03_01_2024.zip
    plugin: cpt-hcpcs
```
