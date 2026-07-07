# Architecture Suite Cheat Sheet

Use this suite after a capability is already `bounded` in `.okf/`. The goal is
to turn one bounded capability into a coherent, implementation-ready reference
set under `docs/architecture/<capability-slug>/`.

## Default Invocation Order

1. `bounded-capability-spec-orchestrator`
   Why: choose the smallest correct next step based on current artifact quality.
   Result: `orchestration-status.md` with artifact inventory, strongest areas,
   weak areas, next skill, and readiness status.

2. `requirements-discovery-interviewer`
   Why: only when the capability is still too vague for bounded specification.
   Result: `discovery-notes.md` with actors, workflows, rules, states,
   boundaries, non-goals, blockers, and assumptions.

3. `requirements-gap-analyzer`
   Why: find the highest-impact gaps or contradictions in existing artifacts.
   Result: `requirements-gap-analysis.md` with prioritized blockers,
   deferrable gaps, assumptions, and targeted follow-up questions.

4. `domain-glossary-extractor`
   Why: stabilize terminology before deeper modeling.
   Result: `domain-glossary.md` with canonical terms, definitions, aliases,
   discouraged synonyms, and semantic distinctions.

5. `prd-author`
   Why: define the product baseline without locking into one architecture.
   Result: `prd.md` with goals, non-goals, actors, workflows, rules,
   constraints, and acceptance intent.

6. `canonical-domain-modeler`
   Why: define the semantic business core.
   Result: `canonical-domain-model.md` with ubiquitous language, aggregates,
   entities, value objects, policies, invariants, lifecycles, and events.

7. `canonical-use-case-modeler`
   Why: define the stable application-layer behavior.
   Result: `canonical-use-cases.md` with commands, queries, service boundaries,
   orchestration expectations, transaction boundaries, idempotency, and
   failures.

8. `canonical-contract-author`
   Why: define stable external behavior from the use-case surface.
   Result: `canonical-api-cli-contract.md` with transport-neutral conventions,
   payload shapes, statuses, errors, idempotency rules, HTTP mapping, and CLI
   mapping.

9. `acceptance-scenario-author`
   Why: capture externally visible behavior as stable scenarios.
   Result: `acceptance-scenarios.md` with happy paths, policy branches,
   exceptions, failures, and read-side scenarios where relevant.

10. `architecture-readiness-reviewer`
    Why: final quality gate before implementation slicing.
    Result: `readiness-review.md` with findings by severity, residual risks,
    and implementation readiness assessment.

11. `reference-docs-to-issues`
    Why: break the reference set into thin, dependency-aware vertical slices.
    Result: approved issue breakdown, `issues/pending/*.md`, and updated
    `issues/issues.md`.

12. `process-reference-issue`
    Why: implement one approved issue while staying anchored to the reference
    docs.
    Result: code changes, updated acceptance checkboxes, issue moved to
    `issues/done/`, updated registry, or escalation back upstream if a true
    spec gap is found.

## Practical Routing Rules

- Start with `bounded-capability-spec-orchestrator` when you want the suite to
  decide the next step.
- Use `requirements-discovery-interviewer` only for pre-spec or severely
  underdefined capabilities.
- Use `requirements-gap-analyzer` when artifacts exist but cannot yet support
  the next artifact cleanly.
- Use `domain-glossary-extractor` before domain, use-case, or contract work if
  terms drift or collide.
- Do not run `canonical-contract-author` before the use-case model is stable.
- Always run `architecture-readiness-reviewer` before issue slicing when the
  intent is to move into implementation.
- If implementation reveals a real spec gap, route back upstream rather than
  silently inventing product behavior.

## Entry Points By Current State

- Only a vague idea exists:
  `requirements-discovery-interviewer` -> `domain-glossary-extractor` ->
  `requirements-gap-analyzer`
- Discovery notes exist but are messy:
  `requirements-gap-analyzer`, then `domain-glossary-extractor` if needed
- PRD exists but canonical docs do not:
  `domain-glossary-extractor` if terms are unstable, otherwise
  `canonical-domain-modeler`
- PRD and domain model exist:
  `canonical-use-case-modeler` -> `canonical-contract-author` ->
  `acceptance-scenario-author`
- Full artifact set exists but confidence is low:
  `architecture-readiness-reviewer`

## Reroute Triggers

- Back to discovery:
  core problem, actors, or workflows are still unstable
- Back to glossary:
  synonyms or overloaded terms are creating semantic drift
- Back to gap analysis:
  contradictions or missing information block the next artifact
- Back to PRD:
  later artifacts expose unclear scope, non-goals, or business capabilities
- Back to domain model:
  use cases or contracts reveal weak business semantics
- Back to use-case model:
  contracts reveal unstable commands, queries, or outcomes
- Back to review:
  the set looks complete and implementation is about to begin

## Artifact Set This Suite Produces

- `discovery-notes.md`
- `requirements-gap-analysis.md`
- `domain-glossary.md`
- `prd.md`
- `canonical-domain-model.md`
- `canonical-use-cases.md`
- `canonical-api-cli-contract.md`
- `acceptance-scenarios.md`
- `readiness-review.md`
- `orchestration-status.md`
- local issue files and issue registry entries
