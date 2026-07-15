// more on the api in https://googleapis.github.io/js-genai/release_docs/index.html
import { GoogleGenAI } from "@google/genai";
import { promises as fs } from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Job = {
  path: string;        // folder path relative to cwd
  imageName: string;   // e.g. "hero-banner.png"
  prompt: string;
  aspectRatio: string; // e.g. "16:9"
  resolution: string;  // e.g. "2K"
};

type JobResult = "generated" | "skipped" | "failed";
type Provider = "gemini" | "openai";
type OpenAiQuality = "low" | "medium" | "high";
type OpenAiDelivery = "standard" | "batch";
type OpenAiOutputFormat = "png" | "jpeg" | "webp";

type PendingJob = {
  index: number;
  job: Job;
  outputPath: string;
  outputFormat: OpenAiOutputFormat;
};

type BatchManifestEntry = {
  customId: string;
  index: number;
  outputPath: string;
  outputFormat: OpenAiOutputFormat;
  aspectRatio: string;
  resolution: string;
};

type BatchManifest = {
  provider: "openai";
  model: string;
  quality: OpenAiQuality;
  submittedAt: string;
  jobsFile: string;
  inputFileId: string;
  batchId: string;
  outputFilePath: string;
  errorFilePath: string;
  jobs: BatchManifestEntry[];
};

type ParsedArgs = {
  batchDownloadManifest?: string;
  batchStatusManifest?: string;
  concurrency: number;
  force: boolean;
  inputFile?: string;
  model?: string;
  openAiDelivery?: OpenAiDelivery;
  openAiQuality?: OpenAiQuality;
  provider?: Provider;
};

// ---------------------------------------------------------------------------
// Defaults & validation sets
// ---------------------------------------------------------------------------

const DEFAULT_GEMINI_MODEL = "gemini-3.1-flash-image-preview";
const OPENAI_MODEL = "gpt-image-2";
const DEFAULT_CONCURRENCY = 3;
const MAX_RETRIES = 1;
const RETRY_BASE_MS = 2_000;
const DEFAULT_OPENAI_INPUT_IMAGES_PER_MINUTE = 5;

const ALLOWED_ASPECT_RATIOS = new Set([
  "1:1", "1:4", "1:8", "2:3", "3:2", "3:4",
  "4:1", "4:3", "4:5", "5:4", "8:1", "9:16", "16:9", "21:9",
]);

const ALLOWED_RESOLUTIONS = new Set(["0.5K", "1K", "2K", "4K"]);
const EXPECTED_JOB_KEYS = new Set(["path", "imageName", "prompt", "aspectRatio", "resolution"]);
const LEGACY_JOB_KEY_HINTS: Record<string, string> = {
  outputPath: `Use "path" instead. The value must be relative to front/, e.g. "src/assets/pages/...".`,
  imagePrompt: `Use "prompt" instead.`,
  provider: `Do not put provider inside each job. Choose provider from the CLI or make target.`,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Tiny .env parser – reads KEY=VALUE lines, ignores comments & blanks. */
async function loadEnvFile(filePath: string): Promise<void> {
  try {
    const content = await fs.readFile(filePath, "utf8");
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const value = trimmed.slice(eqIdx + 1).trim();
      if (key && !(key in process.env)) {
        process.env[key] = value;
      }
    }
  } catch {
    // File not found is fine – env var may already be set
  }
}

