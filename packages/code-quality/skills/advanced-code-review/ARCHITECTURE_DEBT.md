# Architecture Debt Handoff

Use this reference after an architecture-delta review identifies coupling or a
boundary problem.

## Classify

- **New or worsened debt:** P2. The change is not commit-ready until the
  problem is fixed or a concrete, approved delivery issue owns it.
- **Pre-existing debt exposed but not worsened:** P3. Report it separately;
  do not claim the surrounding architecture is healthy.

## Handoff

For every architecture debt finding, identify:

- the owning capability or closest delivery area;
- the affected boundary and its immediate impact;
- the shortest credible refactor direction; and
- an existing issue link, or the exact proposed issue title and dependency.

When the repository has an OKF map and issue registry, use their capability
and issue conventions. A review is read-only unless the user authorizes issue
creation; in that case, create or update the delivery record rather than
leaving an orphan note.

## Reporting standard

Always report these separately:

1. **Current-diff architecture:** no regression, or the P2 regression.
2. **Pre-existing architecture debt:** none found, or the P3/P2 handoff.
3. **Commit readiness:** derived from both the normal review and the
   architecture result.

Never replace these statements with a blanket “SOLID compliant” conclusion.

## Milestone escalation

Recommend a separate whole-codebase architecture pass when a capability
milestone completes, when the same boundary receives repeated P3 findings, or
when a P2 refactor is deferred. Use an architecture-improvement workflow for
that pass; do not turn each pre-commit review into a repository-wide audit.
