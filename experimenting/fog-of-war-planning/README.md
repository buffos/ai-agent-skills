# Fog of War Planning

`fog-of-war-planning` is the orchestrator for `.okf`-first product planning.

It is used when:

- starting a greenfield product map
- resuming work on an existing planning graph
- clearing uncertainty in broad capability areas
- organizing confirmed topology into durable `.okf` structure
- routing bounded areas toward exact documentation and delivery

## What It Does

This skill treats `.okf/` as the durable navigation layer for a product or
repository.

It helps turn vague or legacy product knowledge into a capability graph that
can later drive:

- PRDs
- issue slicing
- implementation
- bug ownership
- architectural navigation

It does not try to replace PRDs, ADRs, or issue files. It points to them.

## Core Idea

The workflow assumes that broad product territory usually starts unclear.

So instead of writing PRDs immediately, the skill:

1. maps broad areas as capabilities
2. clears fog through questioning
3. writes confirmed topology into `.okf/`
4. advances nodes through planning states
5. routes bounded nodes into exact specification work

## Planning States

The skill works with these capability states:

- `foggy`: broad territory, unresolved boundaries, not ready for exact spec
- `bounded`: clear enough to specify, but not yet fully documented
- `specified`: exact decisions exist and the node has a linked PRD
- `implemented`: the scoped work for the node is complete

Mixed-state graphs are normal.

## Modes

On existing planning graphs, the skill should begin by choosing a mode.

### `clear fog on an existing node`

Use this when a capability is still broad and unclear.

Behavior:

- asks one question at a time
- uses `grill-me` style interrogation
- proposes boundaries, children, and shared concerns
- does not write topology until confirmed

### `organize or reshape the map`

Use this when the structure is clear enough to write.

Behavior:

- splits capabilities into children
- adds new capabilities
- promotes shared concerns
- updates `.okf/` topology after confirmation

### `tighten a bounded node`

Use this when a node is no longer broad territory but still needs exact
clarification before PRD creation.

Behavior:

- routes toward `grill-with-docs`
- tightens terminology
- reconciles relevant docs
- clarifies exact specification boundaries

### `add a new capability`

Use this when a feature-concept or domain area is missing from the graph.

Behavior:

- proposes where the new capability belongs
- confirms topology before writing

### `hand off a bounded node to PRD work`

Use this when a bounded node is already exact enough that a PRD can be written
without another clarification pass.

Behavior:

- routes toward `write-a-prd`

### `maintenance only`

Use this for non-topology updates such as:

- link refreshes
- log updates
- index maintenance

## How It Works

### Greenfield

For greenfield work, the skill:

1. asks what the user wants to build
2. does lightweight comparable-product research
3. proposes a root and top-level capabilities
4. confirms the initial map
5. writes the first `.okf/` graph

### Existing Map

For existing maps, the skill:

1. reads the current `.okf/` graph
2. summarizes confirmed topology and current state totals
3. shows current frontiers
4. asks for a mode
5. works only within that mode

### Bounded Node Decision Point

When a node becomes `bounded`, the skill should explicitly recommend one of:

- tighten this bounded node with docs
- hand off this bounded node to PRD work now
- refine one of this node's children instead

This prevents bounded nodes from becoming dead ends in the workflow.

## Durable Outputs

This skill writes or updates:

- `.okf/project.md`
- `.okf/capabilities/...`
- `.okf/capabilities/shared/...`
- `.okf/index.md`
- directory `index.md` files
- `.okf/log.md`

It should keep the graph current as downstream artifacts appear.

## Skills It Depends On

This skill depends directly on:

- [`okf-planning-profile`](../okf-planning-profile/) for canonical node shape, state rules, and planning semantics

It routes into or works alongside:

- [`grill-me`](C:/Users/buffo/.agents/skills/productivity/skills/grill-me/) for `foggy` territory interrogation
- [`grill-me-with-docs`](C:/Users/buffo/.agents/skills/productivity/skills/grill-me-with-docs/) for bounded-node tightening
- [`write-a-prd`](C:/Users/buffo/.agents/skills/engineering/skills/write-a-prd/) for exact specification output
- [`prd-to-issues`](C:/Users/buffo/.agents/skills/engineering/skills/prd-to-issues/) for slicing a specified node into implementation issues
- [`process-issue`](C:/Users/buffo/.agents/skills/engineering/skills/process-issue/) for implementation from issue files
- [`report-bug`](C:/Users/buffo/.agents/skills/engineering/skills/report-bug/) for linking bugs back to owning capability nodes
- [`okf`](C:/Users/buffo/.agents/skills/engineering/skills/okf/) for generic OKF structure expectations
- [`okf-validate`](C:/Users/buffo/.agents/skills/engineering/skills/okf-validate/) when validation of the bundle is needed

## Related Skills

- [`okf-migrate-planning-graph`](../okf-migrate-planning-graph/) is for inferring the first planning graph from an existing repo
- [`okf-workflow-create`](../okf-workflow-create/) is for documenting workflows inside `.okf/workflows/`

## Important Constraints

- Do not treat bare `.okf/` existence as meaning a planning graph already
  exists.
- Do not create PRDs directly from `foggy` territory.
- Do not write topology during `clear fog` mode without confirmation.
- Do not assume the next foggy node automatically; always surface the frontier.
- Always report state totals when a node changes state.
