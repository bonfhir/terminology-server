# Context

The Terminology Server is built using HAPI FHIR which is a Java implementation of the HL7 FHIR standard. When adding an authentication layer to HAPI FHIR, we need to consider the specific requirements and constraints of healthcare applications. This Terminology Server is meant as either a development tool or a building block for more complex health systems.

## Summary of Authentication of Considered Options

 - OAuth 2.0: Widely adopted authentication and authorization framework. It provides a secure and standardized way to authenticate and authorize users and applications. With OAuth 2.0, users can grant access to their healthcare data to third-party applications without sharing their credentials. OAuth 2.0 supports different grant types, such as authorization code, client credentials, and resource owner password credentials.

 - OpenID Connect: An identity layer built on top of OAuth 2.0. It provides authentication and single sign-on capabilities. OpenID Connect allows users to authenticate with an identity provider (IdP), which then issues an identity token. This token can be used to verify the user's identity and gain access to protected resources.

 - SMART on FHIR: SMART (Substitutable Medical Applications, Reusable Technologies) is a set of specifications that enable healthcare applications to integrate with electronic health records (EHR) systems. SMART on FHIR combines the FHIR standard with OAuth 2.0 and OpenID Connect to enable secure authentication and authorization of healthcare applications.

 - Mutual TLS (mTLS): A form of client authentication that uses X.509 certificates to verify the identity of both the client and server. With mTLS, the server requires the client to present a valid client certificate during the TLS handshake. This provides strong authentication and ensures that only authorized clients can access the server.