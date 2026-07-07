# Brownfield Grounding

Use this reference when `fog-of-war-planning` is working against an existing
implemented repository rather than a greenfield design.

## Purpose

In brownfield work, the graph should not drift away from the codebase just
because the user answers design questions from memory or from desired future
intent.

The orchestrator must separate:

- current implemented behavior
- documented intended behavior
- desired future behavior

## Mode

Use `clear fog from code on an existing node` when:

- the repo already has substantial code
- the node should reflect current implemented reality
- the user wants to migrate or verify a brownfield area into the graph

Use `tighten a bounded node from code` when:

- the node is already `bounded`
- the next goal is `specified`
- exact artifacts should be grounded in existing implementation

If important specification gaps remain after code inspection, the node stays
`bounded` until those gaps are clarified.

Use `verify implemented from code` when:

- the node is already `specified`
- the next goal is `implemented`
- completion must be verified from code, issues, and tests rather than assumed

If important completion gaps remain after code, issue, and test inspection,
the node stays `specified` until those gaps are clarified.

## Evidence Order

For current-state questions, inspect in this order when relevant:

1. entrypoints, routes, commands, handlers
2. models, schemas, migrations, persisted formats
3. services, orchestrators, workers, schedulers
4. tests that lock behavior
5. local docs such as PRDs, ADRs, contexts

If code and docs disagree, report the disagreement.

## Required Labels

When summarizing a brownfield node, label findings as one of:

- `observed in code`
- `inferred from docs`
- `user-confirmed target behavior`
- `mismatch`

This keeps the graph honest about what is real now versus what is planned.

## Question Discipline

Do not ask the user questions that local code can answer.

Ask the user only for:

- intended future behavior
- product tradeoffs not encoded in code
- ambiguity the implementation does not settle
- confirmation of how to represent conflicts

## Conflict Handling

If code says one thing and the user wants another:

- treat code as current reality
- treat the user's answer as target state
- do not rewrite the graph as if the target state were already implemented

If needed, the node can later point to both:

- current behavior
- target change

## Goal

Brownfield fog-clearing should make the graph trustworthy as a map of the repo
as it exists today, while still making room for future design and extension.

Brownfield transition work should also make state changes trustworthy:

- `foggy -> bounded` from clarified current behavior
- `bounded -> specified` from code-grounded exact artifacts
- `specified -> implemented` from verified scope exhaustion

`bounded -> specified` should not happen if the exact artifacts still depend on
unresolved clarification outside the code.

`specified -> implemented` should not happen if the evidence still leaves
material doubt about whether the node's scoped work is actually complete.
