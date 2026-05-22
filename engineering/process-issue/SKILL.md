---
name: process-issue
description: Implement a specific issue by number or auto-select the next non-blocking issue from the registry. Use when user wants to process, implement, work on, pick up, or start an issue, or says "next issue".
---

# Process Issue

Implement a specific issue or the next non-blocking issue if a number is not provided.

## Process

### 1. Load the issues registry

Read the issues registry from `docs/issues/issues.md`.

If the file does not exist at that path, ask the user for the correct path.

### 2. Find the issue to implement

**If the user specified an issue number:**

- Locate it in the issues table. If it does not exist, inform the user.
- If the state is NOT `ready-for-agent`, inform the user of the current state and stop.
- If it is blocked by other issues, inform the user which issues must be resolved first to unlock it. **Do not attempt implementation — blocked means blocked.**

**If the user did NOT specify a number:**

- Select the first issue in the table where `Blocked by` is `—` (no blockers) AND `State` is `ready-for-agent`.
- If no such issue exists, inform the user.

### 3. Gather context from completed blockers

Before starting implementation, check if the issue had any blockers that are now resolved (files in `docs/issues/done/`).

Read those completed issue files to understand the interfaces, patterns, types, and conventions established by the prior work. This context is critical for maintaining consistency.

### 4. Implementation phase

Read the issue file from `docs/issues/pending/`. If the file is not found, inform the user and stop.

Read the issue description and acceptance criteria.

Start implementation using the `/tdd` skill and `/solid-principles` skill (if applicable).

**Progress tracking:**
- When any acceptance criterion is met, mark it as checked (`[x]`) in the issue file.
- When all criteria are met, run all tests and check for build and lint errors.

**Failure handling:**
- If tests fail or the build breaks, attempt to fix obvious errors first.
- If fixes don't resolve the problem, add the unresolved items as new acceptance criteria (e.g., `- [ ] All tests pass`, `- [ ] Build completes without errors`) and continue working on them.
- Do NOT leave the issue in a broken state. Stay with it until all criteria — including any newly added ones — are green.

### 5. Update issues registry and pending folder

After all acceptance criteria are met, tests pass, and the build is clean:

- Move the resolved issue file to `docs/issues/done/` and prepend the filename with a date stamp: `YYYYMMDD-NNN-short-title.md` (e.g., `20260509-001-switch-sqlite-pure-go.md`).
- Remove the resolved issue's row from `docs/issues/issues.md`.
- Remove the resolved issue number from the `Blocked by` column of any other issue in the table (since it is no longer blocking them).
- If the issue had user stories associated with it, find the correct PRD file to update by reading the **PRD** column from the issue's row in the registry. The PRD column contains the sub-PRD filename (e.g., `prd-feeds.md`, `prd-email.md`, `prd-youtube.md`) or `prd.md` for cross-cutting issues. Open the corresponding file at `docs/issues/<prd-filename>` and mark the referenced user stories as done. For example: `17. As a user, I want to rename...` becomes `17. [done] As a user, I want to rename...`

### 6. Report to the user

Present a short, concise summary of what was implemented and verified.

Provide a commit message using conventional commit format:

- **Features:** `feat(scope): description` (e.g., `feat(folders): add CRUD repository with tree queries`)
- **Bug fixes:** `fix(scope): description` (e.g., `fix(sync): stop fetching videos for unfollowed channels`)

Match the scope to the feature area (e.g., `folders`, `sync`, `inbox`, `auth`, `ai`, `email`, `search`, `docker`).
