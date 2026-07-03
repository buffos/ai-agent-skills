---
name: okf-migrate-planning-graph
description: Infer and build an `.okf` planning graph for an existing repository from docs, repo structure, code, and runtime clues. Use when migrating a legacy repo into the planning suite, rebuilding a missing capability map, or creating a durable repository TOC from non-OKF sources.
disable-model-invocation: true
---

# OKF Migrate Planning Graph

Build a planning graph for an existing repository when the map does not exist
yet or must be rebuilt from legacy evidence.

This skill is separate from `fog-of-war-planning`.

- `fog-of-war-planning` is for greenfield product exploration or ongoing map refinement
- `okf-migrate-planning-graph` is for inferring the first planning graph from an existing repo

Before non-trivial work, read both:

- [REFERENCE.md](./REFERENCE.md)
- [../okf-planning-profile/REFERENCE.md](../okf-planning-profile/REFERENCE.md)

Use `$okf-planning-profile` whenever this workflow needs to create, update,
split, link, or advance planning-map nodes.

## Workflow

### 1. Detect migration context

Determine which of these situations applies:

- no `.okf/` exists
- `.okf/` exists but contains no planning graph
- `.okf/` exists and contains a partial or stale planning graph

Do not treat bare `.okf/` presence as meaning the planning graph already
exists.

### 2. Choose migration mode

Choose the strongest mode supported by local evidence:

- `docs-first migration`
- `hybrid migration`
- `code-first migration`

Use:

- `docs-first` when durable product docs already exist
- `hybrid` when docs exist but are incomplete and code must fill gaps
- `code-first` when the repo lacks durable planning docs and structure/code are the main evidence

State the chosen mode and why.

### 3. Build the evidence inventory

Collect evidence in descending reliability.

Potential sources:

- existing `.okf/`
- `docs/agents/contexts/`
- PRDs
- ADRs
- issue registries
- repo/package/app/plugin structure
- routes, handlers, schemas, migrations
- test structure
- runtime/config/provider integration clues
- code naming and cross-module dependencies

Prefer durable product/documentation sources over implementation detail when
they disagree.

### 4. Infer candidate topology conservatively

Infer:

- one root project concept
- candidate top-level capabilities
- candidate child capabilities where the evidence is strong enough
- candidate shared concerns
- outward links to PRDs, ADRs, and issues when they exist

When evidence is weak, prefer fewer broader `foggy` nodes over fake precision.

Do not build the first graph from done issues alone.

### 5. Assign confidence

For every inferred node or shared concern, assign a confidence level:

- `high`
- `medium`
- `low`

Use confidence to describe how strongly the evidence supports the inference,
not whether the feature itself is important.

### 6. Present the migration proposal before writing

Before durable writes, present:

- the proposed root concept
- the proposed top-level capabilities
- any proposed child capabilities
- any proposed shared concerns
- the evidence basis for each major area
- the confidence bands
- areas that still need human confirmation

Always confirm before writing topology.

### 7. Write the initial planning graph

After confirmation:

- create `.okf/` if needed
- preserve existing non-planning OKF content when present
- create the root project node
- create inferred capabilities and shared concepts
- attach discovered PRDs, ADRs, and issue references
- keep uncertain nodes `foggy`
- add or refresh `index.md` and `log.md`

### 8. Emit a migration report

Create a durable migration report in the bundle log and summarize:

- migration mode used
- evidence sources used
- major inferred nodes
- low-confidence areas
- follow-up fog-clearing candidates

### 9. Hand off to ongoing planning

After the initial graph exists:

- route unresolved `foggy` territory to `fog-of-war-planning`
- route `bounded` nodes to `grill-with-docs`
- route `specified` nodes to downstream PRD/issue workflows as appropriate

This skill should not try to exhaustively refine the entire inferred graph in
one migration run.
