---
type: Skill
title: acceptance-scenario-author
description: Derive stable, high-value acceptance scenarios from a PRD and canonical design artifacts. Use when Codex must turn already-modeled requirements into behavior-focused scenarios that capture happy paths, exceptions, policy branches, failure modes, and comparison-critical outcomes so the same product behavior can later be tested across architectures, application services, APIs, and CLIs. Do not use as a substitute for writing the requirements themselves.
tags: ["skill", "architecture", "acceptance-scenario-author"]
timestamp: 2026-07-15T00:00:00Z
repo_path: packages/architecture/skills/acceptance-scenario-author
package: /packages/architecture.md
source_skill_file: packages/architecture/skills/acceptance-scenario-author/SKILL.md
---

# Overview

Derive stable, high-value acceptance scenarios from a PRD and canonical design artifacts. Use when Codex must turn already-modeled requirements into behavior-focused scenarios that capture happy paths, exceptions, policy branches, failure modes, and comparison-critical outcomes so the same product behavior can later be tested across architectures, application services, APIs, and CLIs. Do not use as a substitute for writing the requirements themselves.

For lifecycle, timed, concurrent, multi-trigger, or multi-item behavior, it requires an explicit coverage decision for each relevant interaction: a canonical scenario, an explicit `not-applicable` or deferred decision, or a recorded requirements gap. It also calls out independent-work failure isolation where applicable.

# Placement

- Package: [/packages/architecture.md](/packages/architecture.md)
- Package skill index: [./index.md](./index.md)
- Repository: [/repository.md](/repository.md)

# Source Assets

- Skill instructions: [../../../packages/architecture/skills/acceptance-scenario-author/SKILL.md](../../../packages/architecture/skills/acceptance-scenario-author/SKILL.md)
- Skill README: [../../../packages/architecture/skills/acceptance-scenario-author/README.md](../../../packages/architecture/skills/acceptance-scenario-author/README.md)
- Stateful interaction matrix: [../../../packages/architecture/skills/acceptance-scenario-author/references/stateful-scenario-matrix.md](../../../packages/architecture/skills/acceptance-scenario-author/references/stateful-scenario-matrix.md)
# Notes

This concept exists to make the repository's skill inventory retrievable through OKF without re-scanning the package tree.
