"use client";

import { Check, X } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useEffect, useId, useRef, useState } from "react";
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

const STEP_MS = 280;
const DWELL_MS = 3200;

export function Ladder() {
  const reduce = useReducedMotion();
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { margin: "-20% 0px" });
  const [task, setTask] = useState(0);
  const [climb, setClimb] = useState(0);
  const [auto, setAuto] = useState(true);
  const [hover, setHover] = useState(false);
  const stop = TASKS[task].stop;
  const level = reduce ? stop : climb;
  const arrived = level === stop;
  const cycling = auto && inView && !hover && !reduce;

  // Climb one rung at a time until the first rung that works.
  useEffect(() => {
    if (reduce || !inView) return;
    const timers = Array.from({ length: stop }, (_, i) => setTimeout(() => setClimb(i + 1), STEP_MS * (i + 1)));
    return () => timers.forEach(clearTimeout);
  }, [task, stop, reduce, inView]);

  // Until the visitor takes over, walk through the example requests.
  useEffect(() => {
    if (!cycling || !arrived) return;
    const t = setTimeout(() => {
      setClimb(0);
      setTask((n) => (n + 1) % TASKS.length);
    }, DWELL_MS);
    return () => clearTimeout(t);
  }, [cycling, arrived, task]);

  function choose(i: number) {
    setAuto(false);
    setClimb(0);
    setTask(i);
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHead
        id="ladder"
        title="Take the first rung that works."
        accent="first rung"
        lede="Before it writes anything, honey climbs a six-rung ladder and stops at the first rung that solves the problem. Lazy about what it adds, complete about what it touches."
      />

      <div
        ref={root}
        className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16"
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
      >
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
                  onClick={() => choose(i)}
                  className={`relative overflow-hidden rounded-xl px-4 py-3 text-left text-[15px] transition-colors duration-(--dur-short) ${
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
                  {active && cycling && arrived && (
                    <motion.span
                      key={`timer-${task}`}
                      aria-hidden="true"
                      className="absolute inset-x-3 bottom-1.5 h-px origin-left bg-honey/70"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: DWELL_MS / 1000, ease: "linear" }}
                    />
                  )}
                  <span className="relative">{t.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 min-h-[3.25rem]" aria-live="polite">
            <AnimatePresence mode="wait">
              {arrived ? (
                <motion.p
                  key={`out-${task}`}
                  initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.4, ease: easeOut }}
                  className="rounded-xl border border-dashed border-honey/40 px-4 py-3 text-sm leading-relaxed text-body"
                >
                  <span className="font-mono text-honey">rung {stop + 1} → </span>
                  {TASKS[task].outcome}
                </motion.p>
              ) : (
                <motion.p
                  key={`climb-${task}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-4 py-3 font-mono text-sm text-muted"
                >
                  checking rung {level + 1}…
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <ol className="relative flex flex-col-reverse gap-2">
          {RUNGS.map((rung, i) => {
            const passed = i < level;
            const current = i === level;
            const final = current && arrived;
            return (
              <li key={rung.title} className="relative" style={{ paddingLeft: `calc(${i} * min(4.5%, 1.6rem))` }}>
                <motion.div
                  animate={{ opacity: i > level ? 0.36 : 1, x: current && !reduce ? 4 : 0 }}
                  transition={{ duration: 0.35, ease: easeOut }}
                  className={`relative flex items-center gap-4 overflow-hidden rounded-xl border px-4 py-3 transition-colors duration-(--dur-long) ${
                    final ? "border-honey/60 bg-paper-2 shadow-glow" : current ? "border-rule-strong bg-paper-2" : "border-rule bg-paper-2/40"
                  }`}
                >
                  {current && (
                    <motion.span
                      layoutId={`${id}-marker`}
                      className="absolute inset-0 bg-honey/[0.07]"
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span
                    className={`relative grid size-7 shrink-0 place-items-center rounded-full font-mono text-xs tabular-nums transition-colors duration-(--dur-long) ${
                      final ? "bg-honey text-on-honey" : current ? "bg-honey/25 text-honey" : passed ? "bg-paper-3 text-muted" : "bg-paper-3 text-faint"
                    }`}
                  >
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={final ? "ok" : passed ? "no" : "n"}
                        initial={{ scale: 0.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.4, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 26 }}
                      >
                        {final ? <Check size={14} strokeWidth={2.5} /> : passed ? <X size={13} /> : i + 1}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <span className="relative min-w-0">
                    <span className={`block text-[15px] ${current ? "text-ink" : "text-body"}`}>{rung.title}</span>
                    <span className="block text-[13px] text-muted">{rung.body}</span>
                  </span>
                  <AnimatePresence>
                    {final && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8, x: 6 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 420, damping: 24 }}
                        className="relative ml-auto hidden shrink-0 rounded-full bg-honey/15 px-2.5 py-0.5 font-mono text-[11px] text-honey sm:block"
                      >
                        stops here
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
