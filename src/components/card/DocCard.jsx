// src/components/card/DocCard.jsx
import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { BookOpen, Download, Link2 } from "lucide-react";
import { formatDate } from "../../data/documents";
import { highlightParts } from "../../lib/search";
import { FINE_POINTER, useMediaQuery } from "../../hooks/useMediaQuery";
import { copyText, useToast } from "../ui/Toast";
import styles from "./DocCard.module.css";

const TILT = { stiffness: 150, damping: 15, mass: 0.1 };

export const formatSize = (kb) => (kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`);

export function docLink(doc) {
  return `${window.location.origin}${window.location.pathname}#/doc/${doc.slug}`;
}

function Highlight({ text, query }) {
  return highlightParts(text, query).map((p, i) => (p.hit ? <mark key={i}>{p.text}</mark> : p.text));
}

export default function DocCard({ doc, query = "", onOpen }) {
  const ref = useRef(null);
  const fine = useMediaQuery(FINE_POINTER);
  const reduced = useReducedMotion();
  const toast = useToast();
  const rx = useSpring(useMotionValue(0), TILT);
  const ry = useSpring(useMotionValue(0), TILT);
  const interactive = fine && !reduced;

  const onMove = (e) => {
    if (!interactive) return;
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    // tarjetas anchas giran menos
    const k = r.width > 520 ? 2.5 : 6;
    ry.set((px - 0.5) * 2 * k);
    rx.set((0.5 - py) * 2 * k);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  const copy = async () => {
    const ok = await copyText(docLink(doc));
    toast(ok ? "Enlace copiado" : "No se pudo copiar el enlace");
  };

  const meta = [doc.period && `Periodo ${doc.period}`, doc.pages && `${doc.pages} págs`, doc.sizeKB && formatSize(doc.sizeKB)]
    .filter(Boolean)
    .join(" · ");
  const extraTags = doc.tags.length - 3;

  return (
    <motion.article
      ref={ref}
      className={styles.card}
      data-cat={doc.category}
      data-featured={doc.featured || undefined}
      data-interactive={interactive || undefined}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      whileTap={fine ? undefined : { scale: 0.98 }}
    >
      <div className={styles.thumb}>
        <img
          src={doc.thumb}
          srcSet={`${doc.thumb} 600w, ${doc.thumb2x} 1200w`}
          sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
          alt={`Portada de «${doc.title}»`}
          width="600"
          height={Math.round(600 * (doc.ratio || 1.294))}
          loading="lazy"
          decoding="async"
        />
        {doc.featured && <span className={styles.flag}>Publicación destacada</span>}
      </div>

      <div className={styles.body}>
        <div className={styles.top}>
          <span className={styles.code}>
            <i aria-hidden="true" />
            {doc.code}
          </span>
          {doc.format !== "Documento" && <span className={styles.format}>{doc.format}</span>}
          {doc.date && (
            <time className={styles.date} dateTime={doc.date}>
              {formatDate(doc.date)}
            </time>
          )}
        </div>

        <h3 className={styles.title}>
          <Highlight text={doc.title} query={query} />
        </h3>
        <p className={styles.summary}>
          <Highlight text={doc.summary} query={query} />
        </p>

        <ul className={styles.tags} aria-label="Etiquetas">
          {doc.tags.slice(0, 3).map((t) => (
            <li key={t}>
              <Highlight text={t} query={query} />
            </li>
          ))}
          {extraTags > 0 && <li>+{extraTags}</li>}
        </ul>

        <div className={styles.footer}>
          <p className={styles.meta}>{meta}</p>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.read}
              onClick={() => onOpen(doc.slug, ref.current)}
              aria-label={`Leer «${doc.title}» (PDF${doc.pages ? `, ${doc.pages} páginas` : ""})`}
            >
              <BookOpen size={16} aria-hidden="true" /> Leer
            </button>
            <a className={styles.iconAction} href={doc.file} download aria-label={`Descargar «${doc.title}»`} title="Descargar">
              <Download size={17} aria-hidden="true" />
            </a>
            <button type="button" className={styles.iconAction} onClick={copy} aria-label={`Copiar enlace de «${doc.title}»`} title="Copiar enlace">
              <Link2 size={17} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
