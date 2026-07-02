---
name: repo-buffos-setup
description: Scaffold the standard docs/agents repository structure used by Buffo's workflow skills. Use when starting a new project, bootstrapping repo documentation structure, or repairing a repo so issue, PRD, ADR, and context skills can work consistently.
---

# Repo Buffos Setup

Set up the standard `docs/agents/` structure that the repo workflow skills
expect.

## Bootstrap

1. Inspect the repository root for an existing `docs/agents/` tree.
2. Ensure these root files exist:

- `README.md`
- `CODING_STANDARDS.md`
- `.gitignore`

Create them only if they are missing.
3. Create any missing directories from this baseline:

```text
docs/
  agents/
    adr/
    contexts/
    issues/
      pending/
      done/
.codex/
  skills/
scripts/
tmp/
```

4. Do not delete or rename existing files or folders during setup.
5. If the repo already has similar top-level material elsewhere, leave it in
   place unless the user explicitly asks to migrate it.
6. Treat bootstrap as idempotent: if a required file or directory already
   exists, skip it. Do not recreate it, overwrite it, or refresh its contents.

Completion criterion: the full baseline directory tree exists, and the root
`README.md`, `CODING_STANDARDS.md`, and `.gitignore` exist.

## Seed files

After the folders exist, create only the minimal starter files that unblock the
other workflow skills:

- `docs/agents/issues/issues.md` if missing
- `README.md` only if missing
- `CODING_STANDARDS.md` only if missing
- `.gitignore` only if missing

For `docs/agents/issues/issues.md`, use this minimal format and initialize the
current max issue number to `000`. The companion issue skills read that value so
the first real created issue becomes `001`.

```md
# Issues Registry

| # | Title | Category | PRD | State | Blocked by |
|---|---|---|---|---|---|

# Current Max Issue ID

000
```

For `.gitignore`, if the file is missing, create it with exactly:

```gitignore
# Build output
/bin

# Temp folder
/tmp

# Runtime data
**/data/

# Editor / IDE
/.vscode

# External code references
docs/external-reference

# Executables
*.exe

# Logs
*.log
```

Do not create placeholder ADRs, placeholder issue files, empty sub-PRDs, or
starter content for `README.md` or `CODING_STANDARDS.md`. This skill sets up the
structure only.

Completion criterion: required folders exist, and any created seed files are the
minimum needed for the dependent skills to start working.

## Compatibility check

Before finishing, confirm the repo is ready for these skills:

- `write-a-prd`
- `prd-to-issues`
- `process-issue`
- `report-bug`
- `grill-me-with-docs`
- `domain-modeling`

If one of them still expects a missing path, create the missing directory or
starter file rather than leaving the repo half-configured.
