// src/components/viewer/Viewer.jsx
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useDragControls } from "motion/react";
import { ArrowLeft, ArrowRight, Download, ExternalLink, Link2, X } from "lucide-react";
import { DOCUMENTS, formatDate, getDocById, getDocBySlug } from "../../data/documents";
import { lockScroll } from "../../lib/scroll";
import { MOBILE, useMediaQuery } from "../../hooks/useMediaQuery";
import { copyText, useToast } from "../ui/Toast";
import { docLink, formatSize } from "../card/DocCard";
import styles from "./Viewer.module.css";

const EASE = [0.16, 1, 0.3, 1];

// Chrome en Android e iOS no muestran PDFs dentro de un iframe
const canEmbedPdf = () => navigator.pdfViewerEnabled !== false;

function useFocusTrap(ref, active) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e) => {
      if (e.key !== "Tab" || !ref.current) return;
      const items = ref.current.querySelectorAll('a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])');
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [ref, active]);
}

function neighbours(doc) {
  const i = DOCUMENTS.indexOf(doc);
  return {
    index: i,
    prev: DOCUMENTS[(i - 1 + DOCUMENTS.length) % DOCUMENTS.length],
    next: DOCUMENTS[(i + 1) % DOCUMENTS.length],
  };
}

function metaLine(doc) {
  return [doc.date && formatDate(doc.date), doc.pages && `${doc.pages} págs`, doc.sizeKB && formatSize(doc.sizeKB)]
    .filter(Boolean)
    .join(" · ");
}

function Related({ doc, onNavigate }) {
  const related = doc.related.map(getDocById).filter(Boolean);
  if (!related.length) return null;
  return (
    <div className={styles.related}>
      <span className="eyebrow">Ver también</span>
      {related.map((r) => (
        <button key={r.id} type="button" data-cat={r.category} className={styles.relatedBtn} onClick={() => onNavigate(r.slug)}>
          <i aria-hidden="true" /> {r.code} · {r.format === "Documento" ? (r.category === "articulo" ? "versión artículo" : "versión completa") : r.format}
        </button>
      ))}
    </div>
  );
}

// Geometría del panel; debe coincidir con .panel en Viewer.module.css
const PANEL_MAX_W = 1440;
function panelRect() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const inset = Math.min(40, Math.max(12, vw * 0.03));
  const width = Math.min(vw - inset * 2, PANEL_MAX_W);
  return { left: (vw - width) / 2, top: inset, width, height: vh - inset * 2 };
}

// Estado inicial para que el panel "crezca" desde la tarjeta de origen (FLIP)
function flipFrom(origin) {
  if (!origin?.width) return { opacity: 0, scale: 0.96, y: 24 };
  const p = panelRect();
  return {
    opacity: 0,
    x: origin.left + origin.width / 2 - (p.left + p.width / 2),
    y: origin.top + origin.height / 2 - (p.top + p.height / 2),
    scaleX: origin.width / p.width,
    scaleY: origin.height / p.height,
  };
}