function assertValidJob(job: unknown, index: number): void {
  if (!job || typeof job !== "object" || Array.isArray(job)) {
    throw new Error(`jobs[${index}] must be an object`);
  }

  const record = job as Record<string, unknown>;
  const keys = Object.keys(record);
  const unknownKeys = keys.filter((key) => !EXPECTED_JOB_KEYS.has(key));
  if (unknownKeys.length > 0) {
    const hints = unknownKeys
      .map((key) => LEGACY_JOB_KEY_HINTS[key] ? `"${key}": ${LEGACY_JOB_KEY_HINTS[key]}` : `"${key}" is not part of the supported Job schema.`)
      .join(" ");
    throw new Error(
      `jobs[${index}] has unsupported key(s): ${unknownKeys.join(", ")}. Expected keys: ${[...EXPECTED_JOB_KEYS].join(", ")}. ${hints}`,
    );
  }

  const jobRecord = record as Partial<Job>;

  if (!("path" in record)) {
    throw new Error(`jobs[${index}] is missing required key "path"`);
  }
  if (!("imageName" in record)) {
    throw new Error(`jobs[${index}] is missing required key "imageName"`);
  }
  if (!("prompt" in record)) {
    throw new Error(`jobs[${index}] is missing required key "prompt"`);
  }
  if (!("aspectRatio" in record)) {
    throw new Error(`jobs[${index}] is missing required key "aspectRatio"`);
  }
  if (!("resolution" in record)) {
    throw new Error(`jobs[${index}] is missing required key "resolution"`);
  }

  if (!jobRecord.path || typeof jobRecord.path !== "string") {
    throw new Error(`jobs[${index}].path must be a non-empty string`);
  }
  if (jobRecord.path.startsWith("front/") || jobRecord.path.startsWith("front\\")) {
    throw new Error(
      `jobs[${index}].path must be relative to front/, not start with "front/". Example: "src/assets/pages/pillar-foo/article-slug"`,
    );
  }
  if (!jobRecord.imageName || typeof jobRecord.imageName !== "string") {
    throw new Error(`jobs[${index}].imageName must be a non-empty string`);
  }
  if (!jobRecord.prompt || typeof jobRecord.prompt !== "string") {
    throw new Error(`jobs[${index}].prompt must be a non-empty string`);
  }
  if (!ALLOWED_ASPECT_RATIOS.has(jobRecord.aspectRatio)) {
    throw new Error(
      `jobs[${index}].aspectRatio="${jobRecord.aspectRatio}" is invalid. Allowed: ${[...ALLOWED_ASPECT_RATIOS].join(", ")}`
    );
  }
  if (!ALLOWED_RESOLUTIONS.has(jobRecord.resolution)) {
    throw new Error(
      `jobs[${index}].resolution="${jobRecord.resolution}" is invalid. Allowed: ${[...ALLOWED_RESOLUTIONS].join(", ")}`
    );
  }
}

