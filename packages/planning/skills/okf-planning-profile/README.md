# OKF Planning Profile

`okf-planning-profile` defines the canonical planning-node semantics used by
the planning suite.

## Core Role

It standardizes:

- node shape
- planning states
- parent and child rules
- shared-concern links
- outward artifact references
- state progression rules

## Planning States

The intended progression is:

`foggy -> bounded -> specified -> implemented`

Where:

- `bounded` means ready for the architecture specification pipeline
- `specified` means exact artifacts exist and readiness review is clean enough

## How Other Skills Use It

- `fog-of-war-planning` uses it to create and advance the map
- the architecture suite uses it to scope exact specification work to one owning capability
- delivery skills use it to write issue and progress references back into the map

## Important Constraints

- Keep `.okf/` authoritative for topology and ownership
- Do not mark a node `specified` without exact artifacts and readiness review
- Do not mark a node `implemented` because one issue was completed
- Keep the graph conceptual; downstream artifacts hold the delivery detail
