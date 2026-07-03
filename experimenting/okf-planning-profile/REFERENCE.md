# OKF Planning Profile Reference

This file defines the local planning profile that sits on top of OKF for the
planning suite.

Use it as the single source of truth for:

- capability-node structure
- workflow state meanings
- state progress reporting
- handoff rules into PRD and issue workflows
- expectations for future migration work

This profile extends generic OKF practice; it does not replace it. Planning
bundles should still follow the normal OKF maintenance expectations for
directory `index.md` files, `log.md`, frontmatter, and cross-linking.

## Purpose

The map lives in `.okf/`. It is the durable navigation layer for the product.

PRDs are detailed implementation documents. Issue files are delivery slices. ADRs
record hard-to-reverse decisions. The concept graph should point to them, not
absorb them.

## Core model

### Graph shape

- One root project concept for the whole product.
- A primary hierarchy of capability concepts beneath that root.
- Exactly one structural parent per capability.
- Optional extra graph links for shared concerns that cut across capabilities.

### Primary concept unit

The default node is a capability concept:

- stable enough to discuss at product level
- broad enough to decompose into child capabilities
- narrow enough to eventually receive one PRD

Do not default to technical modules as the first cut.

For planning capability nodes, use `type: capability` by default. This includes
shared capabilities when they are modeled as capability-like cross-cutting
nodes inside the same planning graph. Use another `type` only when there is a
clear semantic reason, such as the root `project` node.

### Planning-graph detection

The presence of `.okf/` alone does not mean a planning graph exists.

Treat a planning graph as present only when the bundle contains planning-profile
nodes, for example:

- a root `project` node used by the planning map
- `capability` nodes
- planning fields such as `state`, `project`, `parent`, `children`, or
  `shared_with`

This allows generic OKF knowledge bundles to coexist with the planning map.

## Planning states

Use these frontmatter states on capability concepts:

- `foggy`: broad territory, mixed goals, or unresolved boundaries; not ready for exact specification
- `bounded`: one coherent outcome and bounded enough for exact questioning, but not yet fully specified
- `specified`: exact decisions are documented and the node has a linked PRD
- `implemented`: the scoped work for the node is complete according to its linked PRD and issues

State changes:

- `foggy -> bounded` after decomposition and boundary clarification
- `bounded -> specified` only after `$grill-with-docs` and PRD creation
- `specified -> implemented` only when downstream implementation exhausts the node's scoped work

Mixed-state graphs are expected. Do not wait for the entire map to leave
`foggy` before moving one node forward.

### Leaving `foggy`

A node is ready to stop being the main fog-clearing target when:

- its purpose is understandable in one sentence
- its boundary against siblings is understandable
- its main child territories are visible, even if still foggy
- its key actors and inputs/outputs are known
- the biggest uncertainty now lives inside its children

That is the threshold for handing the parent node off from pure interrogation
into either topology organization or bounded refinement, depending on what was
clarified.

### Required state-progress report

Whenever a node changes state, report:

- the node that changed
- the old state
- the new state
- the current totals of `foggy`, `bounded`, `specified`, and `implemented`

The planning suite should treat this as required user-facing output so the user
can track graph maturity over time.

## Recommended `.okf/` layout

Use a hierarchy that mirrors capability decomposition.

Example:

```text
.okf/
  index.md
  log.md
  project.md
  capabilities/
    index.md
    shared/
      index.md
    youtube/
      index.md
      search.md
      ai.md
    finance/
      index.md
```

PRDs remain flat in `docs/agents/issues/`. Issue files remain in `docs/agents/issues/pending/` and `docs/agents/issues/done/`.

Maintain directory `index.md` files and append durable bundle changes to
`log.md` in the same spirit as the generic `$okf` skill.

## Capability concept profile

Each capability concept should use normal OKF frontmatter plus these planning fields where applicable:

```yaml
type: capability
title: YouTube
state: foggy
project: /project.md
parent: /project.md
children:
  - /capabilities/youtube/search.md
shared_with:
  - /capabilities/shared/search.md
intent: Track and organize YouTube content relevant to the user.
scope: Personal video collection, discovery, and follow-up workflows.
prd: docs/agents/issues/prd-youtube.md
issues:
  - docs/agents/issues/pending/123-youtube-search.md
adrs:
  - docs/agents/adr/0005-youtube-quota-pacific-time-reset.md
```

### Field guidance

- `type`: use `capability` for planning capability nodes by default. Use
  `project` for the root project node, or another valid OKF type only when
  clearly justified.
- `state`: required for capability concepts in this suite
- `project`: required on capability concepts
- `parent`: required except for the root project concept
- `children`: include only structural children
- `shared_with`: cross-links to shared concepts
- `intent`: short statement of what the capability wants to achieve
- `scope`: short statement of what belongs in the capability today
- `prd`, `issues`, `adrs`: outward references to downstream artifacts

Keep the body short and conceptual. Do not dump implementation decisions, acceptance criteria, or long notes into the concept file.

## Existing-map operating model

On existing maps, the orchestrator should begin by choosing a mode and a
frontier rather than assuming the next node to touch.

Recommended modes:

- clear fog on an existing node
- organize or reshape the map
- tighten a bounded node
- add a new capability
- hand off a bounded node to PRD work
- maintenance only

In `clear fog` mode, no durable topology writes should happen until the user
confirms the proposed structural change.

## Shared-concern promotion rule

Promote a concern into its own concept when:

1. it appears in at least two capabilities, and
2. it has behavior, vocabulary, or policy worth reasoning about independently

Do not promote concerns that are merely incidental mentions.

## Orchestrator contract

### Greenfield run

1. Ask what the user wants to build.
2. Run lightweight comparable-product research.
3. Propose root and top-level capabilities.
4. Confirm before writing.
5. Create the initial `.okf/` graph.

### Existing-map run

Read the current root graph, summarize the durable state, and begin with an
explicit mode choice.

Offer grounded paths such as:

- clear fog on an existing node
- organize or reshape the map
- tighten a `bounded` capability
- add a new capability
- hand off a bounded capability to PRD work
- maintenance only

Do not ask an ungrounded generic opener when the graph already exists.
Do not silently pick the next foggy node.

## Routing contract

- `foggy` territory routes to `$grill-me`
- `bounded` territory routes to `$grill-with-docs`
- `specified` territory routes to `$write-a-prd` only when the PRD is missing or needs refresh from the concept node

The required path into specification is:

```text
foggy -> bounded -> grill-with-docs -> PRD -> specified
```

When a node is `bounded`, the orchestrator should explicitly decide between:

- tightening the bounded node with docs
- handing the bounded node to PRD creation now
- refining one of the node's children instead

Do not treat bounded state as a silent or self-explanatory handoff.

## Existing-skill integration targets

These are follow-on changes for the existing skills.

### `write-a-prd`

- If `.okf/` exists, stop treating the user prompt as the sole source of truth.
- Read the selected capability node, its parent, relevant siblings, and linked shared concepts.
- Write one PRD for that bounded capability.
- If `.okf/` does not exist, redirect back to `fog-of-war-planning` instead of inventing the map.

### `prd-to-issues`

- Read the originating capability node and linked shared concepts before slicing.
- Use graph context to avoid duplicate implementation tracks.
- Write created issue links back into the capability concept.

### `process-issue`

- Read the linked capability concept before implementation.
- Write back issue references and progress after implementation.
- Only mark a node `implemented` when the node's scoped work is actually exhausted.

### `report-bug`

- Resolve the owning capability or shared concept when possible.
- Keep issue creation in `docs/agents/issues/`.
- Write the bug issue link back into the owning concept node.

## Topology write policy

Always confirm before durable topology changes:

- initial graph creation
- new top-level capability
- splitting a capability into structural children
- promoting a shared concept

This is the default until the workflow has proved stable.