function getMimeExtension(mimeType: string | undefined): string {
  switch (mimeType) {
    case "image/png":
      return ".png";
    case "image/jpeg":
      return ".jpg";
    case "image/webp":
      return ".webp";
    default:
      return "";
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class OpenAiApiError extends Error {
  status: number;
  retryAfterMs?: number;

  constructor(status: number, bodyText: string, retryAfterMs?: number) {
    super(`OpenAI API ${status}: ${bodyText}`);
    this.name = "OpenAiApiError";
    this.status = status;
    this.retryAfterMs = retryAfterMs;
  }
}

function parseRetryAfterMs(headerValue: string | null, bodyText: string): number | undefined {
  const headerSeconds = headerValue ? Number.parseFloat(headerValue) : Number.NaN;
  if (Number.isFinite(headerSeconds) && headerSeconds > 0) {
    return Math.ceil(headerSeconds * 1000);
  }

  const bodyMatch = bodyText.match(/try again in\s+(\d+(?:\.\d+)?)s/i);
  if (!bodyMatch) return undefined;
  const seconds = Number.parseFloat(bodyMatch[1]);
  if (!Number.isFinite(seconds) || seconds <= 0) return undefined;
  return Math.ceil(seconds * 1000);
}

class OpenAiRateLimiter {
  private readonly minIntervalMs: number;
  private nextAllowedAt = 0;
  private queue: Promise<void> = Promise.resolve();

  constructor(inputImagesPerMinute: number) {
    this.minIntervalMs = Math.ceil(60_000 / Math.max(1, inputImagesPerMinute));
  }

  getMinIntervalMs(): number {
    return this.minIntervalMs;
  }

  async waitTurn(index: number): Promise<void> {
    let waitMs = 0;
    this.queue = this.queue.then(async () => {
      const now = Date.now();
      waitMs = Math.max(0, this.nextAllowedAt - now);
      const startAt = Math.max(this.nextAllowedAt, now);
      this.nextAllowedAt = startAt + this.minIntervalMs;
      if (waitMs > 0) {
        console.log(`[${index}] ⏳ Rate-limit pacing ${waitMs}ms before OpenAI request…`);
        await sleep(waitMs);
      }
    });
    await this.queue;
  }

  async deferFor(ms: number): Promise<void> {
    if (ms <= 0) return;
    this.queue = this.queue.then(() => {
      const deferredUntil = Date.now() + ms;
      if (deferredUntil > this.nextAllowedAt) {
        this.nextAllowedAt = deferredUntil;
      }
    });
    await this.queue;
  }
}

function printUsage(): void {
  console.log(`
Usage:
  npx tsx scripts/generate_images.ts <jobs.json> [--provider gemini|openai] [--concurrency N] [--force]
  npx tsx scripts/generate_images.ts <jobs.json> --provider openai [--quality low|medium|high] [--delivery standard|batch]
  npx tsx scripts/generate_images.ts --batch-status <manifest.json>
  npx tsx scripts/generate_images.ts --batch-download <manifest.json>

Notes:
  - Gemini uses GEMINI_API_KEY
  - OpenAI uses OPENAI_API_KEY or OPEN_AI_API_KEY
  - OpenAI batch submission is asynchronous. Use --batch-status / --batch-download later.
`.trim());
}

/** Parse CLI flags. */
function parseArgs(argv: string[]): ParsedArgs {
  let force = false;
  let concurrency = DEFAULT_CONCURRENCY;
  let model: string | undefined;
  let inputFile: string | undefined;
  let provider: Provider | undefined;
  let openAiQuality: OpenAiQuality | undefined;
  let openAiDelivery: OpenAiDelivery | undefined;
  let batchDownloadManifest: string | undefined;
  let batchStatusManifest: string | undefined;

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--force") {
      force = true;
    } else if (arg === "--concurrency" && argv[i + 1]) {
      concurrency = Math.max(1, Number.parseInt(argv[++i], 10) || DEFAULT_CONCURRENCY);
    } else if (arg === "--model" && argv[i + 1]) {
      model = argv[++i];
    } else if (arg === "--provider" && argv[i + 1]) {
      const value = argv[++i];
      if (value === "gemini" || value === "openai") provider = value;
    } else if (arg === "--quality" && argv[i + 1]) {
      const value = argv[++i];
      if (value === "low" || value === "medium" || value === "high") openAiQuality = value;
    } else if (arg === "--delivery" && argv[i + 1]) {
      const value = argv[++i];
      if (value === "standard" || value === "batch") openAiDelivery = value;
    } else if (arg === "--batch-download" && argv[i + 1]) {
      batchDownloadManifest = argv[++i];
    } else if (arg === "--batch-status" && argv[i + 1]) {
      batchStatusManifest = argv[++i];
    } else if (arg === "--help" || arg === "-h") {
      printUsage();
      process.exit(0);
    } else if (!arg.startsWith("--")) {
      inputFile = arg;
    }
  }

  return {
    batchDownloadManifest,
    batchStatusManifest,
    concurrency,
    force,
    inputFile,
    model,
    openAiDelivery,
    openAiQuality,
    provider,
  };
}

async function promptChoice<T extends string>(
  question: string,
  options: readonly T[],
): Promise<T> {
  const rl = createInterface({ input, output });
  try {
    while (true) {
      const suffix = options.map((option, i) => `${i + 1}) ${option}`).join("  ");
      const answer = (await rl.question(`${question} ${suffix}: `)).trim().toLowerCase();
      const numeric = Number.parseInt(answer, 10);
      if (!Number.isNaN(numeric) && numeric >= 1 && numeric <= options.length) {
        return options[numeric - 1];
      }
      const matched = options.find((option) => option.toLowerCase() === answer);
      if (matched) return matched;
      console.log(`Please choose one of: ${options.join(", ")}`);
    }
  } finally {
    rl.close();
  }
}

function parseAspectRatio(aspectRatio: string): { width: number; height: number } {
  const [widthRaw, heightRaw] = aspectRatio.split(":");
  const width = Number.parseFloat(widthRaw);
  const height = Number.parseFloat(heightRaw);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return { width: 1, height: 1 };
  }
  return { width, height };
}

