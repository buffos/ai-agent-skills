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
- clear fog from code on an existing node
- organize or reshape the map
- add or extend a feature in an existing node
- tighten a `bounded` capability
- tighten a `bounded` capability from code
- add a new capability
- hand off a bounded capability to architecture spec work
- verify implemented from code
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

### `clear fog from code`

Use this mode for brownfield repos when the question is not just what the user
wants, but what the existing code already does.

Allowed actions:

- inspect code first
- summarize observed current behavior
- ask only the questions that code and local docs do not settle
- surface mismatches between code, docs, and user intent

Required behavior:

- label conclusions as `observed in code`, `inferred from docs`,
  `user-confirmed target behavior`, or `mismatch`
- treat current implementation and future design as separate truths when they
  diverge

Disallowed behavior:

- asking the user for answers that are already discoverable in local code
- rewriting current behavior in the graph as if target behavior were already
  implemented

### `organize or reshape the map`

Use this mode for confirmed topology work such as:

- splitting a node into children
- adding a new capability
- promoting a shared concept
- relinking, renaming, or restructuring nodes

### `add or extend a feature in an existing node`

Use this mode when the user already knows the owning node and wants to extend
it without being forced to choose the internal workflow.

Allowed actions:

- resolve the target node
- inspect the node's current planning state
- decide whether the addition is an in-node extension, child capability, shared
  capability, or spec refresh
- route internally to the right next step

Required behavior:

- keep the user-facing interaction at the level of product intent rather than
  sub-skill names
- if the feature widens scope materially, propose the required topology change
  before writing it
- if the feature fits current scope, refresh the node and linked exact-spec
  artifacts as needed
- if the feature belongs outside the node, explain the new proposed placement
  and ask for confirmation before writing topology

State-sensitive expectations:

- `foggy`: clarify where the feature belongs inside the territory
- `bounded`: tighten the addition toward exact specification
- `specified`: decide whether to refresh specs in place or reshape topology
- `implemented`: treat as brownfield extension work and separate current
  implementation from target addition

### `tighten a bounded capability`

Use this mode when the node is no longer broad territory and should move toward
exact language, exact specification, and implementation-ready artifact work.

### `tighten a bounded node from code`

Use this mode for brownfield repos when a node is already `bounded` and the
goal is to move it toward `specified` by grounding exact artifacts in the
existing implementation.

Allowed actions:

- inspect code first
- summarize current implemented behavior for the node
- generate or refresh exact-spec understanding from code and docs
- surface gaps between current code and intended target behavior

Required behavior:

- distinguish current implementation from desired design
- identify whether the exact artifact set for `specified` now exists
- recommend `specified` only when those artifacts are present and aligned enough
- keep the node `bounded` when important specification gaps still require
  clarification

### `verify implemented from code`

Use this mode when a node is already `specified` and the goal is to verify
whether its scoped work is actually exhausted in the codebase.

Allowed actions:

- inspect linked issues
- inspect implementation evidence
- inspect tests and validation evidence
- compare scoped artifacts against implemented behavior

Required behavior:

- verify completion against the node's actual scope
- distinguish partially implemented from truly exhausted scope
- recommend `implemented` only when the node's scoped work is genuinely done
- keep the node `specified` when important completion or scope-exhaustion
  questions still remain unresolved after code inspection

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

For the public mode `add or extend a feature in an existing node`, routing is
chosen internally by the orchestrator from the node's state and the addition's
scope shape. The user should not have to select the downstream workflow.

The required path into specification is:

```text
foggy -> bounded -> architecture-spec pipeline -> readiness review -> specified
```

## Verification-policy initialization

Before routing a `bounded` node into the architecture-spec pipeline or direct
issue slicing, ensure the root project concept has the `verification` policy
defined by `$okf-planning-profile`. If the planning map or root is missing,
create it through `$okf` and `$okf-planning-profile`; if the policy is missing,
ask the user to choose its mode and surface overrides, then persist it in root
frontmatter. Do not create a separate policy file.

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

## Brownfield verification contract

For brownfield work, the orchestrator should answer two separate questions:

1. what does the code do now?
2. what should the graph say we want next?

Use implementation evidence first for current-state questions.

If code and docs disagree:

- do not silently choose one
- surface the conflict
- let the user decide whether the node should reflect current reality, target
  design, or both

If code and user intent disagree:

- record current implementation as current behavior
- record desired behavior as target state or planned change
- do not collapse the two into one misleading node description

