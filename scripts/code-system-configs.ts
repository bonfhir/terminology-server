import YAML from "yaml";

export type CodeSystemConfigEntry = {
  id: string;
  version: string;
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
  return configs;
}
