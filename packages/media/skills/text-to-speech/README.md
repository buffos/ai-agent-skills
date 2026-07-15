# Text to Speech

Create directed Gemini TTS jobs from a long narration, then generate one WAV file per chunk. The package contains:

- `scripts/chunk_tts_text.py` — creates a runnable `tts-jobs.json` with paragraph- and sentence-aware chunks.
- `scripts/generate_tts.ts` — submits those jobs to Gemini and writes WAV or PCM files.

## Set up (only on request)

Only perform these steps when the user explicitly asks to set up the package. Python 3.9+ and Node.js 20+ are required. Install the Node dependencies in this skill folder:

```powershell
$skill = "C:\Users\buffo\.agents\skills\packages\media\skills\text-to-speech"
Push-Location $skill
npm install
Pop-Location
```

## Configure Gemini

Supply a Gemini API key through either method:

```powershell
$env:GEMINI_API_KEY = "your-api-key"
```

Or, from the repository where generation will run, create `secrets/.env` containing:

```text
GEMINI_API_KEY=your-api-key
```

Keep the key out of source control. The generator reads `secrets/.env` from the current directory and its parent directory, in addition to `GEMINI_API_KEY` in the environment.

## Create jobs

Run this from the target repository root. By default, `outputPath` values are relative to that root.

```powershell
$skill = "C:\Users\buffo\.agents\skills\packages\media\skills\text-to-speech"
python "$skill\scripts\chunk_tts_text.py" `
  .\voiceover.md `
  --slug voiceover `
  --voice Kore `
  --language el-GR `
  --audio-profile "Single Greek voice, trustworthy and clear." `
  --scene "A practical technical explainer." `
  --director-notes "Style: Calm and human. Pacing: Medium." `
  --output .\tmp\media\voiceover\tts-jobs.json
```

Each entry contains the exact job shape accepted by the bundled generator: `label`, `source`, `outputPath`, `speechConfig`, and `prompt`. The default generated audio paths are `tmp/media/voiceover/001.wav`, `002.wav`, and so on.

## Generate audio

Stay in the target repository root so generated media is written under its `./tmp/media` directory. Invoke the `tsx` executable installed in the skill folder:

```powershell
$skill = "C:\Users\buffo\.agents\skills\packages\media\skills\text-to-speech"
& "$skill\node_modules\.bin\tsx.cmd" `
  "$skill\scripts\generate_tts.ts" `
  .\tmp\media\voiceover\tts-jobs.json
```

Use `--dry-run` to validate and list jobs without calling Gemini. Use `--force` to overwrite audio files that already exist:

```powershell
& "$skill\node_modules\.bin\tsx.cmd" "$skill\scripts\generate_tts.ts" .\tmp\media\voiceover\tts-jobs.json --dry-run
```

The generator defaults to `gemini-3.1-flash-tts-preview`; override it with `--model MODEL` when needed.
