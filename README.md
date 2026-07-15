# AI Agent Skills

Curated skill packages for Codex-style agents.

## Packages

- `packages/angular` - Angular implementation skills
- `packages/code-quality` - strict review, refactoring, design, and TDD skills
- `packages/planning` - OKF, planning-map, and PRD authoring skills
- `packages/delivery` - issue setup, slicing, triage, and implementation workflow skills
- `packages/productivity` - personal workflow and skill-authoring helpers
- `packages/learning` - research, diagramming, and teaching skills
- `packages/math` - LuaLaTeX high-school math handout skills
- `packages/media` - text-to-image and text-to-speech generation skills
- `packages/personas` - reviewer and debugger personas

## Experimental

`experimenting/` now only holds work that is not yet packaged.

## Package Layout

Each package uses:

```text
<package>/
  plugin.json
  installed_version.json
  README.md
  skills/
    <skill-name>/
      SKILL.md
      ...
```
