# Chart And Analysis Diagrams

Use these diagrams for comparison, prioritization, proportions, overlap, and weighted movement.

## Pie

Use for a small number of part-to-whole slices.

```mermaid
pie showData
    title Traffic sources
    "Organic" : 42
    "Paid" : 18
    "Referral" : 25
    "Direct" : 15
```

Avoid when there are many categories or close values.

## Quadrant Chart

Use for positioning a few named items on two dimensions such as impact vs effort.

```mermaid
quadrantChart
    title Prioritization
    x-axis Low effort --> High effort
    y-axis Low impact --> High impact
    quadrant-1 Defer
    quadrant-2 Quick wins
    quadrant-3 Low value
    quadrant-4 Strategic bets
    "Fix login error": [0.2, 0.8]
    "Rebuild design system": [0.8, 0.9]
```

## XY Chart

Use for line/bar series across categories or numeric ranges.

```mermaid
xychart
    title "Weekly signups"
    x-axis [Mon, Tue, Wed, Thu, Fri]
    y-axis "Users" 0 --> 120
    bar [34, 48, 52, 81, 67]
```

Choose this over quadrant when the points form a series or measurement set.

## Radar

Use for profile comparison across multiple dimensions.

```mermaid
radar-beta
    axis Speed
    axis Reliability
    axis Cost
    axis Maintainability
    curve "Option A" [4, 5, 2, 4]
    curve "Option B" [3, 3, 5, 3]
```

Use sparingly; values should be comparable on the same scale.

## Sankey

Use for weighted flow from sources to targets.

```mermaid
sankey
    Source,Target,Value
    Visit,Signup,120
    Signup,Activated,75
    Signup,Churned,45
```

Because syntax is CSV-like, keep labels clean and quote commas if needed.

## Treemap

Use for hierarchical proportions.

```mermaid
treemap-beta
    "Revenue"
        "Subscriptions": 62
        "Services": 21
        "Marketplace"
            "Fees": 9
            "Ads": 8
```

Choose this over pie when categories are nested.

## Venn

Use for set overlap.

```mermaid
venn-beta
    set A["Engineering"]: 12
    set B["Product"]: 10
    union A,B["Shared"]: 4
```

## Common Mistakes

- Using pie with too many slices
- Using quadrant for measured series
- Using radar for incomparable metrics
- Using sankey when the links are not weighted
- Using treemap without natural hierarchy
