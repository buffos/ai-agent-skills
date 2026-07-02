# Planning And Tracking Diagrams

Use these diagrams for planning, progress, chronology, and user experience over time.

## User Journey

Use for stages in an experience, actor touchpoints, and emotional/satisfaction scoring.

```mermaid
journey
    title Checkout journey
    section Discover
      Browse products: 4: Customer
      Compare options: 3: Customer
    section Purchase
      Add to cart: 5: Customer
      Complete checkout: 2: Customer, Payment Gateway
    section Aftercare
      Track shipment: 4: Customer, Support
```

Choose this over flowchart when the question is about experience quality, not system logic.

## Gantt

Use for dated plans, milestones, dependencies, and delivery schedules.

```mermaid
gantt
    title Release plan
    dateFormat  YYYY-MM-DD
    section Discovery
    Requirements          :done, req, 2026-05-01, 5d
    Architecture          :done, arch, after req, 3d
    section Delivery
    Build feature         :active, build, after arch, 7d
    QA                    :qa, after build, 4d
    Launch                :milestone, launch, after qa, 1d
```

Choose this over timeline when duration and dependency matter.

## Timeline

Use for chronology without task scheduling detail.

```mermaid
timeline
    title Platform evolution
    2023 : MVP launched
         : First paying customers
    2024 : Multi-tenant rollout
    2025 : International expansion
```

Choose this over gantt when you only need ordered events.

## Kanban

Use for work states and in-flight items rather than dates.

```mermaid
kanban
    Todo[Todo]
        api[Define API contract]
        ux[Review empty state]
    Doing[In Progress]
        auth[Implement session refresh]
    Done[Done]
        ci[Fix flaky CI job]
```

Choose this over gantt when throughput and status matter more than schedule.

## Common Mistakes

- Using gantt for unscheduled brainstorming
- Using timeline for dependency-heavy plans
- Using kanban for strict date commitments
- Using user journey to model backend control flow
