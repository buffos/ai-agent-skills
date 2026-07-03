# Artifact Priority

Use the strongest available artifacts first.

## Highest Value

- `docs/architecture/<capability-slug>/prd.md`
- `docs/architecture/<capability-slug>/canonical-domain-model.md`
- `docs/architecture/<capability-slug>/canonical-use-cases.md`
- `docs/architecture/<capability-slug>/canonical-api-cli-contract.md`
- `docs/architecture/<capability-slug>/acceptance-scenarios.md`

These should define the intended product behavior.

## Supporting Value

- `docs/architecture/<capability-slug>/readiness-review.md`
- `docs/architecture/<capability-slug>/domain-glossary.md`
- `docs/architecture/<capability-slug>/discovery-notes.md`
- `docs/architecture/<capability-slug>/requirements-gap-analysis.md`
- `docs/architecture/<capability-slug>/orchestration-status.md`

These help explain weaknesses, vocabulary, and process state.

## Rule

If richer canonical artifacts exist, do not fall back to PRD-only slicing.

Use the whole reference set so issue boundaries reflect:

- domain rules
- use-case boundaries
- external contract shape
- acceptance behavior

## Stop Condition

If the current artifacts are contradictory or obviously incomplete, do not generate agent-ready issues until the gap is resolved.
