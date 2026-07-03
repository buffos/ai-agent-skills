---
type: capability
title: YouTube Inbox
description: Review, triage, and act on newly collected YouTube videos.
tags: [planning, capability, youtube, inbox]
timestamp: 2026-07-02T19:00:00Z
state: specified
project: /project.md
parent: /capabilities/youtube/index.md
shared_with:
  - /shared/search.md
intent: Give the user a clear first-stop workflow for newly imported videos.
scope: Inbox listing, triage actions, and quick discovery of incoming YouTube items.
artifact_root: docs/architecture/youtube
prd: docs/architecture/youtube/prd.md
glossary: docs/architecture/youtube/domain-glossary.md
domain_model: docs/architecture/youtube/canonical-domain-model.md
use_cases: docs/architecture/youtube/canonical-use-cases.md
contract: docs/architecture/youtube/canonical-api-cli-contract.md
scenarios: docs/architecture/youtube/acceptance-scenarios.md
readiness_review: docs/architecture/youtube/readiness-review.md
issues:
  - docs/agents/issues/done/20260702-123-youtube-inbox.md
adrs:
  - docs/agents/adr/0005-youtube-quota-pacific-time-reset.md
---

# Intent

Turn incoming videos into a manageable work queue with clear status and action
paths.

# Scope

This node covers inbox-facing workflows only. Broader library management or AI
enrichment can live in sibling child capabilities later if needed.

# Relationships

- Parent: [YouTube](./index.md)
- Shared concern: [Search](../../../shared/search.md)
- Artifact root: [youtube architecture docs](../../../../docs/architecture/youtube/)
- Downstream PRD: [prd.md](../../../../docs/architecture/youtube/prd.md)

# Notes

This node is `specified` because the detailed behavior is assumed to be captured
in the linked PRD. It is not `implemented` yet unless the linked issue set
exhausts the scoped work.
