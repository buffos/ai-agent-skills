import { GoogleGenAI } from "@google/genai";
import { promises as fs } from "node:fs";
import path from "node:path";

type SpeechConfigEntry = {
  voice: string;
  speaker?: string;
  language?: string;
};

type Job = {
  label?: string;
  outputPath: string;
  prompt: string;
  speechConfig: SpeechConfigEntry[];
  source?: string;
};

type JobResult = "generated" | "skipped" | "failed";

type ParsedArgs = {
  dryRun: boolean;
  force: boolean;
  inputFile?: string;
  model?: string;
};

const DEFAULT_MODEL = "gemini-3.1-flash-tts-preview";
const DEFAULT_SAMPLE_RATE = 24_000;
const DEFAULT_CHANNELS = 1;
const DEFAULT_SAMPLE_WIDTH = 2;
const MAX_RETRIES = 2;
const RETRY_BASE_MS = 2_000;
const EXPECTED_JOB_KEYS = new Set(["label", "outputPath", "prompt", "speechConfig", "source"]);
const EXPECTED_SPEECH_CONFIG_KEYS = new Set(["voice", "speaker", "language"]);

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
    // Ignore missing env files.
  }
}

function printUsage(): void {
  console.log(`
Usage:
  npx tsx scripts/generate_tts.ts <jobs.json> [--model MODEL] [--force] [--dry-run]

Notes:
  - Uses Gemini Interactions API with GEMINI_API_KEY
  - Reads jobs from front/scripts/tts-jobs.json by convention
  - Writes .wav or .pcm files relative to front/
`.trim());
}

function parseArgs(argv: string[]): ParsedArgs {
  let dryRun = false;
  let force = false;
  let inputFile: string | undefined;
  let model: string | undefined;

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--dry-run") {
      dryRun = true;
    } else if (arg === "--force") {
      force = true;
    } else if (arg === "--model" && argv[i + 1]) {
      model = argv[++i];
    } else if (arg === "--help" || arg === "-h") {
      printUsage();
      process.exit(0);
    } else if (!arg.startsWith("--")) {
      inputFile = arg;
    }
  }

  return { dryRun, force, inputFile, model };
}

function assertValidSpeechConfig(config: unknown, jobIndex: number, configIndex: number): void {
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    throw new Error(`jobs[${jobIndex}].speechConfig[${configIndex}] must be an object`);
  }

  const record = config as Record<string, unknown>;
  const unknownKeys = Object.keys(record).filter((key) => !EXPECTED_SPEECH_CONFIG_KEYS.has(key));
  if (unknownKeys.length > 0) {
    throw new Error(
      `jobs[${jobIndex}].speechConfig[${configIndex}] has unsupported key(s): ${unknownKeys.join(", ")}`
    );
  }

  if (typeof record.voice !== "string" || record.voice.trim() === "") {
    throw new Error(`jobs[${jobIndex}].speechConfig[${configIndex}].voice must be a non-empty string`);
  }
  if ("speaker" in record && typeof record.speaker !== "string") {
    throw new Error(`jobs[${jobIndex}].speechConfig[${configIndex}].speaker must be a string when set`);
  }
  if ("language" in record && typeof record.language !== "string") {
    throw new Error(`jobs[${jobIndex}].speechConfig[${configIndex}].language must be a string when set`);
  }
}

