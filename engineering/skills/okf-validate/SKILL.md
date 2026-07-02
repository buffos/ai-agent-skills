---
name: okf-validate
description: Validate an Open Knowledge Format (OKF) bundle against the OKF v0.1 conformance rules. Use when asked to validate, lint, or check an OKF bundle, or before committing changes to one.
---

# OKF Validate

Run the bundled validator script against the target bundle. Default to the
project's `.okf/` directory when no path is given.

Resolve `scripts/okf-validate.mjs` relative to this `SKILL.md`, then run:

```bash
node scripts/okf-validate.mjs [bundle-dir] [--strict] [--json]
```

The script is OS-agnostic and directory-agnostic. It fails fast if the global
Node.js package `yaml` is missing and prints the exact install command:

```bash
npm install -g yaml
```

Interpret the result:

- `ERROR` means a mandatory conformance failure. The bundle is non-conformant.
  Fix every one.
- `warn` means non-blocking guidance only. It never blocks unless `--strict` is
  used.
- Exit code is non-zero for any error, or for any warning in `--strict` mode.
- Add `--json` for machine-readable output.
