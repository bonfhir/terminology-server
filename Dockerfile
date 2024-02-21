# syntax=docker/dockerfile:1

FROM --platform=$BUILDPLATFORM debian:bookworm-slim AS build-bonfhir

RUN apt-get update && apt-get upgrade && apt-get install -y curl unzip
RUN mkdir -p /usr/src/hapi-fhir-cli \
  && curl -SL https://github.com/hapifhir/hapi-fhir/releases/download/v6.10.3/hapi-fhir-6.10.3-cli.zip -o hapi-fhir-6.10.3-cli.zip \
  && unzip -q hapi-fhir-6.10.3-cli.zip -d /usr/src/hapi-fhir-cli

FROM --platform=$BUILDPLATFORM oven/bun AS bun
FROM --platform=$BUILDPLATFORM hapiproject/hapi:latest AS hapi-distroless
FROM --platform=$BUILDPLATFORM hapiproject/hapi:latest-tomcat AS bonfhir-hapi

USER root
RUN groupadd -g 1001 bonfhir
RUN useradd -u 1001 -g 1001 -s /bin/bash bonfhir

RUN mkdir /bitnami/tomcat/webapps/target && chown -R 1001:1001 /bitnami/tomcat/webapps/target

RUN apt update && apt install -y curl libncurses5-dev supervisor  # libncurses5-dev for tput

RUN mkdir -p /var/log/supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

COPY --chown=1001:1001 --from=build-bonfhir /usr/src/hapi-fhir-cli /usr/bin/
COPY --chown=1001:1001 --from=hapi-distroless /app /app

COPY --chown=1001:1001 --from=bun  /usr/local/bin/bun /usr/bin/
ADD --chown=1001:1001 ./server-setup /bonfhir/server-setup/

USER bonfhir
RUN cd /bonfhir/server-setup && bun install

USER root

ENTRYPOINT [ "/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]