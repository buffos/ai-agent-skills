---
name: issue-closeout
description: Finalize a verified local delivery issue after every acceptance criterion and required human-review gate pass. Use to archive the issue file, remove its active registry row, update blockers, synchronize required PRD, architecture, and OKF records, and validate the completed state.
---

# Issue Closeout

Use this skill only after implementation and verification are complete. The
calling issue processor retains responsibility for deciding whether the issue
is ready; this skill owns the common completion bookkeeping.

## 1. Confirm closure is allowed

- Resolve the issue's pending file and active `docs/agents/issues/issues.md`
  row. Read the issue metadata and its stated artifact-sync requirements.
- Confirm every acceptance criterion is checked, required verification passed,
  and any applicable review gate was explicitly approved by the user.
- If a review gate is still pending, keep the file in `pending/`, set its
  active registry state to `awaiting-human-review`, describe the required
  review, and stop. Do not partially close it.

## 2. Close the delivery record

- Move the issue file to `docs/agents/issues/done/` with the dated filename
  convention `YYYYMMDD-NNN-short-title.md`; update its suggested state to
  `done` when the file uses that metadata.
- Remove the completed issue's row from `docs/agents/issues/issues.md`. That
  registry is the active work queue, not a historical ledger.
- Remove the completed number from `Blocked by` cells of any remaining active
  issues. Preserve other blockers and normalize an empty cell to `—`.
- Do not reduce or otherwise alter `# Current Max Issue ID`.

## 3. Synchronize durable knowledge

- Update the issue's declared user stories and architecture artifacts. Do not
  infer a PRD path from a registry column; use the issue metadata and artifact
  anchors.
- When `.okf/` exists, update the owning capability's `issues` reference to
  the dated done path, refresh its timestamp and concise progress notes, and
  append one durable completion entry to `.okf/log.md`.
- Change a capability to `implemented` only when its complete scoped delivery
  is exhausted. Otherwise retain its state and identify the remaining active
  issue(s).
- Refresh an affected `index.md` only when a listed concept, directory, title,
  or description changed. Issue-path changes alone do not require an index
  rewrite.

## 4. Validate and report

- Verify the archived file exists, no active registry row remains, blocker
  updates are correct, and the maximum issue ID is unchanged.
- Run `git diff --check`. When `.okf/` exists, run `$okf-validate` and resolve
  every error.
- Report the archived path, registry removal, remaining blockers or active
  issues, durable-artifact updates, and validation results. Do not create a
  commit unless the calling task asks for one or another invoked workflow
  explicitly requires it.
