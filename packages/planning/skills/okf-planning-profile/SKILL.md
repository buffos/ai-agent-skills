---
name: okf-planning-profile
description: Defines a local planning profile on top of OKF for project and capability maps. Use when another skill needs the canonical node shape, state model, or planning template for `.okf`-based product mapping.
---

# OKF Planning Profile

This helper skill owns the canonical planning-node semantics for `.okf`-based product maps.

Read [REFERENCE.md](./REFERENCE.md) before using or extending planning-map concepts.

Use [templates/project-planning-concept.md](./templates/project-planning-concept.md) when writing project or capability nodes that participate in the planning workflow.

This skill does not orchestrate product discovery. It standardizes how planning-map nodes are created, updated, linked, and advanced through state.

Planning bundles still inherit the generic `$okf` structure and maintenance
rules. Keep directory `index.md` files current, append `log.md` entries for
durable changes, and preserve OKF-compatible frontmatter and linking patterns.

## Use this skill for

- creating the root project node
- creating or splitting capability nodes
- promoting a shared concern into its own concept
- attaching or updating `artifact_root`, `discovery_notes`, `gap_analysis`, `orchestration_status`, `prd`, `glossary`, `domain_model`, `use_cases`, `contract`, `scenarios`, `readiness_review`, `issues`, `adrs`, `children`, and shared links
- defining or updating the root project's `verification` policy
- interpreting or changing planning states
- maintaining planning-node consistency after downstream artifact changes

## Workflow

### 1. Load the planning contract

Read [REFERENCE.md](./REFERENCE.md) first.

Treat it as the source of truth for:

- graph shape
- field meanings
- allowed state transitions
- state progress reporting
- topology confirmation rules

### 2. Identify the node operation

Determine which operation is needed:

- create root project node
- create capability node
- update existing node
- split one capability into structural children
- promote a shared concern
- attach downstream artifacts
- update node state

If the caller is fuzzy about the operation because the territory itself is unclear, route back to `fog-of-war-planning` or the orchestrating skill rather than guessing.

### 3. Read the local graph context

Before editing any node, read the minimum surrounding context:

- the target node when it exists
- its structural parent
- its current children when relevant
- any shared concepts it links to or should link to
- linked PRD, issue, or ADR paths when they are part of the requested change

Never mutate a node in isolation when the relationship change affects neighboring nodes.

### 4. Choose the correct template and shape

Start from [templates/project-planning-concept.md](./templates/project-planning-concept.md) for new planning nodes.

Populate:

- required OKF frontmatter
- planning-profile fields defined in [REFERENCE.md](./REFERENCE.md)
- a short conceptual body focused on intent, scope, and relationships

For the root `project` node, follow the `Verification policy` rules in
[REFERENCE.md](./REFERENCE.md) before downstream specification or issue work.

Do not copy PRD detail, acceptance criteria, or implementation notes into the node body.

### 5. Enforce state discipline

Use only the planning states defined in [REFERENCE.md](./REFERENCE.md).

When updating state:

- do not move `foggy` territory straight to `specified`
- do not mark a node `implemented` because one issue finished
- do not invent additional state names unless the planning profile itself is being intentionally revised

If the requested state change conflicts with the contract, stop and surface the mismatch.

When a node changes state, report the transition and the current state totals
across the planning graph so the user can see concrete planning progress.

### 6. Enforce topology discipline

Before changing graph topology, confirm according to the planning profile rules.

Topology changes include:

- initial graph creation
- adding top-level capabilities
- splitting a capability into children
- promoting a shared concept

When topology changes, update every affected node, not just the newly created one.

### 7. Attach downstream artifacts consistently

When architecture artifacts, issues, or ADRs exist or change:

- add or refresh the relevant outward references on the owning node
- keep paths accurate
- preserve conceptual node bodies

If a downstream skill already made the artifact, this skill is responsible only for planning-map consistency, not re-authoring the artifact.

### 8. Finish in a valid graph state

Before finishing, verify:

- parent/child relationships are structurally coherent
- shared links point at the right concepts
- state matches the node's real level of maturity
- outward references point at the correct artifacts
- the node body remains conceptual and concise

If the work changed node state, include the required state-progress report from
[REFERENCE.md](./REFERENCE.md).

When the work changed `.okf/`, route to the generic `okf-validate` skill if conformance needs to be checked.
