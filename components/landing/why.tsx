"use client";

import { motion, useInView } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useRef } from "react";
import { Count } from "../count";
import { easeOut, SectionHead } from "../reveal";

const BARS = [
  { label: "Stacked toolkits", note: "competing “YOU MUST” prompts", kb: 25, prefix: "~", decimals: 0, tone: "muted" },
  { label: "honey-stack rules", note: "one layer that agrees with itself", kb: 2, prefix: "~", decimals: 0, tone: "honey" },
  { label: "Learned brief", note: "your rules, budgeted", kb: 1.5, prefix: "≤", decimals: 1, tone: "soft" },
] as const;

const PILLARS = [
  { key: "small", title: "Small", body: "About 2 KB is always on. Skills load only when a task calls for them." },
  { key: "opinionated", title: "Opinionated", body: "Sizes each task, makes the smallest complete change, proves it before “done”." },
  { key: "steer", title: "Yours to steer", body: "Learned rules apply on their own. Autonomy is opt-in, and every tier has a gate." },
  { key: "local", title: "Local and reversible", body: "Data lives in ~/.honey. No telemetry. honey uninstall restores everything." },
  { key: "agents", title: "Two agents, one memory", body: "Claude Code and Codex share one data directory, so a lesson carries across both." },
];

const SOURCES = [
  { name: "Superpowers", href: "https://github.com/obra/superpowers" },
  { name: "Ponytail", href: "https://github.com/DietrichGebert/ponytail" },
  { name: "Matt Pocock’s skills", href: "https://github.com/mattpocock/skills" },
  { name: "pstack", href: "https://github.com/cursor/plugins/tree/main/pstack" },
  { name: "gstack", href: "https://github.com/garrytan/gstack" },
];

function ContextBars() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduce = useReducedMotion();

  return (
    <div ref={ref} data-spotlight="" className="space-y-5 rounded-2xl border border-rule bg-paper-2/60 p-5 sm:p-7">
      <p className="font-mono text-xs text-muted">Always-on context injected per session</p>
      {BARS.map((bar, i) => (
        <div key={bar.label}>
          <div className="mb-2 flex items-baseline justify-between gap-4">
            <span className="text-sm text-ink">
              {bar.label} <span className="hidden text-muted sm:inline">· {bar.note}</span>
            </span>
            <span className={`font-mono text-sm ${bar.tone === "honey" ? "text-honey" : "text-muted"}`}>
              <Count to={bar.kb} play={inView} delay={0.15 + i * 0.18} duration={1.1} decimals={bar.decimals} prefix={bar.prefix} suffix=" KB" />
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-paper-3">
            <motion.div
              className={`relative h-full origin-left overflow-hidden rounded-full ${
                bar.tone === "honey" ? "bg-honey shadow-[0_0_14px_var(--color-honey)]" : bar.tone === "soft" ? "bg-honey/40" : "bg-rule-strong"
              }`}
              style={{ width: `${(bar.kb / 25) * 100}%` }}
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : undefined}
              transition={{ duration: reduce ? 0 : 1.1, delay: reduce ? 0 : 0.15 + i * 0.18, ease: easeOut }}
            />
          </div>
        </div>
      ))}
      <p className="pt-1 text-sm leading-relaxed text-muted">
        Less prompt means fewer contradictions and more room for your actual code.
      </p>
    </div>
  );
}

export function Why() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHead
        id="why"
        title="Less prompt. Better judgement."
        accent="Better judgement."
        lede="Stacking toolkits floods every session with rules that fight each other. honey-stack keeps the best ideas from each and drops the noise."
      />

      <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
        <ContextBars />

        <dl className="divide-y divide-rule border-y border-rule">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.key}
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.6, delay: i * 0.07, ease: easeOut }}
              className="group relative grid grid-cols-1 gap-1 py-4 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-6"
            >
              <span
                aria-hidden="true"
                className="absolute top-4 bottom-4 -left-4 w-0.5 origin-top scale-y-0 rounded-full bg-honey transition-transform duration-(--dur-long) ease-out group-hover:scale-y-100"
              />
              <dt className="font-medium text-ink transition-transform duration-(--dur-long) ease-out group-hover:translate-x-1">{p.title}</dt>
              <dd className="text-[15px] leading-relaxed text-muted">{p.body}</dd>
            </motion.div>
          ))}
        </dl>
      </div>

      <div className="mt-12 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        <span className="text-muted">Distilled from</span>
        {SOURCES.map((s) => (
          <a key={s.name} href={s.href} className="text-body underline decoration-rule-strong underline-offset-4 transition-colors hover:text-ink hover:decoration-honey">
            {s.name}
          </a>
        ))}
      </div>
    </section>
  );
}
