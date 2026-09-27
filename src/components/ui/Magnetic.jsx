// src/components/ui/Magnetic.jsx — el hijo sigue levemente al cursor (solo puntero fino)
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { FINE_POINTER, useMediaQuery } from "../../hooks/useMediaQuery";

const SPRING = { stiffness: 150, damping: 15, mass: 0.1 };

export default function Magnetic({ children, strength = 8, className }) {
  const fine = useMediaQuery(FINE_POINTER);
  const reduced = useReducedMotion();
  const x = useSpring(useMotionValue(0), SPRING);
  const y = useSpring(useMotionValue(0), SPRING);
  const enabled = fine && !reduced;

  const onMove = (e) => {
    if (!enabled) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width - 0.5) * 2 * strength);
    y.set(((e.clientY - r.top) / r.height - 0.5) * 2 * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      className={className}
      style={{ x, y, display: "inline-flex" }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.span>
  );
}
