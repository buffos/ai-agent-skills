# Architecture Suite Flowchart

```mermaid
flowchart TD
    A["Start: One selected capability"] --> B{"Capability bounded in .okf?"}
    B -- "No" --> B1["Route to fog-of-war-planning"]
    B -- "Yes" --> C["bounded-capability-spec-orchestrator<br/>Inventory artifacts and choose next step"]

    C --> D{"What exists now?"}

    D -- "Only vague idea" --> E["requirements-discovery-interviewer<br/>Produce discovery-notes.md"]
    E --> F["domain-glossary-extractor<br/>Produce domain-glossary.md"]
    F --> G["requirements-gap-analyzer<br/>Produce requirements-gap-analysis.md"]

    D -- "Discovery exists but messy" --> G
    D -- "PRD exists, canonical docs missing" --> H{"Terminology stable?"}
    H -- "No" --> F
    H -- "Yes" --> I["canonical-domain-modeler<br/>Produce canonical-domain-model.md"]

    D -- "PRD and domain model exist" --> J["canonical-use-case-modeler<br/>Produce canonical-use-cases.md"]
    D -- "Full artifact set exists, confidence low" --> M["architecture-readiness-reviewer<br/>Produce readiness-review.md"]
    D -- "Normal bounded flow" --> G

    G --> K["prd-author<br/>Produce prd.md"]
    F --> K
    K --> I
    I --> J
    J --> L["canonical-contract-author<br/>Produce canonical-api-cli-contract.md"]
    L --> N["acceptance-scenario-author<br/>Produce acceptance-scenarios.md"]
    N --> M

    M --> O{"Ready for implementation?"}
    O -- "No" --> P["Route back to the right upstream skill"]
    P --> G
    P --> F
    P --> K
    P --> I
    P --> J
    P --> L

    O -- "Yes" --> Q["reference-docs-to-issues<br/>Create issue breakdown and local issue files"]
    Q --> R["process-reference-issue<br/>Implement one approved issue"]

    R --> S{"Implementation exposes spec gap?"}
    S -- "Yes" --> T["Update requirements-gap-analysis.md<br/>Route back upstream"]
    T --> G
    S -- "No" --> U["Move issue to done<br/>Update registry"]

    V["Common reroute rules"] -.-> F
    V -. "unstable terms" .-> F
    V -. "contradictions or missing info" .-> G
    V -. "unclear scope or non-goals" .-> K
    V -. "weak business semantics" .-> I
    V -. "unstable commands or queries" .-> J
```

## Reading Notes

- The orchestrator is the router, not a replacement for the specialist skills.
- The default build sequence is:
  gap analysis -> glossary -> PRD -> domain -> use cases -> contract ->
  scenarios -> readiness review.
- The flow is intentionally non-linear. Later artifacts can force a return to
  earlier clarification or modeling steps.
- Issue execution is downstream of the full reference-doc pipeline, not a
  parallel shortcut around it.
