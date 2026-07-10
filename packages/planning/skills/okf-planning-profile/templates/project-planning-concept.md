---
type: <project | capability | shared-concern | decision-surface>
title: <Human-readable planning concept name>
description: <Single sentence summarizing the concept.>
tags: [<tag>, <tag>]
timestamp: <ISO 8601, e.g. 2026-06-14T10:00:00Z>
# Add local profile keys below when your repo defines them, for example:
# state: <foggy | bounded | specified | implemented>
# project: </project.md>
# parent: </project.md>
# children:
#   - </capabilities/example.md>
# shared_with:
#   - </shared/search.md>
# artifact_root: docs/architecture/example-capability
# discovery_notes: docs/architecture/example-capability/discovery-notes.md
# gap_analysis: docs/architecture/example-capability/requirements-gap-analysis.md
# orchestration_status: docs/architecture/example-capability/orchestration-status.md
# prd: docs/architecture/example-capability/prd.md
# glossary: docs/architecture/example-capability/domain-glossary.md
# domain_model: docs/architecture/example-capability/canonical-domain-model.md
# use_cases: docs/architecture/example-capability/canonical-use-cases.md
# contract: docs/architecture/example-capability/canonical-api-cli-contract.md
# scenarios: docs/architecture/example-capability/acceptance-scenarios.md
# readiness_review: docs/architecture/example-capability/readiness-review.md
# issues:
#   - docs/agents/issues/pending/123-example.md
# adrs:
#   - docs/agents/adr/0001-example.md
# verification:
#   # catalog-only records verification intent but never blocks issue closure.
#   # Use when-supported to require tests only where the relevant harness exists,
#   # or required to require every applicable listed test before closure.
#   mode: <catalog-only | when-supported | required>
#   deferred_requires_reason: true
#   surfaces:
#     backend-boundary: <catalog-only | when-supported | required>
#     frontend-integration: <catalog-only | when-supported | required>
#     end-to-end: <catalog-only | when-supported | required>
---

# Intent

<What this concept is trying to achieve from the product or workflow perspective.>

# Scope

<What belongs inside this concept today, and what does not.>

# Relationships

- Parent: [<parent concept>](</path/to/parent.md>)
- Child: [<child concept>](</path/to/child.md>)
- Shared concern: [<shared concept>](</path/to/shared.md>)
- Artifact root: [<artifact root>](</docs/architecture/example-capability/>)
- Downstream PRD: [<prd>](</docs/architecture/example-capability/prd.md>)

# Notes

<Keep this file conceptual. Link out to PRDs, ADRs, or code instead of copying detailed implementation content here.>
