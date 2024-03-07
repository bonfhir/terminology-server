import { $ } from "bun";
import type { TerminologyPlugin } from "..";
import { codeSystem } from "./code-system";
import { stringify } from "csv-stringify/sync";
import { parse } from "csv-parse/sync";
import { mkdir } from "node:fs/promises";
import type { ConfigServer, ConfigTaskEntry } from "../../server-setup/configs";
import type { Outcome } from "../../server-setup/tasks-handlers";

export class RxNormPlugin implements TerminologyPlugin {
  name = "rxnorm";
  async uploadTerminology(
    server: ConfigServer,
    task: ConfigTaskEntry
  ): Promise<Outcome> {
    console.log(
      `📤 Uploading RxNorm code system ${task.id} version ${server.version} from ${task.source}...`
    );

    const path = "/terminologies/data/";
    const destination = "/tmp/rxnorm";

    await this.unzipRxNormFiles(task.source, destination, path);

    await this.translateRxNormFiles(destination);

    await this.zipRxNormCustomVocabulary(destination, "rxnorm.zip");

    await this.uploadRxNormFiles(
      server.url,
      server.version,
      task.id,
      "/tmp/rxnorm/rxnorm.zip"
    );

    return "0";
  }

  private async unzipRxNormFiles(
    source: string,
    destination: string,
    path: string
  ) {
    await mkdir(destination, { recursive: true });

    const { stdout, stderr, exitCode } =
      await $`unzip -o ${path}${source} -d "${destination}"`;
    this.logResults(stdout, stderr, exitCode);
  }

  private async zipRxNormCustomVocabulary(path: string, output: string) {
    const { stdout, stderr, exitCode } =
      await $`zip ${path}/${output} ${path}/concepts.csv ${path}/codesystem.json`;
    this.logResults(stdout, stderr, exitCode);
  }

  private async translateRxNormFiles(path: string) {
    const records: string[][] = await parse(
      // we probably only need to parse RXNCONSO.RRF for now
      await Bun.file(`${path}/rrf/RXNCONSO.RRF`).text(),
      {
        delimiter: "|",
        skip_empty_lines: true,
        escape: null,
        quote: null,
      }
    );

    const translatedRecords = records.map((record) => {
      // 0 = RXCUI, 14 = Str
      return { code: record[0], display: record[14] };
    });

    // NOTE: RRF files have code duplication by design, and HAPI won't ingest custom vocabularies with duplicate codes
    // we'll choose to keep the first occurrence of each code for now
    const uniq = (
      arr: Array<{ code: string; display: string }>,
      track = new Set()
    ) => arr.filter(({ code }) => (track.has(code) ? false : track.add(code)));
    const filteredRecords = uniq(translatedRecords).map((record) => [
      record.code,
      record.display,
    ]);
    filteredRecords.unshift(["CODE", "DISPLAY"]);

    await Bun.write(`${path}/concepts.csv`, stringify(filteredRecords));

    await Bun.write(
      `${path}/codesystem.json`,
      JSON.stringify({ ...codeSystem, date: new Date() }, null, 2)
    );
  }

  private async uploadRxNormFiles(
    url: string,
    version: string,
    system: string,
    source: string
  ) {
    const { stdout, stderr, exitCode } =
      await $`hapi-fhir-cli upload-terminology -d "${source}" -v "${version}" -t "${url}" -u "${system}"`;
    this.logResults(stdout, stderr, exitCode);
  }

  private logResults(stdout: Buffer, stderr: Buffer, exitCode: number) {
    if (exitCode !== 0) {
      console.log("🦺 exitCode: ");
      console.log(exitCode);

      console.log("🚨 errors: ");
      console.log(stderr.toString());
    } else {
      console.log("✅ Uploaded definitions");
      console.log(stdout.toString());
    }
  }
}

await new RxNormPlugin().uploadTerminology(
  { url: "http://localhost:8080/fhir", version: "R4" },
  {
    type: "upload-terminology-plugin",
    id: "http://www.nlm.nih.gov/research/umls/rxnorm",
    source: "RxNorm_full_03042024.zip",
    plugin: "rxnorm",
  }
);
