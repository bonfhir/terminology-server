import { $ } from "bun";
import { type ConfigTaskEntry, type ConfigServer } from "./configs";
import { logResults } from "./utils";
import {
  createApplicationImportAuditEvent,
  isTerminologySourceImported,
} from "./audit-event-functions";
import type { Plugin } from "./terminology-plugin";
import { plugins } from "./terminology-plugin";
import type { AuditEventOutcome } from "@bonfhir/core/r4b";

const TERMINOLOGIES_DATA_BASEPATH = "/terminologies/data/";

interface Handler {
  server: ConfigServer;
  task: ConfigTaskEntry;
  plugin?: Plugin;
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

  "upload-terminology": async ({ server, task, plugin }: Handler) => {
    console.log(
      `📤 Ingesting code system ${task.id} version ${server.version} from ${task.source}...`
    );

    const dataSource = task.source;
    const dataType = task.id;
    const dataVersion = server.version;

    let outcome: AuditEventOutcome = "0";
    if (
      await isTerminologySourceImported(server.url, {
        source: dataSource,
        system: dataType,
        version: dataVersion,
      })
    ) {
      console.log(
        `ℹ️ Code system ${task.id} version ${server.version} from ${task.source} already ingested`
      );
      return;
    }

    try {
      if (plugin) {
        await plugin.uploadTerminology(server, task);
      } else {
        const { stdout, stderr, exitCode } =
          await $`hapi-fhir-cli upload-terminology -d "${TERMINOLOGIES_DATA_BASEPATH}${dataSource}" -v "${dataVersion}" -t "${server.url}" -u "${dataType}"`;
        logResults(stdout, stderr, exitCode);
      }
    } catch (e) {
      console.error(e);
      outcome = "8";
    } finally {
      await createApplicationImportAuditEvent(
        server.url,
        {
          source: dataSource,
          system: dataType,
          version: dataVersion,
        },
        outcome
      );
    }
  },
};

export async function handleTask(server: ConfigServer, task: ConfigTaskEntry) {
  console.log(`▶️ Handling task of type ${task.type}...`);
  const handler = handlers[task.type];
  const plugin = plugins.find((p) => p.name === task.plugin);

  if (handler) {
    return handler({ server, task, plugin });
  }
  console.log(`⛔ No handler for task type ${task.type}`);
}
