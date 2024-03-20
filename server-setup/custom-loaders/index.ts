import type { AuditEventOutcome } from "@bonfhir/core/r4b";
import { readdir } from "fs/promises";
import { join } from "path";

import type { ConfigServer, ConfigTaskEntry } from "@/configs";

export interface CustomLoader {
  name: string;
  uploadTerminology(
    server: ConfigServer,
    task: ConfigTaskEntry
  ): Promise<AuditEventOutcome>;
}

async function loadDir(dir: string) {
  let files = await readdir(dir);
  const plugins: Plugin[] = [];
  for (let file of files) {
    const path = join(process.cwd(), dir, file);
    const Plugin = await import(path);
    const plugin: Plugin = new Plugin.default();
    plugins.push(plugin);
  }
  return plugins;
}

export type Plugin = {
  name: string;
  uploadTerminology: (
    server: ConfigServer,
    task: ConfigTaskEntry
  ) => Promise<AuditEventOutcome>;
};

export const plugins: Plugin[] = (await loadDir("plugins")) ?? [];
