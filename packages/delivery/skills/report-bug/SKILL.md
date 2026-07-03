---
name: report-bug
description: Report and fully specify a bug through structured interrogation, then file it as a local issue. Use when user wants to report a bug, mentions "bug report", "found a bug", "something is broken", or invokes /report-bug, while linking the bug back to the owning `.okf` concept when possible.
---

# Report a Bug

Interrogate the user about a bug until it is fully specified, then create the issue file and register it.

If `.okf/` exists, use `$okf-planning-profile` and read [../../../planning/skills/okf-planning-profile/REFERENCE.md](../../../planning/skills/okf-planning-profile/REFERENCE.md) before resolving concept ownership or writing issue links back into the graph.

## Process

### 1. Gather the initial report

Ask the user: **"What's broken? Describe what you see vs. what you expected."**

Record their answer. This is the starting point — it will almost never be complete.

### 2. Grill for details

Interview the user one question at a time until **all** of the following are established:

- **Steps to reproduce** — exact sequence to trigger the bug
- **Expected behavior** — what should happen
- **Actual behavior** — what happens instead
- **Environment** — OS, browser, versions, config (only what's relevant)
- **Frequency** — always, intermittent, one-time
- **Severity** — blocks work, causes data loss, cosmetic, annoyance

<grilling-rules>
- Ask ONE question at a time. Do not dump a questionnaire.
- If a question can be answered by exploring the codebase, do that instead of asking.
- Provide your best guess when asking — the user can confirm or correct.
- Stop grilling when you have enough to reproduce or clearly describe the bug.
- Err on the side of over-specifying. Vague bugs waste agent cycles.
</grilling-rules>

### 3. Confirm the summary

Present a structured summary to the user:

```markdown
**Bug:** [one-line title]
**Reproduce:** [steps]
**Expected:** [what should happen]
**Actual:** [what happens]
**Severity:** [blocks-work | data-loss | incorrect-behavior | cosmetic]
```

Ask: **"Does this capture it accurately? Anything to add or correct?"**

Iterate until the user confirms.

### 4. Determine dependencies

Check the existing `docs/agents/issues/issues.md` registry and `docs/agents/issues/pending/` files:

- Does this bug depend on a feature that hasn't been built yet? → add blocker
- Is this bug independent of all other issues? → no blockers (`—`)

Also determine which **PRD sub-document** this bug relates to:

- Check which feature domain the bug falls under (e.g., YouTube, Email, Feeds, or cross-cutting)
- Map it to the correct sub-PRD filename (e.g., `prd-youtube.md`, `prd-email.md`, `prd-feeds.md`, or `prd.md` for cross-cutting/standalone bugs)
- If unsure, ask the user which feature area the bug belongs to

If `.okf/` exists, also resolve the owning capability or shared concept when possible. Prefer the narrowest concept that actually owns the behavior. If the bug spans multiple capabilities, use the relevant shared concept or a cross-cutting node, following `$okf-planning-profile` graph semantics.

### 5. Create the issue file

**Numbering:** Read the `# Current Max Issue ID` section at the bottom of `docs/agents/issues/issues.md`. The value there is the highest issue number ever assigned. The new issue number is `max + 1`. If the section or file does not exist, fall back to scanning `docs/agents/issues/pending/` and `docs/agents/issues/done/` for the highest existing number.

<bug-issue-template>
## Parent PRD

`docs/agents/issues/<prd-filename>` (e.g., `docs/agents/issues/prd-email.md`) or "None — standalone bug" if unrelated to any PRD.

## What to fix

A clear description of the bug. Include steps to reproduce, expected vs actual behavior, and any relevant code paths or error messages discovered during the grilling.

## Acceptance criteria

- [ ] Bug no longer reproduces following the steps above
- [ ] [Any additional criteria from the grilling]
- [ ] No regressions in related functionality

## Blocked by

- `docs/agents/issues/pending/NNN-title.md` (if any)

Or "None — can start immediately" if no blockers.

## User stories addressed

Reference by number from the parent PRD (if applicable), or "None — bug fix".
</bug-issue-template>

### 6. Update the issues registry

Append a new row to `docs/agents/issues/issues.md` (or create the file if it doesn't exist):

| # | Title | Category | PRD | State | Blocked by |
|---|---|---|---|---|---|
| NNN | Short bug title | bug | prd-email.md | ready-for-agent | — |

**State rules:**
- Fully specified → `ready-for-agent`
- Needs human judgment to fix → `ready-for-human`
- Missing info despite grilling → `needs-info`

If `.okf/` exists, append the created bug issue path to the owning concept node's `issues` references after the issue file is created through `$okf-planning-profile`, using the planning profile contract for the node shape.

### 7. Update the max issue ID

After appending the new row to the registry, update the `# Current Max Issue ID` section at the bottom of `issues.md` to reflect the new issue number. This ensures future runs of `/prd-to-issues` or `/report-bug` will pick up where this one left off.

The section format is:

```markdown
# Current Max Issue ID

NNN
```

Where `NNN` is the zero-padded number of the issue just created (e.g., `055`). If the section does not exist, create it at the end of the file.
