#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const RESERVED = new Set(["index.md", "log.md"]);
const FENCE = /^(```|~~~)/;
const LINK = /(?<!\!)\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
const LAYOUTS = new Set(["force", "radial", "grid"]);

function npmExecutable() {
  return process.platform === "win32" ? "npm.cmd" : "npm";
}

async function loadYaml() {
  try {
    const globalRoot = execFileSync(npmExecutable(), ["root", "-g"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
    const requireFromGlobal = createRequire(path.join(globalRoot, "__okf_visualize__.cjs"));
    return requireFromGlobal("yaml");
  } catch {
    console.error("Missing global Node.js package: yaml");
    console.error("");
    console.error("Install it with:");
    console.error("npm install -g yaml");
    process.exit(1);
  }
}

function splitFrontmatter(text) {
  const normalized = text.replace(/^\uFEFF/, "");
  if (!normalized.startsWith("---")) {
    return { meta: {}, body: normalized };
  }

  const lines = normalized.split(/\r?\n/);
  if ((lines[0] ?? "").trim() !== "---") {
    return { meta: {}, body: normalized };
  }

  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].trim() === "---") {
      return {
        raw: lines.slice(1, i).join("\n"),
        body: lines.slice(i + 1).join("\n"),
      };
    }
  }

  return { meta: {}, body: normalized };
}

function linkTargets(text) {
  const out = [];
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
      out.push(match[1]);
    }
  }

  return out;
}

function normalizeTags(value) {
  return Array.isArray(value) ? value.filter((tag) => typeof tag === "string") : [];
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function inlineScript(source) {
  return source.replaceAll("</script>", "<\\/script>");
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
  return relative.split(path.sep).join("/").replace(/\.md$/i, "");
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
      } else if (entry.isFile() && entry.name.endsWith(".md") && !RESERVED.has(entry.name)) {
        files.push(fullPath);
      }
    }
  }

  await walk(bundlePath);
  return files;
}

async function build(bundlePath, yaml, maxBody) {
  const files = await listMarkdownFiles(bundlePath);
  const ids = new Set(files.map((filePath) => path.relative(bundlePath, filePath).split(path.sep).join("/").replace(/\.md$/i, "")));
  const nodes = [];
  const edges = [];
  const seen = new Set();

  for (const filePath of files) {
    const cid = path.relative(bundlePath, filePath).split(path.sep).join("/").replace(/\.md$/i, "");
    const text = await fs.readFile(filePath, "utf8");
    const parsed = splitFrontmatter(text);
    let meta = {};
    if (parsed.raw) {
      try {
        const loaded = yaml.parse(parsed.raw);
        meta = loaded && typeof loaded === "object" && !Array.isArray(loaded) ? loaded : {};
      } catch {
        meta = {};
      }
    }
    const body = (parsed.body ?? "").trim();
    nodes.push({
      id: cid,
      type: typeof meta.type === "string" && meta.type.trim() ? meta.type : "Untyped",
      title: typeof meta.title === "string" && meta.title.trim() ? meta.title : path.basename(filePath, ".md"),
      description: typeof meta.description === "string" ? meta.description : "",
      tags: normalizeTags(meta.tags),
      group: cid.includes("/") ? cid.split("/")[0] : "(root)",
      body: body.slice(0, maxBody),
      bodyLength: body.length,
      href: `${cid}.md`,
    });

    for (const target of linkTargets(body)) {
      const clean = target.split("#", 1)[0];
      if (!clean.endsWith(".md")) {
        continue;
      }
      const resolved = resolveLink(bundlePath, filePath, clean);
      if (!resolved || !ids.has(resolved) || resolved === cid) {
        continue;
      }
      const edgeKey = `${cid}=>${resolved}`;
      if (seen.has(edgeKey)) {
        continue;
      }
      seen.add(edgeKey);
      edges.push({ source: cid, target: resolved });
    }
  }

  return { nodes, edges };
}

function parseArgs(argv) {
  let bundle = ".okf";
  let out = null;
  let title = null;
  let link = null;
  let layout = "force";
  let maxBody = 8000;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "-o" || arg === "--out") {
      out = argv[++i] ?? null;
      continue;
    }
    if (arg === "-t" || arg === "--title") {
      title = argv[++i] ?? null;
      continue;
    }
    if (arg === "-l" || arg === "--link") {
      link = argv[++i] ?? null;
      continue;
    }
    if (arg === "--layout") {
      layout = argv[++i] ?? "";
      continue;
    }
    if (arg === "--max-body") {
      maxBody = Number.parseInt(argv[++i] ?? "", 10);
      continue;
    }
    if (arg.startsWith("-")) {
      throw new Error(`Unknown option: ${arg}`);
    }
    if (bundle !== ".okf") {
      throw new Error("Only one bundle directory may be provided");
    }
    bundle = arg;
  }

  if (!LAYOUTS.has(layout)) {
    throw new Error(`Invalid layout: ${layout}`);
  }
  if (!Number.isInteger(maxBody) || maxBody < 0) {
    throw new Error("--max-body must be a non-negative integer");
  }

  return { bundle, out, title, link, layout, maxBody };
}

async function renderHtml({ title, sourceLink, layout, nodes, edges, bundleName }) {
  const safeTitle = escapeHtml(title || bundleName);
  const safeLink = sourceLink ? `<a class="src" href="${escapeHtml(sourceLink)}" target="_blank" rel="noopener">source</a>` : "";
  const payload = JSON.stringify({ nodes, edges, layout });
  const vendorDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "vendor");
  const [cytoscapeSource, markedSource] = await Promise.all([
    fs.readFile(path.join(vendorDir, "cytoscape.min.js"), "utf8"),
    fs.readFile(path.join(vendorDir, "marked.min.js"), "utf8"),
  ]);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>OKF Visualize - ${safeTitle}</title>
<style>
:root{--bg:#f4f1e8;--panel:#fffdf7;--line:#d8cfbf;--ink:#1f1b16;--muted:#73685b;--accent:#0d6b78}
*{box-sizing:border-box}html,body{margin:0;height:100%;background:linear-gradient(180deg,#f8f5ed 0%,#ece4d5 100%);color:var(--ink);font:14px/1.45 Georgia,"Times New Roman",serif}
#app{display:grid;grid-template-columns:minmax(0,1fr) 380px;height:100vh}
#cy{width:100%;height:100%;background:radial-gradient(circle at top,#fffdf8,#efe6d6 72%)}
#side{border-left:1px solid var(--line);background:var(--panel);overflow:auto;padding:22px 18px 28px}
header{position:absolute;top:0;left:0;padding:14px 18px;z-index:5;pointer-events:none}
h1{font:600 18px/1.2 Arial,sans-serif;margin:0 0 4px}
.sub{font:12px/1.2 Arial,sans-serif;color:var(--muted);margin-bottom:18px}
#bar{position:absolute;top:14px;left:50%;transform:translateX(-50%);z-index:5;display:flex;gap:8px;flex-wrap:wrap;max-width:min(92vw,840px)}
#bar input,#bar select{appearance:none;border:1px solid var(--line);background:rgba(255,253,247,.95);color:var(--ink);padding:8px 10px;border-radius:999px;font:13px/1.2 Arial,sans-serif}
#search{width:min(300px,32vw)}
#legend{position:absolute;bottom:14px;left:18px;z-index:5;display:flex;flex-wrap:wrap;gap:8px;max-width:65vw}
.chip{display:flex;align-items:center;gap:6px;background:rgba(255,253,247,.92);border:1px solid var(--line);border-radius:999px;padding:5px 10px;font:12px/1 Arial,sans-serif;color:var(--muted);cursor:pointer;user-select:none}
.chip.off{opacity:.45}.dot{width:10px;height:10px;border-radius:50%}
.src{pointer-events:auto;color:var(--accent);margin-left:8px;text-decoration:none}.src:hover{text-decoration:underline}
.type{display:inline-block;padding:4px 8px;border-radius:999px;font:700 11px/1 Arial,sans-serif;color:#fff;margin-bottom:10px}
h2{font:600 24px/1.2 Georgia,"Times New Roman",serif;margin:0 0 8px}
.desc{color:var(--muted);margin-bottom:14px}
.tags{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px}
.tag{padding:3px 8px;border-radius:999px;border:1px solid var(--line);font:11px/1 Arial,sans-serif;color:var(--muted)}
.section{margin:18px 0}.section h3{font:700 11px/1.2 Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin:0 0 8px}
.section a{display:block;color:var(--accent);text-decoration:none;padding:2px 0}.section a:hover{text-decoration:underline}
.body{border-top:1px solid var(--line);padding-top:16px}.body p,.body ul,.body ol,.body pre,.body blockquote{margin:0 0 12px}
.body pre{overflow:auto;padding:10px 12px;background:#f0eadf;border-radius:12px;border:1px solid var(--line);font:12px/1.5 Consolas,monospace}
.body code{background:#f0eadf;border:1px solid var(--line);padding:1px 4px;border-radius:6px;font:12px Consolas,monospace}
.body blockquote{border-left:3px solid var(--line);padding-left:10px;color:var(--muted)}.body a{color:var(--accent)}.body table{border-collapse:collapse;display:block;overflow:auto}
.body td,.body th{border:1px solid var(--line);padding:4px 8px}.body img{max-width:100%}.empty{color:var(--muted)}
</style>
</head>
<body>
<div id="app">
  <div id="cy"></div>
  <aside id="side">
    <h1>${safeTitle}</h1>
    <div class="sub"><span id="summary"></span>${safeLink}</div>
    <p class="empty">Click a concept to inspect it.</p>
  </aside>
</div>
<header><h1>${safeTitle}</h1><div class="sub"><span id="header-summary"></span></div></header>
<div id="bar">
  <input id="search" placeholder="search concepts">
  <select id="type"><option value="">all types</option></select>
  <select id="layout">
    <option value="cose">force</option>
    <option value="concentric">radial</option>
    <option value="breadthfirst">breadth-first</option>
    <option value="circle">circle</option>
    <option value="grid">grid</option>
  </select>
</div>
<div id="legend"></div>
<script>${inlineScript(cytoscapeSource)}</script>
<script>${inlineScript(markedSource)}</script>
<script>
const DATA=${payload};
const side=document.getElementById("side");
const summary=document.getElementById("summary");
const headerSummary=document.getElementById("header-summary");
const search=document.getElementById("search");
const typeSelect=document.getElementById("type");
const layoutSelect=document.getElementById("layout");
const legend=document.getElementById("legend");
const PALETTE=["#0d6b78","#9c4f2f","#4f772d","#4c5c96","#b7791f","#8a365f","#2f7f6d","#7c5e10","#6b4bb8","#6f4e37"];
layoutSelect.value=DATA.layout;
const byId=Object.fromEntries(DATA.nodes.map(node=>[node.id,node]));
const outgoing={}, incoming={};
DATA.nodes.forEach(node=>{outgoing[node.id]=[];incoming[node.id]=[];});
DATA.edges.forEach(edge=>{outgoing[edge.source].push(edge.target);incoming[edge.target].push(edge.source);});
const types=[...new Set(DATA.nodes.map(node=>node.type))].sort();
const typeColor=Object.fromEntries(types.map((type,index)=>[type,PALETTE[index%PALETTE.length]]));
const hiddenTypes=new Set();
summary.textContent=\`\${DATA.nodes.length} concepts · \${DATA.edges.length} links\`;
headerSummary.textContent=summary.textContent;
types.forEach(type=>{
  const option=document.createElement("option");
  option.value=type;
  option.textContent=type;
  typeSelect.appendChild(option);
});
legend.innerHTML=types.map(type=>\`<button class="chip" data-type="\${escapeAttr(type)}" type="button">\${escapeHtml(type)} (\${DATA.nodes.filter(node=>node.type===type).length})</button>\`).join("");
legend.querySelectorAll(".chip").forEach(button=>{
  const type=button.getAttribute("data-type");
  button.insertAdjacentHTML("afterbegin", \`<span class="dot" style="background:\${typeColor[type]}"></span>\`);
});
legend.querySelectorAll(".chip").forEach(button=>{
  button.addEventListener("click",()=>{
    const type=button.getAttribute("data-type");
    if(hiddenTypes.has(type)){hiddenTypes.delete(type);button.classList.remove("off");}
    else{hiddenTypes.add(type);button.classList.add("off");}
    applyFilter();
  });
});
const cy=cytoscape({
  container:document.getElementById("cy"),
  minZoom:.2,maxZoom:1.6,wheelSensitivity:.2,
  elements:[
    ...DATA.nodes.map(node=>({data:{...node,color:typeColor[node.type],size:Math.max(24, Math.min(70, 24 + Math.floor((node.bodyLength||0)/200)))}})),
    ...DATA.edges.map(edge=>({data:edge}))
  ],
  style:[
    {selector:"node",style:{
      "background-color":"data(color)","label":"data(title)","color":"#1f1b16",
      "font-size":10,"text-wrap":"wrap","text-max-width":120,"text-valign":"bottom","text-margin-y":4,
      "text-outline-width":3,"text-outline-color":"#fffdf8","min-zoomed-font-size":6,
      "width":"data(size)","height":"data(size)","border-width":2,"border-color":"#fffdf8"
    }},
    {selector:"edge",style:{
      "width":1.2,"line-color":"#b7ab98","target-arrow-color":"#b7ab98",
      "target-arrow-shape":"triangle","arrow-scale":.8,"curve-style":"bezier","opacity":.7
    }},
    {selector:".dim",style:{"opacity":.12}},
    {selector:".hl",style:{"border-width":4,"border-color":"#ffffff"}}
  ],
  layout:{name:DATA.layout,animate:false,nodeRepulsion:9000,idealEdgeLength:90,padding:40}
});

search.addEventListener("input",applyFilter);
typeSelect.addEventListener("change",applyFilter);
layoutSelect.addEventListener("change",event=>{
  cy.layout({name:event.target.value,animate:true,padding:40,nodeRepulsion:9000,idealEdgeLength:90}).run();
});

function escapeHtml(value){return String(value??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");}
function escapeAttr(value){return escapeHtml(value);}

function relationBlock(label, ids){
  if(!ids.length) return "";
  return \`<div class="section"><h3>\${label}</h3>\${ids.map(id=>\`<a href="#" data-go="\${escapeAttr(id)}">\${escapeHtml((byId[id]||{}).title || id)}</a>\`).join("")}</div>\`;
}

function showNode(id){
  const node=byId[id];
  if(!node) return;
  const color=typeColor[node.type];
  const bodyHtml=node.body ? marked.parse(node.body) : '<p class="empty">empty body</p>';
  side.innerHTML=\`
    <h1>${safeTitle}</h1>
    <div class="sub">\${DATA.nodes.length} concepts · \${DATA.edges.length} links${sourceLink ? ` · ${safeLink}` : ""}</div>
    <span class="type" style="background:\${color}">\${escapeHtml(node.type)}</span>
    <h2>\${escapeHtml(node.title)}</h2>
    <div class="desc">\${node.description ? escapeHtml(node.description) : '<span class="empty">no description</span>'}</div>
    <div class="tags">\${(node.tags||[]).map(tag=>\`<span class="tag">\${escapeHtml(tag)}</span>\`).join("")}</div>
    \${relationBlock("Links to", outgoing[id])}
    \${relationBlock("Cited by", incoming[id])}
    <div class="section"><h3>Source</h3><a href="\${escapeAttr(node.href)}">\${escapeHtml(node.href)}</a></div>
    <div class="body">\${bodyHtml}</div>\`;
  side.querySelectorAll("[data-go]").forEach(link=>{
    link.addEventListener("click",(event)=>{event.preventDefault();select(link.getAttribute("data-go"));});
  });
}

function applyFilter(){
  const query=search.value.trim().toLowerCase();
  const selectedType=typeSelect.value;
  cy.nodes().forEach(node=>{
    const data=node.data();
    const haystack=[data.title,data.type,data.description,(data.tags||[]).join(" "),data.id].join(" ").toLowerCase();
    const matchQuery=!query || haystack.includes(query);
    const matchType=!selectedType || data.type===selectedType;
    const matchLegend=!hiddenTypes.has(data.type);
    node.style("display", matchQuery && matchType && matchLegend ? "element" : "none");
  });
  cy.edges().forEach(edge=>{
    const visible=edge.source().style("display") !== "none" && edge.target().style("display") !== "none";
    edge.style("display", visible ? "element" : "none");
  });
}

function select(id){
  const node=cy.getElementById(id);
  if(!node.length) return;
  showNode(id);
  cy.elements().removeClass("hl").addClass("dim");
  const neighborhood=node.closedNeighborhood();
  neighborhood.removeClass("dim");
  node.addClass("hl");
  cy.animate({center:{eles:node},duration:250});
}

cy.on("tap","node",event=>select(event.target.id()));
cy.on("tap",event=>{if(event.target===cy)cy.elements().removeClass("dim hl");});
applyFilter();
</script>
</body>
</html>`;
}

async function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(String(error.message ?? error));
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
  const { nodes, edges } = await build(bundlePath, yaml, args.maxBody);
  const outPath = path.resolve(args.out ?? path.join(bundlePath, "viz.html"));
  const title = args.title ?? `${path.basename(path.dirname(bundlePath))}/${path.basename(bundlePath)}`;
  const html = await renderHtml({
    title,
    sourceLink: args.link,
    layout: args.layout,
    nodes,
    edges,
    bundleName: `${path.basename(path.dirname(bundlePath))}/${path.basename(bundlePath)}`,
  });
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, html, "utf8");
  console.log(`rendered ${nodes.length} concepts, ${edges.length} links -> ${outPath}`);
}

await main();
