# Summary

1. Introduction

   Briefly explain the purpose of the RFC.

2. Current Code Systems Supported

   Provide a list of the code systems that are currently supported by HAPI.

3. Identified Additional Code Systems

   Enumerate the extra code systems that need to be supported in HAPI.

4. Challenges in Integrating Additional Code Systems

   Discuss the challenges or limitations in integrating the extra code systems.

5. Universal Mechanism for Ingesting Extra Codes

   Propose a universal mechanism that can be used to ingest the extra codes.

6. Implementation Details

   Provide details on how the proposed mechanism can be implemented in HAPI.

7. Benefits and Impact

   Explain the benefits of supporting additional code systems and the impact it could have on users.

8. Open Questions and Concerns

   Mention any remaining open questions or concerns that need to be addressed.

9. Conclusion

   Summarize the key points and propose a next step for the implementation.

# 1. Introduction

The Terminology Server is built using HAPI FHIR which is a Java implementation of the HL7 FHIR standard. When adding an authentication layer to HAPI FHIR, we need to consider the specific requirements and constraints of healthcare applications. This Terminology Server is meant as either a development tool or a building block for more complex health systems.

The document begins by introducing the Terminology Server built using HAPI FHIR for healthcare applications. It then explores various authentication mechanisms, including OAuth 2.0, OpenID Connect, SMART on FHIR, and Mutual TLS (mTLS). Evaluation criteria are established, leading to a recommendation to use SMART on FHIR.

Each authentication mechanism is detailed, emphasizing their roles and considerations in healthcare. The document also compares the Interceptor pattern and proxying authentication for HAPI FHIR, providing guidelines for choosing between them.

Finally, recommendations for improvement are suggested, and the document concludes by summarizing key insights and reinforcing the SMART on FHIR recommendation for healthcare authentication in the given context.

# 2. Authentication Mechanisms Overview

- OAuth 2.0: Widely adopted authentication and authorization framework. It provides a secure and standardized way to authenticate and authorize users and applications. With OAuth 2.0, users can grant access to their healthcare data to third-party applications without sharing their credentials. OAuth 2.0 supports different grant types, such as authorization code, client credentials, and resource owner password credentials.

- OpenID Connect: An identity layer built on top of OAuth 2.0. It provides authentication and single sign-on capabilities. OpenID Connect allows users to authenticate with an identity provider (IdP), which then issues an identity token. This token can be used to verify the user's identity and gain access to protected resources.

- SMART on FHIR: SMART (Substitutable Medical Applications, Reusable Technologies) is a set of specifications that enable healthcare applications to integrate with electronic health records (EHR) systems. SMART on FHIR combines the FHIR standard with OAuth 2.0 and OpenID Connect to enable secure authentication and authorization of healthcare applications.

- Mutual TLS (mTLS): A form of client authentication that uses X.509 certificates to verify the identity of both the client and server. With mTLS, the server requires the client to present a valid client certificate during the TLS handshake. This provides strong authentication and ensures that only authorized clients can access the server.

# 3. Evaluation Criteria for Authentication Mechanisms

Each of these authentication options has its own advantages and considerations. Let's evaluate them based on the concerns we discussed earlier:

1.  Security: All the mentioned options can provide secure authentication. However, the level of security varies based on the implementation and configuration. It's essential to properly configure and secure authentication mechanisms to protect sensitive healthcare data.

2.  User experience: User experience is crucial for healthcare applications. The chosen authentication mechanism should be user-friendly and intuitive. It should not introduce complexity or deter users from accessing their healthcare data.

3.  Scalability: Healthcare applications often handle a large volume of requests. The chosen authentication mechanism should be scalable and not introduce significant performance overhead. It should also be able to handle concurrent requests efficiently.

4.  Integration: HAPI FHIR is designed to work with different healthcare systems and frameworks. The chosen authentication mechanism should integrate seamlessly with HAPI FHIR and other healthcare systems, such as EHR systems and identity providers.

Maintenance and developer experience: Implementing and maintaining the authentication mechanism should not introduce unnecessary complexity for developers. It should have good documentation, libraries, and tools to facilitate the implementation process.

# 4. Recommendation for Healthcare Authentication

Considering these factors, I would recommend using SMART on FHIR for adding an authentication layer to HAPI FHIR. SMART on FHIR combines the power of FHIR, OAuth 2.0, and OpenID Connect to provide a standardized and secure authentication mechanism for healthcare applications. It has been widely adopted in the healthcare industry and has good integration capabilities with electronic health records systems.

However, it's important to evaluate the specific requirements of this project, such as regulatory compliance and interoperability needs, before making a final decision. Additionally, thorough security testing and adherence to best practices are crucial for ensuring the overall security of the system. The Terminology Server is either meant as a building block for more complex systems or as a development tool. In the later case, authorization might even be disabled entirely. But in the former, it may be necessary to implement best practices.

# 5. OAuth 2.0

OAuth 2.0 is a pivotal authentication and authorization framework within healthcare, enabling secure and flexible access to patient data without compromising user credentials. Its adaptability across different grant types, including Authorization Code, Client Credentials, and Resource Owner Password Credentials, allows for tailored security measures in healthcare applications. Particularly in the HAPI FHIR context, OAuth 2.0 facilitates seamless integration of third-party apps with electronic health records (EHR), empowering patients and healthcare professionals with controlled access to health information, thereby enhancing patient outcomes and data security.

