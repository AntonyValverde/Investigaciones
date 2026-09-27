// src/hooks/useDocRoute.js — documento abierto en el visor vía #/doc/<slug>
import { useCallback, useEffect, useRef, useState } from "react";
import { getDocBySlug } from "../data/documents";

const PREFIX = "#/doc/";

function readSlug() {
  const h = window.location.hash;
  if (!h.startsWith(PREFIX)) return null;
  const slug = decodeURIComponent(h.slice(PREFIX.length));
  return getDocBySlug(slug) ? slug : null;
}

const urlWithout = () => window.location.pathname + window.location.search;

export function useDocRoute() {
  const [slug, setSlug] = useState(readSlug);
  const pushed = useRef(false);

  useEffect(() => {
    const sync = () => {
      const s = readSlug();
      if (!s) pushed.current = false;
      setSlug(s);
    };
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, []);

  const open = useCallback((nextSlug) => {
    const url = `${urlWithout()}${PREFIX}${nextSlug}`;
    if (readSlug()) {
      window.history.replaceState(window.history.state, "", url);
    } else {
      window.history.pushState({ doc: nextSlug }, "", url);
      pushed.current = true;
    }
    setSlug(nextSlug);
  }, []);

  const close = useCallback(() => {
    if (pushed.current) {
      pushed.current = false;
      window.history.back();
    } else {
      window.history.replaceState(window.history.state, "", urlWithout());
    }
    setSlug(null);
  }, []);

  return { slug, open, close };
}
