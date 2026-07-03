---
name: fog-of-war-planning
description: Map a product idea into a capability graph, then route bounded territory into exact specification and implementation workflows.
disable-model-invocation: true
---

# Fog of War Planning

Clear the fog before writing implementation specs.

This skill is the entrypoint for greenfield product planning when the repo should be mapped in `.okf/` before PRDs or issues are expanded.

This skill depends on `$okf-planning-profile` for the canonical planning-node shape and `.okf` planning semantics.

Before non-trivial work, read both:

- [REFERENCE.md](./REFERENCE.md)
- [../okf-planning-profile/REFERENCE.md](../okf-planning-profile/REFERENCE.md)

When writing or updating planning-map concepts, use [../okf-planning-profile/templates/project-planning-concept.md](../okf-planning-profile/templates/project-planning-concept.md) as the starting template.
Use `$okf-planning-profile` whenever this workflow needs to create, update, split, link, or advance planning-map nodes.

## Workflow

### 1. Inventory the territory

Check whether a planning graph already exists inside `.okf/`.

Do not treat bare `.okf/` existence as sufficient. A repo may already use OKF
for datasets, metrics, decisions, or playbooks without having any planning-map
nodes yet.

Treat the repo as having an existing planning graph only when you can find
planning-profile evidence such as:

- a root project node for the planning map
- capability or shared-concern nodes using the planning profile
- planning fields such as `state`, `project`, `parent`, `children`, or
  `shared_with`

- If no planning graph exists yet, ask what the user wants to build at the
  product level. Reuse the existing `.okf/` bundle if one is already present,
  and add the planning graph into it rather than treating the repo as already
  mapped.
- If a planning graph does exist, inspect the root concept and current
  top-level capabilities, then summarize the current map and start with an
  explicit mode choice rather than assuming the next action.

If a question can be answered from local repo context, inspect the repo instead of asking.

### 2. Choose session mode on existing maps

When a planning graph already exists, always ask which mode the user wants
before doing substantive work.

Offer grounded modes such as:

- clear fog on an existing node
- organize or reshape the map
- tighten a bounded node
- add a new capability
- hand off a bounded node to architecture spec work
- maintenance only

Do not silently choose "the next foggy node".

### 3. Select the frontier explicitly

Before questioning or editing, show the current frontier so the user can choose
where to work.

Summarize:

- current `foggy` nodes
- current `bounded` nodes
- recent nodes touched
- candidate shared concerns, if any

Then ask the user which node or area to work on in the chosen mode.

### 4. Resume from durable state

When resuming after interruption, compaction, or a later session, start by
stating:

- the last confirmed topology
- any unconfirmed ideas discovered in the prior session, if they exist
- the current mode options
- the current candidate frontiers

Persisted `.okf/` state is the baseline. It is not permission to skip
questioning, confirmation, or mode selection.

### 5. Research comparable structures

Before proposing the first top-level map for a greenfield idea, do a lightweight comparable-product pass.

Extract only:

- recurring capability patterns
- recurring information architecture patterns
- recurring shared concerns

Do not drift into pricing analysis, feature-by-feature market comparison, or implementation speculation.

### 6. Propose the first map

Model the product as one root project concept plus top-level capability concepts.

The default unit is a capability, not a raw technical module. Technical concepts such as `search`, `ai`, or `db` should only be promoted when they are genuinely shared concerns.

Before writing, confirm:

- the root project concept
- the proposed top-level capabilities
- any promoted shared concepts

### 7. Write the graph

After confirmation, create or update `.okf/` using the orchestration rules in [REFERENCE.md](./REFERENCE.md) and `$okf-planning-profile` for node semantics and topology discipline.

Default behavior:

- create one root project concept
- create one concept file per top-level capability
- attach each capability to exactly one structural parent
- add extra graph links for shared concerns
- set new capabilities to `foggy` unless already clearly bounded

### 8. Route by fog level

Use the capability state to decide the next move:

- `foggy` -> run `$grill-me` to decompose territory, clarify boundaries, or discover child capabilities
- `bounded` -> route to the architecture suite, starting with `bounded-capability-spec-orchestrator`, to turn one bounded capability into exact reference artifacts
- `specified` -> route to issue slicing, or to PRD refresh only when linked artifacts are stale or incomplete
- `implemented` -> maintain the graph only if durable knowledge changed

Do not create a PRD directly from `foggy` territory.

After a node becomes `bounded`, do not leave the next step implicit. Explicitly
offer one of these grounded paths for that node:

- `tighten this bounded node with the architecture spec pipeline`
- `hand off this bounded node to issue slicing if specs already exist`
- `go back and refine this node's children instead`

The skill should recommend one of the three rather than forcing the user to
infer the next move alone.

### 9. Enforce mode discipline

In `clear fog` mode, the skill may:

- ask questions
- summarize what has become clearer
- propose candidate child capabilities, boundaries, or shared concerns

In `clear fog` mode, the skill must not:

- write structural splits
- promote shared concepts durably
- rename or reorganize the map
- advance state merely because an idea sounds plausible

Those actions require explicit confirmation and, when topology changes, a shift
into `organize or reshape the map` or equivalent confirmation to write.

### 10. Decide when a node can leave pure fog clearing

Do not keep clearing fog forever just because more questions are possible.

A node is clear enough to stop being the interrogation target when all of the
following are true:

- its purpose is understandable in one sentence
- its boundary against siblings is understandable
- its main child territories are visible, even if those children remain foggy
- the main actors and inputs/outputs are known
- the biggest ambiguity is now inside its children rather than in the parent

At that point, the node can move out of pure fog-clearing focus even if the
rest of the map still contains many `foggy` nodes.

When this transition results in a `bounded` node, immediately explain whether
the recommended next action is:

- `bounded-capability-spec-orchestrator` on the bounded node
- direct issue-slicing handoff if specs are already complete
- more fog-clearing on one of its children

Do not stop at reporting that the node became bounded.

### 11. Report planning-state progress

Whenever a node changes planning state, explicitly report:

- which node changed
- the old and new state
- the current count of `foggy`, `bounded`, `specified`, and `implemented` nodes

This progress report is required so the user can see that the map is becoming
clearer even while parts of the graph remain unresolved.

### 12. Promote shared concerns carefully

Promote a repeated concern into its own shared concept when it appears in at least two capabilities and has distinct behavior, vocabulary, or policy worth reasoning about separately.

Two mentions alone are not enough.

### 13. Confirm topology changes before writing

Always stop for confirmation before:

- creating the initial graph
- adding top-level capabilities
- splitting a capability into children
- promoting a shared concept

Later maintenance on already-confirmed nodes can be automatic when the topology is unchanged.

### 14. Keep the graph live

Treat `.okf/` as the map, `docs/architecture/` as the exact-spec layer, and `docs/agents/issues/` as the delivery layer.

Capability concepts should link out to their PRD, issue files, and ADRs rather than duplicating those artifacts.

When downstream skills create durable artifacts, update the owning capability concept so the map stays current.