Implementing OAuth 2.0 with HAPI FHIR involves establishing an authorization server to manage access tokens, which are granted upon user consent, providing secure, temporary access to FHIR-hosted healthcare data. This setup centralizes authentication and authorization, streamlining security within healthcare applications. Additionally, OAuth 2.0's support for token introspection and revocation further bolsters security, ensuring sensitive healthcare information remains protected against unauthorized access, thereby aligning with industry standards and fostering a more interconnected, patient-focused healthcare ecosystem.

# 6. OpenID Connect

OpenID Connect, an identity layer built atop OAuth 2.0, enhances the authentication landscape by providing robust single sign-on (SSO) capabilities within healthcare applications. By facilitating secure user authentication across multiple systems through a single set of credentials, OpenID Connect streamlines access to healthcare services and data. It leverages a standard protocol to verify the identity of users and apps, making it easier for healthcare providers to offer a cohesive user experience while maintaining high levels of security and privacy for patient data.

In the healthcare domain, especially when integrated with HAPI FHIR, OpenID Connect allows seamless interaction with electronic health record (EHR) systems, enabling efficient and secure patient data management. This integration not only simplifies the login process for users but also ensures that access to sensitive health information is tightly controlled and compliant with regulatory requirements. Through the issuance of ID tokens, OpenID Connect provides a reliable mechanism for systems to authenticate users' identities, further enhancing the security posture of healthcare applications by ensuring that access is granted only to authenticated and authorized users.

# 7. SMART on FHIR

# 8. Mutual TLS (mTLS)

# 9. Application of Evaluation Criteria

# 10. Interceptor vs Proxy for Authentication

HAPI supports an Interceptor pattern to inject code into the server side or client side, using certain predetermined hooks, called Pointcuts. Is this mechanism suitable for authentication or should we consider something else like proxying authentication requests to a web server, like Nginx or Jetty?

The Interceptor pattern provided by HAPI can be a viable option for implementing authentication in HAPI FHIR. However, there are some considerations to keep in mind when deciding whether to use the Interceptor pattern or proxying authentication requests to a web server like Nginx or Jetty. Let's evaluate both options:

# 11. Interceptor pattern in HAPI:

The Interceptor pattern in HAPI allows you to inject code at specific points within the server or client processing pipeline. This can be useful for implementing custom logic, including authentication.

Pros:

- Fine-grained control: With the Interceptor pattern, you have full control over the authentication process within HAPI. You can customize the authentication logic, integrate with your existing authentication infrastructure, or enforce specific authentication requirements.
- Seamless integration: Interceptors can be easily integrated into your HAPI FHIR application without the need for external dependencies.

Cons:

- Implementation complexity: Implementing authentication with the Interceptor pattern may require additional effort and complexity, especially if you need to handle various authentication mechanisms or integrate with external systems.
- Potential performance impact: Interceptors are executed within the HAPI processing pipeline, which may introduce some performance overhead, depending on the complexity of the interceptor code.

# 12. Proxy Authentication Requests to a Web Server:

Another approach is to proxy authentication requests to a separate web server like Nginx or Jetty. The web server handles the authentication process and passes the authenticated requests to the HAPI FHIR server.

Pros:

- Separation of concerns: proxying authentication requests to a separate web server allows you to delegate the authentication process to a specialized component. This can simplify the implementation and maintenance of the authentication logic.
- Flexibility: Using a web server like Nginx or Jetty gives you the flexibility to leverage their built-in authentication mechanisms or integrate with other authentication providers easily.

Cons:

- Additional infrastructure: proxying requests to a separate web server requires an additional component in your architecture, which adds complexity and potentially increases maintenance overhead.
- Potential configuration complexity: Configuring the web server to handle authentication and routing requests to the HAPI FHIR server may require additional configuration and coordination.

# 13. Consideration Guidelines

Considering these factors, the choice between using the Interceptor pattern in HAPI or proxying authentication requests to a web server depends on your specific requirements and constraints. Here are a few guidelines to help you decide:

Use the Interceptor pattern if you require fine-grained control over the authentication process within HAPI and need to integrate with specific authentication mechanisms or external systems. This approach gives you more flexibility but may introduce additional implementation complexity.

Consider proxying authentication requests to a web server if you prefer to delegate the authentication process to a separate component and leverage its built-in authentication mechanisms or integration capabilities. This approach might simplify the implementation, but it introduces an additional infrastructure component.

In either case, it's crucial to ensure that the chosen authentication mechanism provides robust security and meets the specific regulatory and compliance requirements of your healthcare application. Additionally, proper documentation and configuration management should be in place to facilitate the implementation and maintenance processes.

Remember to evaluate the performance impact and conduct thorough testing to ensure that the chosen approach can handle the expected load and provide a seamless user experience.

Ultimately, the choice between the Interceptor pattern and proxying authentication requests depends on your specific use case and requirements. Evaluating the pros and cons of each option and considering factors such as security, flexibility, and implementation complexity will help guide your decision.

# 14. Recommendations for Improvement

# 15. Conclusion

In summary, this document has thoroughly examined authentication mechanisms for healthcare applications using HAPI FHIR. Following a rigorous evaluation, SMART on FHIR stands out as the recommended solution, offering a secure amalgamation of FHIR, OAuth 2.0, and OpenID Connect tailored for healthcare contexts. Additionally, architectural considerations between the Interceptor pattern and proxying authentication to external web servers were explored, providing concise guidelines for decision-making. Looking ahead, continued awareness of emerging technologies, regulatory compliance, and potential enhancements, such as visual elements or real-world examples, can further enhance the document's applicability in the dynamic healthcare IT landscape.
