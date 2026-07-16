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

### 5. Route verified work through shared closeout

After all acceptance criteria are met, tests pass, and the build is clean:

- If the issue metadata declares a review gate other than `none`, keep the
  issue in `pending/`, update its registry state to `awaiting-human-review`,
  and report the exact visual or product review the user must perform. Do not
  invoke `$issue-closeout` until the user explicitly confirms the gate.
- If the issue has no review gate, or the user has explicitly approved its
  pending gate, invoke `$issue-closeout` with the resolved issue file, registry
  row, ownership context, acceptance evidence, and artifact-sync requirements.

`$issue-closeout` exclusively owns moving completed files, removing active
registry rows, clearing blockers, synchronizing PRD/architecture/OKF records,
and validating the closeout. Do not duplicate or partially perform those
steps here.

### 6. Report to the user

Present a short, concise summary of what was implemented and verified.

Provide a commit message using conventional commit format:

- **Features:** `feat(scope): description` (e.g., `feat(folders): add CRUD repository with tree queries`)
- **Bug fixes:** `fix(scope): description` (e.g., `fix(sync): stop fetching videos for unfollowed channels`)

Match the scope to the feature area (e.g., `folders`, `sync`, `inbox`, `auth`, `ai`, `email`, `search`, `docker`).
