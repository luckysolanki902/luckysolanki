/* ============================================================
   Generates public/resume.pdf from src/resume/resume.html
   using headless Chrome, so the site keeps serving a real PDF
   file while the resume stays editable as HTML.

   Usage: npm run resume:pdf
   ============================================================ */

import { execFileSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const source = path.join(root, "src", "resume", "resume.html");
const output = path.join(root, "public", "resume.pdf");

const chromeCandidates = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium-browser",
];

const chrome = chromeCandidates.find((p) => existsSync(p));
if (!chrome) {
  console.error("No Chrome/Chromium found. Install Google Chrome or add its path to chromeCandidates.");
  process.exit(1);
}

execFileSync(chrome, [
  "--headless",
  "--disable-gpu",
  "--no-pdf-header-footer",
  `--print-to-pdf=${output}`,
  `file://${source}`,
], { stdio: "inherit" });

const kb = (statSync(output).size / 1024).toFixed(1);
console.log(`✓ public/resume.pdf regenerated (${kb} KB) from src/resume/resume.html`);
