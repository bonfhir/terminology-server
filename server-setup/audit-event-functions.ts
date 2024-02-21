import {
  type AuditEvent,
  type AuditEventAgent,
  type AuditEventSource,
  type AuditEventAction,
  type Coding,
  type FhirClient,
  type Retrieved,
  type AuditEventEntity,
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

export async function getApplicationImportAuditEvent(
  client: FhirClient
): Promise<Retrieved<AuditEvent> | undefined> {
  // TODO: this should return all matching audit event and we need to parse the entity detail to match
  try {
    const bundle = await client.search("AuditEvent", (search) => {
      const importOntology: Coding = {
        system: "http://dicom.nema.org/resources/ontology/DCM",
        code: "110107",
      };
      return search.outcome(SUCCESS).type(importOntology);
    });
    return bundle.bundle.entry?.[0].resource;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

export async function createApplicationImportAuditEvent(
  client: FhirClient,
  entity: AuditEventEntity[]
): Promise<Retrieved<AuditEvent>> {
  const source: AuditEventSource = {
    observer: {
      identifier: {
        system: "urn:ietf:rfc:3986",
        value: "",
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
    outcome: SUCCESS,
    agent: makeApplicationAgent(),
    source,
    entity,
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

// builder function for audit event entities
export function makeAuditEventEntities(
  sources: TerminologySource[]
): AuditEventEntity[] {
  return sources.map(makeAuditEventEntity);
}

// builder function for audit event entity
export function makeAuditEventEntity({
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
async function isTerminologySourceImported(
  client: FhirClient,
  source: TerminologySource
): Promise<boolean> {
  const event = await getApplicationImportAuditEvent(client);
  if (event === undefined) {
    return false;
  }
  return (event.entity ?? []).some((e) => e.name === source.system);
}

// test if all terminology sources are already imported
export async function areTerminologySourcesImported(
  client: FhirClient,
  sources: TerminologySource[] | undefined
): Promise<boolean | undefined> {
  if (sources === undefined) return Promise.resolve(false);

  return Promise.all(
    sources.map((source) => isTerminologySourceImported(client, source))
  )
    .then((results) => results.every((result) => result === true))
    .catch((error) => {
      console.error(error);
      return false;
    });
}

try {
  // create a new FHIR client
  const client: FhirClient = new FetchFhirClient({
    baseUrl: "http://localhost:8080/fhir/",
  });

  // payload to create the audit event
  const sources = [
    {
      source: "LV264.zip",
      system: "http://hl7.org/fhir/sid/icd-10-cm",
      version: "R4",
    },
    {
      source: "SNOMED_CT354.zip",
      system: "http://snomed.info/sct",
      version: "R4",
    },
  ];

  // create an audit event
  const event = await createApplicationImportAuditEvent(
    client,
    makeAuditEventEntities(sources)
  );
  console.log(`ID: ${event.id}`);

  // get application audit event
  const event2 = await getApplicationImportAuditEvent(client);
  console.log(`ID: ${event2?.id}`);

  // test if terminology sources are already imported
  const test = await areTerminologySourcesImported(client, sources);
  console.log(`Test: ${test}`);
} catch (error) {
  console.error(error);
}
