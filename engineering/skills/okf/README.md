# OKF Skill

This folder contains a portable Codex skill for working with the Open Knowledge
Format (OKF): authoring bundles, maintaining them, and using them as context.

The skill is self-contained:

- [SKILL.md](SKILL.md) is the instruction file the agent follows.
- [reference/SPEC.md](reference/SPEC.md) is the bundled OKF v0.1 normative
  reference.
- [templates/concept.md](templates/concept.md),
  [templates/index.md](templates/index.md), and
  [templates/log.md](templates/log.md) are starting points for new bundle
  content.

The current upstream OKF materials were checked against the public
`GoogleCloudPlatform/knowledge-catalog` repository on July 2, 2026.

## What the skill does

The skill has three operating modes:

- `produce`: create a new OKF bundle or add new concepts to an existing one
- `maintain`: update an existing bundle after code, docs, or operating reality
  changes
- `consume`: use an OKF bundle as task context without necessarily editing it

In practice, the agent decides the mode from the request and the repo context.

## Prompt patterns

These are the kinds of prompts that should trigger the skill.

### Produce

- `Document this service in OKF.`
- `Create an .okf bundle for the auth system.`
- `Capture the API, schema, and runbook as OKF concepts.`
- `Write OKF docs for this repo from the codebase.`

Expected behavior:

- choose or create the bundle root, usually `.okf/`
- derive concepts from code, docs, config, or user instructions
- write concept files with YAML frontmatter and markdown bodies
- create or refresh `index.md` and `log.md`
- validate before finishing

### Maintain

- `Update the OKF bundle to reflect the new billing pipeline.`
- `The schema changed. Fix the OKF docs.`
- `Refresh the knowledge bundle after this refactor.`
- `Add a deprecation note for the legacy endpoint in OKF.`

Expected behavior:

- find every affected concept
- update bodies, metadata, and cross-links
- add concepts for new assets
- record the change in `log.md`
- validate before finishing

### Consume

- `Use the .okf bundle to understand this repo.`
- `Read the OKF docs before changing the ingestion worker.`
- `What does the OKF bundle say about the customer metrics pipeline?`
- `Use the knowledge bundle as context for this bug.`

Expected behavior:

- start from `index.md` when available
- load only the relevant concepts
- follow links progressively
- tolerate incomplete or partially stale bundles
- write back durable new knowledge when the task uncovers it

## Authoring rules the skill enforces

- One concept per markdown file.
- The concept ID is the file path without `.md`.
- Every non-reserved concept file must have parseable YAML frontmatter.
- Every concept frontmatter block must include a non-empty `type`.
- `index.md` and `log.md` are reserved filenames and should not be used for
  concepts.
- Standard markdown links express relationships between concepts.
- Bundle-root absolute links like `/services/auth-api.md` are preferred because
  they are stable when files move within subdirectories.

## Relationship to the companion skills

This skill is intentionally focused on authoring and reading OKF bundles. It
expects these companion skills to handle adjacent tasks:

- [../okf-validate/SKILL.md](../okf-validate/SKILL.md): deterministic
  validation
- [../okf-visualize/SKILL.md](../okf-visualize/SKILL.md): HTML graph rendering

Typical flow:

1. Use `okf` to create or update bundle content.
2. Use `okf-validate` to confirm conformance.
3. Use `okf-visualize` to render a browsable graph when helpful.

## Notes on portability

This skill avoids provider-specific conventions:

- no Claude-specific environment variables
- no Claude-only tool assumptions
- no hard-coded workspace paths

The skill assumes only that the agent can read and write files in the current
workspace and can invoke the companion skills when they are installed.
