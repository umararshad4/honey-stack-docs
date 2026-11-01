"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
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

  return (
    <ol ref={ref} className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
      {STAGES.map((stage, i) => (
        <li key={stage.name} className="relative bg-paper-2 p-5">
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
              {i + 1}
            </motion.span>
            <span className="font-medium text-ink">{stage.name}</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted">{stage.body}</p>
        </li>
      ))}
    </ol>
  );
}
