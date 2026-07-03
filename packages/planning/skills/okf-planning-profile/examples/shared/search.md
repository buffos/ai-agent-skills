---
type: shared-concern
title: Search
description: Shared retrieval and discovery concern used across multiple product capabilities.
tags: [planning, shared, search]
timestamp: 2026-07-02T19:00:00Z
project: /project.md
shared_with:
  - /capabilities/youtube/index.md
  - /capabilities/youtube/inbox.md
intent: Provide reusable search behavior and vocabulary across otherwise separate product capabilities.
scope: Shared search semantics, reuse decisions, and cross-capability discovery concerns.
adrs:
  - docs/agents/adr/0012-shared-search-foundation.md
---

# Intent

Capture search as a reusable concern so multiple capabilities do not reinvent
discovery behavior independently.

# Scope

This node exists because search behavior is reused and worth reasoning about on
its own. Capability-specific UX still belongs inside the owning capability nodes.

# Relationships

- Project: [Personal Organizer](../project.md)
- Linked capability: [YouTube](../capabilities/youtube/index.md)
- Linked capability: [YouTube Inbox](../capabilities/youtube/inbox.md)

# Notes

This is a graph cross-link, not a structural parent. Shared concerns should not
replace the main capability hierarchy.
