# Text to Image

Create image prompts and `image-jobs.json` entries from text, then generate the images with Gemini or OpenAI. The bundled `scripts/generate_images.ts` accepts only this job shape:

```json
[
  {
    "path": "tmp/media/example",
    "imageName": "hero.png",
    "prompt": "Complete image prompt.",
    "aspectRatio": "16:9",
    "resolution": "1K"
  }
]
```

`path` is relative to the directory from which the generator runs. In the absence of repository conventions, use `tmp/media/<slug>`.

## Set up (only on request)

Only perform these steps when the user explicitly asks to set up the package. Python is not required; Node.js 20+ is required.

```powershell
$skill = "C:\Users\buffo\.agents\skills\packages\media\skills\text-to-image"
Push-Location $skill
npm install
Pop-Location
```

Set the relevant key for the selected provider in the target repository shell:

```powershell
$env:GEMINI_API_KEY = "your-gemini-key"
$env:OPENAI_API_KEY = "your-openai-key"
```

Alternatively create `secrets/.env` in the repository root (or its parent) containing one or both entries:

```text
GEMINI_API_KEY=your-gemini-key
OPENAI_API_KEY=your-openai-key
```

Keep API keys out of source control. `OPEN_AI_API_KEY` is also accepted for OpenAI.

## Create the jobs file

From the target repository root, write `./tmp/media/<slug>/image-jobs.json` (or the repository's required location). Ensure every job has only `path`, `imageName`, `prompt`, `aspectRatio`, and `resolution`.

## Generate images

Run these commands from the target repository root so each job's `path` resolves there. Set `$skill` once:

```powershell
$skill = "C:\Users\buffo\.agents\skills\packages\media\skills\text-to-image"
$runner = "$skill\node_modules\.bin\tsx.cmd"
$generator = "$skill\scripts\generate_images.ts"
$jobs = ".\tmp\media\example\image-jobs.json"
```

### Gemini

Uses `GEMINI_API_KEY`, default model `gemini-3.1-flash-image-preview`, and a default concurrency of 3:

```powershell
& $runner $generator $jobs --provider gemini --concurrency 3
```

Override the Gemini model only when required:

```powershell
& $runner $generator $jobs --provider gemini --model MODEL_NAME
```

### OpenAI standard delivery

Uses `OPENAI_API_KEY` and model `gpt-image-2`. Select exactly one quality level:

```powershell
& $runner $generator $jobs --provider openai --quality low --delivery standard
& $runner $generator $jobs --provider openai --quality medium --delivery standard
& $runner $generator $jobs --provider openai --quality high --delivery standard
```

OpenAI standard generation is paced at five input images per minute by default. Override that only when the account's limit permits it:

```powershell
$env:OPENAI_IMAGE_INPUTS_PER_MINUTE = "5"
& $runner $generator $jobs --provider openai --quality medium --delivery standard
```

### OpenAI batch delivery

Submit asynchronously for any OpenAI quality level:

```powershell
& $runner $generator $jobs --provider openai --quality low --delivery batch
& $runner $generator $jobs --provider openai --quality medium --delivery batch
& $runner $generator $jobs --provider openai --quality high --delivery batch
```

Batch submission writes a manifest next to the jobs file, named like `image-jobs.openai-batch.json`. Use it to check and download results:

```powershell
$batch = ".\tmp\media\example\image-jobs.openai-batch.json"
& $runner $generator --batch-status $batch
& $runner $generator --batch-download $batch
```

Add `--force` to Gemini or OpenAI generation commands only when intentionally overwriting existing files.
