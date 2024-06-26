import { stringify } from "csv-stringify/sync";
import XLSX from "xlsx";
import type { AuditEventOutcome } from "@bonfhir/core/r4b";
import type { CodeSystem } from "@bonfhir/core/r4b";

import type { CustomLoader } from "./index";
import type { ServerConfig, ConfigTaskEntry } from "../configs";
import { packageCustomVocabulary, unzipFiles, uploadFiles } from "../utils";

const codeSystem: Partial<CodeSystem> = {
  resourceType: "CodeSystem",
  url: "http://www.ama-assn.org/go/cpt",
  name: "CPT/HCPCS",
  description:
    "The Current Procedural Terminology (CPT) code set is a medical code set maintained by the American Medical Association (AMA) through the CPT Editorial Panel.",
  status: "active",
  publisher: "U.S. National Library of Medicine",
  content: "not-present",
};

interface CPTHCPCSRecord {
  __EMPTY: string;
  __EMPTY_1: string;
}

export default class CPTHCPCSLoader implements CustomLoader {
  system = "http://www.ama-assn.org/go/cpt";
  name = "cpt-hcpcs";
  async uploadTerminology(
    server: ServerConfig,
    task: ConfigTaskEntry
  ): Promise<AuditEventOutcome> {
    console.log(
      `📤 Uploading CPT/HCPCS code system ${task.system} version ${server.version} from ${task.source}...`
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
      task.system,
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
