---
name: ko-new-mathdoc
description: Create standardized LuaLaTeX high-school math handouts in Greek, English, or bilingual form. Use when the user wants a new `.tex` exam, worksheet, problem sheet, theory handout, or solved exercise set, or needs a reusable math-document preamble with optional TikZ diagrams.
---

# Ko New Mathdoc

## Overview

Create a clean LuaLaTeX handout, not a formal paper. Ask a short setup wizard, choose the lightest workable template, then generate one reusable `.tex` document.

Read [references/foundation.md](references/foundation.md) before drafting the preamble or template.
Read [references/tables-and-images.md](references/tables-and-images.md) only when the handout needs tables, external images, or figure-layout guidance.

## Wizard Flow

Ask these questions in order. Keep them short and grouped naturally.

1. Ask for document kind: `exam`, `worksheet`, `problem set`, `solution sheet`, or `theory handout`.
2. Ask for language mode: `greek`, `english`, or `bilingual`; ask which language is primary when bilingual.
3. Ask for `title` and `author`. Use the current date by default unless the user provides another one.
4. Ask whether the handout includes `solutions`, `point values`, `answer space`, `teacher notes`, or theorem-style structures such as `Θεώρημα`, `Λήμμα`, `Πόρισμα`, and `Απόδειξη`.
5. Ask whether drawings are needed:
   - `none`
   - `basic TikZ diagrams`
   - `geometry diagrams`
   - `coordinate/graph plots`
6. Ask whether boxed statements are wanted for `exercise`, `theory`, `hint`, or `solution`.
7. Ask for any special constraints: page length, school branding, font preference, or section layout.

If the user gives partial information, proceed with reasonable defaults and state them explicitly.

## Default Rules

Use these defaults unless the user asks otherwise:

- Engine: LuaLaTeX.
- Tone: high-school classroom handout, compact and readable.
- Paper/layout: `article`, A4, 12pt, margins around `2.3cm`.
- Date: current date.
- Structure: title block, optional short instructions, numbered exercises, optional solution section.
- Language handling: `babel`, not mixed Greek support stacks.
- Math stack: keep it light, stable, and teaching-oriented.
- Theorem/proof structures: include them when the document is lecture-style, proof-based, or solution-oriented.
- Drawings: add TikZ only when needed.

## Generation Rules

Prefer a minimal preamble. Do not load packages just because they appeared in an old sample.

- Include only the packages required by the chosen features.
- Do not mix `babel`, `alphabeta`, and `polyglossia` in one baseline.
- Do not load heavy extras unless the request needs them: `minted`, `piton`, `tkz-euclide`, `booktabs`, `tcolorbox`.
- Use the plain classroom mode by default; switch to boxed lecture-handout mode only when the user wants visual grouping.
- For exams and worksheets, prioritize exercises, spacing, clarity, and predictable numbering over decorative styling.
- For bilingual content, keep one main document language and switch locally for the secondary language.

## Output Contract

When creating a new document:

1. Summarize the selected options in 3-7 short lines.
2. Generate one complete `.tex` file.
3. Keep custom macros modest and readable.
4. Add short comments only where the template would otherwise be unclear.
5. If the user has not provided exercises yet, generate a reusable starter template with placeholders.
6. If the request becomes more specialized than the baseline, extend it incrementally instead of redesigning the whole template.
