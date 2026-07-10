# LuaLaTeX Foundation

Use this file to choose the baseline preamble and feature switches for school-level math handouts.

## Scope

Target:
- exams
- worksheets
- problem sheets
- theory or revision handouts
- optional solution sheets

Not the default target:
- formal papers
- research notes
- long theorem-heavy expositions
- code listings unless explicitly requested

## Baseline Decisions

- Engine: `lualatex`
- Document class: `article`
- Paper: `a4paper`
- Font size: `12pt` by default, `11pt` only for dense sheets
- Margins: `2.3cm` to `2.5cm`
- Paragraph style: simple, print-friendly, no abstract
- Exercise layout: numbered exercises or sections with compact spacing
- Exercise-list baseline: use `enumitem` with `leftmargin=*` for normal worksheets and exams, so labels align with the text block instead of collapsing into the page edge

## Language Strategy

Prefer `babel` for the baseline:

```tex
\usepackage{fontspec}
\usepackage[english,greek]{babel}
```

With `babel`, the main language is typically the last one listed in the package options unless you switch explicitly later.

So:
- for a primarily Greek document, prefer `\usepackage[english,greek]{babel}`
- for a primarily English document, prefer `\usepackage[greek,english]{babel}`

If needed, set the active language explicitly after loading:

```tex
\selectlanguage{greek}
```

For bilingual handouts:
- keep one main language
- use the other only for mirrored headings, notes, or translated statements
- avoid maintaining two competing language frameworks

Avoid as a default:
- mixing `babel` and `polyglossia`
- adding `alphabeta` unless there is a specific compatibility reason

## Font Strategy

Preferred default:

```tex
\usepackage{mathtools}
\usepackage{unicode-math}
\setmainfont{Libertinus Serif}
\setsansfont{Libertinus Sans}
\setmathfont{Libertinus Math}
```

Reason:
- better math typography than the DejaVu baseline
- good Greek and Latin coverage
- cleaner classroom print output

Fallback or user-preferred alternative:

```tex
\usepackage{mathtools}
\usepackage{unicode-math}
\setmainfont{DejaVu Serif}
\setsansfont{DejaVu Sans}
\setmathfont{Latin Modern Math}
```

Use DejaVu when the user explicitly wants it or when environment portability is more important than typographic quality.

## Minimal Core Packages

Start from:

```tex
\usepackage{fontspec}
\usepackage[english,greek]{babel}
\usepackage{amsmath, amsthm, mathtools}
\usepackage{unicode-math}
\usepackage[a4paper,margin=2.3cm]{geometry}
\usepackage{microtype}
\usepackage{enumitem}
\usepackage{xcolor}
\usepackage{graphicx}
\usepackage{cancel}
```

Add only on demand:
- `tikz` for diagrams
- `tcolorbox` for exercise/theory/solution boxes
- `array` or `booktabs` for real tables
- `amssymb` only if a specific symbol is needed and the setup is verified
- `mathrsfs`, `bbm`, `esint` for specialized notation

## Teaching-Oriented Macros

These are useful enough for your high-school teaching context to keep ready as defaults or near-defaults:

```tex
% Number sets
\newcommand{\R}{\mathbb{R}}
\newcommand{\N}{\mathbb{N}}
\newcommand{\Z}{\mathbb{Z}}
\newcommand{\Q}{\mathbb{Q}}
\newcommand{\C}{\mathbb{C}}

% Derivatives
\newcommand{\pd}[2]{\frac{\partial #1}{\partial #2}}
\newcommand{\dd}[2]{\frac{d #1}{d #2}}

% Delimiters and inner product
\DeclarePairedDelimiter{\abs}{\lvert}{\rvert}
\DeclarePairedDelimiter{\norm}{\lVert}{\rVert}
\newcommand{\inner}[2]{\langle #1,\, #2 \rangle}
```

Notes:
- `\pd` and `\dd` are justified because derivatives and integrals are part of the target curriculum.
- `\inner` is also justified because inner product notation appears in school material.
- Prefer `\DeclarePairedDelimiter` for `\abs` and `\norm` instead of forcing `\left...\right` every time.
- With a `unicode-math` baseline, avoid assuming `amssymb` is always safe; add it only when needed.

## Theorem-Style Structures

Because the skill covers lecture handouts, solved exercises, and proof-based material, theorem-style environments are part of the normal toolkit, not a rare extension.

Typical Greek environment families:
- `Θεώρημα` - `Απόδειξη`
- `Λήμμα` - `Απόδειξη`
- `Πόρισμα`
- `Ορισμός`
- `Παράδειγμα`
- `Παρατήρηση`
- `Άσκηση`
- `Λύση`

Suggested pattern:

```tex
\theoremstyle{plain}
\newtheorem{theorem}{Θεώρημα}
\newtheorem{lemma}[theorem]{Λήμμα}
\newtheorem{corollary}[theorem]{Πόρισμα}

\theoremstyle{definition}
\newtheorem{definition}[theorem]{Ορισμός}
\newtheorem{example}[theorem]{Παράδειγμα}
\newtheorem{exercise}[theorem]{Άσκηση}

\theoremstyle{remark}
\newtheorem{remark}[theorem]{Παρατήρηση}
\newtheorem*{solution}{Λύση}
```

Notes:
- `Απόδειξη` is already provided naturally by the `proof` environment from `amsthm`.
- `Λήμμα - Απόδειξη` is a standard duet and should be treated the same way as `Θεώρημα - Απόδειξη`.
- `Πόρισμα` is the natural Greek translation for `Corollary`.
- For worksheets and exams, a plain `enumerate` structure may still be cleaner than theorem environments for exercises.
- For lecture handouts and solved examples, theorem environments are usually the better default.