function resolveOutputPath(job: Job): string {
  const outputDir = path.resolve(process.cwd(), job.path);
  const hasExt = path.extname(job.imageName) !== "";
  const fileName = hasExt ? job.imageName : `${job.imageName}.png`;
  return path.join(outputDir, fileName);
}

function getOpenAiApiKey(): string | undefined {
  return process.env.OPENAI_API_KEY ?? process.env.OPEN_AI_API_KEY;
}

function getOpenAiOutputFormat(job: Job): OpenAiOutputFormat {
  switch (path.extname(job.imageName).toLowerCase()) {
    case ".jpg":
    case ".jpeg":
      return "jpeg";
    case ".webp":
      return "webp";
    default:
      return "png";
  }
}

function getOpenAiSize(job: Job): "1024x1024" | "1024x1536" | "1536x1024" {
  const { width, height } = parseAspectRatio(job.aspectRatio);
  if (Math.abs(width - height) < 0.001) return "1024x1024";
  return width > height ? "1536x1024" : "1024x1536";
}

function buildOpenAiPrompt(job: Job): string {
  return `${job.prompt}

Output requirements:
- Preserve any requested text exactly and keep it highly legible.
- Intended aspect ratio: ${job.aspectRatio}
- Intended resolution class: ${job.resolution}
- Prefer a clean infographic composition over decorative detail when there is a tradeoff.`;
}

async function readJobs(inputFile: string): Promise<Job[]> {
  const raw = await fs.readFile(path.resolve(process.cwd(), inputFile), "utf8");
  const jobs = JSON.parse(raw) as unknown;
  if (!Array.isArray(jobs)) {
    throw new TypeError("Input JSON must be an array of Job objects");
  }
  jobs.forEach((job, index) => assertValidJob(job, index));
  return jobs as Job[];
}

async function ensurePendingJobs(jobs: Job[], force: boolean): Promise<PendingJob[]> {
  const pending: PendingJob[] = [];

  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    const outputPath = resolveOutputPath(job);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    if (!force) {
      try {
        await fs.access(outputPath);
        console.log(`[${i}] ⊘ Skipped (exists) → ${outputPath}`);
        continue;
      } catch {
        // file doesn't exist - proceed
      }
    }

    pending.push({
      index: i,
      job,
      outputFormat: getOpenAiOutputFormat(job),
      outputPath,
    });
  }

  return pending;
}

// ---------------------------------------------------------------------------
// Gemini generation
// ---------------------------------------------------------------------------

async function callGeminiImageApi(
  ai: GoogleGenAI,
  model: string,
  job: Job,
  index: number,
): Promise<Buffer> {
  const response = await ai.models.generateContent({
    model,
    contents: job.prompt,
    config: {
      imageConfig: {
        aspectRatio: job.aspectRatio,
        imageSize: job.resolution,
      },
    },
  });

  const parts = response.candidates?.[0]?.content?.parts ?? [];

  for (const part of parts) {
    if (part.text) {
      console.log(`[${index}] Model text: ${part.text}`);
    }
    if (part.inlineData?.data) {
      return Buffer.from(part.inlineData.data, "base64");
    }
  }

  throw new Error("No image data in response");
}

async function generateOneGemini(
  ai: GoogleGenAI,
  model: string,
  job: Job,
  index: number,
  force: boolean,
): Promise<JobResult> {
  const outputPath = resolveOutputPath(job);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  if (!force) {
    try {
      await fs.access(outputPath);
      console.log(`[${index}] ⊘ Skipped (exists) → ${outputPath}`);
      return "skipped";
    } catch {
      // file doesn't exist - proceed
    }
  }

  let lastError: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      const delay = RETRY_BASE_MS * 2 ** (attempt - 1);
      console.log(`[${index}] ↻ Retry ${attempt}/${MAX_RETRIES} after ${delay}ms…`);
      await sleep(delay);
    }

    try {
      const buffer = await callGeminiImageApi(ai, model, job, index);
      await fs.writeFile(outputPath, buffer);
      console.log(`[${index}] ✓ Saved → ${outputPath}`);
      return "generated";
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError;
}

