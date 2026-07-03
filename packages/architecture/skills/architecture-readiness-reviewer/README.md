# Architecture Readiness Reviewer

Reviews the full reference document set before implementation starts.

Use it after the core artifacts exist to find contradictions, underspecified
behavior, terminology drift, architecture bias, and testability gaps. It writes
findings to `docs/architecture/<capability-slug>/readiness-review.md` and acts as the final gate
before issue slicing or coding.
