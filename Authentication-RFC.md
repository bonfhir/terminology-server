# Context

The Terminology Server is built using HAPI FHIR which is a Java implementation of the HL7 FHIR standard. When adding an authentication layer to HAPI FHIR, we need to consider the specific requirements and constraints of healthcare applications. This Terminology Server is meant as either a development tool or a building block for more complex health systems.

## Summary of Considered Authentication Options

 - OAuth 2.0: Widely adopted authentication and authorization framework. It provides a secure and standardized way to authenticate and authorize users and applications. With OAuth 2.0, users can grant access to their healthcare data to third-party applications without sharing their credentials. OAuth 2.0 supports different grant types, such as authorization code, client credentials, and resource owner password credentials.

 - OpenID Connect: An identity layer built on top of OAuth 2.0. It provides authentication and single sign-on capabilities. OpenID Connect allows users to authenticate with an identity provider (IdP), which then issues an identity token. This token can be used to verify the user's identity and gain access to protected resources.

 - SMART on FHIR: SMART (Substitutable Medical Applications, Reusable Technologies) is a set of specifications that enable healthcare applications to integrate with electronic health records (EHR) systems. SMART on FHIR combines the FHIR standard with OAuth 2.0 and OpenID Connect to enable secure authentication and authorization of healthcare applications.

 - Mutual TLS (mTLS): A form of client authentication that uses X.509 certificates to verify the identity of both the client and server. With mTLS, the server requires the client to present a valid client certificate during the TLS handshake. This provides strong authentication and ensures that only authorized clients can access the server.



Each of these authentication options has its own advantages and considerations. Let's evaluate them based on the concerns we discussed earlier:

 1. Security: All the mentioned options can provide secure authentication. However, the level of security varies based on the implementation and configuration. It's essential to properly configure and secure authentication mechanisms to protect sensitive healthcare data.

 2. User experience: User experience is crucial for healthcare applications. The chosen authentication mechanism should be user-friendly and intuitive. It should not introduce complexity or deter users from accessing their healthcare data.

 3. Scalability: Healthcare applications often handle a large volume of requests. The chosen authentication mechanism should be scalable and not introduce significant performance overhead. It should also be able to handle concurrent requests efficiently.

 4. Integration: HAPI FHIR is designed to work with different healthcare systems and frameworks. The chosen authentication mechanism should integrate seamlessly with HAPI FHIR and other healthcare systems, such as EHR systems and identity providers.

Maintenance and developer experience: Implementing and maintaining the authentication mechanism should not introduce unnecessary complexity for developers. It should have good documentation, libraries, and tools to facilitate the implementation process.

Considering these factors, I would recommend using SMART on FHIR for adding an authentication layer to HAPI FHIR. SMART on FHIR combines the power of FHIR, OAuth 2.0, and OpenID Connect to provide a standardized and secure authentication mechanism for healthcare applications. It has been widely adopted in the healthcare industry and has good integration capabilities with electronic health records systems.

However, it's important to evaluate the specific requirements of this project, such as regulatory compliance and interoperability needs, before making a final decision. Additionally, thorough security testing and adherence to best practices are crucial for ensuring the overall security of the system. The Terminology Server is either meant as a building block for more complex systems or as a development tool. In the later case, authorization might even be disabled entirely. But in the former, it may be necessary to implement best practices.

# Interceptor vs Proxy

HAPI supports an Interceptor pattern to inject code into the server side or client side, using certain predetermined hooks, called Pointcuts. Is this mechanism suitable for authentication or should we consider something else like proxying authentication requests to a webserver, like Nginx or Jetty?

The Interceptor pattern provided by HAPI can be a viable option for implementing authentication in HAPI FHIR. However, there are some considerations to keep in mind when deciding whether to use the Interceptor pattern or proxying authentication requests to a webserver like Nginx or Jetty. Let's evaluate both options:

## Interceptor pattern in HAPI:

The Interceptor pattern in HAPI allows you to inject code at specific points within the server or client processing pipeline. This can be useful for implementing custom logic, including authentication.

Pros:

 - Fine-grained control: With the Interceptor pattern, you have full control over the authentication process within HAPI. You can customize the authentication logic, integrate with your existing authentication infrastructure, or enforce specific authentication requirements.
 - Seamless integration: Interceptors can be easily integrated into your HAPI FHIR application without the need for external dependencies.

Cons:

 - Implementation complexity: Implementing authentication with the Interceptor pattern may require additional effort and complexity, especially if you need to handle various authentication mechanisms or integrate with external systems.
 - Potential performance impact: Interceptors are executed within the HAPI processing pipeline, which may introduce some performance overhead, depending on the complexity of the interceptor code.

## Proxying authentication requests to a webserver:

Another approach is to proxy authentication requests to a separate web server like Nginx or Jetty. The webserver handles the authentication process and passes the authenticated requests to the HAPI FHIR server.

Pros:

 - Separation of concerns: Proxying authentication requests to a separate webserver allows you to delegate the authentication process to a specialized component. This can simplify the implementation and maintenance of the authentication logic.
 - Flexibility: Using a webserver like Nginx or Jetty gives you the flexibility to leverage their built-in authentication mechanisms or integrate with other authentication providers easily.

Cons:

 - Additional infrastructure: Proxying requests to a separate webserver requires an additional component in your architecture, which adds complexity and potentially increases maintenance overhead.
 - Potential configuration complexity: Configuring the webserver to handle authentication and routing requests to the HAPI FHIR server may require additional configuration and coordination.

Considering these factors, the choice between using the Interceptor pattern in HAPI or proxying authentication requests to a webserver depends on your specific requirements and constraints. Here are a few guidelines to help you decide:

Use the Interceptor pattern if you require fine-grained control over the authentication process within HAPI and need to integrate with specific authentication mechanisms or external systems. This approach gives you more flexibility but may introduce additional implementation complexity.

Consider proxying authentication requests to a webserver if you prefer to delegate the authentication process to a separate component and leverage its built-in authentication mechanisms or integration capabilities. This approach might simplify the implementation, but it introduces an additional infrastructure component.

In either case, it's crucial to ensure that the chosen authentication mechanism provides robust security and meets the specific regulatory and compliance requirements of your healthcare application. Additionally, proper documentation and configuration management should be in place to facilitate the implementation and maintenance processes.

Remember to evaluate the performance impact and conduct thorough testing to ensure that the chosen approach can handle the expected load and provide a seamless user experience.

Ultimately, the choice between the Interceptor pattern and proxying authentication requests depends on your specific use case and requirements. Evaluating the pros and cons of each option and considering factors such as security, flexibility, and implementation complexity will help guide your decision.