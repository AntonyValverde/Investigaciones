// src/components/explorer/Explorer.jsx
import { useEffect, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LayoutGrid, List, Search, SearchX, X } from "lucide-react";
import { CATEGORIES, DOCUMENTS } from "../../data/documents";
import { filterDocuments, matchesQuery } from "../../lib/search";
import { MOBILE, useMediaQuery } from "../../hooks/useMediaQuery";
import DocCard from "../card/DocCard";
import Reveal from "../ui/Reveal";
import styles from "./Explorer.module.css";

const TABS = [{ id: "all", label: "Todos" }, ...CATEGORIES.map((c) => ({ id: c.id, label: c.label }))];
const SORTS = [
  { id: "number", label: "Número" },
  { id: "recent", label: "Más reciente" },
  { id: "az", label: "A–Z" },
];

function Tabs({ value, counts, onChange }) {
  const refs = useRef([]);
  const onKey = (e, i) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (i + dir + TABS.length) % TABS.length;
    refs.current[next]?.focus();
    onChange(TABS[next].id);
  };
  return (
    <div className={styles.tabs} role="radiogroup" aria-label="Filtrar por categoría">
      {TABS.map((t, i) => {
        const selected = value === t.id;
        return (
          <button
            key={t.id}
            ref={(el) => (refs.current[i] = el)}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            className={styles.tab}
            data-cat={t.id === "all" ? undefined : t.id}
            onClick={() => onChange(t.id)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {selected && (
              <motion.span layoutId="tab-pill" className={styles.tabPill} transition={{ type: "spring", stiffness: 400, damping: 34 }} />
            )}
            <span className={styles.tabLabel}>{t.label}</span>
            <span className={styles.tabCount}>{counts[t.id]}</span>
          </button>
        );
      })}
    </div>
  );
}

function SearchBox({ value, onChange }) {
  const input = useRef(null);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      e.preventDefault();
      input.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={styles.search}>
      <Search size={17} aria-hidden="true" className={styles.searchIcon} />
      <label htmlFor="doc-search" className="sr-only">
        Buscar documentos
      </label>
      <input
        ref={input}
        id="doc-search"
        type="search"
        placeholder="Buscar por tema, título o etiqueta…"
        value={value}
        autoComplete="off"
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && onChange("")}
      />
      {value ? (
        <button type="button" className={styles.clear} onClick={() => { onChange(""); input.current?.focus(); }} aria-label="Limpiar búsqueda">
          <X size={16} aria-hidden="true" />
        </button>
      ) : (
        <kbd className={styles.kbd} aria-hidden="true">/</kbd>
      )}
    </div>
  );
}

function Group({ category, docs, query, view, onOpen, showHeader }) {
  return (
    <section id={category.id} data-section={category.id} data-cat={category.id} className={styles.group} aria-labelledby={`g-${category.id}`}>
      {showHeader ? (
        <Reveal className={styles.groupHeader}>
          <span className={styles.groupIndex}>{category.index}</span>
          <div>
            <h2 id={`g-${category.id}`} className={styles.groupTitle}>
              {category.label}
            </h2>
            <p className={styles.groupBlurb}>{category.blurb}</p>
          </div>
          <span className={styles.groupCount}>
            {docs.length} {docs.length === 1 ? "documento" : "documentos"}
          </span>
        </Reveal>
      ) : (
        <h2 id={`g-${category.id}`} className="sr-only">
          {category.label}
        </h2>
      )}

      <motion.ul className={styles.grid} data-view={view} layout>
        <AnimatePresence mode="popLayout">
          {docs.map((doc, i) => (
            <motion.li
              key={doc.id}
              layout
              className={styles.cell}
              data-featured={doc.featured || undefined}
              initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.15 }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.07, ease: [0.16, 1, 0.3, 1], layout: { type: "spring", stiffness: 260, damping: 26 } }}
            >
              <DocCard doc={doc} query={query} onOpen={onOpen} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </section>
  );
}

export default function Explorer({ filters, update, reset, onOpen }) {
  const mobile = useMediaQuery(MOBILE);
  const view = mobile ? "grid" : filters.view;

  const results = useMemo(() => filterDocuments(DOCUMENTS, filters), [filters]);
  const counts = useMemo(() => {
    const byQuery = DOCUMENTS.filter((d) => matchesQuery(d, filters.q));
    const out = { all: byQuery.length };
    for (const c of CATEGORIES) out[c.id] = byQuery.filter((d) => d.category === c.id).length;
    return out;
  }, [filters.q]);

  const groups = CATEGORIES.filter((c) => filters.cat === "all" || filters.cat === c.id)
    .map((c) => ({ category: c, docs: results.filter((d) => d.category === c.id) }))
    .filter((g) => g.docs.length);

  return (
    <section id="explorar" className={styles.explorer} aria-labelledby="explorar-title">
      <div className="container">
        <Reveal className={styles.intro}>
          <p className="eyebrow">Explorador</p>
          <h2 id="explorar-title" className={styles.heading}>
            Documentos
          </h2>
        </Reveal>
      </div>

      <div className={styles.toolbarWrap}>
        <div className={`container ${styles.toolbar}`}>
          <Tabs value={filters.cat} counts={counts} onChange={(cat) => update({ cat })} />
          <div className={styles.tools}>
            <SearchBox value={filters.q} onChange={(q) => update({ q })} />
            <label className={styles.sort}>
              <span className="sr-only">Ordenar por</span>
              <select value={filters.sort} onChange={(e) => update({ sort: e.target.value })}>
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            {!mobile && (
              <div className={styles.viewToggle} role="group" aria-label="Vista">
                <button type="button" aria-pressed={view === "grid"} onClick={() => update({ view: "grid" })} aria-label="Vista en cuadrícula">
                  <LayoutGrid size={17} aria-hidden="true" />
                </button>
                <button type="button" aria-pressed={view === "list"} onClick={() => update({ view: "list" })} aria-label="Vista en lista">
                  <List size={17} aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container">
        <p className={styles.status} aria-live="polite">
          Mostrando {results.length} de {DOCUMENTS.length} documentos
          {filters.q && (
            <>
              {" "}para «<strong>{filters.q}</strong>»
            </>
          )}
        </p>

        {groups.map((g) => (
          <Group key={g.category.id} {...g} query={filters.q} view={view} onOpen={onOpen} showHeader={filters.cat === "all"} />
        ))}

        <AnimatePresence>
          {results.length === 0 && (
            <motion.div className={styles.empty} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <SearchX size={40} aria-hidden="true" />
              <p className={styles.emptyTitle}>
                No encontramos documentos para «{filters.q}»
              </p>
              <p>Prueba con otra palabra o revisa todas las categorías.</p>
              <button type="button" onClick={reset}>
                Limpiar filtros
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