## Presentation Modes

Use two explicit presentation modes.

### 1. Plain Classroom Mode

Use this for:
- exams
- worksheets
- compact problem sheets
- printer-first documents

Characteristics:
- use `amsthm` for semantic structure
- do not load `tcolorbox` unless clearly needed
- keep theorem, exercise, and solution blocks visually simple
- prefer black-and-white or very restrained color use

This is the default mode.

### 2. Boxed Lecture-Handout Mode

Use this for:
- lecture handouts
- solved exercise sheets
- concept notes
- documents where visual grouping helps the student

Characteristics:
- keep `amsthm` semantics or theorem-style numbering
- add `tcolorbox` as a presentation layer
- use subtle fills and borders that remain readable when printed
- box only the structures that benefit from emphasis, not everything

Recommended boxed targets:
- `Θεώρημα`
- `Λήμμα`
- `Πόρισμα`
- `Ορισμός`
- `Παράδειγμα`
- `Άσκηση`
- optionally `Λύση`

Do not treat raw boxes as a replacement for semantic environments. The structure should still reflect theorem-like meaning, not only appearance.

## Tcolorbox Policy

If boxed presentation is needed, prefer `tcolorbox` integration with theorem-like structures over ad hoc visual wrappers such as unrelated `LemmaBox`, `IdeaBox`, or `ProofBox` environments.

Reason:
- preserves semantic meaning
- keeps numbering cleaner
- makes the visual layer easier to toggle on or off
- avoids drifting into a collection of unrelated box styles

Simple visual wrappers are still acceptable for special callouts such as:
- idea
- hint
- warning
- summary

but not as the only representation of core mathematical structures.

Suggested starting style:

```tex
\usepackage[most]{tcolorbox}
\tcbset{
  ko/base/.style={
    enhanced,
    breakable,
    arc=1.5mm,
    boxrule=0.6pt,
    left=2mm,right=2mm,top=1.5mm,bottom=1.5mm
  }
}
```

Then define a small, consistent family instead of many unrelated designs.

Example direction:

```tex
\newtcolorbox{koidea}[1][]{
  ko/base,
  colback=blue!4,
  colframe=blue!50!black,
  title={#1}
}
```

For theorem-like material, prefer a boxed theorem definition approach rather than only free-form named boxes.

## Drawing Options

No drawings:
- do not load TikZ

Basic diagrams:

```tex
\usepackage{tikz}
\usetikzlibrary{calc, arrows.meta}
```

Geometry diagrams:

```tex
\usepackage{tikz}
\usetikzlibrary{calc, angles, quotes, intersections}
```

Coordinate or graph plots:

```tex
\usepackage{tikz}
\usetikzlibrary{calc, arrows.meta}
```

Do not load `tkz-euclide` unless the geometry request is complex enough to justify it.

## Structural Patterns

### Exam / Worksheet

Recommended sections:
- title block
- short instructions
- `enumerate` for exercises
- optional subparts `(a), (b), (c)`
- optional answer space

Recommended baseline list settings:

```tex
\begin{enumerate}[leftmargin=*,labelsep=0.75em]
  \item ...
\end{enumerate}
```

If custom labels such as `\textbf{Άσκηση 1.}` are used, keep `leftmargin=*` unless there is a deliberate layout reason to change it.

### Solution Sheet

Recommended sections:
- title block
- problem statement or reference
- `\section*{Solutions}` or per-exercise solutions
- optional hint boxes

### Theory Handout

Recommended sections:
- title block
- short concept overview
- worked examples
- practice exercises

## Reusable Title Block Pattern

```tex
\title{...}
\author{...}
\date{\today}
```

If the worksheet should look less article-like, prefer a manual heading block instead of `\maketitle`.

## What To Avoid By Default

- abstract
- bibliography tools
- code-highlighting packages
- theorem-heavy formal structure
- excessive custom macros
- decorative colors that reduce print clarity
- packages included only because they appeared in older files
- loading `tcolorbox` in plain exam mode without a clear reason
- replacing semantic theorem structures with purely visual boxes

## Starter Skeleton

```tex
% !TEX TS-program = lualatex
\documentclass[a4paper,12pt]{article}

\usepackage{fontspec}
\usepackage[english,greek]{babel}

\usepackage{amsmath, amsthm, mathtools}
\usepackage{unicode-math}
\setmainfont{Libertinus Serif}
\setsansfont{Libertinus Sans}
\setmathfont{Libertinus Math}
\usepackage[a4paper,margin=2.3cm]{geometry}
\usepackage{microtype}
\usepackage{enumitem}
\usepackage{graphicx}
\usepackage{cancel}

\newcommand{\R}{\mathbb{R}}
\newcommand{\N}{\mathbb{N}}
\DeclarePairedDelimiter{\abs}{\lvert}{\rvert}

\theoremstyle{plain}
\newtheorem{theorem}{Θεώρημα}
\newtheorem{lemma}[theorem]{Λήμμα}
\newtheorem{corollary}[theorem]{Πόρισμα}
\theoremstyle{definition}
\newtheorem{exercise}[theorem]{Άσκηση}
\newtheorem*{solution}{Λύση}

\title{Τίτλος}
\author{Συγγραφέας}
\date{\today}

\begin{document}
\selectlanguage{greek}
\maketitle

\section*{Οδηγίες}

\begin{enumerate}[leftmargin=*,labelsep=0.75em]
  \item Πρώτη άσκηση.
  \item Δεύτερη άσκηση.
\end{enumerate}

\end{document}
```
