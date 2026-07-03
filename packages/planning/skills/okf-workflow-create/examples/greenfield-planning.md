---
type: workflow
title: Greenfield Planning
description: Turn a vague product idea into an initial planning graph and next-step implementation path.
tags: [workflow, planning, greenfield]
timestamp: 2026-07-02T20:00:00Z
triggers:
  - new repo
  - no planning graph yet
prerequisites:
  - docs/agents/issues/issues.md
outputs:
  - .okf/project.md
  - .okf/capabilities/
related_skills:
  - fog-of-war-planning
  - okf-planning-profile
  - bounded-capability-spec-orchestrator
---

# Purpose

Create the first durable planning map for a new product repo.

# When To Use

- The repo has no planning graph yet.
- The product idea is still broad.

# Prerequisites

- Repository baseline exists.
- No planning-profile nodes are present yet.

# Sequence

1. Run `fog-of-war-planning`.
2. Use `okf-planning-profile` to create the root project node and initial capabilities.
3. If one capability becomes bounded, continue to `bounded-capability-spec-orchestrator`.

# Decision Points

- If `.okf/` exists but has no planning-profile nodes, reuse the bundle and add the planning graph into it.
- If the selected capability remains broad, continue decomposition instead of writing a PRD.

# Outputs

- Initial planning graph in `.okf/`
- Next-step routing into PRD or further exploration

# Related Skills

- `fog-of-war-planning`
- `okf-planning-profile`
- `bounded-capability-spec-orchestrator`
