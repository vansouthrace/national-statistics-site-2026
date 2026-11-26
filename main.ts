// NusaStat hand-in program (Node 22+, standard library only).
//
// What it does: takes the static site in app/ and the renders in
// screenshots/ that sit next to this file, copies them into the output
// directory, and writes output/dossier.json — the summary the make.fun
// judge reads (screenshots, first-load files and bytes, and the source).
// Run it outside the grader with MAKEFUN_OUTPUT_DIR set:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Inside the grader the output directory is /output.

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = fileURLToPath(new URL(".", import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const appDir = join(repoRoot, "app");
const shotsDir = join(repoRoot, "screenshots");

function countShots(dir) {
  if (!existsSync(dir)) return 0;
  return readdirSync(dir).filter((name) => {
    const full = join(dir, name);
    return statSync(full).isFile() && !name.startsWith(".");
  }).length;
}

if (!existsSync(join(appDir, "index.html"))) {
  throw new Error("app/index.html is missing, nothing to hand in");
}
const shotCount = countShots(shotsDir);
if (shotCount < 3 || shotCount > 4) {
  throw new Error(`expected 3 or 4 screenshots, found ${shotCount}`);
}

mkdirSync(outDir, { recursive: true });
// Clear stale copies first so a second run never mixes old and new files.
rmSync(join(outDir, "app"), { recursive: true, force: true });
rmSync(join(outDir, "screenshots"), { recursive: true, force: true });
cpSync(appDir, join(outDir, "app"), { recursive: true });
cpSync(shotsDir, join(outDir, "screenshots"), { recursive: true });

const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outDir, "dossier.json"), dossier);
console.log(`handed in ${shotCount} screenshots, dossier ${dossier.length} bytes`);
