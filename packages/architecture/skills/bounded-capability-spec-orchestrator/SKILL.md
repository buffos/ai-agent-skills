---
name: bounded-capability-spec-orchestrator
description: Coordinate the exact-spec workflow for one bounded capability, downstream of the `.okf` planning graph. Use when Codex must sequence gap analysis, terminology stabilization, PRD writing, canonical domain modeling, canonical use-case modeling, canonical contract authoring, acceptance-scenario generation, readiness review, and issue slicing so one selected capability ends up with a coherent, high-quality reference set before implementation begins.
---

# Bounded Capability Spec Orchestrator

Run the exact-spec pipeline for one bounded capability from planning handoff to implementation-ready artifact set.

This skill does not replace the specialist skills. It decides when each one should be used, in what order, and when to pause for clarification or review.

## Pipeline Goals

The orchestrator should produce a coherent node-scoped reference set that usually includes:

- gap report or interview ledger when needed
- domain glossary
- PRD
- canonical domain model
- canonical use-case/application-service model
- canonical API/CLI contract
- acceptance scenarios
- architecture readiness review

This orchestrator is downstream of `.okf/`. It is not a parallel product-mapping system. Not every run starts from zero, and not every run needs all artifacts rewritten. The orchestrator must adapt to the current state of the selected capability.

## Workflow

### 1. Resolve the Owning Capability First

If `.okf/` exists, require or resolve the owning capability node before doing
substantive work.

Read:

- the selected capability node
- its parent when needed
- relevant siblings when needed
- linked shared concepts when needed
- linked downstream artifacts if they already exist

If the node is not `bounded`, route back to `fog-of-war-planning` rather than
forcing exact specification.

### 2. Inventory What Already Exists

Identify which of these are already available:

- node intent and scope
- linked discovery notes
- glossary
- PRD
- canonical domain model
- canonical use-case model
- canonical contract
- acceptance scenarios
- readiness review

Do not restart the pipeline blindly. Reuse strong artifacts and focus only on what is missing or weak.

Use [references/pipeline-entry-points.md](references/pipeline-entry-points.md).

### 3. Assess Readiness and Gaps

Before deciding the next step, determine:

- what is missing
- what is contradictory
- what is too weak to build on
- what can be assumed safely

Use:

- `$requirements-gap-analyzer` when artifacts exist but have gaps
- `$requirements-discovery-interviewer` only when the selected node still lacks the minimum discovery needed for bounded specification
- `$domain-glossary-extractor` when terminology is unstable

### 4. Stabilize Vocabulary Early

If business language is drifting or overloaded, normalize it before writing major artifacts.

Use `$domain-glossary-extractor` early when:

- the same concept has multiple names
- actor and object terminology are fuzzy
- domain terms are still mixed with UI or technical jargon

### 5. Drive the Core Artifact Sequence

Default sequence:

1. `$requirements-gap-analyzer`
2. `$domain-glossary-extractor`
3. `$prd-author`
4. `$canonical-domain-modeler`
5. `$canonical-use-case-modeler`
6. `$canonical-contract-author`
7. `$acceptance-scenario-author`
8. `$architecture-readiness-reviewer`
9. `$reference-docs-to-issues` when the user wants to move into delivery

This is the default, not a rigid rule. Skip or revisit steps based on artifact quality and readiness.

Use [references/pipeline-sequencing.md](references/pipeline-sequencing.md).

### 6. Recurse When Later Artifacts Expose Earlier Weakness

If a downstream skill reveals an upstream problem:

- do not paper over it
- route back to the right earlier step

Examples:

- if domain modeling exposes unstable terminology, return to glossary work
- if contract authoring exposes missing command semantics, return to use-case modeling
- if readiness review exposes weak non-goals or inconsistent workflows, return to PRD or gap analysis

### 7. Keep the Artifact Set Coherent

At each stage, verify that new artifacts do not silently diverge from earlier ones.

Watch for drift in:

- vocabulary
- actor names
- workflow semantics
- rule thresholds
- status vocabularies
- externally visible outcomes

### 8. Preserve Momentum

Do not over-orchestrate.

If the user already has a strong PRD and only needs the domain model and use cases, do not force a full discovery cycle.

If one artifact is missing but everything else is stable, generate that artifact and then run readiness review.

### 9. End with Readiness Review

Before implementation begins, route the full set through `$architecture-readiness-reviewer`.

That review acts as the final gate to catch:

- contradictions
- missing decisions
- architecture bias
- testability gaps
- unstable comparison surface

### 10. Explain the Current State and Next Step

At any point, the orchestrator should be able to say:

- what artifacts exist
- what is strong
- what is weak
- what comes next
- why that next step is the right one

Use [references/orchestrator-output.md](references/orchestrator-output.md).

## Routing Rules

### Use the Smallest Necessary Next Step

Do not invoke the whole pipeline when one focused skill is enough.

### Prefer Clarification Before Fabrication

If an artifact is not ready to be derived cleanly, route to:

- `$requirements-gap-analyzer`
- or `$requirements-discovery-interviewer`

instead of guessing.

### Prefer Stable Vocabulary Before Deep Modeling

If names are unstable, do glossary work before domain modeling or contract work.

### Prefer Behavior Before Transport

Do not route to `$canonical-contract-author` before the use-case model is stable enough.

### Prefer Review Before Implementation

Always treat readiness review as the last major gate before issue slicing or implementation work.

## Anti-Patterns

Do not:

- restart from zero when solid artifacts exist
- let downstream artifacts silently rewrite upstream meaning
- skip gap analysis when contradictions are already visible
- create contracts before use cases are stable
- create use cases before the domain behavior is clear enough
- skip readiness review because the documents “look good”

## Output Contract

When orchestrating, produce:

- current artifact inventory
- strongest artifact(s)
- weak or missing artifact(s)
- recommended next skill to use
- why that step is next
- optional fallback path if the user wants a different order

When the pipeline is complete, produce:

- final artifact inventory
- residual risks
- readiness status for implementation

Persist the output to:

- `docs/architecture/<capability-slug>/orchestration-status.md`

Behavior:

- create the file if it does not exist
- update it as the pipeline progresses
- keep it scoped to the owning capability
- record current artifact inventory, next recommended step, and final completion status
- when `.okf/` exists, update the owning capability node's `orchestration_status` reference after writing

## Resources

Read only what you need:

- [references/pipeline-entry-points.md](references/pipeline-entry-points.md): how to choose a starting point based on what already exists
- [references/pipeline-sequencing.md](references/pipeline-sequencing.md): default flow and reroute rules
- [references/orchestrator-output.md](references/orchestrator-output.md): how to communicate current state and next steps
- [references/skill-routing.md](references/skill-routing.md): which specialist skill to use for which problem
