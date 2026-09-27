// src/components/ui/Reveal.jsx — entrada al hacer scroll (una sola vez)
import { motion } from "motion/react";

export const revealVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function Reveal({ as = "div", delay = 0, children, ...rest }) {
  const Tag = motion[as];
  return (
    <Tag
      variants={revealVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// Titular que aparece palabra por palabra
export function WordReveal({ text, as = "h1", className, delay = 0, stagger = 0.06 }) {
  const Tag = motion[as];
  const words = text.split(" ");
  return (
    <Tag
      className={className}
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span key={i} aria-hidden="true" style={{ display: "inline-block", overflow: "hidden", paddingBottom: "0.08em", marginBottom: "-0.08em" }}>
          <motion.span
            style={{ display: "inline-block" }}
            variants={{
              hidden: { y: "105%", opacity: 0, filter: "blur(8px)" },
              show: { y: "0%", opacity: 1, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </Tag>
  );
}
