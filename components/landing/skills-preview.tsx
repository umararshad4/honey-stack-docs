"use client";

import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import Link from "next/link";
import { useId, useState } from "react";
import { areas, skillCount, skillInfo } from "@/lib/skills";
import { Magnetic } from "../magnetic";
import { easeOut, SectionHead } from "../reveal";

export function SkillsPreview() {
  const reduce = useReducedMotion();
  const id = useId();
  const [area, setArea] = useState(0);
  const [picked, setPicked] = useState<string>(areas[0].skills[0]);
  const current = areas[area];
  const info = skillInfo(picked);

  function chooseArea(i: number) {
    setArea(i);
    setPicked(areas[i].skills[0]);
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHead
        id="skills"
        title={`${skillCount} skills for the whole job.`}
        accent="the whole job."
        lede="From the first question to the production incident, a skill exists for each step — and stays out of context until it's needed. Most fire on their own; the rest are one command away: /honey:<skill> in Claude Code, $<skill> in Codex."
      />

      <div className="mt-12">
        <div role="tablist" aria-label="Skill areas" className="flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none]">
          {areas.map((a, i) => {
            const active = i === area;
            return (
              <button
                key={a.name}
                id={`${id}-tab-${i}`}
                role="tab"
                type="button"
                aria-selected={active}
                aria-controls={`${id}-panel`}
                tabIndex={active ? 0 : -1}
                onClick={() => chooseArea(i)}
                onKeyDown={(e) => {
                  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                  e.preventDefault();
                  const next = (i + (e.key === "ArrowRight" ? 1 : areas.length - 1)) % areas.length;
                  chooseArea(next);
                  document.getElementById(`${id}-tab-${next}`)?.focus();
                }}
                className={`relative shrink-0 rounded-full px-4 py-2 text-sm whitespace-nowrap transition-colors duration-(--dur-short) ${
                  active ? "text-on-honey" : "text-muted hover:text-ink"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId={`${id}-tab`}
                    className="absolute inset-0 rounded-full bg-honey"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative">
                  {a.name} <span className={active ? "text-on-honey/70" : "text-faint"}>{a.skills.length}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div
          id={`${id}-panel`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${area}`}
          className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:gap-14"
        >
          <div>
            <AnimatePresence mode="wait">
              <motion.p
                key={current.name}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: easeOut }}
                className="text-lg text-body"
              >
                {current.blurb}
              </motion.p>
            </AnimatePresence>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.ul
                key={current.name}
                className="mt-5 flex flex-wrap gap-2"
                initial="hidden"
                animate="show"
                exit="exit"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.035 } }, exit: {} }}
              >
                {current.skills.map((name) => {
                  const s = skillInfo(name);
                  const on = picked === name;
                  return (
                    <motion.li
                      key={name}
                      variants={{
                        hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.92 },
                        show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 420, damping: 28 } },
                        exit: { opacity: 0, transition: { duration: 0.12 } },
                      }}
                    >
                      <button
                        type="button"
                        onPointerEnter={() => setPicked(name)}
                        onFocus={() => setPicked(name)}
                        onClick={() => setPicked(name)}
                        aria-pressed={on}
                        className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[13px] transition-[color,background-color,border-color,transform] duration-(--dur-short) hover:-translate-y-0.5 ${
                          on ? "border-honey/70 bg-honey/10 text-honey" : "border-rule text-body hover:border-rule-strong hover:text-ink"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`size-1.5 rounded-full ${s.auto ? "bg-honey" : "border border-muted"}`}
                        />
                        {name}
                      </button>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </AnimatePresence>
            <p className="mt-6 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-honey" /> fires on its own
              </span>
              <span className="flex items-center gap-1.5">
                <span aria-hidden="true" className="size-1.5 rounded-full border border-muted" /> you call it
              </span>
            </p>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <div data-spotlight="" className="min-h-[10.5rem] rounded-2xl border border-rule bg-paper-2/60 p-6" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div
                  key={picked}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8, filter: "blur(4px)" }}
                  transition={{ duration: 0.25, ease: easeOut }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-mono text-honey">{info.name}</p>
                    <span className="rounded-full border border-rule px-2 py-0.5 font-mono text-[11px] text-muted">
                      {info.auto ? "automatic" : `/honey:${info.name}`}
                    </span>
                  </div>
                  <p className="mt-3 text-[15px] leading-relaxed text-body">{info.summary}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            <Magnetic className="mt-4">
              <Link href="/docs/skills" className="group inline-flex items-center gap-1.5 text-sm text-ink">
                Every skill and subagent
                <ArrowRight size={14} className="transition-transform duration-(--dur-short) group-hover:translate-x-0.5" />
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
