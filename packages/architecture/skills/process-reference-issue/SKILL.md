---
name: process-reference-issue
description: Process a local issue derived from the canonical architecture reference set. Use after `reference-docs-to-issues` when an issue must be grounded in its PRD, domain model, use cases, contract, acceptance scenarios, readiness review, and project verification policy before the shared issue-execution lifecycle runs.
---

# Process Reference Issue

Process an architecture-grounded issue through the shared `$process-issue`
execution lifecycle.

This architecture entry point adds reference grounding and verification policy
to the generic lifecycle.

## Before the shared lifecycle

1. Resolve the selected issue from `docs/agents/issues/issues.md` and verify
   its registry row matches the issue file.
2. Read the owning capability concept, its linked shared concepts, and the
   parent artifacts/anchors listed by the issue. Read applicable PRD, domain
   model, use cases, external contract, acceptance scenarios, and readiness
   review; the issue file is not the full source of truth.
3. Read the root project concept's `verification` policy. If it is missing,
   route to `$fog-of-war-planning` to initialize it. Ensure every addressed
   scenario has verification obligations using only `planned`, `implemented`,
   `deferred`, or `not-applicable` values.
4. Read [references/scenario-traceability.md](references/scenario-traceability.md)
   and build a working trace for every canonical rule or use case the issue
   changes: `source rule -> acceptance scenario -> issue criterion -> planned
   verification`. A source rule without a scenario is a material gap unless it
   has an explicit deferred owner. Do not silently rely on an issue's shorter
   acceptance-criteria summary when the canonical artifacts add behavior.
5. If the artifact set has a material contradiction or gap, record it in the
   owning capability's `requirements-gap-analysis.md` and route back to the
   appropriate architecture authoring step. Do not invent product behavior.
6. Read the issue's execution type and review gate. An `AFK` issue with a
   `visual-review` or `product-approval` gate is still ready for agent
   implementation; after automated acceptance checks pass, move it to
   `awaiting-human-review` and pause until the user completes the gate. A
   `HITL` issue requires human implementation or decision-making and should not
   be treated as an ordinary AFK implementation task.

## Shared execution lifecycle

After those checks, follow `$process-issue` for implementation, blocker
handling, acceptance-checkbox updates, and verification. Once the reference
trace and applicable review gate permit closure, invoke `$issue-closeout` for
the shared archive, registry, blocker, artifact, and OKF bookkeeping. Do not
duplicate closeout steps in this architecture entry point.

Before closure, apply the root verification policy:

- `catalog-only` permits planned obligations and does not require a test
  harness.
- `when-supported` requires applicable coverage only when the relevant harness
  exists; otherwise record a reasoned deferral.
- `required` requires every applicable obligation to be implemented.

`not-applicable` is valid for a product without the corresponding surface.

Before closing, complete the scenario traceability check: every addressed
canonical rule and acceptance scenario must point to an executed verification
artifact, or to a named deferred owner that the verification policy permits.

## Boundary

Use `$process-issue` directly for bugs, chores, and other non-architecture
delivery issues. Use this skill for issues created from the architecture
reference-doc pipeline.
