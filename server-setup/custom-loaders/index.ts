import type { AuditEventOutcome } from "@bonfhir/core/r4b";

import type { ServerConfig, ConfigTaskEntry } from "../configs";

import RxNormLoader from "./rxnorm";
import CPTHCPCSLoader from "./cpt-hcpcs";

export interface CustomLoader {
  system: string;
  name: string;
  uploadTerminology(
    server: ServerConfig,
    task: ConfigTaskEntry
  ): Promise<AuditEventOutcome>;
}

export const customLoaders: CustomLoader[] = [
  new RxNormLoader(),
  new CPTHCPCSLoader(),
];
