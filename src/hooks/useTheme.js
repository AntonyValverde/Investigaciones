// src/hooks/useTheme.js — preferencia: "system" | "light" | "dark"
import { useCallback, useEffect, useState } from "react";
import { flushSync } from "react-dom";

const KEY = "theme";
const ORDER = ["system", "light", "dark"];

function readStored() {
  try {
    const v = localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : "system";
  } catch {
    return "system";
  }
}

export function resolvedTheme() {
  const t = document.documentElement.dataset.theme;
  if (t === "light" || t === "dark") return t;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function apply(pref) {
  const root = document.documentElement;
  if (pref === "system") delete root.dataset.theme;
  else root.dataset.theme = pref;
  try {
    if (pref === "system") localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, pref);
  } catch {
    /* almacenamiento bloqueado: el tema sigue funcionando en esta visita */
  }
  window.dispatchEvent(new Event("themechange"));
}

export function useTheme() {
  const [pref, setPref] = useState(readStored);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => window.dispatchEvent(new Event("themechange"));
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Cambia al siguiente tema con una revelación circular desde el botón (View Transitions API).
  const cycle = useCallback(
    (event) => {
      const next = ORDER[(ORDER.indexOf(pref) + 1) % ORDER.length];
      const run = () => {
        apply(next);
        setPref(next);
      };
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!document.startViewTransition || reduced) return run();

      const rect = event?.currentTarget?.getBoundingClientRect();
      const x = rect ? rect.left + rect.width / 2 : window.innerWidth - 40;
      const y = rect ? rect.top + rect.height / 2 : 40;
      const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

      const transition = document.startViewTransition(() => flushSync(run));
      transition.ready.then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
          { duration: 650, easing: "cubic-bezier(.65,0,.35,1)", pseudoElement: "::view-transition-new(root)" }
        );
      });
    },
    [pref]
  );

  return { pref, cycle };
}
