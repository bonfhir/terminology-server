import { $ } from "bun";

import { type ConfigTaskEntry, type ServerConfig } from "./configs";
import {
  createApplicationImportAuditEvent,
  isTerminologySourceImported,
} from "./audit-event-functions";
import { customLoaders } from "./custom-loaders";
import { exit } from "process";

const TERMINOLOGIES_DATA_BASEPATH = "/terminologies/data/";

const NATIVE_TERMINOLOGIES = [
  "http://snomed.info/sct",
  "http://loinc.org",
  "http://hl7.org/fhir/sid/icd-10-cm",
];

export type Outcome = "0" | "8";
interface Handler {
  server: ServerConfig;
  task: ConfigTaskEntry;
}

const handlers = {
  "upload-definitions": async ({ server }: Handler) => {
    console.log(
      `📤 Uploading definition for FHIR version ${server.version}...`
    );

    if (
      await isTerminologySourceImported(server.url, {
        source: "definitions",
        system: "definitions",
        version: "r4",
      })
    ) {
      console.log(
        `ℹ️ definitions for FHIR version ${server.version} already ingested`
      );
      return;
    }

    const { stdout, stderr, exitCode } =
      await $`hapi-fhir-cli upload-definitions -t "${server.url}" -v "${server.version}"`;

    logResults(stdout, stderr, exitCode);

    createApplicationImportAuditEvent(
      server.url,
      {
        source: "definitions",
        system: "definitions",
        version: "r4",
      },
      exitCode === 0 ? "0" : "8"
    );
  },

  "upload-terminology": async ({ server, task }: Handler) => {
    console.log(
      `📤 Ingesting code system ${task.system} version ${server.version} from ${task.source}...`
    );

    if (
      await isTerminologySourceImported(server.url, {
        source: task.source,
        system: task.system,
        version: server.version,
      })
    ) {
      console.log(
        `ℹ️ Code system ${task.system} version ${server.version} from ${task.source} already ingested`
      );
      return;
    }

    let exitCode: number;
    if (isNativeTerminology(task.system)) {
      exitCode = await ingestNativeTerminology(server, task);
    } else {
      const loader = getCustomTerminology(task.system);

      if (!loader) {
        console.log(`⛔ No loader found for ${task.system}`);
        exitCode = 8;
      } else exitCode = Number(await loader.uploadTerminology(server, task));
    }

    createApplicationImportAuditEvent(
      server.url,
      {
        source: task.source,
        system: task.system,
        version: server.version,
      },
      exitCode === 0 ? "0" : "8"
    );
  },
};

export async function handleTask(server: ServerConfig, task: ConfigTaskEntry) {
  console.log(`▶️ Handling task of type ${task.type}...`);
  const handler = handlers[task.type];

  if (handler) {
    return handler({ server, task });
  }
  console.log(`⛔ No handler for task type ${task.type}`);
}

function logResults(stdout: Buffer, stderr: Buffer, exitCode: number) {
  if (exitCode !== 0) {
    console.log("🦺 exitCode: ");
    console.log(exitCode);

    console.log("🚨 errors: ");
    console.log(stderr.toString());
  } else {
    console.log("✅ Uploaded definitions");
    console.log(stdout.toString());
  }
}

function isNativeTerminology(system: string) {
  return NATIVE_TERMINOLOGIES.includes(system);
}

async function ingestNativeTerminology(
  server: ServerConfig,
  task: ConfigTaskEntry
) {
  const { stdout, stderr, exitCode } =
    await $`hapi-fhir-cli upload-terminology -d "${TERMINOLOGIES_DATA_BASEPATH}${task.source}" -v "${server.version}" -t "${server.url}" -u "${task.system}"`;
  logResults(stdout, stderr, exitCode);

  return exitCode;
}

function getCustomTerminology(system: string) {
  return customLoaders.find((loader) => loader.system === system);
}
