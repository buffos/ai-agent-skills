# Fog of War Planning

`fog-of-war-planning` is the orchestrator for `.okf`-first planning.

It is the skill that:

- builds or refines capability topology
- decides which node is the current planning frontier
- moves nodes through planning states
- routes work from planning into specification and delivery

It is not the exact-spec authoring layer and it is not the delivery layer.

## What It Owns

This skill owns:

- capability topology in `.okf/`
- planning states
- frontier selection
- mode selection
- routing to the next appropriate skill or workflow

## Planning States

- `foggy`: broad territory, unresolved boundaries
- `bounded`: clear enough to enter exact specification work
- `specified`: exact artifacts exist and readiness review is clean enough
- `implemented`: scoped work is exhausted

Typical progression:

`foggy -> bounded -> specified -> implemented`

Mixed-state graphs are normal.

## Core Routing

- `foggy` -> `grill-me`
- `bounded` -> architecture specification pipeline, starting with `bounded-capability-spec-orchestrator`
- `specified` -> issue slicing or targeted artifact refresh
- `implemented` -> maintenance only

## Operating Modes

On an existing graph, this skill should begin by choosing a mode.

### `clear fog on an existing node`

Use this when a node is broad and unclear.

Behavior:

- asks one question at a time
- uses `grill-me` style interrogation
- proposes boundaries, children, and shared concerns
- does not write topology until confirmed

### `clear fog from code on an existing node`

Use this for brownfield repos when the graph should align with implemented
behavior.

Behavior:

- inspects code first
- summarizes observed current behavior
- asks only what code cannot answer
- distinguishes current behavior from future intended behavior
- surfaces mismatches instead of hiding them

Primary transition:

- `foggy -> bounded`

### `organize or reshape the map`

Use this when the structure is already clear enough to write.

Behavior:

- splits nodes into children
- adds new capabilities
- promotes shared concerns
- relinks or reshapes topology
- updates `.okf/` after confirmation

### `add or extend a feature in an existing node`

Use this when the user says things like:

- add feature `X` to node `Y`
- extend node `Y` with `X`
- make `Y` support `X`

Behavior:

- resolves the target node
- inspects the node's current state
- decides whether the addition belongs inside the node, as a child capability,
  as a shared capability, or as a spec refresh
- routes the next step internally without forcing the user to know workflow
  names

This is the preferred public entry for feature additions on existing nodes.

### `tighten a bounded node`

Use this when a node is bounded but still needs exact clarification before
specification.

Behavior:

- tightens terminology
- reconciles related docs
- prepares the node for exact specification

### `tighten a bounded node from code`

Use this for brownfield repos when a bounded node should move toward exact
artifacts by grounding on current implementation.

Behavior:

- inspects code first
- summarizes current implemented behavior for the node
- creates or verifies exact-spec understanding from implementation plus docs
- surfaces gaps between current code and intended target design

Primary transition:

- `bounded -> specified`

### `add a new capability`

Use this when a feature-concept or domain area is missing from the graph.

Behavior:

- proposes where the new capability belongs
- confirms topology before writing

### `hand off a bounded node to architecture spec work`

Use this when a bounded node is ready for the exact-spec pipeline.

Behavior:

- routes into the architecture specification workflow

### `verify implemented from code`

Use this for brownfield repos when a specified node should be verified against
real implementation and delivery evidence.

Behavior:

- inspects linked issues, implementation, tests, and completion evidence
- checks whether the node's scoped work is actually exhausted
- distinguishes partially implemented from truly complete scope

Primary transition:

- `specified -> implemented`

### `maintenance only`

Use this for non-topology upkeep such as:

- refreshing links
- updating `index.md`
- appending `log.md`
- keeping the graph aligned with downstream artifacts

## Brownfield Workflow

For brownfield work, this skill should separate:

- current implemented behavior
- documented intended behavior
- future target behavior
- mismatches among them

The supporting detailed reference for that is:

- [BROWNFIELD.md](./BROWNFIELD.md)

That file exists so the main skill can stay procedural while the brownfield
rules remain explicit and consistent.

## Bounded Node Decision Point

When a node becomes `bounded`, the skill should explicitly recommend one of:

- tighten this bounded node with the architecture spec pipeline
- hand off this bounded node to issue slicing if specs already exist
- refine one of this node's children instead

This is important because a bounded node should not become a dead end.

## Greenfield vs Brownfield

### Greenfield

For greenfield work, the skill:

1. asks what the user wants to build
2. proposes a capability map
3. confirms topology
4. writes the first `.okf/` graph

### Brownfield

For brownfield work, the skill:

1. reads the current graph
2. chooses the relevant frontier
3. grounds the node in code and local docs when appropriate
4. updates topology or state only after the transition conditions are met

## Relationship To Other Skills

This skill depends directly on:

- [`okf-planning-profile`](../okf-planning-profile/)

It routes into or works alongside:

- [`grill-me`](C:/Users/buffo/.agents/skills/productivity/skills/grill-me/) for `foggy` interrogation
- [`bounded-capability-spec-orchestrator`](../../../architecture/skills/bounded-capability-spec-orchestrator/) for bounded-node exact specification
- [`write-a-prd`](../write-a-prd/) as a focused PRD helper
- [`prd-to-issues`](../../../delivery/skills/prd-to-issues/) for issue slicing
- [`process-issue`](../../../delivery/skills/process-issue/) for implementation
- [`report-bug`](../../../delivery/skills/report-bug/) for bug ownership write-back

## Durable Outputs

This skill keeps `.okf/` current.

Typical outputs or updates include:

- `.okf/project.md`
- `.okf/capabilities/...`
- `.okf/capabilities/shared/...`
- `.okf/index.md`
- directory `index.md` files
- `.okf/log.md`

It expects downstream specification and delivery artifacts to link back into
the owning capability node rather than duplicating topology elsewhere.

## Important Constraints

- Do not treat bare `.okf/` existence as meaning a planning graph already exists.
- Do not create exact specs directly from `foggy` territory.
- Do not write topology in fog-clearing modes without confirmation.
- Do not let future intended behavior silently overwrite observed current behavior in brownfield work.
- Always report state totals when a node changes state.
- Do not make the user remember internal sub-skills for ordinary feature
  additions; feature-add routing belongs here.
