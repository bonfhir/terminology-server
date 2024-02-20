import { $ } from "bun";

import { type ConfigTaskEntry, type ConfigServer } from "./configs.js";

const TERMINOLOGIES_DATA_BASEPATH = "/terminologies/data/";

const handlers = {
  "upload-definitions": async (
    server: ConfigServer,
    _task: ConfigTaskEntry
  ) => {
    console.log(
      `📤 Uploading definition for FHIR version ${server.version}...`
    );
    const { stdout, stderr, exitCode } =
      await $`hapi-fhir-cli upload-definitions -t "${server.url}" -v "${server.version}"`;

    logResults(stdout, stderr, exitCode);
  },

  "upload-terminology": async (server: ConfigServer, task: ConfigTaskEntry) => {
    console.log(
      `📤 Ingesting code system ${task.id} version ${server.version} from ${task.source}...`
    );
    const dataSource = task.source;
    const dataType = task.id;
    const dataVersion = server.version;

    const { stdout, stderr, exitCode } =
      await $`hapi-fhir-cli upload-terminology -d "${TERMINOLOGIES_DATA_BASEPATH}${dataSource}" -v "${dataVersion}" -t "${server.url}" -u "${dataType}"`;

    logResults(stdout, stderr, exitCode);
  },
};

export async function handleTask(server: ConfigServer, task: ConfigTaskEntry) {
  console.log(`▶️ Handling task of type ${task.type}...`);
  const handler = handlers[task.type];
  if (handler) {
    return handler(server, task);
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
