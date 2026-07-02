#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";

const RESERVED = new Set(["index.md", "log.md"]);
const RECOMMENDED = ["title", "description", "tags", "timestamp"];
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const FENCE = /^(```|~~~)/;
const LINK = /(?<!\!)\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

class Report {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.concepts = 0;
    this.indexes = 0;
    this.logs = 0;
  }

  err(rel, msg) {
    this.errors.push(`${rel}: ${msg}`);
  }

  warn(rel, msg) {
    this.warnings.push(`${rel}: ${msg}`);
  }
}

async function loadYaml() {
  try {
    const globalRoot = execFileSync(npmExecutable(), ["root", "-g"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
    const requireFromGlobal = createRequire(path.join(globalRoot, "__okf_validate__.cjs"));
    return requireFromGlobal("yaml");
  } catch {
    console.error("Missing global Node.js package: yaml");
    console.error("");
    console.error("Install it with:");
    console.error("npm install -g yaml");
    process.exit(1);
  }
}

function npmExecutable() {
  return process.platform === "win32" ? "npm.cmd" : "npm";
}

function splitFrontmatter(text) {
  const normalized = text.replace(/^\uFEFF/, "");
  if (!normalized.startsWith("---")) {
    return { raw: null, body: normalized };
  }

  const lines = normalized.splitLines?.(true) ?? normalized.split(/\r?\n/).map((line, idx, arr) =>
    idx < arr.length - 1 ? `${line}\n` : line
  );

  if ((lines[0] ?? "").trim() !== "---") {
    return { raw: null, body: normalized };
  }

  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].trim() === "---") {
      return {
        raw: lines.slice(1, i).join(""),
        body: lines.slice(i + 1).join(""),
      };
    }
  }

  return { raw: null, body: normalized };
}

async function checkConcept(bundlePath, filePath, report, yaml) {
  report.concepts += 1;
  const rel = path.relative(bundlePath, filePath).split(path.sep).join("/");
  const text = await fs.readFile(filePath, "utf8");
  const { raw } = splitFrontmatter(text);

  if (raw === null) {
    report.err(rel, "§9.1 no parseable YAML frontmatter block");
    return;
  }

  let meta;
  try {
    meta = yaml.parse(raw);
  } catch (error) {
    report.err(rel, `§9.1 frontmatter is not valid YAML: ${String(error.message ?? error).replace(/\s+/g, " ").trim()}`);
    return;
  }

  if (!meta || typeof meta !== "object" || Array.isArray(meta)) {
    report.err(rel, "§9.1 frontmatter must be a YAML mapping");
    return;
  }

  const typeVal = meta.type;
  if (typeof typeVal !== "string" || !typeVal.trim()) {
    report.err(rel, "§9.2 missing or empty required `type` field");
  }

  for (const key of RECOMMENDED) {
    if (!(key in meta)) {
      report.warn(rel, `recommended field \`${key}\` is absent (§4.1)`);
    }
  }
}

async function checkIndex(bundlePath, filePath, report, yaml) {
  report.indexes += 1;
  const rel = path.relative(bundlePath, filePath).split(path.sep).join("/");
  const text = await fs.readFile(filePath, "utf8");
  const { raw } = splitFrontmatter(text);
  const isRoot = path.dirname(filePath) === bundlePath;

  if (raw === null) {
    return;
  }

  if (!isRoot) {
    report.warn(rel, "§6 index.md should contain no frontmatter");
    return;
  }

  let meta = {};
  try {
    meta = yaml.parse(raw) ?? {};
  } catch {
    report.warn(rel, "§11 root index.md frontmatter is not valid YAML");
    return;
  }

  const extra = Object.keys(meta).filter((key) => key !== "okf_version");
  if (extra.length > 0) {
    report.warn(rel, `§11 root index.md frontmatter may only carry \`okf_version\` (found ${JSON.stringify(extra)})`);
  }
}

async function checkLog(bundlePath, filePath, report) {
  report.logs += 1;
  const rel = path.relative(bundlePath, filePath).split(path.sep).join("/");
  const text = await fs.readFile(filePath, "utf8");
  const { raw } = splitFrontmatter(text);

  if (raw !== null) {
    report.warn(rel, "§7 log.md should contain no frontmatter");
  }

  for (const line of text.split(/\r?\n/)) {
    if (!line.startsWith("## ")) {
      continue;
    }

    const heading = line.slice(3).trim();
    if (!ISO_DATE.test(heading)) {
      report.warn(rel, `§7 date heading \`${heading}\` is not ISO 8601 YYYY-MM-DD`);
    }
  }
}

function collectLinkTargets(text) {
  const targets = [];
  let inFence = false;

  for (const line of text.split(/\r?\n/)) {
    if (FENCE.test(line.trim())) {
      inFence = !inFence;
      continue;
    }

    if (inFence) {
      continue;
    }

    for (const match of line.matchAll(LINK)) {
      targets.push(match[1]);
    }
  }

  return targets;
}

