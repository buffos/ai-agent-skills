# Fowler Refactoring Checklist

Use this file to spot smells that matter in the current diff. Do not report a
smell without tying it to a concrete problem and a small refactoring path.

## Checks

- `Mysterious Name`: names hide domain intent
- `Duplicated Code`: repeated logic, shaping, or condition trees
- `Long Function`: multiple phases or mixed abstraction levels in one function
- `Long Parameter List`: missing structure or missing domain object
- `Data Clumps`: values travel together repeatedly
- `Primitive Obsession`: primitives used where domain types should exist
- `Feature Envy`: logic reaches into another object's data too much
- `Message Chains`: callers navigate too much structure directly
- `Shotgun Surgery`: one behavior change scatters across many modules
- `Divergent Change`: one file changes for unrelated reasons
- `Repeated Switches`: same branching logic repeated across the diff
- `Speculative Generality`: abstraction added without present need
- `Temporary Field`: object state exists only for one narrow phase
- `Middle Man`: wrapper mostly delegates without adding value
- `Inappropriate Intimacy`: modules know too much about internals

## Fix directions

- rename
- extract function
- extract module or class
- introduce parameter object or value object
- move function
- hide delegate
- replace conditional with polymorphism or strategy
- inline dead abstraction
- split by reason to change

## Block only when the smell:

- harms correctness
- weakens spec fulfillment
- makes tests materially worse
- adds avoidable complexity in the reviewed scope