// ---------------------------------------------------------------------------
// OpenAI generation
// ---------------------------------------------------------------------------

async function fetchOpenAiJson(
  apiKey: string,
  url: string,
  init: RequestInit,
): Promise<any> {
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      ...(init.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(init.headers ?? {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new OpenAiApiError(
      response.status,
      text,
      parseRetryAfterMs(response.headers.get("retry-after"), text),
    );
  }

  return response.json();
}

async function fetchOpenAiText(
  apiKey: string,
  url: string,
): Promise<string> {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new OpenAiApiError(
      response.status,
      text,
      parseRetryAfterMs(response.headers.get("retry-after"), text),
    );
  }

  return response.text();
}

async function callOpenAiImageApi(
  apiKey: string,
  job: Job,
  quality: OpenAiQuality,
): Promise<Buffer> {
  const body = {
    model: OPENAI_MODEL,
    prompt: buildOpenAiPrompt(job),
    n: 1,
    quality,
    size: getOpenAiSize(job),
    output_format: getOpenAiOutputFormat(job),
    background: "opaque",
  };

  const response = await fetchOpenAiJson(
    apiKey,
    "https://api.openai.com/v1/images/generations",
    {
      method: "POST",
      body: JSON.stringify(body),
    },
  );

  const base64Image = response?.data?.[0]?.b64_json;
  if (!base64Image) {
    throw new Error("No image data in OpenAI response");
  }
  return Buffer.from(base64Image, "base64");
}

async function generateOneOpenAi(
  apiKey: string,
  job: Job,
  index: number,
  force: boolean,
  quality: OpenAiQuality,
  rateLimiter: OpenAiRateLimiter,
): Promise<JobResult> {
  const outputPath = resolveOutputPath(job);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  if (!force) {
    try {
      await fs.access(outputPath);
      console.log(`[${index}] ⊘ Skipped (exists) → ${outputPath}`);
      return "skipped";
    } catch {
      // file doesn't exist - proceed
    }
  }

  let lastError: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      await rateLimiter.waitTurn(index);
      const buffer = await callOpenAiImageApi(apiKey, job, quality);
      await fs.writeFile(outputPath, buffer);
      console.log(`[${index}] ✓ Saved → ${outputPath}`);
      return "generated";
    } catch (err) {
      lastError = err;
      if (attempt < MAX_RETRIES) {
        const retryDelay = err instanceof OpenAiApiError && err.status === 429
          ? Math.max(err.retryAfterMs ?? 0, rateLimiter.getMinIntervalMs())
          : RETRY_BASE_MS * 2 ** attempt;
        await rateLimiter.deferFor(retryDelay);
        console.log(`[${index}] ↻ Retry ${attempt + 1}/${MAX_RETRIES} after ${retryDelay}ms…`);
      }
    }
  }

  throw lastError;
}

