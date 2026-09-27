// scripts/generate-thumbnails.mjs
// Renderiza la portada de cada PDF de public/documents a WebP (1x y 2x)
// y escribe páginas + tamaño en src/data/documents.meta.json.
import { readdir, readFile, writeFile, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const docsDir = path.join(root, "public", "documents");
const thumbsDir = path.join(root, "public", "thumbnails");
const metaFile = path.join(root, "src", "data", "documents.meta.json");
const printText = process.argv.includes("--text");

const WIDTHS = { "": 600, "@2x": 1200 };

await mkdir(thumbsDir, { recursive: true });

const files = (await readdir(docsDir)).filter((f) => f.endsWith(".pdf")).sort();
const meta = {};

for (const file of files) {
  const slug = file.replace(/\.pdf$/, "");
  const data = new Uint8Array(await readFile(path.join(docsDir, file)));
  const task = getDocument({ data, verbosity: 0 });
  const pdf = await task.promise;
  const page = await pdf.getPage(1);
  const base = page.getViewport({ scale: 1 });

  for (const [suffix, width] of Object.entries(WIDTHS)) {
    const viewport = page.getViewport({ scale: width / base.width });
    const { canvas, context } = pdf.canvasFactory.create(
      Math.round(viewport.width),
      Math.round(viewport.height)
    );
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: context, viewport, canvas }).promise;
    await writeFile(path.join(thumbsDir, `${slug}${suffix}.webp`), await canvas.encode("webp", 82));
  }

  const { size } = await stat(path.join(docsDir, file));
  meta[slug] = {
    pages: pdf.numPages,
    sizeKB: Math.round(size / 1024),
    ratio: +(base.height / base.width).toFixed(4),
  };

  if (printText) {
    let out = "";
    for (let n = 1; n <= Math.min(2, pdf.numPages); n++) {
      const text = await (await pdf.getPage(n)).getTextContent();
      out += text.items.map((i) => i.str).join(" ") + " | ";
    }
    console.log(`\n=== ${slug} ===\n` + out.replace(/\s+/g, " ").slice(0, 1200));
  }
  console.log(`✓ ${slug} (${pdf.numPages} págs, ${meta[slug].sizeKB} KB)`);
  await task.destroy();
}

await writeFile(metaFile, JSON.stringify(meta, null, 2) + "\n");
console.log(`\nMetadatos escritos en ${path.relative(root, metaFile)}`);
