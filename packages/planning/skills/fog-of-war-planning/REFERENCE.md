# Fog of War Planning Reference

This file defines the orchestration workflow for the planning suite.

The canonical planning-node profile now lives in
[../okf-planning-profile/REFERENCE.md](../okf-planning-profile/REFERENCE.md).

Use it as the single source of truth for:

- orchestrator behavior
- session routing
- mode and frontier discipline
- topology confirmation policy
- progress-reporting expectations
- planning flow integration with PRDs and issues

## Purpose

The map lives in `.okf/`. It is the durable navigation layer for the product.

PRDs are detailed implementation documents. Issue files are delivery slices. ADRs record hard-to-reverse decisions. The concept graph should point to them, not absorb them.

Use the planning profile for node shape, graph semantics, planning states, and
the recommended `.okf/` directory layout.

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
- hand off a bounded capability to architecture spec work
- maintenance only

Do not ask an ungrounded generic opener when the graph already exists.
Do not silently pick the next foggy node.

When resuming after interruption or compaction, first restate:

- the last confirmed topology
- any unconfirmed ideas, if present
- current mode options
- current candidate frontiers

Persisted graph state is the baseline for resumption, not permission to skip
the questioning workflow.

## Mode discipline

### `clear fog`

Use this mode to interrogate broad territory and make the shape of the problem
visible.

Allowed actions:

- ask questions
- summarize clarified boundaries
- propose candidate child nodes or shared concerns

Disallowed actions unless separately confirmed:

- durable topology writes
- shared-concern promotion
- structural splits
- state advancement based only on inference

### `organize or reshape the map`

Use this mode for confirmed topology work such as:

- splitting a node into children
- adding a new capability
- promoting a shared concept
- relinking, renaming, or restructuring nodes

### `tighten a bounded capability`

Use this mode when the node is no longer broad territory and should move toward
exact language, exact specification, and implementation-ready artifact work.

## Frontier selection

Before substantive work on an existing map, surface the active frontier:

- current `foggy` nodes
- current `bounded` nodes
- recently touched nodes
- candidate shared concerns

Ask the user which frontier to work on. Do not assume endless left-to-right
progress through all `foggy` nodes.

## Exit test for fog clearing

Stop interrogating a parent node once all of these are true:

- its purpose is understandable in one sentence
- its boundary against siblings is understandable
- its main child territories are visible
- the main actors and inputs/outputs are known
- remaining uncertainty is mostly inside children

This is the point where the node can leave pure fog-clearing focus, even if
some or all of its children remain `foggy`.

Mixed-state maps are expected. The suite should support some nodes being
`foggy`, others `bounded`, others `specified`, and others `implemented` at the
same time.

## Progress reporting

Whenever a node changes state, explicitly report:

- the node that changed
- the old state
- the new state
- the total count of `foggy`, `bounded`, `specified`, and `implemented` nodes

This report is part of the workflow, not optional commentary.

## Routing contract

- `foggy` territory routes to `$grill-me`
- `bounded` territory routes to the architecture suite, starting with `bounded-capability-spec-orchestrator`
- `specified` territory routes to issue slicing, or to PRD refresh only when linked artifacts are stale or incomplete

The required path into specification is:

```text
foggy -> bounded -> architecture-spec pipeline -> readiness review -> specified
```

## Bounded-node decision point

When a node becomes `bounded`, the orchestrator must explicitly guide the next
step rather than just exposing the mode list again.

Offer these choices for that bounded node:

- `tighten this bounded node with the architecture spec pipeline`
- `hand off this bounded node to issue slicing if specs already exist`
- `refine one of this node's children instead`

### When to recommend `tighten this bounded node with the architecture spec pipeline`

Recommend this when:

- the node boundary is clear but terminology is still loose
- important internal decisions remain unresolved
- related docs, PRDs, scenarios, or ADRs still need reconciliation
- there is not yet one exact, implementation-ready specification set for the node

### When to recommend direct issue-slicing handoff

Recommend this when:

- the node already has a coherent PRD plus the required architecture artifacts
- the readiness review is clean enough
- the main decisions are already made
- implementation slices can be created without another clarification pass

### When to recommend refining children instead

Recommend this when:

- the bounded parent is clear, but its children are the true next planning
  frontiers
- writing a PRD for the parent would still be too broad
- the parent mainly serves as a navigation layer above more meaningful child
  slices

This decision point should be explicit whenever a node enters or is selected in
the `bounded` state.

## Existing-skill integration targets

These are follow-on changes for the existing skills.

### Architecture suite

- If `.okf/` exists, treat the selected capability node as the scope owner.
- Read the selected capability node, its parent, relevant siblings, and linked shared concepts.
- Produce one exact specification set for that bounded capability.
- Write the generated artifact references back into the capability concept.
- Mark the node `specified` only after the readiness review is clean enough.

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
