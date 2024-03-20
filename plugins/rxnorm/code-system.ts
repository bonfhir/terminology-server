import type { CodeSystem } from "@bonfhir/core/r4b";

export const codeSystem: Partial<CodeSystem> = {
  resourceType: "CodeSystem",
  url: "http://www.nlm.nih.gov/research/umls/rxnorm",
  name: "RXNorm",
  description:
    "RxNorm is a normalized naming system for generic and branded drugs by the United States National Library of Medicine.",
  status: "active",
  publisher: "U.S. National Library of Medicine",
  content: "not-present",
};
