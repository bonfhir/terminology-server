# Summary

1. Introduction

   Briefly explain the purpose of the RFC.

2. Current Code Systems Supported

   Provide a list of the code systems that are currently supported by the Terminology Server.

3. Identified Additional Code Systems

   Enumerate the extra code systems that need to be supported in the Terminology Server.

4. Challenges in Integrating Additional Code Systems

   Discuss the challenges or limitations in integrating the extra code systems.

5. Universal Mechanism for Ingesting Extra Codes

   Propose a universal mechanism that can be used to ingest the extra codes.

6. Implementation Details

   Provide details on how the proposed mechanism can be implemented in the Terminology Server.

7. Benefits and Impact

   Explain the benefits of supporting additional code systems and the impact it could have on users.

8. Open Questions and Concerns

   Mention any remaining open questions or concerns that need to be addressed.

9. Conclusion

   Summarize the key points and propose a next step for the implementation.

# 1. Introduction

The purpose of this RFC is to discuss the integration of additional code systems into the Terminology Server. Currently, the Terminology Server supports a limited set of code systems, and there is a need to expand this support to cater to a wider range of requirements from users and stakeholders.

# 2. Current Code Systems Supported

Currently, the Terminology Server supports the following code systems:

- SNOMED CT
- LOINC
- ICD-10-CM

These code systems provide a solid foundation for healthcare data interoperability. However, there is a demand for supporting additional code systems to enhance the usability and flexibility of the Terminology Server.

# 3. Identified Additional Code Systems

Based on feedback from current maintainers and stakeholders, the following additional code systems have been identified as important candidates for integration into the Terminology Server:

- RxNorm: A medical drug vocabulary used for clinical drugs and drug delivery devices.
- CPT: The Current Procedural Terminology, which provides a standardized classification for medical procedures and services.
- ICD-11: The International Classification of Diseases, Eleventh Revision, which is the latest edition of the global standard for classifying diseases and health conditions.

By integrating these code systems, the Terminology Server can support a broader range of healthcare data and use cases.

# 4. Challenges in Integrating Additional Code Systems

The integration of additional code systems into the Terminology Server brings several challenges that need to be considered:

- Code system complexity: Different code systems may have different structures, terminologies, and data models. Integration efforts must take into account these complexities to ensure accurate and efficient ingestion of the extra codes.

- Mapping and cross-referencing: To support multiple code systems, the Terminology Server may need to establish effective mapping and cross-referencing mechanisms. This requires careful consideration of the relationships and mappings between the codes in different systems, if such translations are possible.

- Maintenance and updates: Supporting additional code systems introduces new responsibilities for Terminology Server users in terms of maintaining and updating the integrated code systems. Changes and updates to these systems must be tracked and incorporated into the Terminology Server in a timely manner.

# 5. Universal Mechanism for Ingesting Extra Codes

To address the challenges mentioned above, a universal mechanism should be implemented to ingest the extra codes into HAPI. This mechanism should be flexible, scalable, and capable of handling different code system structures.

One possible approach is to develop an extensible plugin system within the Terminology Server, where each code system can be integrated as a separate plugin. These plugins would abstract the details of code system integration, providing a standardized interface for ingesting and managing the extra codes. Additionally, the plugin system would allow for easier maintenance and updates as new versions of the code systems are released.

# 6. Implementation Details

The proposed plugin system for integrating additional code systems would consist of the following components:

- Plugin architecture: A modular and extensible architecture that allows new code systems to be seamlessly integrated into the Terminology Server.

- Code system adapters: Each code system would have its own adapter, responsible for handling the specifics of the code system's structure and data model. These adapters would provide standardized methods for code ingestion, retrieval, and cross-referencing.

- Mapping and cross-referencing service: A central service within HAPI that facilitates mapping and cross-referencing between different code systems. This service would ensure interoperability and consistency when working with multiple code systems simultaneously.

# 7. Benefits and Impact

Supporting additional code systems in the Terminology Server would bring several benefits to users and stakeholders:

- Improved data interoperability: The integration of additional code systems would enable users to work with a wider range of healthcare data, enhancing interoperability and exchangeability between different systems and organizations.

- Enhanced data accuracy: By providing support for more comprehensive code systems, the Terminology Server increases the accuracy and specificity of medical data captured and processed.

- Expanded use cases: The integration of additional code systems allows the Terminology Server to support a broader range of use cases, accommodating various healthcare domains and specialties.

# 8. Open Questions and Concerns

While the proposed solution seems promising, there are several open questions and concerns that need to be addressed:

- Scalability: How will the proposed plugin system handle a large number of code systems? Are there any limitations or performance considerations?

- Standardization: How will the plugin system ensure standardization across different code systems? Are there any conflicting naming or coding conventions that need to be resolved?

- Maintenance and community contribution: How can the Terminology Server maintainers and stakeholders contribute to the development and maintenance of code system plugins? Is there a process in place to handle contributions and updates from external sources?

# 9. Conclusion

The integration of additional code systems into the Terminology Server is a significant step towards improving healthcare data management and interoperability. By implementing a universal mechanism for ingesting extra codes, the Terminology Server can expand its scope, accommodate various healthcare domains, and provide a more comprehensive solution for users.

The proposed plugin system, along with code system adapters and mapping services, offers a scalable and extensible approach to integration. However, open questions and concerns regarding scalability, standardization, and community contributions need to be addressed before proceeding with implementation.
