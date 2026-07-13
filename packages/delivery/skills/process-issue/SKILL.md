---
name: process-issue
description: Implement a specific issue by number or auto-select the next non-blocking issue from the registry. Use when user wants to process, implement, work on, pick up, or start an issue, or says "next issue", while keeping any `.okf` capability graph current.
---

# Process Issue

Implement a specific issue or the next non-blocking issue if a number is not provided.

If `.okf/` exists, use `$okf-planning-profile` and read [../../../planning/skills/okf-planning-profile/REFERENCE.md](../../../planning/skills/okf-planning-profile/REFERENCE.md) before changing capability-node state or artifact references.

`process-issue` owns the shared issue-execution lifecycle. Architecture-grounded
work enters through `$process-reference-issue` first.

## Process

### 1. Load the issues registry

Read the issues registry from `docs/agents/issues/issues.md`.

If the file does not exist at that path, ask the user for the correct path.

### 2. Find the issue to implement

**If the user specified an issue number:**

- Locate it in the issues table. If it does not exist, inform the user.
- If the state is `awaiting-human-review`, ask the user to confirm that the
  declared review gate has been completed; after explicit confirmation, resume
  the closure checks without reimplementing the issue.
- If the state is NOT `ready-for-agent` or `awaiting-human-review`, inform the
  user of the current state and stop.
- If it is blocked by other issues, inform the user which issues must be resolved first to unlock it. **Do not attempt implementation — blocked means blocked.**

**If the user did NOT specify a number:**

- Select the first issue in the table where `Blocked by` is `—` (no blockers) AND `State` is `ready-for-agent`.
- If no such issue exists, inform the user.

### 3. Gather context from completed blockers

Before starting implementation, check if the issue had any blockers that are now resolved (files in `docs/agents/issues/done/`).

Read those completed issue files to understand the interfaces, patterns, types, and conventions established by the prior work. This context is critical for maintaining consistency.

If `.okf/` exists, locate the owning capability concept before implementation. Read the concept node, its linked PRD, and any linked shared concepts relevant to the issue. Use `$okf-planning-profile` to interpret state and reference fields.

### 4. Implementation phase

Read the issue file from `docs/agents/issues/pending/`. If the file is not found, inform the user and stop.

Read the issue description and acceptance criteria.

If the issue is a bug and contains an `Artifact sync required` section, treat
that section as part of the required completion scope, not as optional notes.

Determine whether the issue requires any of:

- `.okf` owner updates
- architecture artifact updates such as PRD, contract, use cases, scenarios, or glossary

If those updates are marked as required, include them in the implementation
plan and completion checks.

Use TDD and design practices when the issue or repository convention requires
them; otherwise use proportionate internal tests and implementation practices.

**Progress tracking:**
- When any acceptance criterion is met, mark it as checked (`[x]`) in the issue file.
- When all criteria are met, run all tests and check for build and lint errors.
- When an `Artifact sync required` section exists, do not treat the issue as
  complete until the required `.okf` and architecture updates are also done.

**Failure handling:**
- If tests fail or the build breaks, attempt to fix obvious errors first.
- If fixes don't resolve the problem, add the unresolved items as new acceptance criteria (e.g., `- [ ] All tests pass`, `- [ ] Build completes without errors`) and continue working on them.
- Do NOT leave the issue in a broken state. Stay with it until all criteria — including any newly added ones — are green.

### 5. Update issues registry, pending folder, and graph

After all acceptance criteria are met, tests pass, and the build is clean:

- If the issue metadata declares a review gate other than `none`, keep the
  issue in `pending/`, update its registry state to `awaiting-human-review`,
  and report the exact visual or product review the user must perform. Do not
  move it to `done` until the user explicitly confirms the gate.
- If the issue has no review gate, continue directly with the closure steps
  below.

- Move the resolved issue file to `docs/agents/issues/done/` and prepend the filename with a date stamp: `YYYYMMDD-NNN-short-title.md` (e.g., `20260509-001-switch-sqlite-pure-go.md`).
- Remove the resolved issue's row from `docs/agents/issues/issues.md`.
- Remove the resolved issue number from the `Blocked by` column of any other issue in the table (since it is no longer blocking them).
- If the issue had user stories associated with it, find the correct PRD file to update by reading the **PRD** column from the issue's row in the registry. The PRD column contains the sub-PRD filename (e.g., `prd-feeds.md`, `prd-email.md`, `prd-youtube.md`) or `prd.md` for cross-cutting issues. Open the corresponding file at `docs/agents/issues/<prd-filename>` and mark the referenced user stories as done. For example: `17. As a user, I want to rename...` becomes `17. [done] As a user, I want to rename...`

If `.okf/` exists:

- update the owning capability concept's `issues` references to point at the new done path
- refresh any progress notes needed to reflect what changed
- only mark the capability `implemented` if the node's scoped work is actually exhausted, not merely because one issue is done

If the issue declared artifact-sync requirements:

- verify the declared `.okf` owner update was made, if required
- verify each declared architecture artifact update was made, if required
- do not close the issue while those declared updates are still missing

For bug issues:

- a pure implementation bug may close with code and tests alone only when the
  issue explicitly says no `.okf` or architecture sync is required
- a spec-correction bug is not complete until the code change and the declared
  architecture updates both exist
- a topology/ownership bug should normally have been rerouted before
  implementation; if one still reaches this skill, stop and repair ownership
  through `fog-of-war-planning` before closing it

Use `$okf-planning-profile` as the authority for what `implemented` means and how capability references should be maintained.

### 6. Report to the user

Present a short, concise summary of what was implemented and verified.

Provide a commit message using conventional commit format:

- **Features:** `feat(scope): description` (e.g., `feat(folders): add CRUD repository with tree queries`)
- **Bug fixes:** `fix(scope): description` (e.g., `fix(sync): stop fetching videos for unfollowed channels`)

Match the scope to the feature area (e.g., `folders`, `sync`, `inbox`, `auth`, `ai`, `email`, `search`, `docker`).
