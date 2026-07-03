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
prd: docs/agents/issues/prd-youtube.md
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
- Downstream PRD: [prd-youtube.md](../../../../docs/agents/issues/prd-youtube.md)

# Notes

This node is `specified` because the detailed behavior is assumed to be captured
in the linked PRD. It is not `implemented` yet unless the linked issue set
exhausts the scoped work.
