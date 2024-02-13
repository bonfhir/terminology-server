import { $ } from "bun";

import { type ConfigTaskEntry, type ConfigServer } from "./configs.js";

const TERMINOLOGIES_DATA_BASEPATH = "/terminologies/data/";

const handlers = {
  "upload-definitions": async (
    server: ConfigServer,
    _task: ConfigTaskEntry
  ) => {
    console.log(`Uploading definition for FHIR version ${server.version}...`);
    const { stdout, stderr, exitCode } =
      await $`hapi-fhir-cli upload-definitions -t "${server.url}" -v "${server.version}"`;
    console.log(stdout);
    if (stderr) {
      console.log("errors: ");
      console.log(stderr);
    }
    if (exitCode !== 0) {
      console.log("exitCode: ");
      console.log(exitCode);
    }
    return;
  },

  "upload-terminology": async (server: ConfigServer, task: ConfigTaskEntry) => {
    console.log(
      `Ingesting code system ${task.id} version ${server.version} from ${task.source}...`
    );
    const dataSource = task.source;
    const dataType = task.id;
    const dataVersion = server.version;

    const result = Bun.spawnSync([
      "/bonfhir/server-setup/terminology-upload.sh",
      server.url,
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
  },
};

export async function handleTask(server: ConfigServer, task: ConfigTaskEntry) {
  console.log(`Handling task of type ${task.type}...`);
  const handler = handlers[task.type];
  if (handler) {
    return handler(server, task);
  }
  console.log(`No handler for task type ${task.type}`);
}
