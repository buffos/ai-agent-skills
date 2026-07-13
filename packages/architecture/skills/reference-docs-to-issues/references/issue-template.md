# Issue Template

Use this local markdown template.

```markdown
## Issue Metadata

- Issue number: `NNN`
- Owning capability node: `/.okf/.../<capability>.md`
- Artifact root: `docs/architecture/<capability-slug>/`
- Issue file: `issues/pending/NNN-short-title.md`
- Category: `feature`
- Execution type: `AFK`
- Review gate: `none`
- Suggested state: `ready-for-agent`

If a review gate is declared, the issue remains `ready-for-agent` while the
agent implements it and moves to `awaiting-human-review` only after automated
acceptance checks pass.

## Parent Artifacts

- `docs/architecture/<capability-slug>/prd.md`
- `docs/architecture/<capability-slug>/canonical-domain-model.md`
- `docs/architecture/<capability-slug>/canonical-use-cases.md`
- `docs/architecture/<capability-slug>/canonical-api-cli-contract.md`
- `docs/architecture/<capability-slug>/acceptance-scenarios.md`

Include only the artifacts that actually exist and are relevant.

## What to build

A concise description of the vertical slice. Describe the end-to-end behavior, not a layer-by-layer task list.

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Human review gate

Use `None` when the review gate is `none`. For `visual-review` or
`product-approval`, state exactly what the user must inspect or approve before
the issue can move from `awaiting-human-review` to `done`.

## Blocked by

- Blocked by `issues/pending/NNN-title.md`

Or:

`None - can start immediately`

## Artifact anchors

- PRD: section or requirement anchor
- Domain model: concept, invariant, or lifecycle anchor
- Use cases: command/query or service anchor
- Contract: endpoint/CLI or external behavior anchor

Include only the anchors that exist and matter.

## Acceptance scenarios addressed

- Scenario title 1
- Scenario title 2

If no acceptance-scenarios artifact exists yet, say:

`Not yet defined`

## Verification obligations

- Policy source: `/.okf/<root-project-node>.md`

| Scenario | Backend boundary | Frontend integration | End-to-end journey |
|---|---|---|---|
| `SC-001` | `planned` | `not-applicable` | `deferred: no E2E harness` |

Use stable acceptance-scenario IDs when available. Every cell must be one of
`planned`, `implemented: <test path or command>`, `deferred: <reason>`, or
`not-applicable`. Apply the root project's verification policy when deciding
whether an entry blocks issue closure.
```

Keep the metadata aligned with the registry row. The `Owning capability node`,
`Artifact root`, and `Issue file` values are mandatory for architecture-scoped
issues.
