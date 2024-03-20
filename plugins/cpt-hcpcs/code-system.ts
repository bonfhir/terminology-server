import type { CodeSystem } from "@bonfhir/core/r4b";

export const codeSystem: Partial<CodeSystem> = {
  resourceType: "CodeSystem",
  url: "https://www.cms.gov/Medicare/Coding/HCPCSReleaseCodeSets",
  name: "CPT/HCPCS",
  description: "CPT/HCPCS code system",
  status: "active",
  publisher: "CMS",
  content: "not-present",
};