async function checkLinks(bundlePath, files, report) {
  const existing = new Set(files.map((filePath) => path.relative(bundlePath, filePath).split(path.sep).join("/")));

  for (const filePath of files) {
    const rel = path.relative(bundlePath, filePath).split(path.sep).join("/");
    const text = await fs.readFile(filePath, "utf8");

    for (const target of collectLinkTargets(text)) {
      const targetPath = target.split("#", 1)[0];
      if (!targetPath || targetPath.endsWith("/")) {
        continue;
      }
      if (/^[a-z][a-z0-9+.-]*:\/\//i.test(targetPath) || targetPath.startsWith("mailto:")) {
        continue;
      }
      if (!targetPath.endsWith(".md")) {
        continue;
      }

      const resolved = resolveLink(bundlePath, filePath, targetPath);
      if (!resolved || existing.has(resolved)) {
        continue;
      }

      report.warn(rel, `cross-link target not found: \`${target}\` (tolerated under §5.3)`);
    }
  }
}

function resolveLink(bundlePath, filePath, targetPath) {
  const bundleResolved = path.resolve(bundlePath);
  const candidate = targetPath.startsWith("/")
    ? path.resolve(bundleResolved, `.${targetPath}`)
    : path.resolve(path.dirname(filePath), targetPath);

  const relative = path.relative(bundleResolved, candidate);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    return null;
  }

  return relative.split(path.sep).join("/");
}

async function listMarkdownFiles(bundlePath) {
  const files = [];

  async function walk(dirPath) {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }
      if (entry.isFile() && entry.name.endsWith(".md")) {
        files.push(fullPath);
      }
    }
  }

  await walk(bundlePath);
  return files;
}

async function validate(bundlePath, yaml) {
  const report = new Report();
  const files = await listMarkdownFiles(bundlePath);

  for (const filePath of files) {
    const name = path.basename(filePath);
    if (name === "index.md") {
      await checkIndex(bundlePath, filePath, report, yaml);
    } else if (name === "log.md") {
      await checkLog(bundlePath, filePath, report);
    } else if (!RESERVED.has(name)) {
      await checkConcept(bundlePath, filePath, report, yaml);
    }
  }

  await checkLinks(bundlePath, files, report);
  return report;
}

function parseArgs(argv) {
  let bundle = ".okf";
  let strict = false;
  let json = false;

  for (const arg of argv) {
    if (arg === "--strict") {
      strict = true;
      continue;
    }
    if (arg === "--json") {
      json = true;
      continue;
    }
    if (arg.startsWith("--")) {
      throw new Error(`Unknown option: ${arg}`);
    }
    if (bundle !== ".okf") {
      throw new Error("Only one bundle directory may be provided");
    }
    bundle = arg;
  }

  return { bundle, strict, json };
}

function printUsage() {
  console.error("Usage: node scripts/okf-validate.mjs [bundle-dir] [--strict] [--json]");
}

function printTextReport(bundlePath, report, conformant) {
  console.log(`OKF v0.1 conformance - ${bundlePath}`);
  console.log(`  concepts: ${report.concepts}   index.md: ${report.indexes}   log.md: ${report.logs}`);

  for (const error of report.errors) {
    console.log(`  ERROR  ${error}`);
  }
  for (const warning of report.warnings) {
    console.log(`  warn   ${warning}`);
  }

  if (conformant && report.warnings.length === 0) {
    console.log("  conformant - no issues");
    return;
  }
  if (conformant) {
    console.log(`  conformant (${report.warnings.length} warning(s))`);
    return;
  }

  console.log(`  non-conformant (${report.errors.length} error(s))`);
}

async function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(String(error.message ?? error));
    printUsage();
    process.exit(2);
  }

  const bundlePath = path.resolve(args.bundle);
  let stat;
  try {
    stat = await fs.stat(bundlePath);
  } catch {
    console.error(`error: ${args.bundle} is not a directory`);
    process.exit(2);
  }

  if (!stat.isDirectory()) {
    console.error(`error: ${args.bundle} is not a directory`);
    process.exit(2);
  }

  const yaml = await loadYaml();
  const report = await validate(bundlePath, yaml);
  const conformant = report.errors.length === 0;
  const failed = report.errors.length > 0 || (args.strict && report.warnings.length > 0);

  if (args.json) {
    console.log(JSON.stringify({
      bundle: bundlePath,
      conformant,
      passed: !failed,
      counts: {
        concepts: report.concepts,
        indexes: report.indexes,
        logs: report.logs,
      },
      errors: report.errors,
      warnings: report.warnings,
    }, null, 2));
    process.exit(failed ? 1 : 0);
  }

  printTextReport(bundlePath, report, conformant);
  process.exit(failed ? 1 : 0);
}

await main();
