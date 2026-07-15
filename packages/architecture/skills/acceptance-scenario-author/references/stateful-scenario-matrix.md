# Stateful Scenario Matrix

Use this matrix only when the capability has lifecycle state, multiple trigger
sources, time-based behavior, independent work items, or concurrent mutation.
It identifies behavioral interactions that are easy to omit from a happy-path
scenario set; it is not an instruction to generate every Cartesian-product
variant.

## Build the matrix

List the applicable values from the canonical artifacts, then examine these
interactions:

| Interaction | Question to answer |
| --- | --- |
| State × action | Can every meaningful lifecycle state receive each permitted user or system action? |
| State × trigger | Which trigger sources are allowed, blocked, or handled differently in each state? |
| Time × lifecycle | What happens when a timer is missed, resumed, restarted, expired, or changed? |
| Failure × independent work | Does one item failing prevent unrelated items from completing their promised work? |
| Mutation × execution | What happens if state changes or deletion races with an in-flight action? |
| Scope × concurrency | How do ownership, retries, duplicate delivery, or simultaneous requests preserve the policy? |

For every relevant interaction, choose exactly one outcome:

1. Write one canonical scenario with an externally observable outcome.
2. Record `not-applicable` or a named deferred owner, with a reason.
3. Record a requirements gap and route it to the appropriate authoring step.

Do not invent a product policy to fill a gap. A scenario should prove the rule,
not its internal implementation. For example, use “a paused schedule can still
be run manually” rather than a database-state assertion.
