# Planning Skills

Skills for `.okf`-based planning, capability graph maintenance, planning-map
migration, and bounded-node routing.

Planning owns:

- capability topology
- planning states
- frontier selection
- handoff into exact specification and delivery

Architecture is now a separate package and is the downstream exact-spec layer
for `bounded` capabilities.

## Planning Map Skills

- `fog-of-war-planning`
- `okf-planning-profile`
- `okf-workflow-create`
- `okf-migrate-planning-graph`

## OKF Utilities

- `okf`
- `okf-validate`
- `okf-visualize`

## Transitional Helpers

- `write-a-prd`

These remain useful, but the preferred bounded-node path now goes into the
`architecture` package rather than directly from planning into PRD-only work.
