# Structure And Thinking Diagrams

Use these diagrams for hierarchy, brainstorming, and root-cause analysis.

## Mindmap

Use for concept decomposition and brainstorming.

```mermaid
mindmap
  root((Observability))
    Metrics
      Latency
      Throughput
    Logs
      Errors
      Audit
    Tracing
      Spans
      Correlation IDs
```

Choose this over flowchart when relationships are hierarchical, not sequential.

## TreeView

Use for directory-like structures or simple parent-child hierarchy display.

```mermaid
treeView-beta
    "src"
        "api"
            "routes.ts"
            "handlers.ts"
        "ui"
            "App.tsx"
            "Dashboard.tsx"
```

Choose this over mindmap when the shape should read like a file tree.

## Ishikawa

Use for root-cause analysis of one problem.

```mermaid
ishikawa-beta
    "Checkout abandonment"
        "Product"
            "Unexpected fees"
            "Weak value proposition"
        "UX"
            "Long form"
            "Confusing shipping options"
        "Performance"
            "Slow payment step"
```

Choose this over mindmap when the central question is causes of a problem.

## Common Mistakes

- Using mindmap for chronological flows
- Using treeView when overlap or cross-links matter
- Using ishikawa without a single clear effect/problem at the head
