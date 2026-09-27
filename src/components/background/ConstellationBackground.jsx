// src/components/background/ConstellationBackground.jsx
// Red de nodos en Canvas 2D que reacciona al puntero, al toque y a la sección visible.
import { useEffect, useRef } from "react";
import { resolvedTheme } from "../../hooks/useTheme";
import styles from "./ConstellationBackground.module.css";

const LINK_DIST = 140;
const POINTER_RADIUS = 180;
const MAX_SPEED = 0.35;

const TONE_VAR = {
  sintesis: "--c-sintesis",
  investigacion: "--c-investigacion",
  articulo: "--c-articulo",
};

function hexToRgb(hex) {
  const h = hex.trim().replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, "$&$&") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function cssColor(name) {
  return hexToRgb(getComputedStyle(document.documentElement).getPropertyValue(name) || "#5eead4");
}

function nodeBudget(w, h) {
  const reduce = navigator.hardwareConcurrency <= 4 || navigator.connection?.saveData;
  let max = w < 768 ? 40 : w < 1024 ? 70 : 140;
  if (reduce) max = Math.round(max / 2);
  return Math.min(max, Math.floor((w * h) / 11000));
}

export default function ConstellationBackground({ tone = "inicio" }) {
  const canvasRef = useRef(null);
  const toneRef = useRef(tone);
  const refreshColor = useRef(() => {});

  useEffect(() => {
    toneRef.current = tone;
    refreshColor.current();
  }, [tone]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext?.("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let w = 0, h = 0, dpr = 1;
    let nodes = [];
    let raf = 0;
    let running = false;
    const pointer = { x: -9999, y: -9999, active: false, px: 0, py: 0 };
    const offset = { x: 0, y: 0 };
    const pulses = [];

    let isLight = resolvedTheme() === "light";
    const color = { cur: cssColor("--accent"), target: cssColor("--accent"), accent: cssColor("--accent") };

    refreshColor.current = () => {
      isLight = resolvedTheme() === "light";
      color.accent = cssColor("--accent");
      color.target = cssColor(TONE_VAR[toneRef.current] || "--accent");
      if (reduced) {
        color.cur = color.target.slice();
        draw();
      }
    };

    function seed() {
      const count = nodeBudget(w, h);
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * MAX_SPEED,
        vy: (Math.random() - 0.5) * MAX_SPEED,
        r: 0.8 + Math.random() * 1.6,
      }));
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const prevW = w;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Solo re-siembra si cambia el ancho (evita saltos al ocultarse la barra del navegador en móvil)
      if (!nodes.length || Math.abs(prevW - w) > 40) seed();
      draw();
    }

    function step() {
      // parallax suave del puntero
      if (finePointer && pointer.active) {
        offset.x += ((pointer.x / w - 0.5) * -24 - offset.x) * 0.04;
        offset.y += ((pointer.y / h - 0.5) * -24 - offset.y) * 0.04;
      }
      for (let i = 0; i < 3; i++) color.cur[i] += (color.target[i] - color.cur[i]) * 0.035;

      const now = performance.now();
      for (let i = pulses.length - 1; i >= 0; i--) if (now - pulses[i].t > 800) pulses.splice(i, 1);

      for (const n of nodes) {
        n.vx += (Math.random() - 0.5) * 0.02;
        n.vy += (Math.random() - 0.5) * 0.02;

        if (finePointer && pointer.active) {
          const dx = pointer.x - offset.x - n.x;
          const dy = pointer.y - offset.y - n.y;
          const d = Math.hypot(dx, dy);
          if (d < POINTER_RADIUS && d > 1) {
            const f = (1 - d / POINTER_RADIUS) * 0.035;
            n.vx += (dx / d) * f;
            n.vy += (dy / d) * f;
          }
        }

        for (const p of pulses) {
          const radius = ((now - p.t) / 800) * 420;
          const dx = n.x - p.x;
          const dy = n.y - p.y;
          const d = Math.hypot(dx, dy) || 1;
          const band = Math.abs(d - radius);
          if (band < 40) {
            const f = (1 - band / 40) * 0.6;
            n.vx += (dx / d) * f;
            n.vy += (dy / d) * f;
          }
        }

        n.vx *= 0.975;
        n.vy *= 0.975;
        const speed = Math.hypot(n.vx, n.vy);
        const limit = pulses.length ? MAX_SPEED * 8 : MAX_SPEED * 2.5;
        if (speed > limit) {
          n.vx = (n.vx / speed) * limit;
          n.vy = (n.vy / speed) * limit;
        }
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = w + 20;
        else if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20;
        else if (n.y > h + 20) n.y = -20;
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(offset.x, offset.y);

      const [r, g, b] = color.cur.map(Math.round);
      const [ar, ag, ab] = color.accent;
      const alphaK = isLight ? 0.55 : 0.38;

      // rejilla espacial para buscar vecinos sin O(n²)
      const cols = Math.ceil((w + 40) / LINK_DIST) + 1;
      const grid = new Map();
      nodes.forEach((n, i) => {
        const key = Math.floor((n.x + 20) / LINK_DIST) + Math.floor((n.y + 20) / LINK_DIST) * cols;
        const cell = grid.get(key);
        if (cell) cell.push(i);
        else grid.set(key, [i]);
      });

      const px = pointer.x - offset.x;
      const py = pointer.y - offset.y;
      const pointerOn = finePointer && pointer.active;

      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        const cx = Math.floor((a.x + 20) / LINK_DIST);
        const cy = Math.floor((a.y + 20) / LINK_DIST);
        for (let ox = -1; ox <= 1; ox++) {
          for (let oy = -1; oy <= 1; oy++) {
            const cell = grid.get(cx + ox + (cy + oy) * cols);
            if (!cell) continue;
            for (const j of cell) {
              if (j <= i) continue;
              const bnode = nodes[j];
              const d = Math.hypot(a.x - bnode.x, a.y - bnode.y);
              if (d > LINK_DIST) continue;
              let alpha = (1 - d / LINK_DIST) * alphaK;
              let lit = false;
              if (pointerOn) {
                const mx = (a.x + bnode.x) / 2 - px;
                const my = (a.y + bnode.y) / 2 - py;
                if (mx * mx + my * my < POINTER_RADIUS * POINTER_RADIUS) {
                  alpha = Math.min(1, alpha * 2.4);
                  lit = true;
                }
              }
              ctx.strokeStyle = lit ? `rgba(${ar},${ag},${ab},${alpha})` : `rgba(${r},${g},${b},${alpha})`;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(bnode.x, bnode.y);
              ctx.stroke();
            }
          }
        }
      }

      // el puntero actúa como un nodo más
      if (pointerOn) {
        for (const n of nodes) {
          const d = Math.hypot(n.x - px, n.y - py);
          if (d > POINTER_RADIUS) continue;
          ctx.strokeStyle = `rgba(${ar},${ag},${ab},${(1 - d / POINTER_RADIUS) * 0.55})`;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(n.x, n.y);
          ctx.stroke();
        }
      }

      ctx.fillStyle = `rgba(${r},${g},${b},${isLight ? 0.7 : 0.85})`;
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      const now = performance.now();
      for (const p of pulses) {
        const t = (now - p.t) / 800;
        ctx.strokeStyle = `rgba(${ar},${ag},${ab},${(1 - t) * 0.45})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, t * 420, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    function loop() {
      step();
      draw();
      raf = requestAnimationFrame(loop);
    }
    function start() {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(loop);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    };
    const onMove = (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = e.pointerType === "mouse";
    };
    const onLeave = () => (pointer.active = false);
    const onDown = (e) => {
      if (reduced) return;
      pulses.push({ x: e.clientX - offset.x, y: e.clientY - offset.y, t: performance.now() });
      if (pulses.length > 4) pulses.shift();
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const onTheme = () => refreshColor.current();

    resize();
    refreshColor.current();
    color.cur = color.target.slice();
    if (reduced) draw();
    else start();

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("themechange", onTheme);

    return () => {
      stop();
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("themechange", onTheme);
    };
  }, []);

  return (
    <div className={styles.root} aria-hidden="true" data-tone={tone}>
      <div className={styles.blobs}>
        <span className={`${styles.blob} ${styles.b1}`} />
        <span className={`${styles.blob} ${styles.b2}`} />
        <span className={`${styles.blob} ${styles.b3}`} />
      </div>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.vignette} />
    </div>
  );
}
