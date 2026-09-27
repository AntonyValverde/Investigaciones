// src/lib/search.js
export const normalize = (s = "") =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function matchesQuery(doc, query) {
  const q = normalize(query.trim());
  if (!q) return true;
  const haystack = normalize([doc.title, doc.summary, doc.code, ...doc.tags].join(" "));
  return q.split(/\s+/).every((word) => haystack.includes(word));
}

const SORTERS = {
  number: (a, b) => a.number - b.number,
  recent: (a, b) => (b.date || "").localeCompare(a.date || "") || a.number - b.number,
  az: (a, b) => a.title.localeCompare(b.title, "es"),
};

export function filterDocuments(docs, { cat, q, sort }) {
  return docs
    .filter((d) => cat === "all" || d.category === cat)
    .filter((d) => matchesQuery(d, q))
    .sort(SORTERS[sort] || SORTERS.number);
}

// Divide `text` en fragmentos marcando las coincidencias (sin distinguir tildes).
export function highlightParts(text, query) {
  const words = normalize(query.trim()).split(/\s+/).filter(Boolean);
  if (!words.length) return [{ text, hit: false }];
  const norm = normalize(text);
  const hits = new Array(text.length).fill(false);
  for (const w of words) {
    let i = norm.indexOf(w);
    while (i !== -1) {
      hits.fill(true, i, i + w.length);
      i = norm.indexOf(w, i + w.length);
    }
  }
  const parts = [];
  for (let i = 0; i < text.length; i++) {
    const last = parts[parts.length - 1];
    if (last && last.hit === hits[i]) last.text += text[i];
    else parts.push({ text: text[i], hit: hits[i] });
  }
  return parts;
}
