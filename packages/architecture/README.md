# Architecture Skills

Architecture-focused reference-document skills for turning a bounded `.okf`
capability into a coherent exact-spec baseline before implementation starts.

## What This Suite Covers

This suite helps you move through four stages:

1. discovery and gap closing
2. reference document authoring
3. review and implementation slicing
4. issue processing

## Recommended Order

Use the suite in roughly this order when a capability is already `bounded`:

1. `bounded-capability-spec-orchestrator`
   Use when you want the suite to choose the next step for one selected capability.
2. `requirements-gap-analyzer`
   Use when the node or linked docs still have blocking ambiguity.
3. `domain-glossary-extractor`
   Use when vocabulary is unstable.
4. `prd-author`
   Write the product baseline.
5. `canonical-domain-modeler`
   Define the business model.
6. `canonical-use-case-modeler`
   Define commands, queries, and orchestration responsibilities.
7. `canonical-contract-author`
   Define the external API and CLI behavior.
8. `acceptance-scenario-author`
   Define stable behavior scenarios.
9. `architecture-readiness-reviewer`
    Review the full artifact set before implementation.
10. `reference-docs-to-issues`
    Slice the artifact set into vertical implementation issues.
11. `process-reference-issue`
    Implement one issue at a time.

## How The Skills Connect

- `bounded-capability-spec-orchestrator` is the coordinator for one bounded capability.
- `requirements-discovery-interviewer` is for very early or pre-OKF work.
- `requirements-gap-analyzer` is the normal clarification step inside the bounded-node pipeline.
- `prd-author`, `domain-glossary-extractor`, `canonical-domain-modeler`,
  `canonical-use-case-modeler`, `canonical-contract-author`, and
  `acceptance-scenario-author` create the durable reference set.
- `architecture-readiness-reviewer` is the gate before implementation.
- `reference-docs-to-issues` and `process-reference-issue` bridge from docs to
  code.

## Relationship To Fog Of War

`fog-of-war-planning` owns topology, node state, and routing in `.okf/`.

This architecture suite is downstream of `fog-of-war-planning`. It should be
used after a capability is `bounded`, not as a parallel planning system.

Its job is to turn one bounded capability into:

- node-scoped reference artifacts under `docs/architecture/<capability-slug>/`
- linked PRD material
- readiness review
- implementation issues

## Package Boundary

Keep this package when you want to select or install the entire architecture
specification workflow as one unit.

Use:

- `planning` for capability mapping and state progression
- `architecture` for exact specification of one bounded capability

## Example Flow

Example: you already bounded a `quote-to-order` capability in `.okf/`.

1. Run `bounded-capability-spec-orchestrator` on the selected capability node.
2. If the node still has blocking ambiguity, run `requirements-gap-analyzer`.
3. Run `domain-glossary-extractor` to stabilize terms like `Quote`, `Order`,
   `Approval`, and `Return`.
4. Run `prd-author` to write or refresh the node PRD.
5. Run `canonical-domain-modeler`, `canonical-use-case-modeler`,
   `canonical-contract-author`, and `acceptance-scenario-author`.
6. Run `architecture-readiness-reviewer` to catch contradictions and missing
   decisions.
7. Run `reference-docs-to-issues` to create local implementation issues.
8. Run `process-reference-issue` to execute the next ready issue.

See a concrete worked example in
[examples/bounded-capability-example.md](./examples/bounded-capability-example.md).
