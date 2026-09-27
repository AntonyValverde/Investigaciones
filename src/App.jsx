// src/App.jsx
import { useCallback, useEffect, useState } from "react";
import { MotionConfig } from "motion/react";
import { CATEGORIES, DOCUMENTS } from "./data/documents";
import { SITE } from "./data/site";
import { matchesQuery } from "./lib/search";
import { initSmoothScroll, scrollToTarget, scrollToTop } from "./lib/scroll";
import { useTheme } from "./hooks/useTheme";
import { useUrlFilters } from "./hooks/useUrlFilters";
import { useDocRoute } from "./hooks/useDocRoute";
import { useActiveSection } from "./hooks/useActiveSection";
import ConstellationBackground from "./components/background/ConstellationBackground";
import Nav from "./components/layout/Nav";
import Hero from "./components/hero/Hero";
import Explorer from "./components/explorer/Explorer";
import Timeline from "./components/timeline/Timeline";
import About from "./components/about/About";
import Footer from "./components/layout/Footer";
import BackToTop from "./components/layout/BackToTop";
import Viewer from "./components/viewer/Viewer";
import { ToastProvider } from "./components/ui/Toast";

const CATEGORY_IDS = CATEGORIES.map((c) => c.id);

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": DOCUMENTS.map((d) => ({
    "@type": d.category === "articulo" ? "ScholarlyArticle" : "CreativeWork",
    name: d.title,
    abstract: d.summary,
    author: d.authors.map((name) => ({ "@type": "Person", name })),
    dateCreated: d.date,
    inLanguage: "es",
    keywords: d.tags.join(", "),
    encodingFormat: "application/pdf",
    sourceOrganization: SITE.university,
  })),
};

export default function App() {
  const theme = useTheme();
  const [filters, update, reset] = useUrlFilters();
  const route = useDocRoute();
  const [origin, setOrigin] = useState(null);
  const active = useActiveSection([filters.cat, filters.q]);

  useEffect(() => {
    let cleanup = () => {};
    initSmoothScroll().then((fn) => (cleanup = fn));
    return () => cleanup();
  }, []);

  const openDoc = useCallback(
    (slug, el) => {
      setOrigin(el?.getBoundingClientRect?.() ?? null);
      route.open(slug);
    },
    [route]
  );
  const switchDoc = useCallback((slug) => route.open(slug), [route]);

  const navigate = useCallback(
    (id) => {
      if (id === "inicio") return scrollToTop();
      const hidden =
        CATEGORY_IDS.includes(id) &&
        ((filters.cat !== "all" && filters.cat !== id) ||
          !DOCUMENTS.some((d) => d.category === id && matchesQuery(d, filters.q)));
      if (hidden) update({ cat: "all", q: "" });
      // espera a que el grupo exista en el DOM tras limpiar filtros
      requestAnimationFrame(() => requestAnimationFrame(() => scrollToTarget(`#${id}`)));
    },
    [filters, update]
  );

  const tone = CATEGORY_IDS.includes(active) ? active : "inicio";

  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        <ConstellationBackground tone={tone} />
        <div className="grain" aria-hidden="true" />

        <Nav active={active} onNavigate={navigate} theme={theme} />

        <main id="contenido" tabIndex={-1}>
          <Hero onExplore={() => scrollToTarget("#explorar")} onAbout={() => navigate("sobre-mi")} onOpen={openDoc} />
          <Explorer filters={filters} update={update} reset={reset} onOpen={openDoc} />
          <Timeline onOpen={openDoc} />
          <About />
        </main>

        <Footer onNavigate={navigate} />
        <BackToTop />
        <Viewer slug={route.slug} origin={origin} onClose={route.close} onNavigate={switchDoc} />

        <script type="application/ld+json">{JSON.stringify(JSON_LD)}</script>
      </ToastProvider>
    </MotionConfig>
  );
}