async function uploadOpenAiBatchFile(apiKey: string, jsonl: string): Promise<string> {
  const form = new FormData();
  form.append("purpose", "batch");
  form.append(
    "file",
    new Blob([jsonl], { type: "application/jsonl" }),
    "openai-image-batch.jsonl",
  );

  const response = await fetch("https://api.openai.com/v1/files", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: form,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI file upload failed ${response.status}: ${text}`);
  }

  const payload = await response.json();
  if (!payload?.id) throw new Error("OpenAI file upload returned no file ID");
  return payload.id as string;
}

async function createOpenAiBatch(apiKey: string, inputFileId: string): Promise<string> {
  const response = await fetchOpenAiJson(
    apiKey,
    "https://api.openai.com/v1/batches",
    {
      method: "POST",
      body: JSON.stringify({
        input_file_id: inputFileId,
        endpoint: "/v1/images/generations",
        completion_window: "24h",
        metadata: {
          source: "front/scripts/generate_images.ts",
          model: OPENAI_MODEL,
        },
      }),
    },
  );

  if (!response?.id) throw new Error("OpenAI batch creation returned no batch ID");
  return response.id as string;
}

function getBatchArtifactsPath(inputFile: string): {
  manifestPath: string;
  outputFilePath: string;
  errorFilePath: string;
} {
  const resolved = path.resolve(process.cwd(), inputFile);
  const dir = path.dirname(resolved);
  const baseName = path.basename(resolved, path.extname(resolved));
  return {
    manifestPath: path.join(dir, `${baseName}.openai-batch.json`),
    outputFilePath: path.join(dir, `${baseName}.openai-batch.output.jsonl`),
    errorFilePath: path.join(dir, `${baseName}.openai-batch.errors.jsonl`),
  };
}

async function submitOpenAiBatch(
  apiKey: string,
  inputFile: string,
  jobs: Job[],
  force: boolean,
  quality: OpenAiQuality,
): Promise<void> {
  const pending = await ensurePendingJobs(jobs, force);
  if (pending.length === 0) {
    console.log("\nNothing to submit. All output files already exist.\n");
    return;
  }

  const lines = pending.map((item) => {
    const customId = `image-job-${item.index}`;
    return JSON.stringify({
      custom_id: customId,
      method: "POST",
      url: "/v1/images/generations",
      body: {
        model: OPENAI_MODEL,
        prompt: buildOpenAiPrompt(item.job),
        n: 1,
        quality,
        size: getOpenAiSize(item.job),
        output_format: item.outputFormat,
        background: "opaque",
      },
    });
  });

  const jsonl = `${lines.join("\n")}\n`;
  const inputFileId = await uploadOpenAiBatchFile(apiKey, jsonl);
  const batchId = await createOpenAiBatch(apiKey, inputFileId);
  const { manifestPath, outputFilePath, errorFilePath } = getBatchArtifactsPath(inputFile);

  const manifest: BatchManifest = {
    provider: "openai",
    model: OPENAI_MODEL,
    quality,
    submittedAt: new Date().toISOString(),
    jobsFile: path.resolve(process.cwd(), inputFile),
    inputFileId,
    batchId,
    outputFilePath,
    errorFilePath,
    jobs: pending.map((item) => ({
      customId: `image-job-${item.index}`,
      index: item.index,
      outputPath: item.outputPath,
      outputFormat: item.outputFormat,
      aspectRatio: item.job.aspectRatio,
      resolution: item.job.resolution,
    })),
  };

  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

  console.log(`\nBatch submitted.`);
  console.log(`Batch ID:      ${batchId}`);
  console.log(`Input file ID: ${inputFileId}`);
  console.log(`Manifest:      ${manifestPath}`);
  console.log(`\nCheck status with:`);
  console.log(`npx tsx scripts/generate_images.ts --batch-status "${manifestPath}"`);
  console.log(`\nDownload results with:`);
  console.log(`npx tsx scripts/generate_images.ts --batch-download "${manifestPath}"\n`);
}

async function readBatchManifest(manifestPath: string): Promise<BatchManifest> {
  const raw = await fs.readFile(path.resolve(process.cwd(), manifestPath), "utf8");
  return JSON.parse(raw) as BatchManifest;
}

async function retrieveOpenAiBatch(apiKey: string, batchId: string): Promise<any> {
  return fetchOpenAiJson(apiKey, `https://api.openai.com/v1/batches/${batchId}`, {
    method: "GET",
  });
}

async function showOpenAiBatchStatus(apiKey: string, manifestPath: string): Promise<void> {
  const manifest = await readBatchManifest(manifestPath);
  const batch = await retrieveOpenAiBatch(apiKey, manifest.batchId);

  console.log(`Batch ID:           ${batch.id}`);
  console.log(`Status:             ${batch.status}`);
  console.log(`Input file ID:      ${batch.input_file_id}`);
  console.log(`Output file ID:     ${batch.output_file_id ?? "-"}`);
  console.log(`Error file ID:      ${batch.error_file_id ?? "-"}`);
  console.log(`Request counts:     ${JSON.stringify(batch.request_counts ?? {})}`);
  console.log(`Submitted at:       ${manifest.submittedAt}`);
}

