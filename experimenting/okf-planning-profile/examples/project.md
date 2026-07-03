---
type: project
title: Personal Organizer
description: Personal knowledge and workflow system for managing videos, finances, bookmarks, and related tools.
tags: [planning, product, root]
timestamp: 2026-07-02T19:00:00Z
intent: Provide one integrated product surface for collecting, organizing, searching, and acting on personal information domains.
scope: Root planning node for the full product and its top-level capabilities.
children:
  - /capabilities/youtube/index.md
shared_with:
  - /shared/search.md
---

# Intent

Unify multiple personal-information domains inside one product while preserving a
clear capability map and reusable shared concerns.

# Scope

This node defines the whole product boundary. Feature-level implementation
details belong in child capability nodes and their linked PRDs.

# Relationships

- Child: [YouTube](./capabilities/youtube/index.md)
- Shared concern: [Search](./shared/search.md)

# Notes

This root node exists to anchor the graph and to give downstream skills one
stable top-level concept to attach capability structure beneath.
