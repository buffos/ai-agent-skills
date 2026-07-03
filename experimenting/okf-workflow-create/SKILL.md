---
name: okf-workflow-create
description: Create or update workflow concepts in `.okf/workflows/` using OKF-compatible markdown plus frontmatter. Use when defining a reusable project workflow, documenting a skill sequence, or maintaining a workflow catalog outside generic OKF and planning-node semantics.
---

# OKF Workflow Create

Author workflow concepts under `.okf/workflows/`.

This skill defines how reusable workflows are documented as OKF-compatible
concepts. It does not replace executable orchestration skills; it captures the
durable workflow contract that those skills can follow.

Read [REFERENCE.md](./REFERENCE.md) before non-trivial work.

Use [templates/workflow.md](./templates/workflow.md) when creating a new
workflow concept.

## Workflow

### 1. Locate the workflow bundle area

Use `.okf/workflows/` at the repo root unless the project already uses a
different OKF bundle location.

If `.okf/workflows/` does not exist, create it. Do not infer that a planning
graph exists just because the workflows folder exists.

### 2. Identify the workflow operation

Determine whether the request is to:

- create a new workflow
- update an existing workflow
- split a broad workflow into smaller workflows
- add a new variant or decision point
- refresh workflow links after skills or artifacts changed

### 3. Gather the execution contract

Before writing, establish:

- the workflow purpose
- when the workflow should be used
- prerequisites
- the ordered skill or action sequence
- decision points or reroute conditions
- expected artifacts or outputs

If the real workflow is still vague, stop and clarify before documenting it.

### 4. Read local context

Read only what the workflow needs:

- referenced skills
- nearby `.okf` workflow concepts
- relevant project docs or conventions

Reuse existing workflow vocabulary when possible.

### 5. Write the workflow concept

Create or update the workflow using [templates/workflow.md](./templates/workflow.md).

Keep the workflow concrete:

- name the skills or actions in order
- record the decision points explicitly
- link to artifacts the workflow reads or writes

Do not embed large copies of skill bodies. Link to the skill or artifact
instead.

### 6. Maintain the workflow catalog

Create or refresh `.okf/workflows/index.md` so the available workflows can be
discovered progressively.

If the repo uses a root `.okf/index.md`, add or refresh the workflows entry
there when appropriate.

### 7. Finish in a reusable state

Before finishing, verify:

- frontmatter parses
- the workflow has a non-empty `type`
- the sequence is ordered and readable
- decision points are explicit
- links to skills and artifacts are accurate

Route to the generic `okf-validate` skill if bundle conformance needs to be
checked.
