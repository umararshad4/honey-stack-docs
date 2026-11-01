"use client";

import { motion, type Variants } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { Fragment, type ReactNode } from "react";

export const easeOut = [0.16, 1, 0.3, 1] as const;

/** One-shot reveal on first view. */
export function Reveal({ children, delay = 0, className, spotlight }: { children: ReactNode; delay?: number; className?: string; spotlight?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      data-spotlight={spotlight ? "" : undefined}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: reduce ? 0.15 : 0.7, delay, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

const wordVariants: Variants = {
  hidden: { y: "108%", rotate: 4 },
  show: { y: "0%", rotate: 0, transition: { duration: 0.85, ease: easeOut } },
};

/**
 * Masked word-by-word rise. Words stay real text in the DOM, so headings read and
 * index normally; only their inner spans move.
 */
export function Words({ text, accent, delay = 0, stagger = 0.045 }: { text: string; accent?: string; delay?: number; stagger?: number }) {
  const start = accent ? text.indexOf(accent) : -1;
  const parts = start < 0 ? [{ text, accent: false }] : [
    { text: text.slice(0, start), accent: false },
    { text: accent!, accent: true },
    { text: text.slice(start + accent!.length), accent: false },
  ];
  const words = parts.flatMap((p) => p.text.split(/\s+/).filter(Boolean).map((w) => ({ w, accent: p.accent })));

  return (
    <motion.span
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {words.map(({ w, accent: a }, i) => (
        <Fragment key={i}>
          <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span variants={wordVariants} className={`inline-block origin-bottom-left ${a ? "text-honey" : ""}`}>
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </motion.span>
  );
}

export function SectionHead({ title, accent, lede, id }: { title: string; accent?: string; lede?: ReactNode; id?: string }) {
  return (
    <div className="max-w-2xl">
      <h2 id={id} className="scroll-mt-28 text-3xl font-semibold tracking-[-0.03em] text-balance text-ink sm:text-[2.6rem] sm:leading-[1.08]">
        <Words text={title} accent={accent} />
      </h2>
      {lede && (
        <Reveal delay={0.18}>
          <p className="mt-4 text-[17px] leading-relaxed text-pretty text-muted">{lede}</p>
        </Reveal>
      )}
    </div>
  );
}
