#! /usr/bin/bun

import { readConfigFile } from "./code-system-configs.ts";
import Bun from "bun";

const config = await readConfigFile();

await Bun.write(Bun.stdout, config.server.url);
process.exit(0);
