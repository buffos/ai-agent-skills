# OKF Migrate Planning Graph Reference

This file defines the migration workflow for building a planning graph from an
existing repository.

Use it as the single source of truth for:

- migration modes
- evidence ordering
- inference rules
- confidence reporting
- migration write policy

The canonical planning-node shape still lives in
[../okf-planning-profile/REFERENCE.md](../okf-planning-profile/REFERENCE.md).

## Purpose

This skill exists for repos that already contain meaningful product,
architectural, or code structure but do not yet have a planning graph in
`.okf/`.

Its job is to infer a conservative first map and make that map durable enough
for the rest of the planning suite to take over.

## Migration modes

### `docs-first migration`

Use when the repository already has durable planning evidence such as:

- product/context docs
- PRDs
- ADRs
- issue registries with meaningful product grouping

In this mode:

- docs define the primary capability map
- issues and code refine the map
- code should not override durable product docs without clear conflict handling

### `hybrid migration`

Use when the repo has some durable docs but they are incomplete, stale, or too
coarse to define the whole graph alone.

In this mode:

- docs define the initial candidate map
- code structure and runtime clues fill gaps
- confidence should be lower in code-inferred areas

### `code-first migration`

Use when the repo lacks durable planning docs and the graph must be recovered
mainly from code and structure.

In this mode:

- infer broad capabilities from bounded structural areas
- infer shared concerns from reused infrastructure and cross-cutting services
- avoid narrow or overly implementation-specific nodes unless the structure is
  extremely clear

Code-first migration should be more conservative than docs-first migration.

## Evidence ordering

Use evidence in this general order:

1. existing planning-map nodes, if any
2. other existing `.okf/` knowledge relevant to product structure
3. product/context documents
4. PRDs
5. ADRs
6. issue registries and issue files
7. repo structure
8. code structure and naming
9. runtime/config/provider clues

This ordering is a bias, not a blind rule. If higher-order docs are clearly
stale and the code strongly contradicts them, surface the conflict instead of
forcing a false map.

## Evidence interpretation rules

### Product contexts and PRDs

Treat these as the strongest signals for:

- major capability areas
- user-facing domain boundaries
- vocabulary that should become node titles or scopes

### ADRs

Treat ADRs as strong signals for:

- shared concerns
- architecture-level capabilities
- policies that cut across multiple domains

Do not automatically convert every ADR into a capability node.

### Issues

Treat issues as strong signals for:

- density within a capability
- possible child capabilities
- implementation history to link back into the graph

Do not let issue granularity define the first top-level map.

### Repo structure and code

Treat structure and code as strong signals for:

- bounded domain areas when docs are absent
- shared runtime/services used by multiple areas
- missing capability candidates not documented elsewhere

Do not blindly mirror package names or directory names into capability nodes.

## Confidence model

Assign every inferred major node and shared concern one confidence level.

### `high`

Use when the inference is supported by multiple durable sources, for example:

- context docs plus PRDs
- repeated PRD and issue clustering
- stable repo structure aligned with docs

### `medium`

Use when the inference is plausible and supported, but not fully corroborated,
for example:

- one durable doc plus reinforcing code structure
- repeated issue clusters without explicit context docs

### `low`

Use when the inference is mostly from structure, naming, or scattered evidence.

Low-confidence nodes should usually remain broad and `foggy`.

## Proposed outputs

The migration run should produce:

- a root `project` node
- capability nodes
- shared capability nodes when justified
- outward links to PRDs, ADRs, and issues when they exist
- refreshed `.okf/index.md`, directory `index.md` files, and `.okf/log.md`

It should also produce a user-facing migration summary that calls out:

- migration mode
- evidence used
- confidence distribution
- low-confidence areas needing follow-up

## Generic `.okf/` behavior

If `.okf/` does not exist:

- create the generic bundle structure first
- then add the planning graph into it

If `.okf/` exists without planning nodes:

- preserve the generic bundle
- add the planning graph alongside existing knowledge

If `.okf/` contains a partial planning graph:

- treat migration as graph completion or repair
- preserve confirmed topology unless the user confirms reshaping it

## Topology write policy

Always confirm before:

- creating the first inferred root and top-level graph
- adding inferred shared concerns
- inferring child capability splits with less than high confidence
- reshaping an existing partial graph

Migration can be evidence-driven, but it is still a topology-writing workflow.

## State policy during migration

Default inferred nodes to `foggy` unless they are already clearly bounded by
strong durable evidence.

Examples of bounded-by-evidence cases:

- one clean PRD maps directly to one coherent capability slice
- multiple sources agree on a stable, narrow domain boundary

Do not mark large inferred parent areas `specified` during migration.

## Recommended migration heuristics

### For top-level capabilities

Prefer capability candidates that are:

- user/domain meaningful
- repeated in durable artifacts
- large enough to contain multiple issues or sub-areas

### For shared concerns

Promote only when the concern:

1. appears in at least two capability areas, and
2. has behavior, policy, or vocabulary worth reasoning about independently

### For child capabilities

Split only when:

- issue density or docs show multiple coherent sub-territories, or
- the parent would otherwise be too broad to use as a planning node

## Handoff after migration

Once the graph exists:

- use `fog-of-war-planning` for unresolved `foggy` nodes
- use `grill-with-docs` for `bounded` nodes that need exact shaping
- use downstream PRD/issue skills only after the graph provides a stable owner

Migration should create the map, not replace the rest of the planning suite.
