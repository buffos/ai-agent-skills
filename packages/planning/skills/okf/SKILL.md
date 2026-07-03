---
name: okf
description: Author, maintain, and consume Open Knowledge Format (OKF) knowledge bundles as portable markdown plus YAML frontmatter. Use when documenting durable project knowledge in an `.okf/` bundle, updating an existing OKF bundle after code or docs change, or using an OKF bundle as task context.
---

# OKF

Use this skill to produce, maintain, or consume an Open Knowledge Format bundle.
For non-trivial work, read [reference/SPEC.md](reference/SPEC.md) first. It is
the bundled normative source for OKF v0.1.

Default bundle location: use `.okf/` at the repository root unless the project
already uses a different OKF bundle path.

Templates:

- [templates/concept.md](templates/concept.md)
- [templates/index.md](templates/index.md)
- [templates/log.md](templates/log.md)

## Hard rule

A bundle is conformant when every non-reserved `.md` file has parseable YAML
frontmatter and every such frontmatter block has a non-empty `type`. Treat all
other spec rules as guidance for production quality, not reasons to reject a
bundle during consumption.

## Produce

1. Read [reference/SPEC.md](reference/SPEC.md).
2. Derive the concept set from code, docs, config, or user instructions.
3. Organize concepts by domain. One concept per file; concept ID is path minus
   `.md`.
4. Write concepts from [templates/concept.md](templates/concept.md). Always set
   `type`. Add `title`, `description`, `resource`, `tags`, and `timestamp` when
   they improve retrieval.
5. Cross-link related concepts with standard markdown links. Prefer bundle-root
   absolute links such as `/services/auth-api.md`.
6. Add or refresh directory `index.md` files and append a dated `log.md` entry.
7. Run the companion `okf-validate` skill before finishing. Resolve every
   `ERROR`.

Completion criterion: the new bundle or concept set exists, is internally
linked, and validates without errors.

## Maintain

1. Find the affected concepts by topic, `resource`, path, or links.
2. Update the body and `timestamp` for durable changes.
3. Add new concepts for new assets; mark removals or retirements explicitly
   instead of silently deleting important context.
4. Refresh nearby `index.md` files and append a dated `log.md` entry.
5. Run `okf-validate` and fix every `ERROR`.

Completion criterion: every affected concept and index is updated, the log
records the change, and validation passes without errors.

## Consume

1. Start at the bundle-root `index.md` when present.
2. Read only the concepts needed for the task, following links progressively.
3. Tolerate missing optional fields, unknown types, and broken links.
4. If the task reveals durable knowledge that should persist, switch to
   maintain mode and write it back into the bundle.

Completion criterion: the bundle has informed the task, and any durable new
knowledge has been written back when appropriate.

## Companion skills

- `okf-validate`: deterministic conformance checker
- `okf-visualize`: self-contained HTML graph renderer
