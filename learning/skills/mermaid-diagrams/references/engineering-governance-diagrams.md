# Engineering And Governance Diagrams

Use these diagrams for traceability, version-control strategy, protocol structure, and high-level system composition.

## Requirement Diagram

Use for SysML-style requirements, traceability, and verification.

```mermaid
requirementDiagram
    functionalRequirement api_latency {
        id: FR-1
        text: API p95 latency must stay below 250ms
        risk: Medium
        verifymethod: Test
    }

    element perf_suite {
        type: test-suite
        docref: perf/api-latency.spec.ts
    }

    perf_suite - verifies -> api_latency
```

Choose this over flowchart when the point is traceability, not behavior.

## GitGraph

Use for branching, releases, and merge strategy.

```mermaid
gitGraph LR:
    commit id: "init"
    branch develop
    checkout develop
    commit id: "feature-a"
    branch release
    checkout main
    merge develop
    checkout release
    commit id: "qa-fixes"
    checkout main
    merge release
```

Choose this over flowchart when the audience needs Git history shape.

## Packet

Use for bit/byte fields in network or binary message layouts.

```mermaid
packet
    0-3: "Version"
    4-7: "IHL"
    8-13: "DSCP"
    14-15: "ECN"
    16-31: "Total Length"
```

Use `+<count>` style when iterative editing is easier than absolute ranges.

## Block Diagram

Use for high-level system decomposition without implying runtime order.

### Flat layout

```mermaid
block
    columns 3
    Frontend["Frontend"]
    API["API Layer"]
    Data["Data Layer"]
    Frontend --> API
    API --> Data
```

### Nested blocks with columns

Blocks can nest to group related components. Each `block:ID["Label"]` opens a named block region; `columns` inside it controls the inner grid.

```mermaid
block
    columns 1

    block:external["External"]
        columns 3
        telegram["Telegram"]
        discord["Discord"]
        slack["Slack"]
    end

    block:app["Application"]
        columns 2
        block:plugins["Plugins"]
            columns 1
            bookmarks["bookmarks"]
            feeds["feeds"]
        end
        gateway["Chat Gateway"]
        ai["AI Provider"]
    end

    telegram --> gateway
    discord --> gateway
    slack --> gateway
    gateway --> ai
```

Choose this over flowchart when the system is structural, not procedural.

### Common Mistakes

- Using requirement diagrams as a substitute for architecture
- Using gitGraph for generic workflow logic
- Using packet diagrams without exact field widths
- Using block diagrams when state or timing is the actual concern
- Using bare `block-beta` as the diagram type keyword — use `block` instead (the older keyword `block-beta` was renamed)
