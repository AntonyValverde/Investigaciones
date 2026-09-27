// scripts/generate-icons.mjs — genera logo192/512 y og-image.png a partir del monograma
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createCanvas, GlobalFonts, loadImage } from "@napi-rs/canvas";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pub = (f) => path.join(root, "public", f);
const font = (pkg, file) => path.join(root, "node_modules", "@fontsource-variable", pkg, "files", file);

GlobalFonts.registerFromPath(font("fraunces", "fraunces-latin-standard-normal.woff2"), "Fraunces");
GlobalFonts.registerFromPath(font("jetbrains-mono", "jetbrains-mono-latin-wght-normal.woff2"), "JetBrains Mono");
GlobalFonts.registerFromPath(font("inter", "inter-latin-wght-normal.woff2"), "Inter");

const svg = await readFile(pub("favicon.svg"));
const mark = await loadImage(svg);

for (const size of [192, 512]) {
  const c = createCanvas(size, size);
  c.getContext("2d").drawImage(mark, 0, 0, size, size);
  await writeFile(pub(`logo${size}.png`), await c.encode("png"));
}

// Open Graph 1200×630
const W = 1200, H = 630;
const c = createCanvas(W, H);
const ctx = c.getContext("2d");
ctx.fillStyle = "#07090f";
ctx.fillRect(0, 0, W, H);

const glow = (x, y, r, color) => {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color);
  g.addColorStop(1, "transparent");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
};
glow(160, 80, 520, "rgba(94,234,212,0.22)");
glow(1080, 520, 560, "rgba(167,139,250,0.2)");

// red de nodos decorativa (determinista)
let seed = 7;
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const pts = Array.from({ length: 70 }, () => [rand() * W, rand() * H]);
ctx.lineWidth = 1;
for (let i = 0; i < pts.length; i++)
  for (let j = i + 1; j < pts.length; j++) {
    const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]);
    if (d < 150) {
      ctx.strokeStyle = `rgba(94,234,212,${(1 - d / 150) * 0.25})`;
      ctx.beginPath();
      ctx.moveTo(...pts[i]);
      ctx.lineTo(...pts[j]);
      ctx.stroke();
    }
  }
ctx.fillStyle = "rgba(94,234,212,0.6)";
for (const [x, y] of pts) {
  ctx.beginPath();
  ctx.arc(x, y, 2, 0, Math.PI * 2);
  ctx.fill();
}

ctx.drawImage(mark, 80, 80, 88, 88);
ctx.fillStyle = "#a3acbd";
ctx.font = "500 22px 'JetBrains Mono'";
ctx.fillText("ARCHIVO DE INVESTIGACIÓN · 2019 — 2024", 80, 250);
ctx.fillStyle = "#e8ecf4";
ctx.font = "400 76px Fraunces";
ctx.fillText("Tecnología, sociedad y", 76, 350);
ctx.fillText("futuro en Costa Rica", 76, 436);
ctx.fillStyle = "#a3acbd";
ctx.font = "400 28px Inter";
ctx.fillText("Antony Valverde Rojas · Universidad Nacional de Costa Rica", 80, 530);

await writeFile(pub("og-image.png"), await c.encode("png"));
console.log("✓ logo192.png, logo512.png, og-image.png");
