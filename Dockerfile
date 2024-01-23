FROM hapiproject/hapi:latest-tomcat

EXPOSE 8080

COPY scripts /scripts

# TODO: no download utilities in the base image
# NOTE: cannot install with apt
# RUN apt-get update && apt-get install -y curl unzip
# RUN wget https://github.com/hapifhir/hapi-fhir/releases/download/v6.10.3/hapi-fhir-6.10.3-cli.zip -O hapi-fhir-cli.zip
# RUN curl -L https://github.com/hapifhir/hapi-fhir/releases/download/v6.10.3/hapi-fhir-6.10.3-cli.zip -o hapi-fhir-cli.zip
# RUN mkdir -p /bin
# RUN unzip hapi-fhir-cli.zip -d /bin/hapi-fhir-cli
# ENV PATH="${PATH}:/bin"

