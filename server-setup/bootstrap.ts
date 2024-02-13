#! /usr/bin/bun

import { readConfigFile } from "./configs.js";
import { handleTask } from "./tasks-handlers.js";

const config = await readConfigFile();

const serverUrl = config.server.url;
const tasks = config.tasks;

await serverIsReady(serverUrl);
console.log("Server is ready!");

for (const task of tasks) {
  await handleTask(config.server, task);
}

async function serverIsReady(serverUrl: string) {
  while (true) {
    try {
      const response = await Bun.fetch(serverUrl + "/metadata", {
        headers: { accept: "application/fhir+json" },
      });
      if (response.ok) {
        return;
      }
    } catch (error) {
      console.log("Server not ready yet, retrying in 5 seconds...");
      await Bun.sleep(5000);
    }
  }
}
