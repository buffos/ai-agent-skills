# OKF Workflow Reference

This package defines a local workflow-documentation profile on top of OKF.

Use it for durable workflow knowledge that should live in `.okf/workflows/`
without polluting the generic `okf` skill.

## Purpose

A workflow concept documents a reusable process such as:

- greenfield planning
- bounded feature expansion
- PRD-to-issues slicing
- bug report to implementation

The workflow concept is the durable description of the process. An executable
container skill may still exist separately to run that workflow.

## Location

Default location:

```text
.okf/
  workflows/
```

Each workflow is one markdown file. Use `index.md` for cataloging.

## Recommended frontmatter

Use normal OKF frontmatter plus these workflow-oriented fields when they help:

```yaml
type: workflow
title: Greenfield Planning
description: Turn a vague product idea into an initial capability map and next-step plan.
tags: [workflow, planning]
timestamp: 2026-07-02T20:00:00Z
triggers:
  - new repo
  - vague product idea
prerequisites:
  - docs/agents/issues/issues.md
outputs:
  - .okf/project.md
  - .okf/capabilities/
related_skills:
  - fog-of-war-planning
  - okf-planning-profile
```

These extra fields are local conventions, not generic OKF requirements.

## Recommended body sections

- `# Purpose`
- `# When To Use`
- `# Prerequisites`
- `# Sequence`
- `# Decision Points`
- `# Outputs`
- `# Related Skills`

Keep the workflow explicit and ordered. Prefer lists over long prose.

## Catalog rule

Maintain `.okf/workflows/index.md` as a progressive-disclosure catalog of the
available workflows.

## Relationship to other skills

- `okf` remains generic and format-level
- `okf-planning-profile` owns planning-node semantics
- `okf-workflow-create` owns workflow concept authoring

Executable container skills may point to workflow concepts, but the workflow
concept itself should stay durable and repo-specific.
