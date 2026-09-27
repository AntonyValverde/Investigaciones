// src/components/layout/Footer.jsx
import { ArrowUpRight } from "lucide-react";
import { SITE } from "../../data/site";
import Magnetic from "../ui/Magnetic";
import Reveal from "../ui/Reveal";
import { Logo, NAV_LINKS } from "./Nav";
import styles from "./Footer.module.css";

export default function Footer({ onNavigate }) {
  const go = (e, id) => {
    e.preventDefault();
    onNavigate(id);
  };

  return (
    <footer className={styles.footer}>
      <div className="container">
        <Reveal className={styles.cta}>
          <p className="eyebrow">Contacto</p>
          <h2 className={styles.ctaTitle}>¿Colaboramos en una investigación?</h2>
          <Magnetic strength={12}>
            <a className={styles.ctaBtn} href={`mailto:${SITE.email}`}>
              Escríbeme <ArrowUpRight size={20} aria-hidden="true" />
            </a>
          </Magnetic>
        </Reveal>

        <div className={styles.bottom}>
          <a href="#inicio" className={styles.brand} onClick={(e) => go(e, "inicio")} aria-label="Volver al inicio">
            <Logo />
          </a>
          <nav aria-label="Pie de página">
            <ul className={styles.links}>
              {NAV_LINKS.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} onClick={(e) => go(e, l.id)}>
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={SITE.links.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={SITE.links.github} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
            </ul>
          </nav>
          <p className={styles.copy}>
            © {new Date().getFullYear()} {SITE.name} · Hecho en Costa Rica
          </p>
        </div>
      </div>
    </footer>
  );
}
