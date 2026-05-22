---
name: mermaid-diagrams
description: Create, choose, and refine Mermaid diagrams for software design, architecture, data modeling, project planning, technical documentation, and analysis. Use when users ask to diagram, visualize, model, map out, sketch, chart, show relationships, show a flow, document an architecture, explain a process, represent state changes, show timelines, plan work, compare options, visualize metrics, express event-sourced flows, map strategic components, or turn structured information into Mermaid syntax. Supports selecting the right Mermaid diagram type, producing clean Mermaid code, splitting overloaded diagrams into focused views, and adapting output for common diagram families including flowchart, sequence, class, state, ERD, C4, architecture, user journey, gantt, timeline, gitGraph, requirement, mindmap, pie, quadrant, sankey, xychart, block, packet, kanban, radar, treemap, venn, ishikawa, wardley, event modeling, treeView, and ZenUML.
---

# Mermaid Diagramming

Create Mermaid diagrams by first choosing the right diagram family, then emitting the smallest clear diagram that answers the user's need.

## Workflow

1. Identify the user's real intent before choosing syntax.
2. Pick the narrowest diagram type that matches that intent.
3. Keep one diagram focused on one question.
4. Split overloaded requests into 2-4 smaller diagrams when needed.
5. Prefer stable Mermaid syntax unless the user explicitly wants a newer or experimental type.
6. If the requested type is version-sensitive, say so briefly and keep the syntax minimal.

## Diagram Selection

Use this routing logic before writing Mermaid:

- **Flowchart** for process steps, branching logic, user/admin workflows, algorithms, and operational runbooks.
- **Sequence Diagram** for time-ordered interactions between actors, services, APIs, queues, and databases.
- **ZenUML** for code-like interaction flows when the user thinks in methods, control flow, `if`, `try`, `for`, and nested calls.
- **Class Diagram** for object models, domain entities, interfaces, and OOP structure.
- **ERD** for relational data schemas, keys, and cardinality.
- **State Diagram** for lifecycle states and legal transitions.
- **C4** for architecture by abstraction level: context, container, component.
- **Architecture** for cloud, infra, CI/CD, service topology, and deployment relationships.
- **Block Diagram** for high-level system decomposition when flowchart feels too procedural.
- **User Journey** for experience stages, touchpoints, and satisfaction across actors.
- **Gantt** for schedules, milestones, dependencies, and timelines with durations.
- **Timeline** for chronology, historical events, phased rollouts, and ordered milestones without dependency detail.
- **Kanban** for work-in-progress and items moving across stages.
- **GitGraph** for branching strategy, release flow, and merge history.
- **Requirement Diagram** for SysML-style requirements, traceability, verification, and design constraints.
- **Mindmap** for brainstorming, topic decomposition, and hierarchical idea exploration.
- **TreeView** for directory-like or hierarchy-only structures.
- **Ishikawa** for root-cause analysis.
- **Pie** for simple part-to-whole comparisons with few categories.
- **Quadrant Chart** for prioritization or 2-axis positioning with a small number of labeled items.
- **XY Chart** for line/bar comparisons across categories or numeric ranges.
- **Radar** for capability/profile comparison across multiple dimensions.
- **Treemap** for hierarchical proportions.
- **Venn** for overlaps between sets.
- **Sankey** for weighted flow between stages or categories.
- **Packet** for bit/field layout of binary protocols or message headers.
- **Event Modeling** for event-sourced/domain-event storytelling across UI, commands, read models, and events.
- **Wardley** for strategic maps of user visibility versus component evolution.

## Fast Disambiguation

Use these tie-breakers when multiple diagram types seem plausible:

- Choose **flowchart** over **sequence** when order matters less than branching and decisions.
- Choose **sequence** over **flowchart** when actors/participants matter more than branching.
- Choose **state** over **flowchart** when the question is "what states can this thing be in?" rather than "what steps happen?".
- Choose **ERD** over **class** for tables and persistence; choose **class** over **ERD** for behaviors and interfaces.
- Choose **C4** over **architecture** for software architecture storytelling across abstraction levels; choose **architecture** for deployment/infrastructure pictures.
- Choose **timeline** over **gantt** when you need chronology without task duration/dependencies.
- Choose **kanban** over **gantt** when work status matters more than dates.
- Choose **quadrant** over **xychart** when there are a few named items to position, not a measured series.
- Choose **treemap** over **pie** when proportions are hierarchical.
- Choose **venn** over **mindmap** when overlap is the point.
- Choose **block** over **flowchart** when the goal is system structure, not step-by-step behavior.
- Choose **ZenUML** over **sequenceDiagram** when the user gives code-like nested call logic.
- Choose **event modeling** over **sequence/state/flowchart** when the story is about information changing over time in an event-driven system.
- Choose **Wardley** over **architecture** when the point is strategic positioning and evolution, not deployment topology.

