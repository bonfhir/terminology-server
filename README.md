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
