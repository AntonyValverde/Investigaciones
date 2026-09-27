// src/components/layout/Nav.jsx
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { Monitor, Moon, Sun } from "lucide-react";
import { lockScroll } from "../../lib/scroll";
import { DESKTOP_NAV, useMediaQuery } from "../../hooks/useMediaQuery";
import styles from "./Nav.module.css";

export const NAV_LINKS = [
  { id: "sintesis", label: "Síntesis" },
  { id: "investigacion", label: "Investigaciones" },
  { id: "articulo", label: "Artículos" },
  { id: "cronologia", label: "Cronología" },
  { id: "sobre-mi", label: "Sobre mí" },
];

const THEME_META = {
  system: { Icon: Monitor, label: "Tema: sistema" },
  light: { Icon: Sun, label: "Tema: claro" },
  dark: { Icon: Moon, label: "Tema: oscuro" },
};

export function Logo() {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    show: (i) => ({ pathLength: 1, opacity: 1, transition: { duration: 1.1, delay: 0.15 + i * 0.25, ease: [0.65, 0, 0.35, 1] } }),
  };
  return (
    <svg className={styles.logoMark} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="av-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--accent)" />
          <stop offset="1" stopColor="var(--c-sintesis)" />
        </linearGradient>
      </defs>
      <motion.path d="M12 48 L23 16 L34 48 M16.5 36 H29.5" variants={draw} custom={0} initial="hidden" animate="show" />
      <motion.path d="M34 16 L43 48 L52 16" variants={draw} custom={1} initial="hidden" animate="show" />
    </svg>
  );
}

export default function Nav({ active, onNavigate, theme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const desktop = useMediaQuery(DESKTOP_NAV);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    if (menuOpen) return;
    if (y > 320 && y > prev + 2) setHidden(true);
    else if (y < prev - 2 || y <= 320) setHidden(false);
  });

  useEffect(() => {
    document.documentElement.style.setProperty("--nav-offset", hidden ? "0px" : "var(--nav-h)");
  }, [hidden]);

  useEffect(() => {
    if (desktop) setMenuOpen(false);
  }, [desktop]);

  useEffect(() => {
    lockScroll(menuOpen);
    if (!menuOpen) return;
    menuRef.current?.querySelector("a")?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const go = (e, id) => {
    e.preventDefault();
    setMenuOpen(false);
    onNavigate(id);
  };

  const { Icon, label } = THEME_META[theme.pref];
  const activeCat = ["sintesis", "investigacion", "articulo"].includes(active) ? active : undefined;

  return (
    <>
      <header
        className={styles.header}
        data-scrolled={scrolled || undefined}
        data-hidden={hidden || undefined}
        data-cat={activeCat}
      >
        <nav className={`container ${styles.inner}`} aria-label="Principal">
          <a href="#inicio" className={styles.logo} onClick={(e) => go(e, "inicio")}>
            <Logo />
            <span className={styles.logoText}>
              Antony Valverde<span className={styles.logoDot}>.</span>
            </span>
          </a>

          {desktop && (
            <ul className={styles.links}>
              {NAV_LINKS.map((l) => (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    className={styles.link}
                    aria-current={active === l.id ? "location" : undefined}
                    onClick={(e) => go(e, l.id)}
                  >
                    {active === l.id && (
                      <motion.span
                        layoutId="nav-pill"
                        className={styles.pill}
                        data-cat={activeCat}
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className={styles.linkText}>{l.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}

          <div className={styles.actions}>
            <button type="button" className={styles.iconBtn} onClick={theme.cycle} aria-label={`${label}. Cambiar tema`} title={label}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme.pref}
                  initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.25 }}
                  style={{ display: "inline-flex" }}
                >
                  <Icon size={18} aria-hidden="true" />
                </motion.span>
              </AnimatePresence>
            </button>

            {!desktop && (
              <button
                ref={toggleRef}
                type="button"
                className={styles.burger}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
                onClick={() => setMenuOpen((o) => !o)}
                data-open={menuOpen || undefined}
              >
                <span />
                <span />
              </button>
            )}
          </div>
        </nav>
        <motion.div className={styles.progress} style={{ scaleX: progress }} aria-hidden="true" />
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            className={styles.menu}
            initial={{ clipPath: "circle(0% at calc(100% - 40px) 36px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 40px) 36px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 40px) 36px)" }}
            transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
            onClick={(e) => e.target === e.currentTarget && setMenuOpen(false)}
          >
            <p className="eyebrow">Navegación</p>
            <ul>
              {NAV_LINKS.map((l, i) => (
                <motion.li
                  key={l.id}
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.18 + i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
                  exit={{ opacity: 0, y: 12, transition: { duration: 0.15 } }}
                >
                  <a href={`#${l.id}`} onClick={(e) => go(e, l.id)} aria-current={active === l.id ? "location" : undefined}>
                    <span className={styles.menuIndex}>0{i + 1}</span>
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
