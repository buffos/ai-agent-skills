# Advanced Code Review Checklist

Use this file as the strict review checklist.

## Target

- verify the review target resolves
- capture the exact diff command
- capture commit list for range review
- capture changed files
- stop on empty diff

## Intent stack

Read strongest available evidence first:

1. explicit user-provided spec path
2. `docs/agents/issues/` issue files and PRDs
3. `.okf/` planning graph nodes with fields such as `state`, `parent`,
   `children`, `shared_with`, `prd`, `issues`
4. commit messages, branch name, ADRs, local design docs
5. infer from diff only as a last resort

Questions to answer:

- what problem is this change meant to solve
- which issue, PRD, or capability owns it
- which acceptance criteria or user stories it claims to satisfy
- whether the scope fits the owning capability or shared concern

Missing answers are findings.

## Review dimensions

### Problem-solution fit

- is the intended problem clearly identified
- does the code actually solve it
- is the solution partial
- does it introduce a new problem
- does it expand scope beyond the evidence

### Spec fulfillment

- missing acceptance criteria
- wrong behavior versus PRD or issue
- incomplete edge cases or lifecycle handling
- undocumented scope creep
- broken contract assumptions

### Correctness and regressions

- broken invariants
- stale or invalid state transitions
- null, race, retry, cleanup, or data-loss risks
- backward-compatibility breaks
- hidden coupling to unrelated modules or globals

### Tests

- missing tests for new behavior
- happy-path-only tests
- assertions that miss the contract
- implementation-mirroring tests
- missing integration coverage at changed boundaries

### Repo-wide gates

Find the authoritative commands from:

- CI config
- package scripts
- `pyproject.toml`
- `Makefile` or `justfile`
- monorepo task runners
- contributor docs

Minimum expected gates:

- tests
- lint
- build or typecheck when normally required

Unknown repo-wide gates mean `not ready to commit`.

## Severity

- `P0`: broken behavior, security, data loss, or false completion claim
- `P1`: important requirement gap, likely regression, or repo gate failure
- `P2`: design or maintainability problem that should block a strict review
- `P3`: non-blocking improvement

Each blocking finding should state:

- severity
- file or area
- problem
- evidence
- impact
- shortest credible fix direction

## Commit gate

`ready to commit` only when all are true:

- no unresolved `P0` to `P2`
- intended issue or spec identified, or user accepts none exists
- enough evidence shows the problem is solved
- repo-wide tests pass
- repo-wide lint passes
- repo-normal build or typecheck passes

Else: `not ready to commit`.

## Commit message

Use:

```text
<type>(<scope>): <subject>

<why this exists>

<what changed>
- ...
- ...

<verification>
- tests: ...
- lint: ...
- build/typecheck: ...

Closes: <issue refs if justified>
Refs: <PRD or capability refs if useful>
```
