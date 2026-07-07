---
name: fog-of-war-planning
description: Plan and evolve `.okf` capability maps for greenfield and brownfield repos.
disable-model-invocation: true
---

# Fog of War Planning

Use this as the public planning front door for `.okf` capability maps.

The user should be able to say things like:

- what should we build?
- clear fog on `<node>`
- add `<feature>` to `<node>`
- organize this area

This skill owns the planning map. It decides the internal route from node
state and graph shape; the user should not have to remember downstream
sub-skills.

## Load first

Read these before substantive work:

- [REFERENCE.md](./REFERENCE.md)
- [../okf-planning-profile/REFERENCE.md](../okf-planning-profile/REFERENCE.md)

Read [BROWNFIELD.md](./BROWNFIELD.md) too when the repo already has meaningful
code and the graph must align with implemented behavior.

When writing or updating planning-map concepts:

- use [../okf-planning-profile/templates/project-planning-concept.md](../okf-planning-profile/templates/project-planning-concept.md) as the starting template
- use `$okf-planning-profile` as the authority for node shape, state, links,
  and maintenance rules

## Workflow

### 1. Detect the planning map

Inspect `.okf/` and determine whether a planning graph already exists.

Do not treat bare `.okf/` existence as enough. Generic OKF bundles may already
exist without any planning nodes.

If no planning graph exists:

- ask what the user wants to build
- do lightweight comparable-product research
- propose the first root and top-level capabilities
- confirm before writing the initial graph

If a planning graph does exist:

- summarize the durable state
- restate the active frontier
- ask for an explicit mode instead of silently picking the next node

If the repo can answer a question, inspect it before asking the user.

### 2. Choose the mode and frontier

On existing maps, always make the mode explicit before substantive work.

The available modes and their detailed rules live in
[REFERENCE.md](./REFERENCE.md). In practice, this includes:

- fog clearing
- brownfield code-grounded refinement
- topology organization
- feature addition inside an existing node
- bounded-node tightening
- implementation verification
- maintenance only

Then surface the frontier and have the user pick the node or area to work on.

### 3. Run the chosen mode

Follow [REFERENCE.md](./REFERENCE.md) as the single source of truth for:

- mode discipline
- state transitions
- bounded-node decision points
- feature-add routing
- progress reporting
- topology confirmation policy

Important public contract:

- when the user says `add <feature> to <node>`, treat that as one planning
  request
- resolve whether it is an in-node extension, child capability, shared
  capability, or spec refresh
- choose the internal path yourself
- explain the outcome in product terms, not sub-skill names

For brownfield work, separate:

- current implemented behavior
- documented intended behavior
- future target behavior
- mismatches among them

### 4. Write only confirmed topology

When the run produces a durable topology change, update `.okf/` using the
planning profile template and maintenance rules.

Always confirm before:

- creating the initial graph
- adding top-level capabilities
- splitting structural children
- promoting shared concerns

### 5. Keep the map live

Treat:

- `.okf/` as the planning map
- `docs/architecture/` as the exact-spec layer
- `docs/agents/issues/` as the delivery layer

When downstream work creates or changes durable artifacts, keep the owning
capability node current.

Whenever a node changes planning state, report:

- the node
- old state
- new state
- current totals of `foggy`, `bounded`, `specified`, and `implemented`
