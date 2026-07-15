---
name: text-to-image
description: Turn source text, briefs, or article content into precise image-generation prompts and runnable image-jobs.json entries, then generate images with Gemini or OpenAI. Use when creating illustrations, hero images, infographics, diagrams, or image assets from text.
---

# Text to Image

Transform source material into one or more visual concepts, then write a runnable image-job manifest for the bundled generator.

Do not install Node dependencies or configure credentials during a normal invocation. Perform setup only when the user explicitly asks to set up this image package; then follow [README.md](README.md).

## Workflow

1. Identify the intended image role: hero, supporting illustration, technical diagram, infographic, social asset, or thumbnail.
2. Extract the visual subject, factual constraints, audience, aspect ratio, and desired output location from the source text.
3. Write a concrete prompt: subject and action first, then composition, visual style, lighting/palette, required text or labels, and exclusions. Do not invent technical facts or visible copy not supported by the source.
4. Write a `image-jobs.json` array. Each job must use exactly these keys: `path`, `imageName`, `prompt`, `aspectRatio`, and `resolution`.
5. Follow repository-specific image conventions. Otherwise write media to `tmp/media/<slug>/` relative to the repository root.

```json
[
  {
    "path": "tmp/media/roof-insulation",
    "imageName": "hero.png",
    "prompt": "Clean editorial illustration of a well-insulated pitched roof in cutaway, showing continuous insulation and an airtight layer. Three-quarter isometric view, warm daylight, restrained slate-blue and timber palette, no labels, no people, no logos, no watermark.",
    "aspectRatio": "16:9",
    "resolution": "2K"
  }
]
```

## Prompt rules

- Name the primary subject and visual type before describing the style.
- State required visual facts, layout, text, palette, and explicit exclusions.
- For infographics, specify the exact layout and every visible label or data item. Request no invented numbers, text, brands, logos, or watermarks.
- Prefer one coherent composition over a list of unrelated objects.
- Use `1K` for routine graphics and `2K` or `4K` only when detail materially helps. Allowed values are `0.5K`, `1K`, `2K`, and `4K`.
- Use one of the generator's allowed aspect ratios: `1:1`, `1:4`, `1:8`, `2:3`, `3:2`, `3:4`, `4:1`, `4:3`, `4:5`, `5:4`, `8:1`, `9:16`, `16:9`, or `21:9`.

## Generate

Run the packaged `scripts/generate_images.ts` from the target repository root after creating the jobs file. Select the provider and quality deliberately:

- Gemini: `--provider gemini`; use `--model` only to override the default image model.
- OpenAI: `--provider openai --quality low|medium|high --delivery standard`.
- OpenAI batch: replace `standard` with `batch`; check and download the generated batch manifest later.

See [README.md](README.md) for installation, API-key configuration, and ready-to-run commands for every variant.
