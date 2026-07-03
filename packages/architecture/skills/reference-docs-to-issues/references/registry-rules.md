# Registry Rules

Use this format for `issues/issues.md`.

Architecture-scoped issue registries should retain explicit references to:

- owning capability node path
- artifact root
- issue file path

```markdown
# Issues Registry

| # | Title | Category | Owning Capability | Artifact Root | Issue File | State | Blocked by |
|---|---|---|---|---|---|---|---|
| 001 | Short issue title | feature | `/.okf/.../checkout.md` | `docs/architecture/checkout/` | `issues/pending/001-short-issue-title.md` | ready-for-agent | — |
| 002 | Another issue | feature | `/.okf/.../checkout.md` | `docs/architecture/checkout/` | `issues/pending/002-another-issue.md` | ready-for-human | 001 |
```

## Column Rules

- **#**: zero-padded issue number
- **Title**: short descriptive title matching the file
- **Category**: usually `feature` or `bug`
- **Owning Capability**: absolute or repo-root-relative path to the owning
  capability node when `.okf/` exists, such as `/.okf/.../<capability>.md`.
  If the repo is not using OKF yet, use `—`.
- **Artifact Root**: the architecture artifact directory for the issue, usually
  `docs/architecture/<capability-slug>/`.
- **Issue File**: the current local markdown issue file path. This must match
  the actual file location and should be updated when the issue moves from
  `issues/pending/` to `issues/done/`.
- **State**:
  - `needs-triage`
  - `needs-info`
  - `ready-for-agent`
  - `ready-for-human`
  - `done`
  - `wontfix`
- **Blocked by**: comma-separated issue numbers or `—`

## State Assignment

- fully specified `AFK` issues -> `ready-for-agent`
- `HITL` issues -> `ready-for-human`
- issues with unresolved details -> `needs-info`
- externally reported unclear work -> `needs-triage`
- completed issues -> `done`

## Max Issue ID Section

Always maintain:

```markdown
# Current Max Issue ID

NNN
```

## Consistency Rules

- Every issue row must include the same owning capability and artifact root that
  appear in the issue file.
- The registry is the routing index for implementation. Do not leave `Issue
  File` implicit.
- When an issue is completed and moved to `issues/done/`, update the `Issue
  File` cell to the new path and set `State` to `done`.
