"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export const easeOut = [0.16, 1, 0.3, 1] as const;

/** One-shot reveal on first view. Used for section heads, not every element. */
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: reduce ? 0.15 : 0.7, delay, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHead({ title, lede, id }: { title: ReactNode; lede?: ReactNode; id?: string }) {
  return (
    <Reveal className="max-w-2xl">
      <h2 id={id} className="scroll-mt-28 text-3xl font-semibold tracking-[-0.03em] text-balance text-ink sm:text-[2.6rem] sm:leading-[1.08]">
        {title}
      </h2>
      {lede && <p className="mt-4 text-[17px] leading-relaxed text-pretty text-muted">{lede}</p>}
    </Reveal>
  );
}
