---
name: prd-to-issues
description: Break a PRD into independently-workable issues and write each as a local markdown file in issues/pending. Use when the user wants to turn a PRD into a list of concrete tasks.
---

# PRD to Issues

Break a PRD into independently-grabbable issues using vertical slices (tracer bullets), written as local markdown files.

## Process

### 1. Locate the PRD

Ask the user for the PRD file path (e.g. `issues/prd.md`).

If the PRD is not already in your context window, read it from the file.

### 2. Explore the codebase (optional)

If you have not already explored the codebase, do so to understand the current state of the code.

### 3. Draft vertical slices

Break the PRD into **tracer bullet** issues. Each issue is a thin vertical slice that cuts through ALL integration layers end-to-end, NOT a horizontal slice of one layer.

Slices may be 'HITL' or 'AFK'. HITL slices require human interaction, such as an architectural decision or a design review. AFK slices can be implemented and merged without human interaction. Prefer AFK over HITL where possible.

<vertical-slice-rules>
- Each slice delivers a narrow but COMPLETE path through every layer (schema, API, UI, tests)
- A completed slice is demoable or verifiable on its own
- Prefer many thin slices over few thick ones
</vertical-slice-rules>

### 4. Quiz the user

Present the proposed breakdown as a numbered list. For each slice, show:

- **Title**: short descriptive name
- **Type**: HITL / AFK
- **Blocked by**: which other slices (if any) must complete first
- **User stories covered**: which user stories from the PRD this addresses

Ask the user:

- Does the granularity feel right? (too coarse / too fine)
- Are the dependency relationships correct?
- Should any slices be merged or split further?
- Are the correct slices marked as HITL and AFK?

Iterate until the user approves the breakdown.

### 5. Create the issue files

For each approved slice, write a markdown file in `issues/pending` using the naming pattern `issues/NNN-short-title.md` (e.g. `issues/001-add-user-auth.md`).

**Numbering:** Read the `# Current Max Issue ID` section at the bottom of `docs/issues/issues.md`. The value there is the highest issue number ever assigned. Start numbering new issues from `max + 1`. If the section or file does not exist, fall back to scanning `issues/pending/` and `issues/done/` for the highest existing number.

Create files in dependency order (blockers first) so you can reference real filenames in the "Blocked by" field.

Do NOT use `gh issue create` or any GitHub CLI commands. Do NOT reference GitHub issue numbers. Use local filenames for all cross-references.

<issue-template>
## Parent PRD

`issues/prd.md` (or whichever PRD file was used)

## What to build

A concise description of this vertical slice. Describe the end-to-end behavior, not layer-by-layer implementation. Reference specific sections of the parent PRD rather than duplicating content.

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Blocked by

- Blocked by `issues/pending/NNN-title.md` (if any)

Or "None - can start immediately" if no blockers.

## User stories addressed

Reference by number from the parent PRD:

- User story 3
- User story 7

</issue-template>

Do NOT close or modify the parent PRD file.

### 6. Create or update the issues registry

After all issue files are created, create or update an `issues.md` file in the same directory as the PRD (e.g., `issues/issues.md`).

If the file already exists, **append** the new issues to the existing table. Do not overwrite existing rows.

If the file does not exist, create it with the header and all new rows.

<issues-registry-format>
# Issues Registry

| # | Title | Category | PRD | State | Blocked by |
|---|---|---|---|---|---|
| 001 | Short title from the issue | feature | prd-feeds.md | ready-for-agent | — |
| 002 | Another issue title | bug | prd-email.md | needs-triage | 001 |
</issues-registry-format>

**Column definitions:**

- **#**: Zero-padded issue number (e.g., `001`, `012`)
- **Title**: Short descriptive title matching the issue filename
- **Category**: `feature` or `bug`
- **PRD**: The PRD sub-document this issue originates from (e.g., `prd-feeds.md`, `prd-email.md`, `prd-youtube.md`, or `prd.md` for cross-cutting issues)
- **State**: One of:
  - `needs-triage` — maintainer needs to evaluate
  - `needs-info` — waiting on reporter for more information
  - `ready-for-agent` — fully specified, ready for an AFK agent
  - `ready-for-human` — needs human implementation
  - `wontfix` — will not be actioned
- **Blocked by**: Comma-separated issue numbers (e.g., `001, 003`) or `—` if none

**State assignment rules:**
- AFK issues that are fully specified → `ready-for-agent`
- HITL issues → `ready-for-human`
- Issues with open questions or missing details → `needs-info`
- New issues from external reporters → `needs-triage`

### 7. Update the max issue ID

After appending all new rows to the registry, update the `# Current Max Issue ID` section at the bottom of `issues.md` to reflect the highest issue number just created. This ensures future runs of `/prd-to-issues` or `/report-bug` will pick up where this batch left off.

The section format is:

```markdown
# Current Max Issue ID

NNN
```

Where `NNN` is the zero-padded number of the last issue created (e.g., `054`). If the section does not exist, create it at the end of the file.
