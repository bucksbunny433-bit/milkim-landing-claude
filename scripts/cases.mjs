/**
 * Portfolio checker for src/content/cases.json.
 *
 *   npm run cases          check everything and report
 *   npm run cases -- --fix rewrite w/h from the real files, then check
 *
 * Replacing a portfolio photograph is the most frequent edit this site gets, and the
 * one place it can silently go wrong: a wrong `w`/`h` makes Astro ship the untouched
 * original (a 3 MB build became 53 MB that way), and a filename that does not exist
 * renders an empty card. This finds both before the build does.
 */
import { readFile, writeFile } from "node:fs/promises";
import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA = path.join(ROOT, "src/content/cases.json");
const PHOTOS = path.join(ROOT, "src/assets/portfolio");
const FIX = process.argv.includes("--fix");

const LAYOUTS = ["collage", "pair", "single"];
const SERVICES = { brows: "Брови", correction: "Перекрытие" };

const errors = [];
const warnings = [];
const fixes = [];

const cases = JSON.parse(await readFile(DATA, "utf8"));

if (!Array.isArray(cases)) {
  console.error("cases.json must hold an array.");
  process.exit(1);
}

const seenIds = new Set();
const usedFiles = new Set();

for (const [i, c] of cases.entries()) {
  const at = `#${i + 1} ${c.id ?? "(no id)"}`;

  for (const key of ["id", "service", "serviceTitle", "number", "layout", "frames"]) {
    if (c[key] === undefined) errors.push(`${at}: missing "${key}"`);
  }
  if (seenIds.has(c.id)) errors.push(`${at}: duplicate id`);
  seenIds.add(c.id);

  if (!LAYOUTS.includes(c.layout)) {
    errors.push(`${at}: layout must be one of ${LAYOUTS.join(" / ")}, got "${c.layout}"`);
  }
  if (!SERVICES[c.service]) {
    errors.push(`${at}: service must be "brows" or "correction", got "${c.service}"`);
  } else if (c.serviceTitle !== SERVICES[c.service]) {
    warnings.push(`${at}: serviceTitle is "${c.serviceTitle}", expected "${SERVICES[c.service]}"`);
  }

  const frames = Array.isArray(c.frames) ? c.frames : [];
  const want = c.layout === "pair" ? 2 : 1;
  if (frames.length !== want) {
    errors.push(`${at}: layout "${c.layout}" needs ${want} frame(s), found ${frames.length}`);
  }

  for (const [j, f] of frames.entries()) {
    const where = `${at} frame ${j + 1}`;
    if (!f.file) {
      errors.push(`${where}: missing "file"`);
      continue;
    }
    const abs = path.join(PHOTOS, f.file);
    usedFiles.add(path.resolve(abs));

    if (!existsSync(abs)) {
      errors.push(`${where}: file not found — src/assets/portfolio/${f.file}`);
      continue;
    }

    const { width, height } = await sharp(abs).metadata();
    if (f.w !== width || f.h !== height) {
      if (FIX) {
        f.w = width;
        f.h = height;
        fixes.push(`${where}: w/h set to ${width}x${height}`);
      } else {
        errors.push(
          `${where}: w/h say ${f.w}x${f.h}, the file is ${width}x${height}` +
            ` — run: npm run cases -- --fix`,
        );
      }
    }

    if (c.layout === "pair" && !["before", "after"].includes(f.role)) {
      errors.push(`${where}: a "pair" frame needs "role": "before" or "after"`);
    }
    if (c.layout !== "pair" && f.role) {
      warnings.push(`${where}: "role" only means anything on a "pair"`);
    }
    if (f.focus && !/^-?[\d.]+%?\s+-?[\d.]+%?$/.test(f.focus)) {
      warnings.push(`${where}: "focus" should look like "50% 30%", got "${f.focus}"`);
    }
  }
}

// Photographs sitting in the folders that no case points at. Not an error - the studio
// supplies more frames than a card shows - but worth seeing when a swap went half done.
const onDisk = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(jpe?g|png)$/i.test(name)) onDisk.push(p);
  }
};
if (existsSync(PHOTOS)) walk(PHOTOS);
const unused = onDisk.filter((p) => !usedFiles.has(path.resolve(p)));

if (FIX && fixes.length) {
  await writeFile(DATA, JSON.stringify(cases, null, 2) + "\n", "utf8");
}

const byService = {};
for (const c of cases) (byService[c.service] ??= []).push(c);

console.log("\nMilkim portfolio\n");
for (const [svc, list] of Object.entries(byService)) {
  console.log(`  ${SERVICES[svc] ?? svc} — ${list.length} works`);
  for (const c of list) {
    console.log(
      `    ${String(c.number).padStart(2, "0")}  ${c.layout.padEnd(7)} ` +
        c.frames.map((f) => f.file).join("  +  "),
    );
  }
  console.log("");
}

if (fixes.length) {
  console.log("Fixed:");
  for (const f of fixes) console.log("  " + f);
  console.log("");
}
if (unused.length) {
  console.log("On disk but not shown on the site (fine, just so you know):");
  for (const p of unused) console.log("  " + path.relative(PHOTOS, p));
  console.log("");
}
if (warnings.length) {
  console.log("Warnings:");
  for (const w of warnings) console.log("  " + w);
  console.log("");
}
if (errors.length) {
  console.log("ERRORS — the build will be wrong until these are fixed:");
  for (const e of errors) console.log("  " + e);
  console.log("");
  process.exit(1);
}

console.log(`OK — ${cases.length} works, ${usedFiles.size} photographs, no problems.\n`);
