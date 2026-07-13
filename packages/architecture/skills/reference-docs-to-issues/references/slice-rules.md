# Slice Rules

Use tracer-bullet thinking.

## Good Slice Properties

- narrow end-to-end behavior
- independently verifiable
- minimal but complete
- clear dependency story

## Vertical Slice Rule

A slice should cut through all required layers for one behavior path, such as:

- persistence changes
- domain behavior
- application orchestration
- contract exposure
- tests

Not every slice needs every layer explicitly named, but the behavior should be complete.

## Dependency Rule

Prefer:

- foundational blockers first
- feature slices after their blockers
- acceptance coverage that can be demonstrated incrementally

## Execution type and review gate

Mark execution type `HITL` only if implementation itself requires:

- product-owner clarification before implementation can proceed
- a human architectural or product decision
- human-only access or manual implementation

Mark execution type `AFK` if an agent can implement and test it directly once
the issue is written clearly enough.

Use a separate review gate when the implementation is AFK but closure requires
human inspection or approval:

- `visual-review` for visual/UX inspection after implementation
- `product-approval` for explicit product acceptance after implementation

An AFK issue with a review gate remains agent-ready for implementation and
transitions to `awaiting-human-review` after its automated acceptance checks
pass.
