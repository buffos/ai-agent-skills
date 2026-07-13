---
name: reference-docs-to-issues
description: Break a PRD and the canonical reference artifact set into independently workable local issues. Use when the product specs are stable enough that Codex should translate them into dependency-aware vertical slices, propose the breakdown for approval, and then write local markdown issue files plus an issue registry. Prefer this over PRD-only issue generation when any of the canonical artifacts exist because it can ground issue boundaries in domain rules, use cases, contracts, acceptance scenarios, and readiness findings.
---

# Reference Docs to Issues

Break the reference artifact set into independently grabbable local issues using vertical slices.

This skill is the implementation bridge between the reference documents and actual work items. It should produce thin, demoable, dependency-aware issues that an agent can process one at a time.

If `.okf/` exists, begin from the owning capability node and its linked
artifacts. Scope the issue set to that capability, then write the created issue
references back into the node.

## Source of Truth

Use whichever of these artifacts exist, in this priority:

1. `docs/architecture/<capability-slug>/prd.md`
2. `docs/architecture/<capability-slug>/canonical-domain-model.md`
3. `docs/architecture/<capability-slug>/canonical-use-cases.md`
4. `docs/architecture/<capability-slug>/canonical-api-cli-contract.md`
5. `docs/architecture/<capability-slug>/acceptance-scenarios.md`
6. `docs/architecture/<capability-slug>/readiness-review.md`
7. `docs/architecture/<capability-slug>/domain-glossary.md`
8. `docs/architecture/<capability-slug>/discovery-notes.md`
9. `docs/architecture/<capability-slug>/requirements-gap-analysis.md`
10. `docs/architecture/<capability-slug>/orchestration-status.md`

If only some artifacts exist, use the strongest available set. If the artifacts are too weak or contradictory to support issue breakdown, stop and tell the user to route back through the missing authoring or review skill first.

Use [references/artifact-priority.md](references/artifact-priority.md).

## Process

### 1. Inventory the Artifact Set

Check which source artifacts exist and treat them as the current reference set.

If the user explicitly names a different source file or folder, use that instead.

Before creating issues, determine:

- which artifacts are present
- which are authoritative
- whether the set is implementation-ready enough

If the node-scoped readiness review contains unresolved high-severity findings, do not blindly generate agent-ready issues from a broken spec set. Surface that problem first.

### 2. Explore the Codebase When Relevant

If the user wants issues for an existing codebase, inspect the current implementation so the issue breakdown reflects what already exists versus what still needs to be built.

This is especially important for:

- brownfield systems
- partially implemented products
- gaps between spec and code

### 3. Derive Vertical Slices

Break the reference set into **tracer bullet** issues.

Each issue should be a thin vertical slice that cuts through all relevant layers needed to make the behavior real and verifiable.

Use [references/slice-rules.md](references/slice-rules.md).

Rules:

- each slice must deliver a narrow but complete path
- a completed slice must be demoable or verifiable on its own
- prefer many thin slices over few thick ones
- do not create horizontal layer-only issues unless the work is genuinely cross-cutting and cannot be sliced vertically
- for user-visible behavior, do not accept a slice that leaves the behavior
  behind the product surface

Execution types:

- `AFK`: an agent can implement and test the issue directly from the written
  specification. An AFK issue may still require a post-implementation review
  gate before closure.
- `HITL`: implementation itself requires human input, a product decision,
  human-only access, or human implementation. Do not use HITL merely because
  a completed UI needs visual inspection.

Review gates are separate metadata:

- `none`: no additional human gate beyond normal acceptance verification.
- `visual-review`: the agent implements and tests the feature, then pauses for
  the user to inspect the visual/UX result before closure.
- `product-approval`: the user must approve a product behavior or decision
  after implementation before closure.

Prefer `AFK` with an explicit review gate over `HITL` when the agent can perform
the implementation autonomously.

### 4. Ground the Slices in the Artifact Set

Each proposed issue should be anchored to whichever of these exist:

- PRD sections
- domain concepts or invariants
- use cases or application services
- contract endpoints or CLI commands
- acceptance scenarios
- readiness review findings, if the issue exists to resolve one

Do not create issues that float free from the reference documents.

If acceptance scenarios or use cases imply user-visible reachability, the issue
must include the work needed to make that behavior reachable and observable on
the product surface.

### 5. Present the Breakdown for Approval

Before writing files, present the proposed breakdown as a numbered list.

