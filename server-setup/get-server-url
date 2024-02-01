#! /usr/bin/bun

import { readConfigFile } from "./code-system-configs.ts";

const config = await readConfigFile();

await Bun.write(Bun.stdout, config.server.url);
process.exit(0);
