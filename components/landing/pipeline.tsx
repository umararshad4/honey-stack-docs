"use client";

import { Check } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useEffect, useRef, useState } from "react";
import { easeOut } from "../reveal";

const STAGES = [
  { name: "Suggestion", body: "A redacted diagnosis from your sessions." },
  { name: "GitHub issue", body: "Recorded as unimplemented, needs confirmation." },
  { name: "Evaluation", body: "Generated, matched and behaviour cases." },
  { name: "Applied locally", body: "Snapshot-checked, synced to both agents." },
  { name: "Skill-only PR", body: "Only skills/<name>/SKILL.md. No quotes." },
  { name: "CI-gated merge", body: "All four test jobs, exact head, reviews met." },
  { name: "Versioned release", body: "Semver bump, changelog, tag, published." },
  { name: "Auto-update", body: "Installs pick up the release next session." },
];

/** The publish pipeline; a single pass lights each stage in order when it scrolls into view. */
export function Pipeline() {
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduce = useReducedMotion();
  const [lit, setLit] = useState<boolean[]>(() => STAGES.map(() => false));

  // Each badge turns into a check as the wave passes it.
  useEffect(() => {
    if (!inView) return;
    const timers = STAGES.map((_, i) =>
      setTimeout(() => setLit((prev) => prev.map((v, j) => (j === i ? true : v))), reduce ? 0 : i * 160 + 420),
    );
    return () => timers.forEach(clearTimeout);
  }, [inView, reduce]);

  return (
    <ol ref={ref} className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
      {STAGES.map((stage, i) => (
        <motion.li
          key={stage.name}
          data-spotlight=""
          className="relative bg-paper-2 p-5"
          initial={{ opacity: reduce ? 1 : 0.35 }}
          animate={inView ? { opacity: 1 } : undefined}
          transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : i * 0.16 }}
        >
          <motion.span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px origin-left bg-honey"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : undefined}
            transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : i * 0.16, ease: easeOut }}
          />
          <div className="flex items-center gap-3">
            <motion.span
              className="grid size-6 place-items-center rounded-full font-mono text-[11px] tabular-nums"
              initial={{ backgroundColor: "var(--color-paper-3)", color: "var(--color-faint)" }}
              animate={inView ? { backgroundColor: "var(--color-honey)", color: "var(--color-on-honey)" } : undefined}
              transition={{ duration: reduce ? 0 : 0.3, delay: reduce ? 0 : i * 0.16 + 0.25 }}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={lit[i] ? "ok" : "n"}
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.3, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 520, damping: 24 }}
                >
                  {lit[i] ? <Check size={12} strokeWidth={3} /> : i + 1}
                </motion.span>
              </AnimatePresence>
            </motion.span>
            <span className="font-medium text-ink">{stage.name}</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted">{stage.body}</p>
        </motion.li>
      ))}
    </ol>
  );
}