For brownfield transition work, the orchestrator should also answer:

3. do the exact-spec artifacts reflect the current implementation well enough
   for `specified`?
4. is the specified scope actually exhausted in code well enough for
   `implemented`?

If important specification questions remain open after code inspection, the
node stays `bounded`. Code grounding can reduce uncertainty, but it does not
justify `specified` while material clarification gaps still exist.

If important completion questions remain open after code inspection, the node
stays `specified`. Existing code can support the decision, but it does not
justify `implemented` while material uncertainty remains about whether the
node's scoped work is actually exhausted.

## Mismatch Reopen Contract

Use this contract when brownfield inspection shows that a node previously marked
`implemented` does not actually deliver behavior already promised by its
current scope.

### Required decision

If the missing behavior is inside the node's existing promised scope:

- record it as a `mismatch`
- demote the node from implemented to specified
- create or identify delivery work for the gap

Do not keep the node `implemented` just because most of its scope exists.

If the behavior is truly net-new scope outside the current node:

- keep the node's current state
- route through `add or extend a feature in an existing node`

### Required labels

When reopening a node, summarize the gap using all four labels:

- `observed in code`
- `inferred from docs`
- `mismatch`
- `required follow-up`

### Owning-node rule

The owning node for a mismatch should be:

- the narrowest capability whose promised scope already includes the missing behavior

If no child cleanly owns the gap:

- reopen the parent node

If multiple nodes are affected:

- choose one owning node for the delivery issue
- cross-link related nodes explicitly if needed

### Delivery bookkeeping

When mismatch follow-up requires a new pending issue, the orchestrator must:

1. read `docs/agents/issues/issues.md`
2. read `# Current Max Issue ID`
3. assign the next issue number as `max + 1`
4. create the pending issue file in `docs/agents/issues/pending/`
5. append a row to `docs/agents/issues/issues.md`
6. update `# Current Max Issue ID`
7. append the issue path to the owning capability node's `issues:` list
8. append a mismatch/state-change entry to `.okf/log.md`

The reopen flow is not complete until planning truth, delivery truth, traceability links, and audit trail are all synchronized.

### Registry format

When creating the registry row in `docs/agents/issues/issues.md`, use the same
columns and state semantics as `$prd-to-issues`:

- `#`
- `Title`
- `Category`
- `PRD`
- `State`
- `Blocked by`

For mismatch-driven implementation gaps inside an already-specified capability,
default to:

- `Category`: `feature`
- `State`: `ready-for-agent`

Unless the gap clearly needs human-only work or is still under-specified.

### Required user-facing report

Whenever a mismatch reopens a node, explicitly report:

- the node
- old state
- new state
- pending issue id/path
- current totals of `foggy`, `bounded`, `specified`, and `implemented`

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

For mismatch-driven issue creation outside a normal `$prd-to-issues` run, reuse
the same local issue conventions:

- numbering from `# Current Max Issue ID`
- row append behavior in `docs/agents/issues/issues.md`
- issue template shape
- state semantics such as `ready-for-agent` and `ready-for-human`

`fog-of-war-planning` must not create pending issue files that bypass the local
issue registry.

### `process-reference-issue`

- Use this after architecture specification and reference-doc issue slicing.
- Read the linked capability concept and architecture artifacts before implementation.
- Apply the root verification policy and write back issue references and progress.
- Only mark a node `implemented` when the node's scoped work is actually exhausted.

### `report-bug`

- Resolve the owning capability or shared concept when possible.
- Keep issue creation in `docs/agents/issues/`.
- Write the bug issue link back into the owning concept node.

## Mismatch-Reopen Exit Checklist

A mismatch-driven reopen is complete only if all of these are true:

- the owning capability node records `observed in code`
- the owning capability node records `inferred from docs`
- the owning capability node records `mismatch`
- the owning capability node records `required follow-up`
- the node state has been demoted if promised scope is missing
- the pending issue file exists
- the issue path is linked from the owning node's `issues:` list
- the issue row exists in `docs/agents/issues/issues.md`
- `# Current Max Issue ID` is correct
- `.okf/log.md` records both the mismatch and the state change

Do not stop after updating only the node or only the issue file.

## Topology write policy

Always confirm before durable topology changes:

- initial graph creation
- new top-level capability
- splitting a capability into structural children
- promoting a shared concept

This is the default until the workflow has proved stable.
