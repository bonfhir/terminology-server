import {
  type AuditEvent,
  type AuditEventAgent,
  type AuditEventSource,
  type AuditEventAction,
  type Coding,
  type FhirClient,
  type Retrieved,
  type AuditEventEntity,
  type AuditEventOutcome,
  FetchFhirClient,
} from "@bonfhir/core/r4b";

// Audit Event Success Token
const SUCCESS = "0";

// Terminology Source
export type TerminologySource = {
  source: string;
  system: string;
  version: string;
};

const cache = new Map<string, Retrieved<AuditEvent>[] | undefined>();

export async function getApplicationImportAuditEvents(
  baseUrl: string
): Promise<Retrieved<AuditEvent>[] | undefined> {
  const client: FhirClient = new FetchFhirClient({
    baseUrl,
  });

  const importOntology: Coding = {
    system: "http://dicom.nema.org/resources/ontology/DCM",
    code: "110107",
  };
  const cacheKey = [importOntology.system, importOntology.code].join("|");

  if (cache.has(cacheKey)) {
    return Promise.resolve(cache.get(cacheKey));
  }
  try {
    const result = await client.search("AuditEvent", (search) =>
      search.outcome("0").type(importOntology)
    );
    const events: Retrieved<AuditEvent>[] | undefined = result.bundle.entry
      ?.flatMap((e) => e.resource as Retrieved<AuditEvent>)
      .filter(Boolean);
    cache.set(cacheKey, events);
    return events;
  } catch (error) {
    console.error("Error fetching audit event", error);
    return undefined;
  }
}

export async function createApplicationImportAuditEvent(
  baseUrl: string,
  entitySource: TerminologySource,
  outcome: AuditEventOutcome = SUCCESS
): Promise<Retrieved<AuditEvent>> {
  const client: FhirClient = new FetchFhirClient({
    baseUrl,
  });

  const source: AuditEventSource = {
    observer: {
      identifier: {
        system: "urn:ietf:rfc:3986",
        value: baseUrl,
      },
    },
    type: [
      {
        system: "http://terminology.hl7.org/CodeSystem/security-source-type",
        code: "4",
        display: "Application Server",
      },
    ],
  };

  const type: Coding = {
    system: "http://dicom.nema.org/resources/ontology/DCM",
    code: "110107",
    display: "Import",
  };

  const action: AuditEventAction = "C";

  const auditEvent: AuditEvent = {
    resourceType: "AuditEvent",
    type,
    action,
    recorded: new Date().toISOString(),
    outcome,
    agent: makeApplicationAgent(),
    source,
    entity: [makeAuditEventEntity(entitySource)],
  };

  return await client.create(auditEvent);
}

// builder function for application agent
export function makeApplicationAgent(): AuditEventAgent[] {
  return [
    {
      type: {
        coding: [
          {
            system: "http://dicom.nema.org/resources/ontology/DCM",
            code: "110150",
            display: "Application",
          },
        ],
        text: "Application",
      },
      who: {
        identifier: {
          system: "urn:ietf:rfc:3986",
          value: "http://bonfhir.dev/terminology-server-loader",
        },
      },
      name: "BonFHIR Terminology Server Loader",
      requestor: false,
    },
  ];
}

// builder function for audit event entity
function makeAuditEventEntity({
  source,
  system,
  version,
}: TerminologySource): AuditEventEntity {
  return {
    type: {
      system: "http://hl7.org/fhir/resource-types",
      code: "CodeSystem",
    },
    lifecycle: {
      system: "http://terminology.hl7.org/CodeSystem/dicom-audit-lifecycle",
      code: "2",
      display: "Import / Copy",
    },
    securityLabel: [
      {
        system: "http://terminology.hl7.org/CodeSystem/v3-Confidentiality",
        code: "U",
        display: "unrestricted",
      },
    ],
    name: system,
    detail: [
      {
        type: "results",
        valueBase64Binary: btoa(JSON.stringify({ source, version })),
      },
    ],
  };
}

// test if terminology source is already imported
export async function isTerminologySourceImported(
  baseUrl: string,
  source: TerminologySource
): Promise<boolean> {
  const events = await getApplicationImportAuditEvents(baseUrl);
  if (events === undefined) {
    return false;
  }
  return (events.flatMap((event) => event.entity) ?? []).some(
    (entity) =>
      entity !== undefined &&
      entity.name === source.system &&
      (entity.detail ?? []).some(
        (d) =>
          d.valueBase64Binary ===
          btoa(
            JSON.stringify({ source: source.source, version: source.version })
          )
      )
  );
}
