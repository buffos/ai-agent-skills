---
type: capability
title: YouTube
description: Track, organize, search, and enrich YouTube videos relevant to the user.
tags: [planning, capability, youtube]
timestamp: 2026-07-02T19:00:00Z
state: bounded
project: /project.md
parent: /project.md
children:
  - /capabilities/youtube/inbox.md
shared_with:
  - /shared/search.md
intent: Give the user a structured workflow for collecting and processing YouTube videos.
scope: Video intake, organization, enrichment, and discovery workflows for the YouTube domain.
artifact_root: docs/architecture/youtube
prd: docs/architecture/youtube/prd.md
glossary: docs/architecture/youtube/domain-glossary.md
domain_model: docs/architecture/youtube/canonical-domain-model.md
use_cases: docs/architecture/youtube/canonical-use-cases.md
contract: docs/architecture/youtube/canonical-api-cli-contract.md
scenarios: docs/architecture/youtube/acceptance-scenarios.md
readiness_review: docs/architecture/youtube/readiness-review.md
issues:
  - docs/agents/issues/pending/123-youtube-inbox.md
adrs:
  - docs/agents/adr/0005-youtube-quota-pacific-time-reset.md
---

# Intent

Model the YouTube domain as one bounded product capability that can later
decompose into narrower workflows.

# Scope

This capability owns YouTube-specific user workflows. It does not own generic
search policy beyond how YouTube integrates with the shared search concern.

# Relationships

- Parent: [Personal Organizer](../../../project.md)
- Child: [YouTube Inbox](./inbox.md)
- Shared concern: [Search](../../../shared/search.md)
- Artifact root: [youtube architecture docs](../../../../docs/architecture/youtube/)
- Downstream PRD: [prd.md](../../../../docs/architecture/youtube/prd.md)

# Notes

Because this node is `bounded`, it is small enough to move through
`grill-with-docs` and into PRD writing, but it is not yet marked `specified`
until the exact specification is written back into the graph.
