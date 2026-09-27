// src/hooks/useUrlFilters.js — filtros del explorador sincronizados con ?cat=&q=&sort=&view=
import { useCallback, useEffect, useState } from "react";

const DEFAULTS = { cat: "all", q: "", sort: "number", view: "grid" };
const VALID = {
  cat: ["all", "sintesis", "investigacion", "articulo"],
  sort: ["number", "recent", "az"],
  view: ["grid", "list"],
};

function read() {
  const params = new URLSearchParams(window.location.search);
  const out = { ...DEFAULTS };
  for (const key of Object.keys(DEFAULTS)) {
    const v = params.get(key);
    if (v == null) continue;
    if (VALID[key] && !VALID[key].includes(v)) continue;
    out[key] = v;
  }
  return out;
}

function write(filters) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(filters)) if (v !== DEFAULTS[k]) params.set(k, v);
  const search = params.toString();
  const url = `${window.location.pathname}${search ? `?${search}` : ""}${window.location.hash}`;
  window.history.replaceState(window.history.state, "", url);
}

export function useUrlFilters() {
  const [filters, setFilters] = useState(read);

  useEffect(() => {
    const onPop = () => setFilters(read());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const update = useCallback((patch) => {
    setFilters((prev) => {
      const next = { ...prev, ...patch };
      write(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => update({ cat: "all", q: "" }), [update]);

  return [filters, update, reset];
}