function Modal({ doc, origin, onClose, onNavigate }) {
  const panel = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [from] = useState(() => flipFrom(origin));
  const toast = useToast();
  const { index, prev, next } = neighbours(doc);
  useFocusTrap(panel, true);

  useEffect(() => setLoaded(false), [doc.slug]);

  const copy = async () => toast((await copyText(docLink(doc))) ? "Enlace copiado" : "No se pudo copiar el enlace");

  return (
    <motion.div
      ref={panel}
      className={styles.panel}
      data-cat={doc.category}
      role="dialog"
      aria-modal="true"
      aria-labelledby="viewer-title"
      initial={from}
      animate={{ opacity: 1, x: 0, y: 0, scaleX: 1, scaleY: 1, scale: 1 }}
      exit={{ ...from, transition: { duration: 0.35, ease: [0.65, 0, 0.35, 1] } }}
      transition={{ duration: 0.5, ease: EASE, opacity: { duration: 0.25 } }}
      style={{ transformOrigin: "50% 50%" }}
    >
      <header className={styles.bar}>
        <div className={styles.barInfo}>
          <span className={styles.code}>
            <i aria-hidden="true" /> {doc.code}
            <span className={styles.counter}>
              {index + 1} / {DOCUMENTS.length}
            </span>
          </span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.h2
              key={doc.slug}
              id="viewer-title"
              className={styles.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {doc.title}
            </motion.h2>
          </AnimatePresence>
          <p className={styles.meta}>{metaLine(doc)}</p>
        </div>
        <div className={styles.barActions}>
          <button type="button" className={styles.icon} onClick={() => onNavigate(prev.slug)} aria-label={`Anterior: ${prev.title}`} title="Anterior (←)">
            <ArrowLeft size={18} aria-hidden="true" />
          </button>
          <button type="button" className={styles.icon} onClick={() => onNavigate(next.slug)} aria-label={`Siguiente: ${next.title}`} title="Siguiente (→)">
            <ArrowRight size={18} aria-hidden="true" />
          </button>
          <span className={styles.sep} aria-hidden="true" />
          <button type="button" className={styles.icon} onClick={copy} aria-label="Copiar enlace" title="Copiar enlace">
            <Link2 size={18} aria-hidden="true" />
          </button>
          <a className={styles.icon} href={doc.file} download aria-label="Descargar PDF" title="Descargar">
            <Download size={18} aria-hidden="true" />
          </a>
          <a className={styles.icon} href={doc.file} target="_blank" rel="noopener noreferrer" aria-label="Abrir en pestaña nueva" title="Abrir en pestaña nueva">
            <ExternalLink size={18} aria-hidden="true" />
          </a>
          <button type="button" className={`${styles.icon} ${styles.close}`} onClick={onClose} aria-label="Cerrar visor" title="Cerrar (Esc)" data-autofocus>
            <X size={20} aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className={styles.frame}>
        {!loaded && (
          <div className={styles.loading} aria-hidden="true">
            <img src={doc.thumb} alt="" />
            <span className={styles.spinner} />
          </div>
        )}
        <iframe key={doc.slug} src={`${doc.file}#view=FitH`} title={`PDF: ${doc.title}`} onLoad={() => setLoaded(true)} />
      </div>

      <Related doc={doc} onNavigate={onNavigate} />
    </motion.div>
  );
}

function Sheet({ doc, onClose, onNavigate }) {
  const panel = useRef(null);
  const drag = useDragControls();
  const { prev, next } = neighbours(doc);
  useFocusTrap(panel, true);

  return (
    <motion.div
      ref={panel}
      className={styles.sheet}
      data-cat={doc.category}
      role="dialog"
      aria-modal="true"
      aria-labelledby="viewer-title"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%", transition: { duration: 0.3, ease: [0.65, 0, 0.35, 1] } }}
      transition={{ type: "spring", stiffness: 320, damping: 34 }}
      drag="y"
      dragControls={drag}
      dragListener={false}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.6 }}
      onDragEnd={(_, info) => (info.offset.y > 110 || info.velocity.y > 600) && onClose()}
    >
      <div className={styles.grabber} onPointerDown={(e) => drag.start(e)} aria-hidden="true">
        <div className={styles.handle} />
      </div>
      <button type="button" className={`${styles.icon} ${styles.sheetClose}`} onClick={onClose} aria-label="Cerrar" data-autofocus>
        <X size={20} aria-hidden="true" />
      </button>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={doc.slug} className={styles.sheetBody} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
          <div className={styles.sheetThumb}>
            <img src={doc.thumb} srcSet={`${doc.thumb} 1x, ${doc.thumb2x} 2x`} alt={`Portada de «${doc.title}»`} draggable="false" />
          </div>
          <span className={styles.code}>
            <i aria-hidden="true" /> {doc.code}
          </span>
          <h2 id="viewer-title" className={styles.title}>
            {doc.title}
          </h2>
          <p className={styles.meta}>{metaLine(doc)}</p>
          <p className={styles.summary}>{doc.summary}</p>
          <p className={styles.authors}>{doc.authors.join(" · ")}</p>

          <div className={styles.sheetActions}>
            <a className={styles.primary} href={doc.file} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={18} aria-hidden="true" /> Abrir PDF
            </a>
            <a className={styles.secondary} href={doc.file} download>
              <Download size={18} aria-hidden="true" /> Descargar
            </a>
          </div>
          <Related doc={doc} onNavigate={onNavigate} />
        </motion.div>
      </AnimatePresence>

      <nav className={styles.sheetNav} aria-label="Otros documentos">
        <button type="button" onClick={() => onNavigate(prev.slug)}>
          <ArrowLeft size={16} aria-hidden="true" /> Anterior
        </button>
        <button type="button" onClick={() => onNavigate(next.slug)}>
          Siguiente <ArrowRight size={16} aria-hidden="true" />
        </button>
      </nav>
    </motion.div>
  );
}

export default function Viewer({ slug, origin, onClose, onNavigate }) {
  const mobile = useMediaQuery(MOBILE);
  const doc = slug ? getDocBySlug(slug) : null;
  const returnFocus = useRef(null);
  const open = Boolean(doc);

  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement;
    lockScroll(true);
    requestAnimationFrame(() => document.querySelector("[data-autofocus]")?.focus());
    return () => {
      lockScroll(false);
      const el = returnFocus.current;
      if (el && document.contains(el)) el.focus({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    if (!doc) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.target.tagName === "INPUT") return;
      const { prev, next } = neighbours(doc);
      if (e.key === "ArrowLeft") onNavigate(prev.slug);
      if (e.key === "ArrowRight") onNavigate(next.slug);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [doc, onClose, onNavigate]);

  const sheet = mobile || !canEmbedPdf();

  return (
    <AnimatePresence>
      {doc && (
        <motion.div key="viewer" className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.3 } }}>
          <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
          {sheet ? (
            <Sheet doc={doc} onClose={onClose} onNavigate={onNavigate} />
          ) : (
            <Modal doc={doc} origin={origin} onClose={onClose} onNavigate={onNavigate} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