function assertValidJob(job: unknown, index: number): void {
  if (!job || typeof job !== "object" || Array.isArray(job)) {
    throw new Error(`jobs[${index}] must be an object`);
  }

  const record = job as Record<string, unknown>;
  const unknownKeys = Object.keys(record).filter((key) => !EXPECTED_JOB_KEYS.has(key));
  if (unknownKeys.length > 0) {
    throw new Error(
      `jobs[${index}] has unsupported key(s): ${unknownKeys.join(", ")}. Expected keys: ${[...EXPECTED_JOB_KEYS].join(", ")}`
    );
  }

  if ("label" in record && typeof record.label !== "string") {
    throw new Error(`jobs[${index}].label must be a string when set`);
  }
  if (typeof record.outputPath !== "string" || record.outputPath.trim() === "") {
    throw new Error(`jobs[${index}].outputPath must be a non-empty string`);
  }
  if (path.isAbsolute(record.outputPath)) {
    throw new Error(`jobs[${index}].outputPath must be relative to front/, not absolute`);
  }
  const ext = path.extname(record.outputPath).toLowerCase();
  if (ext !== ".wav" && ext !== ".pcm") {
    throw new Error(`jobs[${index}].outputPath must end in .wav or .pcm`);
  }

  if (typeof record.prompt !== "string" || record.prompt.trim() === "") {
    throw new Error(`jobs[${index}].prompt must be a non-empty string`);
  }

  if (!Array.isArray(record.speechConfig) || record.speechConfig.length === 0) {
    throw new Error(`jobs[${index}].speechConfig must be a non-empty array`);
  }
  record.speechConfig.forEach((config, configIndex) => assertValidSpeechConfig(config, index, configIndex));

  if ("source" in record && typeof record.source !== "string") {
    throw new Error(`jobs[${index}].source must be a string when set`);
  }
}

async function readJobs(inputFile: string): Promise<Job[]> {
  const raw = await fs.readFile(path.resolve(process.cwd(), inputFile), "utf8");
  const jobs = JSON.parse(raw) as unknown;
  if (!Array.isArray(jobs)) {
    throw new TypeError("Input JSON must be an array of TTS jobs");
  }
  jobs.forEach((job, index) => assertValidJob(job, index));
  return jobs as Job[];
}

function resolveOutputPath(job: Job): string {
  return path.resolve(process.cwd(), job.outputPath);
}

function getJobTag(job: Job, index: number): string {
  return job.label ? `[${index}] ${job.label}` : `[${index}]`;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createWaveHeader(
  pcmByteLength: number,
  channels: number,
  sampleRate: number,
  sampleWidth: number,
): Buffer {
  const blockAlign = channels * sampleWidth;
  const byteRate = sampleRate * blockAlign;
  const buffer = Buffer.alloc(44);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + pcmByteLength, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(channels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(sampleWidth * 8, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(pcmByteLength, 40);

  return buffer;
}

function pcmToWave(pcm: Buffer): Buffer {
  const header = createWaveHeader(
    pcm.length,
    DEFAULT_CHANNELS,
    DEFAULT_SAMPLE_RATE,
    DEFAULT_SAMPLE_WIDTH,
  );
  return Buffer.concat([header, pcm]);
}

class ApiError extends Error {
  status: number;
  retryAfterMs?: number;

  constructor(status: number, bodyText: string, retryAfterMs?: number) {
    super(`Gemini API ${status}: ${bodyText}`);
    this.name = "ApiError";
    this.status = status;
    this.retryAfterMs = retryAfterMs;
  }
}

function parseRetryAfterMs(headerValue: string | null): number | undefined {
  const seconds = headerValue ? Number.parseFloat(headerValue) : Number.NaN;
  if (!Number.isFinite(seconds) || seconds <= 0) return undefined;
  return Math.ceil(seconds * 1000);
}

function getErrorStatus(error: unknown): number | undefined {
  if (!error || typeof error !== "object") return undefined;
  const record = error as Record<string, unknown>;
  if (typeof record.status === "number") return record.status;
  if (typeof record.code === "number") return record.code;
  return undefined;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

function isRetryableError(error: unknown): boolean {
  const status = getErrorStatus(error);
  if (status === undefined) {
    // Network/transport/SDK wrapper errors without HTTP status may be transient.
    return true;
  }

  if (status === 408 || status === 429) return true;
  if (status >= 500 && status <= 599) return true;
  return false;
}

async function callGeminiTtsApi(apiKey: string, model: string, job: Job): Promise<Buffer> {
  const ai = new GoogleGenAI({ apiKey });
  const primaryConfig = job.speechConfig[0];

  const speechConfig = job.speechConfig.length === 1
    ? {
        ...(primaryConfig.language ? { languageCode: primaryConfig.language } : {}),
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName: primaryConfig.voice,
          },
        },
      }
    : {
        multiSpeakerVoiceConfig: {
          speakerVoiceConfigs: job.speechConfig.map((config, index) => {
            if (!config.speaker) {
              throw new Error(
                `jobs speechConfig[${index}] is missing speaker. Multi-speaker jobs require a speaker name for every voice config.`,
              );
            }
            return {
              speaker: config.speaker,
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: config.voice,
                },
              },
            };
          }),
        },
      };

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text: job.prompt }] }],
    config: {
      responseModalities: ["AUDIO"],
      speechConfig,
    },
  });

  const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!audioData) {
    throw new Error("No candidates[0].content.parts[0].inlineData.data found in Gemini TTS response");
  }
  return Buffer.from(audioData, "base64");
}

