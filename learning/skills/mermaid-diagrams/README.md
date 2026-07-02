# Mermaid Diagrams Skill

This skill helps Codex choose the right Mermaid diagram type, generate valid Mermaid syntax, and keep diagrams focused on the actual question being asked.

The skill is no longer just a syntax cheat sheet for a few core diagram types. It now acts as a routing layer:

- identify the user's real intent
- choose the best Mermaid diagram family
- produce a small, clear diagram
- fall back cleanly when a diagram type is version-sensitive or unsupported

## What This Skill Covers

The current skill covers both common and newer Mermaid families, including:

- flowchart
- sequence diagram
- ZenUML
- class diagram
- ERD
- state diagram
- C4
- architecture
- user journey
- gantt
- timeline
- kanban
- gitGraph
- requirement diagram
- block diagram
- packet
- pie
- quadrant chart
- xychart
- sankey
- radar
- treemap
- venn
- mindmap
- treeView
- ishikawa
- Wardley
- event modeling

## Skill Design

The skill is organized around selection first, syntax second.

- [SKILL.md](SKILL.md) contains trigger coverage, diagram-selection heuristics, tie-breakers, output rules, and reference navigation.
- `references/` contains focused guides for each diagram family or group of related diagram families.
- [agents/openai.yaml](agents/openai.yaml) provides UI metadata for the skill.

This keeps the main skill body lean while making detailed syntax available only when needed.

## Repository Structure

```text
mermaid-diagrams/
├── SKILL.md
├── agents/
│   └── openai.yaml
└── references/
    ├── advanced-features.md
    ├── architecture-diagrams.md
    ├── c4-diagrams.md
    ├── chart-and-analysis-diagrams.md
    ├── class-diagrams.md
    ├── engineering-governance-diagrams.md
    ├── erd-diagrams.md
    ├── flowcharts.md
    ├── planning-and-tracking-diagrams.md
    ├── sequence-diagrams.md
    ├── state-and-lifecycle-diagrams.md
    ├── strategy-and-event-diagrams.md
    ├── structure-and-thinking-diagrams.md
    └── zenuml.md
```

## Reference Map

- [references/flowcharts.md](references/flowcharts.md): workflows, decisions, process logic
- [references/sequence-diagrams.md](references/sequence-diagrams.md): participant interactions over time
- [references/zenuml.md](references/zenuml.md): code-like nested interaction flows
- [references/class-diagrams.md](references/class-diagrams.md): domain and OOP structure
- [references/erd-diagrams.md](references/erd-diagrams.md): relational schema modeling
- [references/state-and-lifecycle-diagrams.md](references/state-and-lifecycle-diagrams.md): states and legal transitions
- [references/c4-diagrams.md](references/c4-diagrams.md): system context, containers, components
- [references/architecture-diagrams.md](references/architecture-diagrams.md): infra and deployment topology
- [references/planning-and-tracking-diagrams.md](references/planning-and-tracking-diagrams.md): user journey, gantt, timeline, kanban
- [references/engineering-governance-diagrams.md](references/engineering-governance-diagrams.md): requirement, gitGraph, packet, block
- [references/chart-and-analysis-diagrams.md](references/chart-and-analysis-diagrams.md): pie, quadrant, xychart, sankey, radar, treemap, venn
- [references/structure-and-thinking-diagrams.md](references/structure-and-thinking-diagrams.md): mindmap, treeView, ishikawa
- [references/strategy-and-event-diagrams.md](references/strategy-and-event-diagrams.md): event modeling and Wardley
- [references/advanced-features.md](references/advanced-features.md): theming, layout, styling, export

## How To Use The Skill

Use this skill when the goal is to turn technical or structured information into Mermaid. Typical requests include:

- diagram a system architecture
- show the authentication flow
- map out a user journey
- model the database schema
- show order lifecycle states
- compare options on a quadrant chart
- map weighted flows with sankey
- model event-sourced behavior
- create a Wardley map

The skill works best when the request is framed around the communication goal, not only the syntax name.

For example:

- "Show how checkout works across services" -> sequence diagram
- "Show the states an order can move through" -> state diagram
- "Show the database tables and relationships" -> ERD
- "Show high-level deployment topology" -> architecture
- "Show impact vs effort for these initiatives" -> quadrant chart

## Key Improvements Over The Previous Version

- expanded from a small core subset to broad Mermaid family coverage
- added routing logic for choosing the right diagram type
- added tie-breakers between similar diagram families
- added grouped references for newer Mermaid syntaxes
- added version-sensitivity guidance for newer or beta families
- added skill UI metadata in `agents/openai.yaml`

## Validation

The skill has been validated with the `skill-creator` validator:

```powershell
python C:\Users\buffo\.codex\skills\.system\skill-creator\scripts\quick_validate.py .
```

## Notes

- Mermaid support still depends on the target runtime and Mermaid version.
- Some newer diagram families are version-sensitive and may need fallbacks.
- When a diagram becomes overloaded, the skill should prefer multiple focused diagrams over one large diagram.

## External Resources

- [Mermaid Live Editor](https://mermaid.live)
- [Official Mermaid Documentation](https://mermaid.js.org)
- Mermaid CLI: `npm install -g @mermaid-js/mermaid-cli`
