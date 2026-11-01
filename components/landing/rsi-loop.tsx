"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { easeOut, SectionHead } from "../reveal";

const STEPS = [
  {
    name: "Observe",
    pos: "top-[5%] left-1/2 -translate-x-1/2 -translate-y-1/2",
    body: "Hooks log bounded, redacted requests, corrections, “still broken” and which skills fired. Ambiguous feedback stays uncertain instead of blaming every recent skill.",
    fact: "≤300-char redacted snippets",
  },
  {
    name: "Reflect",
    pos: "top-1/2 right-0 translate-x-1/2 -translate-y-1/2",
    body: "After a session with signal, a small model proposes evidence-backed WHEN → THEN rules. Haiku via Claude, or Codex.",
    fact: "about $0.002 per reflection",
  },
  {
    name: "Curate",
    pos: "bottom-[5%] left-1/2 -translate-x-1/2 translate-y-1/2",
    body: "A rule goes live once two sessions back it. It goes stale after 30 days and is archived after 90. Deterministic, no model call.",
    fact: "2 sessions · 30 days · 90 days",
  },
  {
    name: "Apply",
    pos: "top-1/2 left-0 -translate-x-1/2 -translate-y-1/2",
    body: "Review mode queues changes for /rsi review. Autonomous mode applies supported changes after validation — instruction edits, skill patches, guards.",
    fact: "every tier has its own gate",
  },
];

const TIERS = [
  { tier: 0, change: "Learned rules in each session's brief (≤1.5 KB)", who: "Automatic" },
  { tier: 1, change: "Instruction edits and known toolkit repairs, with backups", who: "You, or autonomous RSI" },
  { tier: 2, change: "Skill patches and new skills that pass regression evals", who: "You, or autonomous RSI" },
  { tier: 3, change: "Enforced guards, ≤1% false positives on replay", who: "You, or autonomous RSI" },
];

const C = 2 * Math.PI * 120;

export function RsiLoop() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px" });
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0); // ever-increasing so the orbit never spins backwards
  const [paused, setPaused] = useState(false);
  const active = step % STEPS.length;

  useEffect(() => {
    if (!inView || paused || reduce) return;
    const t = setInterval(() => setStep((s) => s + 1), 3800);
    return () => clearInterval(t);
  }, [inView, paused, reduce]);

  function select(i: number) {
    setStep((s) => s + ((i - (s % STEPS.length) + STEPS.length) % STEPS.length));
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHead
        id="rsi"
        title={
          <>
            It gets better <span className="text-honey">every session.</span>
          </>
        }
        lede="RSI — recursive self-improvement — watches how sessions actually go, turns your corrections into rules, and rules into evaluated skill patches. Nothing applies without passing its gate."
      />

      <div
        ref={ref}
        className="mt-16 grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div className="relative mx-auto aspect-square w-[76%] max-w-[22rem] sm:w-full">
          <svg viewBox="0 0 320 320" className="absolute inset-0 size-full" aria-hidden="true">
            <circle cx="160" cy="160" r="120" fill="none" stroke="var(--color-rule)" strokeWidth="1" />
            <circle cx="160" cy="160" r="84" fill="none" stroke="var(--color-rule)" strokeWidth="1" strokeDasharray="2 6" />
            <motion.g
              animate={{ rotate: step * 90 }}
              transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 60, damping: 16, mass: 1 }}
            >
              {/* Symmetric bounds keep the rotation origin at the centre. */}
              <circle cx="160" cy="160" r="134" fill="none" />
              <circle
                cx="160"
                cy="160"
                r="120"
                fill="none"
                stroke="var(--color-honey)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={`${C * 0.22} ${C}`}
                transform={`rotate(${-90 - 0.22 * 360} 160 160)`}
                opacity="0.9"
              />
              <circle cx="160" cy="40" r="5" fill="var(--color-honey)" />
              <circle cx="160" cy="40" r="12" fill="var(--color-honey)" opacity="0.15" />
            </motion.g>
          </svg>

          <div className="absolute inset-[22%] grid place-items-center text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.3, ease: easeOut }}
              >
                <p className="font-mono text-5xl font-medium tracking-tight text-ink tabular-nums">0{active + 1}</p>
                <p className="mt-1 font-mono text-xs text-muted">of 04</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {STEPS.map((s, i) => (
            <button
              key={s.name}
              type="button"
              onClick={() => select(i)}
              aria-pressed={i === active}
              className={`absolute ${s.pos} rounded-full border px-3 py-1.5 font-mono text-xs whitespace-nowrap backdrop-blur transition-colors duration-(--dur-short) ${
                i === active ? "border-honey/70 bg-paper-2 text-honey" : "border-rule bg-paper/80 text-muted hover:text-ink"
              }`}
            >
              {s.name.toLowerCase()}
            </button>
          ))}
        </div>

        <div className="min-h-[13rem]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: 0.4, ease: easeOut }}
              aria-live="polite"
            >
              <p className="text-2xl font-semibold tracking-tight text-ink">{STEPS[active].name}</p>
              <p className="mt-3 text-[17px] leading-relaxed text-muted">{STEPS[active].body}</p>
              <p className="mt-5 inline-block rounded-full border border-rule px-3 py-1 font-mono text-xs text-honey">
                {STEPS[active].fact}
              </p>
            </motion.div>
          </AnimatePresence>
          <div className="mt-8 flex gap-1.5" aria-hidden="true">
            {STEPS.map((s, i) => (
              <span key={s.name} className="h-1 flex-1 overflow-hidden rounded-full bg-paper-3">
                <motion.span
                  className="block h-full origin-left bg-honey"
                  animate={{ scaleX: i <= active ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: easeOut }}
                />
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-20">
        <p className="font-mono text-xs text-muted">What it may change, and who decides</p>
        <div className="mt-4 space-y-2">
          {TIERS.map((t, i) => (
            <motion.div
              key={t.tier}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: easeOut }}
              style={{ marginLeft: `calc(${i} * min(3%, 1.25rem))` }}
              className="grid grid-cols-1 items-center gap-x-5 gap-y-1 rounded-xl border border-rule bg-paper-2/50 px-4 py-3 sm:grid-cols-[4.5rem_minmax(0,1fr)_auto]"
            >
              <span className="font-mono text-sm text-honey tabular-nums">Tier {t.tier}</span>
              <span className="text-[15px] text-body">{t.change}</span>
              <span className="text-sm text-muted">{t.who}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
