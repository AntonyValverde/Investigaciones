// src/components/layout/BackToTop.jsx — aparece tras 1.5 pantallas y muestra el progreso de lectura
import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowUp } from "lucide-react";
import { scrollToTop } from "../../lib/scroll";
import styles from "./BackToTop.module.css";

export default function BackToTop() {
  const { scrollY, scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setVisible(y > window.innerHeight * 1.5));

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          className={styles.btn}
          onClick={scrollToTop}
          aria-label="Volver arriba"
          initial={{ opacity: 0, scale: 0.6, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 12 }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
        >
          <svg viewBox="0 0 48 48" className={styles.ring} aria-hidden="true">
            <circle cx="24" cy="24" r="22" className={styles.track} />
            <motion.circle cx="24" cy="24" r="22" className={styles.fill} style={{ pathLength: scrollYProgress }} />
          </svg>
          <ArrowUp size={18} aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
