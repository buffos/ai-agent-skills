---
type: workflow
title: <Workflow name>
description: <Single sentence describing the workflow.>
tags: [workflow]
timestamp: <ISO 8601, e.g. 2026-07-02T20:00:00Z>
triggers:
  - <when this workflow should be used>
prerequisites:
  - <required file, state, or artifact>
outputs:
  - <artifact created or updated by the workflow>
related_skills:
  - <skill-name>
---

# Purpose

<Why this workflow exists.>

# When To Use

- <trigger or repo state>

# Prerequisites

- <required path, artifact, or condition>

# Sequence

1. <first skill or action>
2. <second skill or action>
3. <third skill or action>

# Decision Points

- If <condition>, then <reroute or alternate step>.

# Outputs

- <artifact path or durable outcome>

# Related Skills

- `<skill-name>`
