import YAML from "yaml";
import Bun from "bun";

export const FHIR_VERSIONS = ["R3", "R4", "R4B", "R5"] as const;
export type FHIRVersion = (typeof FHIR_VERSIONS)[number];

export type CodeSystemConfigEntry = {
  id: string;
  version: FHIRVersion;
  source: string;
};
export type CodeSystemConfigServer = {
  url: string;
};
export type CodeSystemConfig = {
  server: CodeSystemConfigServer;
  "code-systems": CodeSystemConfigEntry[];
};

const CONFIG_PATH = "/configs/code-systems.yml";

export async function readConfigFile(): Promise<CodeSystemConfig> {
  const configFile = Bun.file(CONFIG_PATH);
  const configFileString = await configFile.text();
  const configs = YAML.parse(configFileString) as CodeSystemConfig;
  configs["code-systems"].forEach((cs) => assertVersionSupport(cs.version));
  return configs;
}

function assertVersionSupport(fhirVersion: string) {
  if (!FHIR_VERSIONS.includes(fhirVersion.toUpperCase() as any)) {
    console.error(`FHIR version ${fhirVersion} is not supported`);
    process.exit(1);
  }
}
