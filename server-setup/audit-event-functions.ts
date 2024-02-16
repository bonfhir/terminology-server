import {
  type Identifier,
  type AuditEvent,
  type AuditEventAgent,
  type AuditEventSource,
  type Coding,
  type AuditEventAction,
  type FhirClient,
  type Retrieved,
  type Reference,
  type AuditEventEntity,
  reference,
  FetchFhirClient,
} from "@bonfhir/core/r4b";

// https://github.com/bonfhir/terminology-server/issues/13

export async function getAuditEvent(
  client: FhirClient,
  agent: AuditEvent["agent"][0]["who"]
): Promise<Retrieved<AuditEvent> | undefined> {
  try {
    return await client.searchOne("AuditEvent", (search) =>
      search.outcome("0").agent(agent)
    );
  } catch (error) {
    return undefined;
  }
}

export async function setAuditEvent(
  client: FhirClient,
  agent: AuditEventAgent[],
  entity: AuditEventEntity[]
): Promise<Retrieved<AuditEvent>> {
  const source: AuditEventSource = {
    observer: {
      identifier: {
        system: "urn:ietf:rfc:3986",
        value: "<URL of the FHIR Server>",
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
    recorded: "2017-09-16T00:00:00Z",
    outcome: "0",
    agent,
    source,
    entity,
  };

  return await client.create(auditEvent);
}

export function getServerAgent(identifier: Identifier): AuditEventAgent[] {
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
        identifier,
      },
      name: "BonFHIR Terminology Server Loader",
      requestor: false,
    },
  ];
}

const entities: AuditEventEntity[] = [
  {
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
    name: "http://hl7.org/fhir/sid/icd-10-cm",
    detail: [
      {
        type: "results",
        valueBase64Binary:
          "eyAic291cmNlIjogIkxWMjY0LnppcCIsICJ2ZXJzaW9uIjogIlI0IiB9",
      },
    ],
  },
  {
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
    name: "http://snomed.info/sct",
    detail: [
      {
        type: "results",
        valueBase64Binary:
          "eyAic291cmNlIjogIlNOT01FRF9DVDM1NC56aXAiLCAidmVyc2lvbiI6ICJSNCIgfQ==",
      },
    ],
  },
];

// Initialize a new client with a fixed `Authorization` value
const client: FhirClient = new FetchFhirClient({
  baseUrl: "http://localhost:8080/fhir/",
  // auth: "Basic <basic-auth-key>",
});

const identifier: Identifier = {
  system: "urn:ietf:rfc:3986",
  value: "http://bonfhir.dev/terminology-server-loader",
};
const agent = getServerAgent(identifier);

try {
  const event = await setAuditEvent(client, agent, entities);
  console.log(`ID: ${event.id}`);
  console.log(`Reference: ${event?.agent[0]?.who?.identifier?.value}`);
  const event2 = await getAuditEvent(client, event?.agent[0]?.who);
  console.log(`ID: ${event2?.id}`);
} catch (error) {
  console.error(error);
}
