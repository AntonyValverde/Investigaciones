// src/lib/scroll.js — punto único para desplazarse y bloquear el scroll (con o sin Lenis)
let lenis = null;

export async function initSmoothScroll() {
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!fine || reduced || lenis) return () => {};

  const [{ default: Lenis }] = await Promise.all([import("lenis"), import("lenis/dist/lenis.css")]);
  lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4) });
  let raf = requestAnimationFrame(function loop(time) {
    lenis?.raf(time);
    raf = requestAnimationFrame(loop);
  });
  return () => {
    cancelAnimationFrame(raf);
    lenis?.destroy();
    lenis = null;
  };
}

function headerOffset() {
  const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 72;
  return nav + 64;
}

export function scrollToTarget(target) {
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (lenis) {
    lenis.scrollTo(el, { offset: -headerOffset() });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY - headerOffset();
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
  }
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0);
  else {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }
}

export function lockScroll(locked) {
  document.body.classList.toggle("is-locked", locked);
  if (locked) lenis?.stop();
  else lenis?.start();
}
