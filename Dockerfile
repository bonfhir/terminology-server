# syntax=docker/dockerfile:1

FROM debian:bookworm-slim AS build-bonfhir

RUN apt-get update && apt-get upgrade && apt-get install -y curl unzip
RUN mkdir -p /usr/src/hapi-fhir-cli \
  && curl -SL https://github.com/hapifhir/hapi-fhir/releases/download/v6.10.3/hapi-fhir-6.10.3-cli.zip -o hapi-fhir-6.10.3-cli.zip \
  && unzip -q hapi-fhir-6.10.3-cli.zip -d /usr/src/hapi-fhir-cli

COPY <<EOF /bin/app.sh
#!/bin/bash
# This script is run when the container starts
# It is used to start the application
# the code system bootstrap script should be added around here
/bonfhir/scripts/ingest-code-systems &

cd /app && java --class-path /app/main.war -Dloader.path="main.war!/WEB-INF/classes/,main.war!/WEB-INF/,/app/extra-classes" org.springframework.boot.loader.PropertiesLauncher
EOF

FROM oven/bun AS bun
FROM hapiproject/hapi:latest AS hapi-distroless
FROM hapiproject/hapi:latest-tomcat AS bonfhir-hapi

USER root
RUN apt update && apt install -y curl libncurses5-dev  # libncurses5-dev for tput

COPY --from=build-bonfhir --chown=1001:1001 /usr/src/hapi-fhir-cli /usr/bin/

COPY --from=build-bonfhir --chown=1001:1001 /bin/app.sh /bin/
RUN chmod a+x /bin/app.sh

COPY --chown=1001:1001 --from=hapi-distroless /app /app

COPY --from=bun --chown=1001:1001 /usr/local/bin/bun /usr/bin/
ADD --chown=1001:1001 ./scripts /bonfhir/scripts/
RUN cd /bonfhir/scripts && bun install

USER 1001
ENV SPRING_CONFIG_LOCATION=file:///configs/application.yml

ENTRYPOINT [ "/bin/bash" ]