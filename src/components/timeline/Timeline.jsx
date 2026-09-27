// src/components/timeline/Timeline.jsx — cronología de entregas de 2024
import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { DOCUMENTS, formatDate } from "../../data/documents";
import Reveal from "../ui/Reveal";
import styles from "./Timeline.module.css";

// Primero los de fecha exacta en orden cronológico; al final los que solo tienen año
const ITEMS = [...DOCUMENTS].sort((a, b) => {
  const pa = a.date.length > 4, pb = b.date.length > 4;
  if (pa !== pb) return pa ? -1 : 1;
  return a.date.localeCompare(b.date) || a.number - b.number;
});

export default function Timeline({ onOpen }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <section id="cronologia" data-section="cronologia" className={styles.section} aria-labelledby="cron-title">
      <div className="container">
        <Reveal className={styles.head}>
          <p className="eyebrow">Cronología</p>
          <h2 id="cron-title" className={styles.heading}>
            Un año de investigación
          </h2>
          <p className={styles.lead}>
            Cada entrega, en el orden en que fue escrita durante 2024. Los documentos analizan el periodo 2019–2024 en Costa Rica.
          </p>
        </Reveal>

        <div ref={ref} className={styles.track}>
          <div className={styles.rail} aria-hidden="true">
            <motion.div className={styles.railFill} style={{ scaleY }} />
          </div>
          <ol className={styles.list}>
          {ITEMS.map((doc, i) => (
            <motion.li
              key={doc.id}
              className={styles.item}
              data-cat={doc.category}
              data-side={i % 2 ? "right" : "left"}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.span
                className={styles.node}
                aria-hidden="true"
                initial={{ scale: 0.4 }}
                whileInView={{ scale: 1 }}
                viewport={{ amount: 1, margin: "0px 0px -40% 0px" }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
              />
              <button type="button" className={styles.card} onClick={(e) => onOpen(doc.slug, e.currentTarget)}>
                <time dateTime={doc.date} className={styles.date}>
                  {doc.date.length > 4 ? formatDate(doc.date) : `${doc.date} · fecha sin precisar`}
                </time>
                <span className={styles.code}>{doc.code}</span>
                <span className={styles.title}>{doc.title}</span>
                <span className={styles.course}>{doc.course}</span>
                <ArrowUpRight size={18} className={styles.arrow} aria-hidden="true" />
              </button>
            </motion.li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