async function generateOne(
  apiKey: string,
  model: string,
  job: Job,
  index: number,
  force: boolean,
): Promise<JobResult> {
  const outputPath = resolveOutputPath(job);
  const jobTag = getJobTag(job, index);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  if (!force) {
    try {
      await fs.access(outputPath);
      console.log(`${jobTag} Skipped (exists) -> ${outputPath}`);
      return "skipped";
    } catch {
      // File does not exist.
    }
  }

  let lastError: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const pcm = await callGeminiTtsApi(apiKey, model, job);
      const ext = path.extname(outputPath).toLowerCase();
      const data = ext === ".wav" ? pcmToWave(pcm) : pcm;
      await fs.writeFile(outputPath, data);
      console.log(`${jobTag} Saved -> ${outputPath}`);
      return "generated";
    } catch (error) {
      lastError = error;
      const message = getErrorMessage(error);
      const status = getErrorStatus(error);
      const retryable = isRetryableError(error);

      console.error(
        `${jobTag} Attempt ${attempt + 1}/${MAX_RETRIES + 1} failed${status ? ` (status ${status})` : ""}: ${message}`,
      );
      console.error(`${jobTag} Raw error:`, error);

      if (!retryable) {
        console.error(`${jobTag} Not retrying because the error is not retryable.`);
        throw error;
      }

      if (attempt === MAX_RETRIES) {
        break;
      }

      const retryAfterMs = error instanceof ApiError ? error.retryAfterMs : undefined;
      const delay = retryAfterMs ?? RETRY_BASE_MS * 2 ** attempt;
      console.log(`${jobTag} Retry ${attempt + 1}/${MAX_RETRIES} after ${delay}ms...`);
      await sleep(delay);
    }
  }

  throw lastError;
}

function printSummary(results: JobResult[]): void {
  const generated = results.filter((result) => result === "generated").length;
  const skipped = results.filter((result) => result === "skipped").length;
  const failed = results.filter((result) => result === "failed").length;

  console.log("\n--------------------------------");
  console.log(`Generated: ${generated}`);
  console.log(`Skipped:   ${skipped}`);
  console.log(`Failed:    ${failed}`);
  console.log("--------------------------------\n");

  if (failed > 0) {
    process.exitCode = 1;
  }
}

async function main(): Promise<void> {
  await loadEnvFile(path.resolve(process.cwd(), "../secrets/.env"));
  await loadEnvFile(path.resolve(process.cwd(), "secrets/.env"));

  const args = parseArgs(process.argv);
  if (!args.inputFile) {
    printUsage();
    process.exit(1);
  }

  const jobs = await readJobs(args.inputFile);
  const model = args.model ?? DEFAULT_MODEL;

  console.log(`\nGemini TTS generator`);
  console.log(`Model:   ${model}`);
  console.log(`Jobs:    ${jobs.length}`);
  console.log(`Force:   ${args.force}`);
  console.log(`Dry run: ${args.dryRun}\n`);

  if (args.dryRun) {
    jobs.forEach((job, index) => {
      const jobTag = getJobTag(job, index);
      console.log(`${jobTag} ${job.outputPath}`);
      if (job.source) {
        console.log(`      source: ${job.source}`);
      }
      console.log(`      voice:  ${job.speechConfig.map((config) => config.voice).join(", ")}`);
    });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not set. Set it in secrets/.env, the environment, or the make command.");
  }

  const results: JobResult[] = new Array(jobs.length).fill("failed");
  for (let i = 0; i < jobs.length; i++) {
    try {
      results[i] = await generateOne(apiKey, model, jobs[i], i, args.force);
    } catch (error) {
      console.error(`[${i}] Failed:`, error instanceof Error ? error.message : error);
      results[i] = "failed";
    }
  }

  printSummary(results);
}

await main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
