#! /usr/bin/bun

import {
  type CodeSystemConfigEntry,
  readConfigFile,
  type FHIRVersion,
  FHIR_VERSIONS,
} from "./code-system-configs.js";

const TERMINOLOGIES_DATA_BASEPATH = "/terminologies/data/";

const config = await readConfigFile();

const serverUrl = config.server.url;
const codeSystems = config["code-systems"];

const versions = new Set(codeSystems.map((cs) => cs.version));
// is the HAPI server supporting multiple FHIR versions simultaneously?
for (const version of versions) {
  await uploadDefinition(serverUrl, version);
}

for (const codeSystem of codeSystems) {
  await ingestCodeSystem(serverUrl, codeSystem);
}

async function uploadDefinition(serverUrl: string, fhirVersion: FHIRVersion) {
  console.log(`Uploading definition for FHIR version ${fhirVersion}...`);
  const result = Bun.spawnSync([
    "/bonfhir/server-setup/definition-upload.sh",
    serverUrl,
    fhirVersion,
  ]);
  console.log(result.stdout.toString());
  const errors = result.stderr.toString();
  if (errors) {
    console.log("errors: ");
    console.log(errors);
  }
  return;
}

async function ingestCodeSystem(
  serverUrl: string,
  codeSystem: CodeSystemConfigEntry
) {
  console.log(
    `Ingesting code system ${codeSystem.id} version ${codeSystem.version} from ${codeSystem.source}...`
  );
  const dataSource = codeSystem.source;
  const dataType = codeSystem.id;
  const dataVersion = codeSystem.version;

  const result = Bun.spawnSync([
    "/bonfhir/server-setup/terminology-upload.sh",
    serverUrl,
    dataType,
    dataVersion,
    TERMINOLOGIES_DATA_BASEPATH + dataSource,
  ]);
  console.log(result.stdout.toString());
  const errors = result.stderr.toString();
  if (errors) {
    console.log("errors: ");
    console.log(errors);
  }
  return;
}
