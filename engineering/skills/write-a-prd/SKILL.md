---
name: write-a-prd
description: Generate a PRD for a bounded capability and write it as a local markdown file in docs/agents/issues/. Use when the user wants to turn a selected capability into a structured implementation PRD.
---

This skill writes detailed implementation PRDs. In repos that use `.okf/`, the capability graph is the planning source of truth and this skill is downstream of it.

You may skip steps if they are unnecessary, but do not invent missing planning structure when the graph should exist.

If `.okf/` exists, use `$okf-planning-profile` and read [../../../experimenting/okf-planning-profile/REFERENCE.md](../../../experimenting/okf-planning-profile/REFERENCE.md) before making assumptions about capability-node fields, planning states, or graph relationships.

## PRD Structure Convention

This project uses a **main + sub-PRD** architecture:

- **`docs/agents/issues/prd.md`** — the main reference PRD. Contains the overall problem statement, solution summary, cross-cutting concerns (shared architecture, deployment, multi-account, AI integration, testing philosophy), links to sub-PRDs, and development phases.
- **`docs/agents/issues/prd-<feature>.md`** — one sub-PRD per feature domain (e.g., `prd-youtube.md`, `prd-email.md`, `prd-feeds.md`). Each sub-PRD is **self-contained**: it has its own user stories, implementation decisions, testing decisions, and out-of-scope section. A sub-PRD should be independently actionable — an agent working on that feature should not need to read the main PRD except for cross-cutting patterns.

**Every feature — including the first one — lives in a sub-PRD.** The main PRD never contains feature-specific user stories or implementation details. It only contains cross-cutting content and links.

## Process

### 1. Determine the target PRD file

Before anything else, check whether `.okf/` exists.

- **If `.okf/` exists:** do not start from a blank user description. Ask which bounded capability should receive or refresh a PRD, then read the selected capability node, its parent, relevant siblings when needed, and any linked shared concepts before writing. Interpret and mutate node fields through `$okf-planning-profile`.
- **If `.okf/` does NOT exist:** do not invent the capability map here. Redirect the user to `fog-of-war-planning` so the territory is mapped first.

Then check if a main PRD (`docs/agents/issues/prd.md`) already exists:

- **If it exists:** Ask the user which sub-PRD file to write to (e.g., `docs/agents/issues/prd-payments.md`). The new feature will be written as a sub-PRD and linked from the main PRD.
- **If it does NOT exist:** You will need to create both:
  1. A main PRD (`docs/agents/issues/prd.md`) with the overall problem statement, solution, cross-cutting architecture, and a "Feature Sub-Documents" section linking to sub-PRDs.
  2. A sub-PRD (`docs/agents/issues/prd-<feature>.md`) with the feature-specific content.

  Ask the user for a short feature name to use in the filename (e.g., `prd-feeds.md`).

### 2. Gather the bounded-capability inputs

If `.okf/` exists, derive the starting context from the selected capability node and ask only for missing exactness.

At minimum, establish:

- which capability node owns this PRD
- whether the node is already `bounded`
- whether a linked PRD already exists and should be updated rather than created

Ask the user for any additional implementation detail that is still missing.

### 3. Explore the repo

Explore the repo to verify the selected capability's current state, linked artifacts, and implementation surface.

### 4. Interview the user

If the selected capability is still broad or mixes multiple outcomes, stop and route back to `fog-of-war-planning` or `grill-me` rather than forcing a PRD.

If the capability is bounded but not exact enough, use `grill-me-with-docs` behavior to tighten terminology, interfaces, and decisions before writing.

### 5. Sketch modules

Sketch out the major modules you will need to build or modify to complete the implementation. Actively look for opportunities to extract deep modules that can be tested in isolation.

A deep module (as opposed to a shallow module) is one which encapsulates a lot of functionality in a simple, testable interface which rarely changes.

Check with the user that these modules match their expectations. Check with the user which modules they want tests written for.

### 6. Write the PRD files and link them back to the graph

Once you have a complete understanding of the problem and solution, write the PRD files.

**For the sub-PRD** (`docs/agents/issues/prd-<feature>.md`), use the sub-PRD template below. Create the `docs/agents/issues/` directory if it doesn't exist. Do NOT submit a GitHub issue or call any external service.

**If the main PRD does not exist**, also create `docs/agents/issues/prd.md` using the main PRD template below. If the main PRD already exists, update it to add a link to the new sub-PRD in the "Feature Sub-Documents" section.

If `.okf/` exists, update the selected capability concept after writing through `$okf-planning-profile`, following the planning-profile contract:

- set or refresh its `prd` reference
- mark the capability `specified`
- keep the concept body conceptual; do not copy PRD detail back into the concept

<sub-prd-template>

# <Feature Name> Feature — Product Requirements Document

> **Status:** Draft
> **Created:** <date>
> **Parent:** [prd.md](./prd.md)

---

## Problem Statement

The problem that the user is facing, from the user's perspective. Scoped to this feature only.

## Solution

The solution to the problem, from the user's perspective. Scoped to this feature only.

## User Stories

A LONG, numbered list of user stories. Each user story should be in the format of:

1. As an <actor>, I want a <feature>, so that <benefit>

<user-story-example>
1. As a mobile bank customer, I want to see balance on my accounts, so that I can make better informed decisions about my spending
</user-story-example>

This list of user stories should be extremely extensive and cover all aspects of the feature.

User story numbering should continue from the highest number in any existing sub-PRD to avoid collisions. Check existing sub-PRDs for the current max number.

## Implementation Decisions

A list of implementation decisions that were made. This can include:

- The modules that will be built/modified
- The interfaces of those modules that will be modified
- Technical clarifications from the developer
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

Do NOT include specific file paths or code snippets. They may end up being outdated very quickly.

For cross-cutting decisions that live in the main PRD (e.g., AI integration, shared services), reference them with a link: "see [prd.md](./prd.md)".

## Testing Decisions

A list of testing decisions that were made. Include:

- A reference to the project-wide testing philosophy in the main PRD
- Which feature-specific modules will be tested
- Prior art for the tests (i.e. similar types of tests in the codebase)

## Out of Scope

A description of the things that are out of scope for this feature's PRD.

## Further Notes

Any further notes about the feature.

</sub-prd-template>

<main-prd-template>

# <Project Name> — Product Requirements Document

> **Status:** Draft
> **Created:** <date>

---

## Problem Statement

The overall problem the user is facing across all features.

## Solution

The high-level solution encompassing all features.

## Feature Sub-Documents

Detailed user stories, implementation decisions, and testing plans for each feature domain:

- **[prd-<feature>.md](./prd-<feature>.md)** — short description of the feature

## Cross-Cutting User Stories

User stories that span multiple features or address shared infrastructure (e.g., multi-account, deployment, settings).

## Shared Implementation Decisions

Architecture, backend structure, database strategy, AI integration, frontend framework, and other decisions shared across all features. Do NOT include feature-specific decisions here — those belong in sub-PRDs.

## Shared Testing Decisions

Project-wide testing philosophy, cross-cutting modules under test, and shared testing patterns.

## Out of Scope

Global out-of-scope items that apply across all features.

## Further Notes

Migration paths, development phases (referencing sub-PRDs), and other cross-cutting notes.

</main-prd-template>
