import type { TerminologyPlugin } from "terminology-server-setup/terminology-plugin";
import { codeSystem } from "./code-system";
import { stringify } from "csv-stringify/sync";
import { parse } from "csv-parse/sync";
import type {
  ConfigServer,
  ConfigTaskEntry,
} from "terminology-server-setup/configs";

import {
  packageCustomVocabulary,
  unzipFiles,
  uploadFiles,
} from "terminology-server-setup/utils";
import type { AuditEventOutcome } from "@bonfhir/core/r4b";

export default class RxNormPlugin implements TerminologyPlugin {
  name = "rxnorm";
  async uploadTerminology(
    server: ConfigServer,
    task: ConfigTaskEntry
  ): Promise<AuditEventOutcome> {
    console.log(
      `📤 Uploading RxNorm code system ${task.id} version ${server.version} from ${task.source}...`
    );

    const path = "/terminologies/data/";
    const destination = "/tmp/rxnorm";

    await unzipFiles(task.source, destination, path);

    await this.translateRxNormFiles(destination);

    await packageCustomVocabulary(destination, "rxnorm.zip");

    await uploadFiles(
      server.url,
      server.version,
      task.id,
      "/tmp/rxnorm/rxnorm.zip"
    );

    return "0";
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
}
