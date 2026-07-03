# Bounded Capability Example

This example shows how the architecture package is meant to be used after
`fog-of-war-planning` has already produced a `bounded` capability node.

## Input: Owning Capability Node

Example `.okf` node before exact-spec work:

```yaml
type: capability
title: Quote to Order
state: bounded
project: /project.md
parent: /capabilities/sales/index.md
shared_with:
  - /capabilities/shared/search.md
intent: Turn approved customer quotes into committed orders.
scope: Quote creation, discount approval, quote expiry, and quote-to-order conversion.
artifact_root: docs/architecture/quote-to-order
```

At this point the node is bounded, but it does not yet have exact artifacts.

## Package Flow

Run the architecture package in this order:

1. `bounded-capability-spec-orchestrator`
2. `requirements-gap-analyzer` if blocking ambiguity remains
3. `domain-glossary-extractor`
4. `prd-author`
5. `canonical-domain-modeler`
6. `canonical-use-case-modeler`
7. `canonical-contract-author`
8. `acceptance-scenario-author`
9. `architecture-readiness-reviewer`
10. `reference-docs-to-issues`
11. `process-reference-issue`

## Produced Artifact Paths

The architecture package should produce these node-scoped files:

```text
docs/architecture/quote-to-order/
  orchestration-status.md
  requirements-gap-analysis.md
  domain-glossary.md
  prd.md
  canonical-domain-model.md
  canonical-use-cases.md
  canonical-api-cli-contract.md
  acceptance-scenarios.md
  readiness-review.md
```

Some runs may skip or delay one of these, but these are the canonical target
paths.

## Write-Back To The Node

After the exact-spec pass, the owning capability node should look like:

```yaml
type: capability
title: Quote to Order
state: specified
project: /project.md
parent: /capabilities/sales/index.md
shared_with:
  - /capabilities/shared/search.md
intent: Turn approved customer quotes into committed orders.
scope: Quote creation, discount approval, quote expiry, and quote-to-order conversion.
artifact_root: docs/architecture/quote-to-order
gap_analysis: docs/architecture/quote-to-order/requirements-gap-analysis.md
orchestration_status: docs/architecture/quote-to-order/orchestration-status.md
glossary: docs/architecture/quote-to-order/domain-glossary.md
prd: docs/architecture/quote-to-order/prd.md
domain_model: docs/architecture/quote-to-order/canonical-domain-model.md
use_cases: docs/architecture/quote-to-order/canonical-use-cases.md
contract: docs/architecture/quote-to-order/canonical-api-cli-contract.md
scenarios: docs/architecture/quote-to-order/acceptance-scenarios.md
readiness_review: docs/architecture/quote-to-order/readiness-review.md
```

The node should move to `specified` only after the readiness review is clean
enough.

## Example Slice Output

After `reference-docs-to-issues`, you might expect issue slices like:

1. `001-quote-create-and-expiry.md`
   Covers quote creation, validity window, and expiration rules.
2. `002-discount-approval-flow.md`
   Blocked by `001`. Covers approval thresholds and outcomes.
3. `003-convert-approved-quote-to-order.md`
   Blocked by `001,002`. Covers conversion command and resulting order state.
4. `004-quote-order-contract-surface.md`
   Covers API/CLI parity and contract verification for the bounded capability.

Registry and issue files remain in:

```text
issues/
  issues.md
  pending/
  done/
```

The registry row for each issue should explicitly include:

- `Owning Capability`: the `.okf` node path
- `Artifact Root`: `docs/architecture/quote-to-order/`
- `Issue File`: the current markdown issue path

Each issue file should repeat those values in its metadata so selection and
execution can verify routing consistency before code changes begin.

And the owning node should gain:

```yaml
issues:
  - issues/pending/001-quote-create-and-expiry.md
  - issues/pending/002-discount-approval-flow.md
  - issues/pending/003-convert-approved-quote-to-order.md
  - issues/pending/004-quote-order-contract-surface.md
```

## What This Example Demonstrates

- planning owns the node and its state
- architecture owns exact specification for the bounded node
- the node-scoped artifact root is stable
- issue slicing is downstream of readiness review
- the node remains the durable place where artifact references are collected