async function downloadOpenAiBatchResults(apiKey: string, manifestPath: string): Promise<void> {
  const manifest = await readBatchManifest(manifestPath);
  const batch = await retrieveOpenAiBatch(apiKey, manifest.batchId);

  console.log(`Batch ID: ${batch.id}`);
  console.log(`Status:   ${batch.status}`);

  if (batch.status !== "completed" || !batch.output_file_id) {
    console.log("Batch is not ready yet. Use --batch-status to check again later.");
    return;
  }

  const outputJsonl = await fetchOpenAiText(
    apiKey,
    `https://api.openai.com/v1/files/${batch.output_file_id}/content`,
  );
  await fs.writeFile(manifest.outputFilePath, outputJsonl);

  if (batch.error_file_id) {
    const errorJsonl = await fetchOpenAiText(
      apiKey,
      `https://api.openai.com/v1/files/${batch.error_file_id}/content`,
    );
    await fs.writeFile(manifest.errorFilePath, errorJsonl);
  }

  const jobsById = new Map(manifest.jobs.map((job) => [job.customId, job]));
  let saved = 0;
  let failed = 0;

  for (const line of outputJsonl.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const item = JSON.parse(trimmed) as any;
    const customId = item.custom_id as string | undefined;
    if (!customId) continue;

    const manifestJob = jobsById.get(customId);
    if (!manifestJob) continue;

    const imageData = item.response?.body?.data?.[0]?.b64_json as string | undefined;
    if (!imageData) {
      failed++;
      console.log(`[${manifestJob.index}] ✗ Missing image data in batch output`);
      continue;
    }

    await fs.mkdir(path.dirname(manifestJob.outputPath), { recursive: true });
    await fs.writeFile(manifestJob.outputPath, Buffer.from(imageData, "base64"));
    saved++;
    console.log(`[${manifestJob.index}] ✓ Saved → ${manifestJob.outputPath}`);
  }

  if (batch.error_file_id) {
    console.log(`Saved batch error file → ${manifest.errorFilePath}`);
  }
  console.log(`Saved batch output file → ${manifest.outputFilePath}`);
  console.log(`\n────────────────────────────────`);
  console.log(`  ✓ ${saved} saved   ✗ ${failed} failed`);
  console.log(`────────────────────────────────\n`);
}

// ---------------------------------------------------------------------------
// Concurrency helper
// ---------------------------------------------------------------------------

async function runWithConcurrency<T>(
  tasks: (() => Promise<T>)[],
  limit: number,
): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  let nextIdx = 0;

  async function worker() {
    while (nextIdx < tasks.length) {
      const idx = nextIdx++;
      results[idx] = await tasks[idx]();
    }
  }

  const workers = Array.from({ length: Math.min(limit, tasks.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

async function runStandardGemini(
  jobs: Job[],
  force: boolean,
  concurrency: number,
  model: string,
): Promise<void> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not set. Set it in secrets/.env or as an env var.");
  }

  console.log(`\n🖼  Image generator`);
  console.log(`   Provider:    gemini`);
  console.log(`   Model:       ${model}`);
  console.log(`   Jobs:        ${jobs.length}`);
  console.log(`   Concurrency: ${concurrency}`);
  console.log(`   Force:       ${force}\n`);

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const results: JobResult[] = new Array(jobs.length).fill("failed");

  const tasks = jobs.map((job, i) => async () => {
    try {
      results[i] = await generateOneGemini(ai, model, job, i, force);
    } catch (error) {
      console.error(`[${i}] ✗ Failed:`, error instanceof Error ? error.message : error);
      results[i] = "failed";
    }
    return results[i];
  });

  await runWithConcurrency(tasks, concurrency);
  printSummary(results);
}

async function runStandardOpenAi(
  jobs: Job[],
  force: boolean,
  concurrency: number,
  quality: OpenAiQuality,
): Promise<void> {
  const apiKey = getOpenAiApiKey();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY or OPEN_AI_API_KEY not set.");
  }

  console.log(`\n🖼  Image generator`);
  console.log(`   Provider:    openai`);
  console.log(`   Model:       ${OPENAI_MODEL}`);
  console.log(`   Quality:     ${quality}`);
  console.log(`   Delivery:    standard`);
  console.log(`   Jobs:        ${jobs.length}`);
  console.log(`   Concurrency: ${concurrency}`);
  console.log(`   Force:       ${force}`);
  console.log(`   Note:        OpenAI Images API normalizes output to square, portrait, or landscape sizes.\n`);

  const configuredInputImagesPerMinute = Math.max(
    1,
    Number.parseInt(process.env.OPENAI_IMAGE_INPUTS_PER_MINUTE ?? "", 10) || DEFAULT_OPENAI_INPUT_IMAGES_PER_MINUTE,
  );
  const rateLimiter = new OpenAiRateLimiter(configuredInputImagesPerMinute);
  console.log(`   Pacing:      ${configuredInputImagesPerMinute} input image(s)/min → ${rateLimiter.getMinIntervalMs()}ms between request starts\n`);

  const results: JobResult[] = new Array(jobs.length).fill("failed");

  const tasks = jobs.map((job, i) => async () => {
    try {
      results[i] = await generateOneOpenAi(apiKey, job, i, force, quality, rateLimiter);
    } catch (error) {
      console.error(`[${i}] ✗ Failed:`, error instanceof Error ? error.message : error);
      results[i] = "failed";
    }
    return results[i];
  });

  await runWithConcurrency(tasks, concurrency);
  printSummary(results);
}

