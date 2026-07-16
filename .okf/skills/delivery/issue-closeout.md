---
type: Skill
title: issue-closeout
description: Finalize a verified local delivery issue after acceptance criteria and any required human-review gate pass, including archival, registry and blocker maintenance, durable-artifact synchronization, and validation.
tags: ["skill", "delivery", "issue-closeout"]
timestamp: 2026-07-16T00:00:00Z
repo_path: packages/delivery/skills/issue-closeout
package: /packages/delivery.md
source_skill_file: packages/delivery/skills/issue-closeout/SKILL.md
---

# Overview

Finalizes a verified delivery issue after all acceptance criteria and any applicable human-review gate pass. It owns dated archival, active-registry removal, blocker cleanup, declared PRD/architecture/OKF synchronization, and final validation; calling processors retain readiness decisions and implementation work.

# Placement

- Package: [/packages/delivery.md](/packages/delivery.md)
- Package skill index: [./index.md](./index.md)
- Repository: [/repository.md](/repository.md)
- Invoked after verification by [process-issue](/skills/delivery/process-issue.md) and [process-reference-issue](/skills/architecture/process-reference-issue.md).

# Source Assets

- Skill instructions: [../../../packages/delivery/skills/issue-closeout/SKILL.md](../../../packages/delivery/skills/issue-closeout/SKILL.md)
