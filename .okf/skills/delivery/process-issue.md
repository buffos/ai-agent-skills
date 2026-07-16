---
type: Skill
title: process-issue
description: Implement a specific issue by number or auto-select the next non-blocking issue from the registry. Use when user wants to process, implement, work on, pick up, or start an issue, or says "next issue", while keeping any `.okf` capability graph current.
tags: ["skill", "delivery", "process-issue"]
timestamp: 2026-07-16T00:00:00Z
repo_path: packages/delivery/skills/process-issue
package: /packages/delivery.md
source_skill_file: packages/delivery/skills/process-issue/SKILL.md
---

# Overview

Implement a specific issue by number or auto-select the next non-blocking issue from the registry. It retains responsibility for implementation and verification, then hands off eligible work to [issue-closeout](/skills/delivery/issue-closeout.md) for shared completion bookkeeping.

# Placement

- Package: [/packages/delivery.md](/packages/delivery.md)
- Package skill index: [./index.md](./index.md)
- Repository: [/repository.md](/repository.md)

# Source Assets

- Skill instructions: [../../../packages/delivery/skills/process-issue/SKILL.md](../../../packages/delivery/skills/process-issue/SKILL.md)
- Shared closeout skill: [/skills/delivery/issue-closeout.md](/skills/delivery/issue-closeout.md)
# Notes

This concept exists to make the repository's skill inventory retrievable through OKF without re-scanning the package tree.
