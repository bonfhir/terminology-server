import { $ } from "bun";

import { type ConfigTaskEntry, type ConfigServer } from "./configs.js";
import {
  createApplicationImportAuditEvent,
  isTerminologySourceImported,
} from "./audit-event-functions.js";
import { RxNormPlugin } from "../plugins/rxnorm/index.js";
import { CPTHCPCSPlugin } from "../plugins/cpt-hcpcs/index.js";

const TERMINOLOGIES_DATA_BASEPATH = "/terminologies/data/";

export type Outcome = "0" | "8";

// TODO: proper plugin system
interface Plugin {
  name: string;

  uploadTerminology: (
    server: ConfigServer,
    task: ConfigTaskEntry
  ) => Promise<Outcome>;
}
// TODO: autoload /plugins ?
const plugins: Plugin[] = [new RxNormPlugin(), new CPTHCPCSPlugin()];

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

  "upload-terminology": async ({ server, task }: Handler) => {
    console.log(
      `📤 Ingesting code system ${task.id} version ${server.version} from ${task.source}...`
    );

    const dataSource = task.source;
    const dataType = task.id;
    const dataVersion = server.version;

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

    const { stdout, stderr, exitCode } =
      await $`hapi-fhir-cli upload-terminology -d "${TERMINOLOGIES_DATA_BASEPATH}${dataSource}" -v "${dataVersion}" -t "${server.url}" -u "${dataType}"`;
    logResults(stdout, stderr, exitCode);

    createApplicationImportAuditEvent(
      server.url,
      {
        source: dataSource,
        system: dataType,
        version: dataVersion,
      },
      exitCode === 0 ? "0" : "8"
    );
  },

  "upload-terminology-plugin": async ({ server, task, plugin }: Handler) => {
    console.log(
      `📤 Ingesting code system ${task.id} version ${server.version} from ${task.source}...`
    );

    const dataSource = task.source;
    const dataType = task.id;
    const dataVersion = server.version;

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

    const exitCode = (await plugin?.uploadTerminology(server, task)) ?? "8";

    createApplicationImportAuditEvent(
      server.url,
      {
        source: dataSource,
        system: dataType,
        version: dataVersion,
      },
      exitCode
    );
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
