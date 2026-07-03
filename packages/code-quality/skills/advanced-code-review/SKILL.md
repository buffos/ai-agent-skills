---
name: code-review
description: Run a strict pre-commit or pre-submit review over a diff, branch, working tree, or range such as HEAD~5. Use when the user wants strict code review for spec fulfillment, code quality, repo-wide verification, SOLID issues, Fowler refactoring issues, or commit readiness.
---

# Advanced Code Review

Strict pre-commit review.

Read [REFERENCE.md](./REFERENCE.md). Read [FOWLER_REFACTORING.md](./FOWLER_REFACTORING.md) when checking smells and refactoring options. Read [SOLID_REVIEW.md](./SOLID_REVIEW.md) when reviewing classes, services, handlers, or module boundaries.

## Inputs

Review one of:

- `git diff <fixed-point>...HEAD`
- `git diff --cached`
- `git diff`
- a user-supplied diff range

If the target is unspecified, ask for it.

## Checklist

1. Resolve target.
   Done when the diff command works, the fixed point resolves, the changed files are known, and the diff is non-empty.

2. Build intent stack.
   Read strongest available sources in this order:
   - explicit spec path from the user
   - `docs/agents/issues/`
   - `.okf/` planning graph nodes and linked PRD or issues
   - commit messages, branch name, ADRs, local docs
   Done when you can state the intended problem, issue, PRD, capability, or you explicitly report missing evidence.

3. Review the change.
   Check:
   - problem-solution fit
   - spec fulfillment
   - correctness and regressions
   - test adequacy
   - repo conventions
   - SOLID issues
   - Fowler smells worth fixing now
   Done when every material finding has severity, evidence, impact, and a fix direction.

4. Run repo-wide gates.
   Derive commands from CI, package scripts, task runners, Makefiles, or contributor docs.
   Minimum gates:
   - tests
   - lint
   - build or typecheck when the repo normally requires them
   Done when repo-wide gates pass or are reported as blockers. Touched-files-only checks are not enough.

5. Decide commit readiness.
   `ready to commit` only if:
   - no unresolved `P0` to `P2` findings
   - intended issue or spec is identified, or the user explicitly accepts that none exists
   - enough evidence shows the problem is solved
   - repo-wide tests pass
   - repo-wide lint passes
   - normal build or typecheck gates pass
   Otherwise: `not ready to commit`.

6. Output.
   Report findings first, ordered by severity. Then missing evidence or open questions. Then verification results. Then verdict.

7. Commit behavior.
   If commit-ready and changes are local and uncommitted, create one detailed conventional commit.
   If the reviewed range is already committed, do not rewrite history; provide the exact commit message only.
