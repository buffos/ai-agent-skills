---
name: okf-visualize
description: Render an Open Knowledge Format (OKF) bundle as a self-contained interactive HTML graph. Use when asked to visualize, graph, preview, or explore an OKF bundle.
---

# OKF Visualize

Run the bundled renderer against the target bundle. Default to the project's
`.okf/` directory when no path is given.

Resolve `scripts/okf-visualize.mjs` relative to this `SKILL.md`, then run:

```bash
node scripts/okf-visualize.mjs [bundle-dir] [-o output.html]
```

Optional flags:

- `-o`, `--out`: output HTML path. Defaults to `<bundle>/viz.html`.
- `-t`, `--title`: graph title shown in the header.
- `-l`, `--link`: optional source URL shown in the header.
- `--layout`: initial layout. One of `force`, `radial`, or `grid`.
- `--max-body`: maximum body characters stored per concept in the output.

The script is OS-agnostic and directory-agnostic. It fails fast if the global
Node.js package `yaml` is missing and prints the exact install command:

```bash
npm install -g yaml
```

Interpret the result:

- The output is a single self-contained HTML file. No backend or browser-side
  install is required.
- Concept nodes are colored by `type` and linked by markdown cross-links.
- Clicking a concept opens its details, outgoing links, and backlinks.
