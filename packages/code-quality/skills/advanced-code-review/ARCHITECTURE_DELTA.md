# Architecture Delta

Use this reference only when the trigger in `SKILL.md` applies. This is a
one-hop review, not a whole-codebase architecture audit.

## Inspect

Read the changed module plus its direct callers, direct dependencies,
composition root, and focused tests. Read the owning issue, PRD, or capability
when available.

## Record

State all of the following:

1. **Owner** — the product capability or delivery area responsible for this boundary.
2. **Boundary** — one sentence describing what the module owns and excludes.
3. **Delta** — the responsibility, interface surface, dependency, or test seam added by the diff.
4. **Verdict** — `deepens`, `neutral`, or `widens`.
5. **Evidence** — the callers, dependencies, and tests that support the verdict.

`Deepens` means the caller learns less while the module hides more coherent
complexity. `Neutral` preserves an already coherent boundary. `Widens` adds a
new reason to change, exposes workflow, couples to a low-level detail, or
forces unrelated clients or test doubles to grow.

## Escalate

Report a P2 architecture regression when the diff introduces or materially
worsens any of these:

- an unrelated product concern in an already multi-purpose module;
- an optional capability, type assertion, or reach-through around an existing abstraction;
- a concrete domain implementation dependency from transport or presentation code;
- a test double that must implement unrelated roles to exercise the changed behavior;
- coordinated edits across otherwise unrelated modules because the feature has no owning boundary; or
- public interface growth that gives callers more workflow to coordinate instead of hiding it.

Do not use method count alone as evidence. Do not require a generic registry,
strategy, or interface unless the current change has a real extension or
substitution need.

## Deferral

Accept a deferral only when the review records why extraction now would be
speculative or unsafe and names the concrete future change that must revisit
the boundary. Apply `ARCHITECTURE_DEBT.md` to record the result.

## Output

Include an `Architecture delta` section before the final verdict:

```text
Architecture delta: widens
Owner: Tutorial Lifecycle
Boundary: Tutorial commands and state transitions, excluding transport and repository sessions.
Evidence: Handler now calls a concrete service and its fake implements provider methods unrelated to Tutorial creation.
Action: P2 — extract or link the approved boundary issue before commit.
```
