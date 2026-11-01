"use client";

import { motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import { easeOut, SectionHead } from "../reveal";

const RUNGS = [
  { title: "Does it need to exist?", body: "Skip unrequested features — and name them in one line." },
  { title: "Reuse what's there", body: "The codebase usually already has the helper." },
  { title: "Stdlib or platform", body: "A built-in feature beats new code." },
  { title: "An installed dependency", body: "Never add a package for a few lines." },
  { title: "One readable line", body: "If one line does it clearly, stop there." },
  { title: "The minimum code that works", body: "Only now write something new — and keep it small." },
];

const TASKS = [
  { label: "“Format dates in the table”", stop: 2, outcome: "Intl.DateTimeFormat — no date library added." },
  { label: "“Also add a settings page?”", stop: 0, outcome: "Not requested. Named in one line, not built." },
  { label: "“Debounce the search box”", stop: 1, outcome: "hooks/useDebounce.ts already exists. Reused." },
  { label: "“Parse this new log format”", stop: 5, outcome: "Nothing fits, so a small, tested parser is written." },
];

export function Ladder() {
  const [task, setTask] = useState(0);
  const reduce = useReducedMotion();
  const id = useId();
  const stop = TASKS[task].stop;

  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHead
        id="ladder"
        title={<>Take the first rung that works.</>}
        lede="Before it writes anything, honey climbs a six-rung ladder and stops at the first rung that solves the problem. Lazy about what it adds, complete about what it touches."
      />

      <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div>
          <p className="font-mono text-xs text-muted" id={`${id}-label`}>
            Pick a request
          </p>
          <div role="group" aria-labelledby={`${id}-label`} className="mt-3 flex flex-col gap-1.5">
            {TASKS.map((t, i) => {
              const active = i === task;
              return (
                <button
                  key={t.label}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setTask(i)}
                  className={`relative rounded-xl px-4 py-3 text-left text-[15px] transition-colors duration-(--dur-short) ${
                    active ? "text-ink" : "text-muted hover:bg-paper-2 hover:text-body"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId={`${id}-task`}
                      className="absolute inset-0 rounded-xl border border-rule-strong bg-paper-2"
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    />
                  )}
                  <span className="relative">{t.label}</span>
                </button>
              );
            })}
          </div>
          <motion.p
            key={task}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: reduce ? 0 : 0.25, ease: easeOut }}
            className="mt-6 rounded-xl border border-dashed border-rule px-4 py-3 text-sm leading-relaxed text-body"
            aria-live="polite"
          >
            <span className="font-mono text-honey">rung {stop + 1} → </span>
            {TASKS[task].outcome}
          </motion.p>
        </div>

        <ol className="relative flex flex-col-reverse gap-2">
          {RUNGS.map((rung, i) => {
            const passed = i < stop;
            const current = i === stop;
            return (
              <li
                key={rung.title}
                className="relative"
                style={{ paddingLeft: `calc(${i} * min(4.5%, 1.6rem))` }}
              >
                <motion.div
                  animate={{
                    opacity: i > stop ? 0.38 : 1,
                  }}
                  transition={{ duration: 0.4, ease: easeOut }}
                  className={`relative flex items-center gap-4 overflow-hidden rounded-xl border px-4 py-3 ${
                    current ? "border-honey/60 bg-paper-2" : "border-rule bg-paper-2/40"
                  }`}
                >
                  {current && (
                    <motion.span
                      layoutId={`${id}-marker`}
                      className="absolute inset-0 bg-honey/[0.07]"
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 30 }}
                    />
                  )}
                  <span
                    className={`relative grid size-7 shrink-0 place-items-center rounded-full font-mono text-xs tabular-nums transition-colors duration-(--dur-long) ${
                      current ? "bg-honey text-on-honey" : passed ? "bg-paper-3 text-muted line-through" : "bg-paper-3 text-faint"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="relative min-w-0">
                    <span className={`block text-[15px] ${current ? "text-ink" : "text-body"}`}>{rung.title}</span>
                    <span className="block text-[13px] text-muted">{rung.body}</span>
                  </span>
                  {current && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: reduce ? 0 : 0.3, duration: 0.3, ease: easeOut }}
                      className="relative ml-auto hidden shrink-0 rounded-full bg-honey/15 px-2.5 py-0.5 font-mono text-[11px] text-honey sm:block"
                    >
                      stops here
                    </motion.span>
                  )}
                </motion.div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
