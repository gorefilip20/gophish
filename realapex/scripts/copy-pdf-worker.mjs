// Copies the pdf.js worker from pdfjs-dist into /public so the whitepaper
// reader loads it from the app's own origin (no external CDN dependency).
// Runs on `postinstall`; also safe to run manually: `node scripts/copy-pdf-worker.mjs`.
import { copyFile, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

try {
  const require = createRequire(import.meta.url);
  const pkg = require.resolve("pdfjs-dist/package.json");
  const src = join(dirname(pkg), "build", "pdf.worker.min.mjs");
  const dest = join(process.cwd(), "public", "pdf.worker.min.mjs");
  await mkdir(dirname(dest), { recursive: true });
  await copyFile(src, dest);
  console.log("[copy-pdf-worker] copied worker -> public/pdf.worker.min.mjs");
} catch (err) {
  console.warn("[copy-pdf-worker] skipped:", err?.message ?? err);
}
