// src/data/documents.js
// Fuente única del contenido. Autores, cursos y fechas verificados en la portada de cada PDF.
// `pages`, `sizeKB` y `ratio` vienen de documents.meta.json (npm run thumbs).
import meta from "./documents.meta.json";

const BASE = import.meta.env.BASE_URL;

export const CATEGORIES = [
  {
    id: "sintesis",
    label: "Síntesis",
    short: "SÍN",
    index: "01",
    blurb: "Lecturas críticas que condensan autores y debates clave sobre tecnología y sociedad.",
  },
  {
    id: "investigacion",
    label: "Investigaciones",
    short: "INV",
    index: "02",
    blurb: "Trabajos de investigación sobre el impacto de la tecnología en Costa Rica, 2019–2024.",
  },
  {
    id: "articulo",
    label: "Artículos científicos",
    short: "ART",
    index: "03",
    blurb: "Resultados publicados en formato de artículo académico.",
  },
];

const AUTHORS_BOTH = ["Antony Valverde Rojas", "Jordan Laguna Rodríguez"];
const EIF410 = "EIF-410 Informática y Sociedad";
const EIF413 = "EIF-413 Métodos de Investigación Científica en Informática";

const RAW = [
  {
    id: "sin-01",
    slug: "sintesis-1-sociedad-informacion-digital-control",
    category: "sintesis",
    number: 1,
    title: "Sociedad de la información, sociedad digital, sociedad de control",
    summary:
      "Recorrido por cómo la informática transformó la vida cotidiana y por las tensiones entre información, vigilancia y control social.",
    date: "2024-08-02",
    course: EIF410,
    authors: AUTHORS_BOTH,
    tags: ["Sociedad digital", "TIC", "Control social"],
  },
  {
    id: "sin-02",
    slug: "sintesis-2-contaminacion-agua-metales-pesados",
    category: "sintesis",
    number: 2,
    title: "Contaminación del agua por metales pesados",
    summary:
      "Métodos de análisis y tecnologías de remoción de metales pesados en fuentes hídricas, y su impacto en la salud y el ambiente.",
    date: "2024",
    course: EIF413,
    authors: ["Antony Valverde Rojas"],
    tags: ["Medio ambiente", "Agua", "Tecnologías de remoción"],
  },
  {
    id: "sin-03",
    slug: "sintesis-3-tecnologias-digitales-desafios",
    category: "sintesis",
    number: 3,
    title: "De tecnologías digitales y usos: un recorrido por los desafíos actuales",
    summary:
      "Cómo la tecnología transformó la comunicación, la cultura y el acceso a la información, y los retos que eso plantea hoy.",
    date: "2024-10-04",
    course: EIF410,
    authors: AUTHORS_BOTH,
    tags: ["Comunicación", "Cultura digital", "Brecha digital"],
  },
  {
    id: "inv-01",
    slug: "investigacion-1-imas-desigualdad-acceso-tecnologia",
    category: "investigacion",
    number: 1,
    title: "El IMAS frente a la desigualdad en el acceso a la tecnología en Costa Rica",
    summary:
      "Papel del Instituto Mixto de Ayuda Social para combatir la brecha digital: beneficios, alfabetización digital y estrategias de mitigación.",
    period: "2019–2024",
    date: "2024-08-16",
    course: EIF410,
    authors: AUTHORS_BOTH,
    tags: ["Brecha digital", "IMAS", "Inclusión"],
  },
  {
    id: "inv-02",
    slug: "investigacion-2-presentacion-disenos-investigacion",
    category: "investigacion",
    format: "Presentación",
    number: 2,
    title: "Diseños de investigación",
    summary:
      "Objetivos, enfoque cuantitativo, cualitativo o mixto, alcance, hipótesis, variables e instrumentos de una investigación científica.",
    date: "2024",
    course: EIF413,
    authors: ["Antony Valverde Rojas"],
    tags: ["Metodología", "Investigación científica"],
  },
  {
    id: "inv-03",
    slug: "investigacion-3-ia-pymes-costa-rica-2021-2023",
    category: "investigacion",
    number: 3,
    title: "Inteligencia artificial en el desarrollo laboral de las Pymes de Costa Rica",
    summary:
      "Investigación cualitativa sobre la adopción de IA en Pymes costarricenses: automatización de tareas, recursos humanos y finanzas.",
    period: "2021–2023",
    date: "2024-06-07",
    course: EIF413,
    authors: AUTHORS_BOTH,
    tags: ["Inteligencia artificial", "Pymes", "Empleo"],
    related: ["art-01"],
  },
  {
    id: "inv-04",
    slug: "investigacion-4-vision-computacional-dermatologia",
    category: "investigacion",
    number: 4,
    title: "Visión computacional aplicada al análisis de imágenes dermatológicas",
    summary:
      "Librerías como PyTorch, Keras, TensorFlow y NumPy en el diagnóstico dermatológico, y su impacto en la medicina y la sociedad.",
    date: "2024-08-24",
    course: EIF410,
    authors: AUTHORS_BOTH,
    tags: ["Visión computacional", "Salud", "Machine learning"],
  },
  {
    id: "inv-05",
    slug: "investigacion-5-tecnologia-digital-educacion",
    category: "investigacion",
    number: 5,
    title: "Tecnología digital para el desarrollo de habilidades en la educación costarricense",
    summary:
      "Desafíos, antecedentes y recursos digitales en la educación: pedagogía y evaluación digital en Costa Rica.",
    period: "2019–2024",
    date: "2024-08-24",
    course: EIF410,
    authors: AUTHORS_BOTH,
    tags: ["Educación", "Tecnología digital", "Pedagogía"],
  },
  {
    id: "inv-06",
    slug: "investigacion-6-tecnologia-inteligente-agricultura",
    category: "investigacion",
    number: 6,
    title: "Tecnología inteligente para el desarrollo industrial del sector agrícola",
    summary:
      "De la agricultura de precisión a la agricultura 5.0: aplicación de tecnología inteligente en el agro costarricense.",
    period: "2019–2024",
    date: "2024-10-25",
    course: EIF410,
    authors: AUTHORS_BOTH,
    tags: ["Agricultura", "IoT", "Industria"],
  },
  {
    id: "art-01",
    slug: "articulo-1-ia-pymes-costa-rica-2021-2023",
    category: "articulo",
    number: 1,
    featured: true,
    title: "Uso de la inteligencia artificial en el desarrollo laboral en las Pymes de Costa Rica",
    summary:
      "La adopción de IA en las Pymes costarricenses está siendo positiva: automatiza tareas, impulsa el crecimiento económico y transforma recursos humanos y finanzas.",
    period: "2021–2023",
    date: "2024-06-04",
    course: EIF413,
    authors: AUTHORS_BOTH,
    tags: ["Inteligencia artificial", "Pymes", "Artículo científico"],
    related: ["inv-03"],
  },
];

const categoryById = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

export const DOCUMENTS = RAW.map((d) => ({
  format: "Documento",
  related: [],
  ...d,
  ...meta[d.slug],
  code: `${categoryById[d.category].short} · ${String(d.number).padStart(2, "0")}`,
  file: `${BASE}documents/${d.slug}.pdf`,
  thumb: `${BASE}thumbnails/${d.slug}.webp`,
  thumb2x: `${BASE}thumbnails/${d.slug}@2x.webp`,
}));

export const getCategory = (id) => categoryById[id];
export const getDocBySlug = (slug) => DOCUMENTS.find((d) => d.slug === slug);
export const getDocById = (id) => DOCUMENTS.find((d) => d.id === id);

export const ALL_TAGS = [...new Set(DOCUMENTS.flatMap((d) => d.tags))];

const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
export function formatDate(date) {
  if (!date) return "";
  const [y, m, d] = date.split("-");
  if (!m) return y;
  return `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`;
}
