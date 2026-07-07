# Fog of War Planning

`fog-of-war-planning` is the orchestrator for `.okf`-first product planning.

It owns:

- capability topology
- planning states
- frontier selection
- routing between planning, specification, and delivery

## Core Role

This skill maps the product in `.okf/` and decides what should happen next for
each capability.

It is the planning authority, not the exact-spec authoring layer.

## Planning States

- `foggy`: broad territory, unresolved boundaries
- `bounded`: clear enough to enter exact specification work
- `specified`: exact artifacts exist and readiness review is clean enough
- `implemented`: scoped work is exhausted

## Routing

- `foggy` -> `grill-me`
- `bounded` -> architecture specification pipeline, starting with `bounded-capability-spec-orchestrator`
- `specified` -> issue slicing or targeted artifact refresh
- `implemented` -> maintenance only

## Brownfield Mode

`clear fog from code on an existing node` is the explicit brownfield mode.

Use it when the goal is to align the graph with implemented behavior before
deciding what should change next.

In this mode, the skill should:

- inspect code first
- summarize observed current behavior
- ask only what code cannot answer
- distinguish current behavior from future intended behavior
- surface mismatches instead of hiding them

## Bounded Node Decision Point

When a node becomes `bounded`, recommend one of:

- tighten this bounded node with the architecture spec pipeline
- hand off this bounded node to issue slicing if specs already exist
- refine one of this node's children instead

## Relationship To Other Skills

This skill depends on:

- [`okf-planning-profile`](../okf-planning-profile/)

It routes into or works alongside:

- [`grill-me`](C:/Users/buffo/.agents/skills/productivity/skills/grill-me/) for `foggy` interrogation
- [`bounded-capability-spec-orchestrator`](../../../architecture/skills/bounded-capability-spec-orchestrator/) for bounded-node exact specification
- [`write-a-prd`](../write-a-prd/) as a focused PRD helper
- [`prd-to-issues`](../../../delivery/skills/prd-to-issues/) for issue slicing
- [`process-issue`](../../../delivery/skills/process-issue/) for implementation
- [`report-bug`](../../../delivery/skills/report-bug/) for bug ownership write-back

## Durable Outputs

This skill keeps `.okf/` current and expects downstream artifacts to link back
into the owning capability node.
