# OKF Migrate Planning Graph

`okf-migrate-planning-graph` builds an initial `.okf` planning graph for an
existing repository.

It is used when:

- a repo has no planning graph yet
- a repo has legacy docs, PRDs, ADRs, or issue history that should become a
  durable `.okf` map
- a repo has little or no planning documentation and the graph must be
  recovered from structure and code
- an existing planning graph is partial, stale, or missing large areas

## What It Does

This skill infers a conservative first planning graph from available evidence.

It is not the ongoing refinement orchestrator. Its job is to create the first
durable map or repair a missing one so that the rest of the planning suite can
take over.

## Core Idea

Migration is evidence-driven.

The skill reads what already exists in the repository and turns that into:

- one root project node
- top-level capabilities
- child capabilities where evidence is strong enough
- shared concerns when they clearly span multiple capabilities
- links to PRDs, ADRs, and issues where available

When evidence is weak, it prefers fewer broader `foggy` nodes rather than fake
precision.

## Migration Modes

### `docs-first migration`

Use when the repository already has strong durable planning evidence such as:

- context docs
- PRDs
- ADRs
- issue registries

In this mode, docs define the map and code mainly refines it.

### `hybrid migration`

Use when docs exist but are incomplete, stale, or too coarse.

In this mode:

- docs define the initial candidate map
- code and repo structure fill the gaps

### `code-first migration`

Use when the repo lacks durable planning docs and the graph must be inferred
mainly from code and structure.

In this mode, the graph should be more conservative.

## Evidence Sources

The skill uses evidence in descending reliability, roughly:

1. existing planning-map nodes, if any
2. other existing `.okf/` knowledge
3. product/context docs
4. PRDs
5. ADRs
6. issue registries and issue files
7. repo structure
8. code structure and naming
9. runtime/config/provider clues

If strong evidence conflicts, the skill should surface the conflict rather than
hide it.

## Confidence Model

Every inferred major node or shared concern should get a confidence level:

- `high`
- `medium`
- `low`

Confidence describes how strongly the evidence supports the inference, not
whether the inferred feature is important.

## How It Works

1. Detect whether `.okf/` exists
2. Detect whether a planning graph already exists
3. Choose migration mode
4. Build evidence inventory
5. Infer conservative candidate topology
6. Present proposal before writing
7. Write the initial `.okf/` graph after confirmation
8. Emit a migration report
9. Hand off unresolved areas to `fog-of-war-planning`

## Durable Outputs

This skill creates or updates:

- `.okf/project.md`
- `.okf/capabilities/...`
- `.okf/capabilities/shared/...`
- `.okf/index.md`
- directory `index.md` files
- `.okf/log.md`

It should preserve existing generic OKF content when present.

## Skills It Depends On

This skill depends directly on:

- [`okf-planning-profile`](../okf-planning-profile/) for planning-node shape and state semantics

It should work alongside:

- [`okf`](C:/Users/buffo/.agents/skills/engineering/skills/okf/) for generic OKF structure expectations
- [`okf-validate`](C:/Users/buffo/.agents/skills/engineering/skills/okf-validate/) if bundle validation is needed
- [`fog-of-war-planning`](../fog-of-war-planning/) for ongoing fog-clearing after migration

## Important Constraints

- Do not assume `.okf/` means a planning graph already exists.
- Do not build the first graph from done issues alone.
- Do not mirror directories or packages blindly into capability nodes.
- Always confirm topology before durable writes.
- Default uncertain inferred nodes to `foggy`.
