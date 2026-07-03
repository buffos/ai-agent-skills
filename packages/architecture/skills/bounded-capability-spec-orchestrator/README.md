# Bounded Capability Spec Orchestrator

Coordinates the exact-spec pipeline for one bounded capability.

Use it after `fog-of-war-planning` has selected a `bounded` node and you want
the suite to inspect what already exists, decide the next best skill to run,
and keep the artifact set coherent for that capability through implementation
readiness. It writes status and next-step guidance to the node-scoped
architecture docs area.
