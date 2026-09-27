// src/components/about/About.jsx
import { Copy, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../ui/BrandIcons";
import { SITE } from "../../data/site";
import { ALL_TAGS } from "../../data/documents";
import Reveal from "../ui/Reveal";
import Magnetic from "../ui/Magnetic";
import { copyText, useToast } from "../ui/Toast";
import styles from "./About.module.css";

const INTERESTS = ALL_TAGS.filter((t) => t !== "Artículo científico").slice(0, 12);

export default function About() {
  const toast = useToast();
  const copyEmail = async () => toast((await copyText(SITE.email)) ? "Correo copiado" : "No se pudo copiar el correo");

  return (
    <section id="sobre-mi" data-section="sobre-mi" className={styles.section} aria-labelledby="about-title">
      <div className={`container ${styles.grid}`}>
        <Reveal className={styles.portrait}>
          <div className={styles.ring}>
            {/* TODO: reemplazar por public/avatar.webp cuando exista una foto */}
            <div className={styles.avatar} aria-hidden="true">
              AV
            </div>
          </div>
          <div className={styles.card}>
            <p className={styles.name}>{SITE.fullName}</p>
            <p className={styles.role}>{SITE.university}</p>
          </div>
        </Reveal>

        <div className={styles.copy}>
          <Reveal>
            <p className="eyebrow">Sobre mí</p>
            <h2 id="about-title" className={styles.heading}>
              Investigar para entender cómo la tecnología nos cambia
            </h2>
          </Reveal>
          {SITE.bio.map((p, i) => (
            <Reveal as="p" key={i} className={styles.text} delay={0.1 + i * 0.08}>
              {p}
            </Reveal>
          ))}

          <Reveal delay={0.2}>
            <p className={`eyebrow ${styles.subhead}`}>Áreas de interés</p>
            <ul className={styles.chips}>
              {INTERESTS.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.25} className={styles.contact}>
            <div className={styles.emailRow}>
              <a className={styles.contactBtn} href={`mailto:${SITE.email}`}>
                <Mail size={18} aria-hidden="true" /> {SITE.email}
              </a>
              <button type="button" className={styles.copyBtn} onClick={copyEmail} aria-label="Copiar correo" title="Copiar correo">
                <Copy size={16} aria-hidden="true" />
              </button>
            </div>
            <Magnetic>
              <a className={styles.contactBtn} href={SITE.links.linkedin} target="_blank" rel="noopener noreferrer">
                <LinkedinIcon /> LinkedIn
              </a>
            </Magnetic>
            <Magnetic>
              <a className={styles.contactBtn} href={SITE.links.github} target="_blank" rel="noopener noreferrer">
                <GithubIcon /> GitHub
              </a>
            </Magnetic>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
