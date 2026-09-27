// src/hooks/useActiveSection.js — id de la sección [data-section] que cruza el centro de la pantalla
import { useEffect, useState } from "react";

export function useActiveSection(deps = []) {
  const [active, setActive] = useState("inicio");

  useEffect(() => {
    const els = document.querySelectorAll("[data-section]");
    if (!els.length || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.dataset.section);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return active;
}