For each slice, show:

- **Title**
- **Execution type**: `AFK` or `HITL`
- **Review gate**: `none`, `visual-review`, or `product-approval`
- **Blocked by**
- **Artifacts covered**
- **Acceptance scenarios covered** when available
- **Exposure note**: whether the slice includes the user-facing exposure path
  or is intentionally non-user-facing

Ask the user:

- Is the granularity right?
- Are the dependency relationships correct?
- Should any slices be split or merged?
- Are the execution types and review gates correct?

Iterate until the user approves the breakdown.

Reject and revise any proposed slice for user-visible behavior when it would
allow the behavior to remain behind the product surface.

### 6. Create the Issue Files

After approval, write one markdown file per issue in:

- `issues/pending/`

Use the filename pattern:

- `issues/pending/NNN-short-title.md`

Create files in dependency order so blockers are written first.

Read the current max issue ID from:

- `issues/issues.md`

Look for the section:

```markdown
# Current Max Issue ID

NNN
```

If that section does not exist, fall back to scanning:

- `issues/pending/`
- `issues/done/`

for the highest existing issue number.

Do not use GitHub issues or `gh issue create`. These are local issue files only.

### 7. Use the Issue Template

Use the template in [references/issue-template.md](references/issue-template.md).

Each issue file must include:

- issue metadata
- parent artifacts
- what to build
- acceptance criteria
- blocked by
- artifact anchors
- acceptance scenarios addressed
- verification obligations mapped to the addressed stable scenario IDs

For each relevant scenario, classify backend-boundary, frontend-integration,
and end-to-end coverage as `planned`, `implemented`, `deferred`, or
`not-applicable`. Read the root project concept's `verification` policy before
deciding whether any item is a closure requirement. Do not invent a test
harness merely to satisfy a `catalog-only` policy.

For user-visible slices, the issue must also make the exposure obligation
explicit in the `What to build` or acceptance criteria so the slice cannot be
closed while the feature remains behind the product surface.

If some artifact types do not exist, omit only the irrelevant references.

### 8. Create or Update the Issues Registry

Create or update:

- `issues/issues.md`

Append new issues to the existing table. Do not overwrite existing rows.

Registry convention:

- keep active and completed issues in the same registry
- completed issues remain in the table with state `done`
- issue file history lives in `issues/done/`, but the registry remains the index of all issued work
- every row must explicitly include the owning capability node path, artifact root, and issue file path

Use the registry rules in [references/registry-rules.md](references/registry-rules.md).

### 9. Update the Max Issue ID

After appending the new rows, update:

```markdown
# Current Max Issue ID

NNN
```

so future runs continue numbering correctly.

## Brownfield Guidance

For brownfield projects, the issue set should reflect what is already implemented.

Do not generate issues as if the codebase were empty.

Instead:

- compare the artifact set to the existing code
- generate only the missing or corrective slices
- create explicit spec-alignment issues when implementation and reference docs differ

If brownfield code already implements behavior behind the product surface,
generate the missing exposure slice rather than treating the feature as
complete.

If the artifact set is weak, route back to:

- `requirements-gap-analyzer`
- `architecture-readiness-reviewer`

before generating implementation issues.

## Anti-Patterns

Do not:

- generate horizontal layer-only issues by default
- generate one giant “implement the whole feature” issue
- generate issues from the PRD only when richer artifacts exist
- ignore acceptance scenarios
- ignore readiness-review findings
- create issue files before the user approves the breakdown
- let a user-visible feature be considered covered while it remains behind the
  product surface

## Output Contract

Produce:

- an approved issue breakdown
- local issue markdown files in `issues/pending/`
- an updated `issues/issues.md` registry
- an updated max issue ID
- issue rows and issue files that agree on owning capability, artifact root, and issue path
- when `.okf/` exists, appended `issues` references on the owning capability node

For user-visible capabilities, the issue set should make it impossible to mark
the capability complete while the feature remains behind the product surface.

If the artifact set is not strong enough, stop and report which upstream artifact must be fixed first.

## Resources

Read only what you need:

- [references/artifact-priority.md](references/artifact-priority.md): which artifacts to trust and how strongly
- [references/slice-rules.md](references/slice-rules.md): vertical-slice rules and dependency guidance
- [references/issue-template.md](references/issue-template.md): local issue file template
- [references/registry-rules.md](references/registry-rules.md): issue registry format and state rules
