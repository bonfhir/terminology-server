import type { TerminologyPlugin } from "terminology-server-setup/terminology-plugin";
import { codeSystem } from "./code-system";
import { stringify } from "csv-stringify/sync";
import type {
  ConfigServer,
  ConfigTaskEntry,
} from "terminology-server-setup/configs";

import {
  packageCustomVocabulary,
  unzipFiles,
  uploadFiles,
} from "terminology-server-setup/utils";
import XLSX from "xlsx";
import type { AuditEventOutcome } from "@bonfhir/core/r4b";

interface CPTHCPCSRecord {
  __EMPTY: string;
  __EMPTY_1: string;
}

export default class CPTHCPCSPlugin implements TerminologyPlugin {
  name = "cpt-hcpcs";
  async uploadTerminology(
    server: ConfigServer,
    task: ConfigTaskEntry
  ): Promise<AuditEventOutcome> {
    console.log(
      `📤 Uploading CPT/HCPCS code system ${task.id} version ${server.version} from ${task.source}...`
    );

    const path = "/terminologies/data/";
    const destination = "/tmp/cpt-hcpcs";
    const fileName = task.source.replace(".zip", ".xlsx");

    await unzipFiles(task.source, destination, path);

    await this.translateCPTFiles(destination, fileName);

    await packageCustomVocabulary(destination, "cpt-hcpcs.zip");

    await uploadFiles(
      server.url,
      server.version,
      task.id,
      "/tmp/cpt-hcpcs/cpt-hcpcs.zip"
    );

    return "0";
  }

  private async translateCPTFiles(path: string, fileName: string) {
    const records: string[][] = [];
    const workbook = XLSX.read(
      await Bun.file(`${path}/${fileName}`).arrayBuffer(),
      {
        type: "buffer",
      }
    );

    for (const sheet of workbook.SheetNames) {
      const worksheet = workbook.Sheets[sheet];
      const sheetRecords = XLSX.utils.sheet_to_json<CPTHCPCSRecord>(worksheet);

      for (const record of sheetRecords) {
        const conceptCode = record.__EMPTY;
        const conceptName = record.__EMPTY_1;

        if (conceptCode && conceptName) {
          records.push([conceptCode, conceptName]);
        }
      }
    }

    const translatedRecords = records.map((record) => {
      // 0 = conceptCode, 1 = conceptName
      return { code: record[0], display: record[1] };
    });

    // probably unnecessary
    const uniq = (
      arr: Array<{ code: string; display: string }>,
      track = new Set()
    ) => arr.filter(({ code }) => (track.has(code) ? false : track.add(code)));
    const filteredRecords = uniq(translatedRecords).map((record) => [
      record.code,
      record.display,
    ]);
    filteredRecords.unshift(["CODE", "DISPLAY"]);

    // write custom terminology files
    await Bun.write(`${path}/concepts.csv`, stringify(filteredRecords));
    await Bun.write(
      `${path}/codesystem.json`,
      JSON.stringify({ ...codeSystem, date: new Date() }, null, 2)
    );
  }
}
