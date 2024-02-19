#! /usr/bin/bun

import { readConfigFile } from "./configs.js";
import { handleTask } from "./tasks-handlers.js";

const config = await readConfigFile();

const serverUrl = config.server.url;
const tasks = config.tasks;

await serverIsReady(serverUrl);

for (const task of tasks) {
  await handleTask(config.server, task);
}

async function serverIsReady(serverUrl: string) {
  while (true) {
    try {
      const response = await fetch(serverUrl + "/metadata", {
        headers: { accept: "application/fhir+json" },
      });
      if (response.ok) {
        console.log("\n🏁 Server is ready! 🏁\n");
        return;
      }
    } catch (error) {
      console.log("\n⏳ Server not ready yet, retrying in 5 seconds...\n");
      await Bun.sleep(5000);
    }
  }
}
