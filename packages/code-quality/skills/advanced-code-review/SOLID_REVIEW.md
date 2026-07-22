# SOLID Review Checklist

Use this file when reviewing classes, services, handlers, controllers, or
module boundaries.

## SRP

- one reason to change
- no mixing of orchestration, policy, validation, persistence, rendering, IO
- no unrelated new responsibility added to an already busy unit

Fix directions:

- split policy from orchestration
- split validation from mutation
- extract a narrower deep module

## OCP

- new behavior should not require repeated branch edits
- avoid growing special-case trees
- prefer one extension seam over repeated modification

Fix directions:

- strategy or polymorphism
- registration or composition
- remove speculative hooks

## LSP

- implementation must honestly satisfy the declared contract
- no stronger preconditions
- no weaker postconditions
- no partial or do-nothing implementations hidden behind shared abstractions

Fix directions:

- narrow the abstraction
- split roles
- replace inheritance with composition

## ISP

- clients should depend only on what they use
- avoid fat interfaces
- avoid optional methods or oversized mocks

Fix directions:

- split by role
- depend on smaller protocols or contracts
- separate read and write concerns when appropriate

## DIP

- high-level policy should not depend directly on low-level details
- business logic should stay testable
- abstractions should be stable enough to earn their cost

Fix directions:

- inject dependencies
- introduce a small boundary contract
- move framework wiring to the composition root

## Boundary depth

SOLID compliance is not sufficient by itself. Prefer a cohesive deep module
with a small interface over many shallow abstractions.

Before recommending a split, show that the responsibilities change
independently, have distinct clients or dependencies, and can be tested more
durably at the proposed boundary.

Before accepting an interface, check that:

- its clients use the surface they depend on;
- it hides meaningful workflow or infrastructure complexity;
- it does not exist only to make mocking easier; and
- it removes a real seam rather than merely moving coupling.

Use `ARCHITECTURE_DELTA.md` when the current diff changes a boundary. It
decides whether a local SOLID observation is an architecture regression that
must block the change.

## Block only when the violation:

- makes the current change brittle
- materially increases regression risk
- makes testing meaningfully harder
- solves the immediate problem by breaking module boundaries
