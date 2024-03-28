import { $ } from "bun";
import { mkdir } from "node:fs/promises";

export async function packageCustomVocabulary(path: string, output: string) {
  const { stdout, stderr, exitCode } =
    await $`zip ${path}/${output} ${path}/concepts.csv ${path}/codesystem.json`;
  logResults(stdout, stderr, exitCode);
}

export async function unzipFiles(
  source: string,
  destination: string,
  path: string
) {
  await mkdir(destination, { recursive: true });

  const { stdout, stderr, exitCode } =
    await $`unzip -o ${path}${source} -d "${destination}"`;
  logResults(stdout, stderr, exitCode);
}

export async function uploadFiles(
  url: string,
  version: string,
  system: string,
  source: string
) {
  const { stdout, stderr, exitCode } =
    await $`hapi-fhir-cli upload-terminology -d "${source}" -v "${version}" -t "${url}" -u "${system}"`;
  logResults(stdout, stderr, exitCode);
}

export async function logResults(
  stdout: Buffer,
  stderr: Buffer,
  exitCode: number
) {
  //if (exitCode !== 0) {
  console.log("🦺 exitCode: ");
  console.log(exitCode);

  console.log("🚨 errors: ");
  console.log(stderr.toString());
  //} else {
  console.log("✅ Uploaded definitions");
  console.log(stdout.toString());
  //}
}