async function runOpenAiBatch(
  inputFile: string,
  jobs: Job[],
  force: boolean,
  quality: OpenAiQuality,
): Promise<void> {
  const apiKey = getOpenAiApiKey();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY or OPEN_AI_API_KEY not set.");
  }

  console.log(`\n🖼  Image generator`);
  console.log(`   Provider: openai`);
  console.log(`   Model:    ${OPENAI_MODEL}`);
  console.log(`   Quality:  ${quality}`);
  console.log(`   Delivery: batch`);
  console.log(`   Jobs:     ${jobs.length}`);
  console.log(`   Force:    ${force}`);
  console.log(`   Note:     Batch is asynchronous and may complete anytime within 24 hours.\n`);

  await submitOpenAiBatch(apiKey, inputFile, jobs, force, quality);
}

function printSummary(results: JobResult[]): void {
  const generated = results.filter((r) => r === "generated").length;
  const skipped = results.filter((r) => r === "skipped").length;
  const failed = results.filter((r) => r === "failed").length;

  console.log(`\n────────────────────────────────`);
  console.log(`  ✓ ${generated} generated   ⊘ ${skipped} skipped   ✗ ${failed} failed`);
  console.log(`────────────────────────────────\n`);

  if (failed > 0) process.exitCode = 1;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  await loadEnvFile(path.resolve(process.cwd(), "../secrets/.env"));
  await loadEnvFile(path.resolve(process.cwd(), "secrets/.env"));

  const args = parseArgs(process.argv);

  if (args.batchStatusManifest) {
    const apiKey = getOpenAiApiKey();
    if (!apiKey) throw new Error("OPENAI_API_KEY or OPEN_AI_API_KEY not set.");
    await showOpenAiBatchStatus(apiKey, args.batchStatusManifest);
    return;
  }

  if (args.batchDownloadManifest) {
    const apiKey = getOpenAiApiKey();
    if (!apiKey) throw new Error("OPENAI_API_KEY or OPEN_AI_API_KEY not set.");
    await downloadOpenAiBatchResults(apiKey, args.batchDownloadManifest);
    return;
  }

  if (!args.inputFile) {
    printUsage();
    process.exit(1);
  }

  const jobs = await readJobs(args.inputFile);
  const provider = args.provider ?? await promptChoice("Provider?", ["gemini", "openai"] as const);

  if (provider === "gemini") {
    const model = args.model ?? DEFAULT_GEMINI_MODEL;
    await runStandardGemini(jobs, args.force, args.concurrency, model);
    return;
  }

  const quality = args.openAiQuality
    ?? await promptChoice("OpenAI quality?", ["low", "medium", "high"] as const);
  const delivery = args.openAiDelivery
    ?? await promptChoice("OpenAI delivery?", ["standard", "batch"] as const);

  if (delivery === "standard") {
    await runStandardOpenAi(jobs, args.force, args.concurrency, quality);
    return;
  }

  await runOpenAiBatch(args.inputFile, jobs, args.force, quality);
}

await main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