## Output Rules

- Start with valid Mermaid code immediately unless the user asked for explanation first.
- Keep labels short and concrete.
- Avoid decorative styling unless it improves readability.
- Use comments only when they help maintainability.
- Prefer stable keywords and common shapes first.
- For beta/newer diagram types, keep to the documented core syntax and avoid fancy options.
- If a diagram gets wide, split by scenario, subsystem, or abstraction level.

## Recommended Response Pattern

When the user asks for a diagram, produce:

1. A one-line statement of the chosen diagram type if the choice is non-obvious.
2. The Mermaid code block.
3. Optional short notes only if there is a tradeoff, assumption, or version caveat.

## Core Syntax Reminder

All Mermaid diagrams start with a type declaration:

```mermaid
diagramType
  definition content
```

General rules:

- Use `%%` for comments.
- Mermaid is sensitive to spelling and indentation in several diagram families.
- Quote labels with spaces or risky punctuation when syntax looks fragile.
- Frontmatter config must be the first thing in the block if used.

## References

Read only the file relevant to the user's intent:

- **[references/flowcharts.md](references/flowcharts.md)** - Process logic, workflows, decisions, subgraphs, styling
- **[references/sequence-diagrams.md](references/sequence-diagrams.md)** - Participants, messages, activations, alt/opt/par/loop blocks
- **[references/zenuml.md](references/zenuml.md)** - Code-like interaction flows with nested calls and control structures
- **[references/class-diagrams.md](references/class-diagrams.md)** - Entities, interfaces, inheritance, composition, multiplicity
- **[references/erd-diagrams.md](references/erd-diagrams.md)** - Relational schema modeling, keys, relationships, attributes
- **[references/state-and-lifecycle-diagrams.md](references/state-and-lifecycle-diagrams.md)** - State machines, lifecycle transitions, choices, forks
- **[references/c4-diagrams.md](references/c4-diagrams.md)** - Context, container, component architecture views
- **[references/architecture-diagrams.md](references/architecture-diagrams.md)** - Deployment, cloud, infra, service topology
- **[references/planning-and-tracking-diagrams.md](references/planning-and-tracking-diagrams.md)** - User journey, gantt, timeline, kanban
- **[references/engineering-governance-diagrams.md](references/engineering-governance-diagrams.md)** - Requirement diagrams, gitGraph, packet, block
- **[references/chart-and-analysis-diagrams.md](references/chart-and-analysis-diagrams.md)** - Pie, quadrant, sankey, xychart, radar, treemap, venn
- **[references/structure-and-thinking-diagrams.md](references/structure-and-thinking-diagrams.md)** - Mindmap, treeView, ishikawa
- **[references/strategy-and-event-diagrams.md](references/strategy-and-event-diagrams.md)** - Event modeling and Wardley maps
- **[references/advanced-features.md](references/advanced-features.md)** - Themes, configuration, layout, export, rendering

## Version-Sensitive Types

Several Mermaid diagram families in current official docs are marked newer, beta, or experimental, including types such as `architecture-beta`, `treemap-beta`, `treeView-beta`, `venn-beta`, `radar-beta`, `mindmap`, `timeline`, `eventmodeling` (v11.15.0+), and `wardley-beta` (v11.14.0+).

For these:

- Prefer the official minimal syntax.
- Avoid undocumented variants.
- Mention version sensitivity if the environment is unknown.
- If the runtime likely lacks support, fall back to a nearby stable type:
  - `block` or `flowchart` instead of unsupported architecture-like syntax
  - `timeline` or `flowchart` instead of unsupported gantt-like/roadmap syntax
  - `pie` or `xychart` instead of unsupported advanced chart syntax

## Unsupported Or Unclear Requests

If the user asks for a Mermaid type that is not clearly supported in the target runtime:

- Say the target may not support that diagram type.
- Offer the closest Mermaid-native fallback.
- Preserve the user's information design even if the syntax family changes.

This is especially important for diagram names that appear in some community examples or configs but are not consistently present in the main syntax reference for the target Mermaid version.
