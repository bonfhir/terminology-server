import YAML from "yaml";

export const FHIR_VERSIONS = ["R3", "R4", "R4B", "R5"] as const;
export type FHIRVersion = (typeof FHIR_VERSIONS)[number];

export type ConfigTaskEntry = {
  type: "upload-definitions" | "upload-terminology";
  id: string;
  source: string;
};
export type ConfigServer = {
  url: string;
  version: FHIRVersion;
};
export type Config = {
  server: ConfigServer;
  tasks: ConfigTaskEntry[];
};

const CONFIG_PATH = "/configs/bonfhir-hapi.yml";

export async function readConfigFile(): Promise<Config> {
  const configFile = Bun.file(CONFIG_PATH);
  const configFileString = await configFile.text();
  const configs = YAML.parse(configFileString) as Config;
  assertVersionSupport(configs.server.version);
  return configs;
}

function assertVersionSupport(fhirVersion: string) {
  if (!FHIR_VERSIONS.includes(fhirVersion.toUpperCase() as any)) {
    console.error(`FHIR version ${fhirVersion} is not supported`);
    process.exit(1);
  }
}
