# OKF Planning Profile

`okf-planning-profile` defines the canonical planning-node semantics used by
the planning suite.

It is used when another skill needs to:

- create or update planning nodes in `.okf/`
- interpret capability states
- split capabilities into children
- attach PRDs, issues, or ADRs to planning nodes
- maintain planning-graph consistency

## What It Does

This is not the orchestrator.

It is the canonical profile for how planning concepts should look and behave
inside `.okf/`.

It standardizes:

- node shape
- planning states
- parent/child rules
- shared-concern links
- outward artifact references
- state progression rules

## Core Idea

The planning suite needs one stable definition of:

- what a capability node is
- what `foggy`, `bounded`, `specified`, and `implemented` mean
- what fields belong in planning frontmatter
- how topology changes should be represented

This skill provides that definition.

## Planning Model

The profile assumes:

- one root `project` node
- capability nodes beneath that root
- exactly one structural parent per capability
- optional shared/cross-cutting links through `shared_with`

The default planning node type is:

- `type: capability`

The root uses:

- `type: project`

## Planning States

The profile defines these states:

- `foggy`
- `bounded`
- `specified`
- `implemented`

And the intended progression is:

`foggy -> bounded -> specified -> implemented`

Mixed-state graphs are normal.

## What a Node Contains

A planning node may contain:

- `type`
- `title`
- `state`
- `project`
- `parent`
- `children`
- `shared_with`
- `intent`
- `scope`
- `prd`
- `issues`
- `adrs`

The node body should stay conceptual and concise.

It should not absorb:

- implementation detail
- long acceptance criteria
- large design dumps

## How Other Skills Use It

### `fog-of-war-planning`

Uses this profile to:

- create the first map
- split capabilities into children
- advance state after confirmed refinement

### `okf-migrate-planning-graph`

Uses this profile to:

- infer and write the first planning graph for legacy repos

### Downstream delivery skills

Skills such as `write-a-prd`, `prd-to-issues`, `process-issue`, and
`report-bug` should use this profile to understand:

- which capability owns the work
- which artifacts should link back into the map
- what the current maturity of the node is

## Durable Responsibilities

When a planning node changes, the profile expects:

- coherent `parent` and `children`
- correct shared links
- accurate outward artifact references
- current `index.md` files
- updated `.okf/log.md`

It extends generic OKF practice rather than replacing it.

## Skills It Depends On

This profile is used by other skills rather than orchestrating work itself.

It relies conceptually on:

- [`okf`](C:/Users/buffo/.agents/skills/engineering/skills/okf/) for generic OKF structure expectations
- [`okf-validate`](C:/Users/buffo/.agents/skills/engineering/skills/okf-validate/) when conformance checks are needed

Skills that depend on it include:

- [`fog-of-war-planning`](../fog-of-war-planning/)
- [`okf-migrate-planning-graph`](../okf-migrate-planning-graph/)
- `write-a-prd`
- `prd-to-issues`
- `process-issue`
- `report-bug`

## Important Constraints

- Use `type: capability` for planning capability nodes by default.
- Do not invent extra planning states casually.
- Do not mark a node `specified` without exact documentation and a linked PRD.
- Do not mark a node `implemented` because one issue was completed.
- Keep the graph conceptual; downstream artifacts hold the delivery detail.
