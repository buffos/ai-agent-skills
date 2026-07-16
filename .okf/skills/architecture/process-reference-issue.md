---
type: Skill
title: process-reference-issue
description: Implement a specific local issue or auto-select the next non-blocking agent-ready issue from the local issue registry. Use when the user wants Codex to process, implement, pick up, start, or continue an issue from the artifact-grounded issue system, or says things like "next issue". This skill is designed for issues derived from the PRD and canonical reference documents, and it must escalate back to the reference-doc pipeline when implementation exposes a real spec gap.
tags: ["skill", "architecture", "process-reference-issue"]
timestamp: 2026-07-16T00:00:00Z
repo_path: packages/architecture/skills/process-reference-issue
package: /packages/architecture.md
source_skill_file: packages/architecture/skills/process-reference-issue/SKILL.md
---

# Overview

Implement a specific local issue or auto-select the next non-blocking agent-ready issue from the local issue registry. Use when the user wants Codex to process, implement, pick up, start, or continue an issue from the artifact-grounded issue system, or says things like "next issue". This skill is designed for issues derived from the PRD and canonical reference documents, and it must escalate back to the reference-doc pipeline when implementation exposes a real spec gap.

Before execution and closure, it requires a trace from each addressed canonical rule or use case through an acceptance scenario, issue criterion, planned verification, and executed evidence. Uncovered material rules are requirements gaps unless they have an explicit deferred owner.

After its reference-specific checks and verification, it hands off closure-eligible work to [issue-closeout](/skills/delivery/issue-closeout.md). That delivery skill exclusively performs shared archive, registry, blocker, artifact, and OKF completion bookkeeping.

# Placement

- Package: [/packages/architecture.md](/packages/architecture.md)
- Package skill index: [./index.md](./index.md)
- Repository: [/repository.md](/repository.md)

# Source Assets

- Skill instructions: [../../../packages/architecture/skills/process-reference-issue/SKILL.md](../../../packages/architecture/skills/process-reference-issue/SKILL.md)
- Skill README: [../../../packages/architecture/skills/process-reference-issue/README.md](../../../packages/architecture/skills/process-reference-issue/README.md)
- Scenario traceability guidance: [../../../packages/architecture/skills/process-reference-issue/references/scenario-traceability.md](../../../packages/architecture/skills/process-reference-issue/references/scenario-traceability.md)
- Shared closeout skill: [/skills/delivery/issue-closeout.md](/skills/delivery/issue-closeout.md)
# Notes

This concept exists to make the repository's skill inventory retrievable through OKF without re-scanning the package tree.
