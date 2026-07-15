---
name: text-to-speech
description: Create Gemini/Google TTS prompts and a runnable tts-jobs.json from narration or voiceover text. Use when preparing long plain-text or Markdown narration for Gemini TTS, when large TTS prompts degrade or fail, or when a reproducible per-chunk audio job manifest is needed.
---

# Text to Speech

Write directed Gemini TTS prompts and split long spoken transcripts into coherent jobs. Each chunk becomes one entry in `tts-jobs.json`.

Do not install Node dependencies or configure credentials during a normal invocation. Perform setup only when the user explicitly asks to set up this TTS package; then follow [README.md](README.md).

## Workflow

1. Start with text that should actually be spoken. Remove titles, citations, chapter labels, and production notes unless they belong in the narration.
2. Shape the writing for speech: short sentences, useful punctuation, and sparse inline performance tags such as `[pause]` or `[with a smile]`.
3. Set an Audio Profile, Scene, and Director's Notes. Keep the direction specific, performable, and consistent with the words.
4. Create TTS jobs. Use `1800` characters per chunk by default; lower it when the selected model is unreliable with long inputs.

```powershell
python "C:\Users\buffo\.agents\skills\packages\media\skills\text-to-speech\scripts\chunk_tts_text.py" `
  path\to\narration.md `
  --slug my-narration `
  --voice Kore `
  --language el-GR `
  --audio-profile "Single Greek voice, trustworthy and clear." `
  --scene "A practical technical explainer." `
  --director-notes "Style: Calm and human. Pacing: Medium." `
  --output .\tmp\media\my-narration\tts-jobs.json
```

The output is a JSON array compatible with a runner that accepts `label`, `source`, `outputPath`, `speechConfig`, and `prompt`.

5. Run the packaged Gemini generator from the target repository root. See [README.md](README.md) for one-time installation, API-key setup, and commands.

## Output location

Follow repository-specific media conventions if they exist. Otherwise, create the job file and generated audio beneath the current repository root:

```text
./tmp/media/<narration-slug>/
  tts-jobs.json
  001.wav
  002.wav
  ...
```

The generated job paths are `tmp/media/<slug>/001.wav`, etc. Do not place generated media inside the skill directory.

## Prompt and chunk rules

- Speak only the transcript: the generated prompt explicitly tells Gemini not to read headings or instructions aloud.
- Preserve meaningful paragraphs whenever they fit; combine short adjacent paragraphs within the chunk limit.
- Split oversized paragraphs at sentence boundaries, then at word boundaries only as a last resort.
- Keep the same `speechConfig` across chunks unless there is an intentional speaker change.
- Review joins, dialogue, lists, and quotations manually; they may need smaller chunks or custom direction.

Use `--format manifest` only when a neutral chunk manifest is needed instead of runnable TTS jobs. Use `--format markdown` for a human review copy.
