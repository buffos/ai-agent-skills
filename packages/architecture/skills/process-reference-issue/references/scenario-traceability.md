# Scenario Traceability

Build this working trace after reading the canonical artifacts and before
implementation. Keep it in the issue notes or implementation record when it
helps later review.

| Source rule or use case | Acceptance scenario | Issue criterion | Planned verification | Closure evidence |
| --- | --- | --- | --- | --- |
| Canonical rule | `SC-###`, or gap/deferred owner | Criterion that delivers it | Test, contract check, or approved surface check | Command/result or approved deferral |

## Rules

- Include every canonical rule or use case that the issue implements, changes,
  or depends on; issue acceptance criteria are a summary, not the sole source
  of truth.
- A material source rule without an acceptance scenario is a requirements gap.
  Route it to acceptance-scenario authoring unless a named issue already owns
  the deferral.
- A scenario can map to more than one test, but every required verification
  surface must have evidence or a policy-permitted deferral.
- At closure, replace planned verification with the executed artifact and its
  result. A passing broad test command alone is not evidence that an omitted
  behavior was exercised.
