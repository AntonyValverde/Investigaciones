// src/components/hero/Hero.jsx
import { useEffect } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { SITE } from "../../data/site";
import { ALL_TAGS, CATEGORIES, DOCUMENTS, getDocById } from "../../data/documents";
import { FINE_POINTER, useMediaQuery } from "../../hooks/useMediaQuery";
import Magnetic from "../ui/Magnetic";
import Counter from "../ui/Counter";
import { WordReveal } from "../ui/Reveal";
import styles from "./Hero.module.css";

const years = DOCUMENTS.flatMap((d) => (d.period || "").split("–").map(Number)).filter(Boolean);
const STATS = [
  { value: DOCUMENTS.length, label: "documentos" },
  { value: CATEGORIES.length, label: "categorías" },
  { value: Math.max(...years) - Math.min(...years) + 1, label: "años analizados" },
];

const CLUSTER = ["inv-03", "art-01", "inv-06"].map(getDocById);

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
});

function Cluster({ onOpen }) {
  const fine = useMediaQuery(FINE_POINTER);
  const reduced = useReducedMotion();
  const mx = useSpring(useMotionValue(0), { stiffness: 60, damping: 18 });
  const my = useSpring(useMotionValue(0), { stiffness: 60, damping: 18 });

  useEffect(() => {
    if (!fine || reduced) return;
    const onMove = (e) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [fine, reduced, mx, my]);

  const layers = [
    { rotate: -9, x: "-34%", y: "8%", depth: 18 },
    { rotate: 4, x: "0%", y: "-4%", depth: 34 },
    { rotate: 12, x: "32%", y: "12%", depth: 24 },
  ];

  return (
    <div className={styles.cluster} aria-label="Documentos destacados">
      {CLUSTER.map((doc, i) => (
        <ClusterCard key={doc.id} doc={doc} layer={layers[i]} i={i} mx={mx} my={my} onOpen={onOpen} />
      ))}
    </div>
  );
}

function ClusterCard({ doc, layer, i, mx, my, onOpen }) {
  const tx = useTransform(mx, (v) => v * layer.depth);
  const ty = useTransform(my, (v) => v * layer.depth);
  return (
    <motion.div
      className={styles.clusterSlot}
      style={{ left: `calc(50% + ${layer.x})`, top: `calc(50% + ${layer.y})`, x: tx, y: ty, zIndex: i === 1 ? 3 : 1 }}
      whileHover={{ zIndex: 4 }}
    >
      <motion.button
        type="button"
        className={styles.clusterCard}
        data-cat={doc.category}
        initial={{ opacity: 0, rotate: 0, scale: 0.85, y: 40 }}
        animate={{ opacity: 1, rotate: layer.rotate, scale: 1, y: 0 }}
        transition={{ delay: 0.5 + i * 0.12, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.05, rotate: 0, y: -8, transition: { type: "spring", stiffness: 260, damping: 22 } }}
        onClick={(e) => onOpen(doc.slug, e.currentTarget)}
        aria-label={`Leer «${doc.title}»`}
      >
        <img src={doc.thumb} srcSet={`${doc.thumb} 1x, ${doc.thumb2x} 2x`} alt="" width="600" height={Math.round(600 * doc.ratio)} />
        <span className={styles.clusterTag}>{doc.code}</span>
      </motion.button>
    </motion.div>
  );
}

export default function Hero({ onExplore, onAbout, onOpen }) {
  const wide = useMediaQuery("(min-width: 1024px)");
  const reduced = useReducedMotion();

  return (
    <section id="inicio" data-section="inicio" className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <motion.p className="eyebrow" {...fadeUp(0.05)}>
            <span className={styles.dot} aria-hidden="true" /> {SITE.eyebrow}
          </motion.p>

          <WordReveal as="h1" text={SITE.headline} className={styles.title} delay={0.15} />

          <motion.p className={styles.intro} {...fadeUp(0.55)}>
            {SITE.intro}
          </motion.p>

          <motion.div className={styles.ctas} {...fadeUp(0.7)}>
            <Magnetic>
              <button type="button" className={styles.primary} onClick={onExplore}>
                Explorar documentos <ArrowRight size={18} aria-hidden="true" />
              </button>
            </Magnetic>
            <Magnetic>
              <button type="button" className={styles.secondary} onClick={onAbout}>
                Sobre el autor
              </button>
            </Magnetic>
          </motion.div>

          <motion.dl className={styles.stats} {...fadeUp(0.85)}>
            {STATS.map((s) => (
              <div key={s.label} className={styles.stat}>
                <dt className="eyebrow">{s.label}</dt>
                <dd>
                  <Counter value={s.value} />
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {wide && <Cluster onOpen={onOpen} />}
      </div>

      <motion.div className={styles.marquee} {...fadeUp(1)} data-static={reduced || undefined}>
        <div className={styles.track}>
          {[0, 1].map((copy) => (
            <ul key={copy} aria-hidden={copy === 1 || undefined}>
              {ALL_TAGS.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          ))}
        </div>
      </motion.div>

      <button type="button" className={styles.scrollHint} onClick={onExplore} aria-label="Ir a los documentos">
        <ArrowDown size={16} aria-hidden="true" />
      </button>
    </section>
  );
}
