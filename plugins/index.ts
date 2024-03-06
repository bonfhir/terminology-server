import type { ConfigServer, ConfigTaskEntry } from "../server-setup/configs";
import type { Outcome } from "../server-setup/tasks-handlers";

export interface TerminologyPlugin {
  name: string;
  uploadTerminology(
    server: ConfigServer,
    task: ConfigTaskEntry
  ): Promise<Outcome>;
}
