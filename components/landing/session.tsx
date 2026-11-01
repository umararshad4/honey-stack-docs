"use client";

import { RotateCcw } from "lucide-react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { easeOut } from "../reveal";

const PROMPT = "fix the flaky checkout test";

type Line = { key: string; label?: string; text: string; tone?: "honey" | "ok" | "receipt" | "learn" };

const LINES: Line[] = [
  { key: "indicator", text: "🍯 HONEY · direct", tone: "honey" },
  { key: "size", label: "size", text: "small change · fixture, not retry" },
  { key: "skill", label: "skill", text: "debug → root cause before fix" },
  { key: "cause", label: "cause", text: "cart state leaks between tests" },
  { key: "fix", label: "fix", text: "isolate cart per test · 1 file" },
  { key: "proof", label: "proof", text: "pnpm test checkout ✓ 14 passed", tone: "ok" },
  { key: "receipt", text: "Checks run: pnpm test checkout · Risk: none", tone: "receipt" },
  { key: "learn", label: "rsi", text: "WHEN state leaks → THEN isolate it", tone: "learn" },
];

const toneClass: Record<NonNullable<Line["tone"]>, string> = {
  honey: "text-honey font-medium",
  ok: "text-ok",
  receipt: "text-muted",
  learn: "text-honey/90",
};

/** A replayable, scripted session that shows the always-on rules at work. */
export function Session() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const [typedCount, setTyped] = useState(0);
  const [shownCount, setShown] = useState(0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let t = 350;
    for (let i = 1; i <= PROMPT.length; i++) {
      timers.push(setTimeout(() => setTyped(i), t));
      t += 28 + (i % 5 === 0 ? 40 : 0);
    }
    t += 420;
    for (let i = 1; i <= LINES.length; i++) {
      timers.push(setTimeout(() => setShown(i), t));
      t += i === 1 ? 520 : i === 5 ? 700 : 380;
    }
    return () => timers.forEach(clearTimeout);
  }, [inView, reduce, run]);

  // Reduced motion shows the finished session instead of playing it.
  const typed = reduce && inView ? PROMPT.length : typedCount;
  const shown = reduce && inView ? LINES.length : shownCount;
  const done = shown === LINES.length;

  function replay() {
    setTyped(0);
    setShown(0);
    setRun((r) => r + 1);
  }

  return (
    <figure
      ref={ref}
      className="relative rounded-2xl border border-rule bg-paper-2/80 p-5 font-mono text-[12.5px] leading-[1.9] shadow-float backdrop-blur-sm sm:p-6 sm:text-[13px]"
      aria-label="Example honey-stack session"
    >
      <p className="flex min-h-[1.9em] items-baseline gap-2 text-ink">
        <span className="text-honey">›</span>
        <span>
          {PROMPT.slice(0, typed)}
          {shown === 0 && (
            <span className="ml-px inline-block h-[1.05em] w-[0.55em] translate-y-[0.15em] animate-blink bg-honey/80" />
          )}
        </span>
      </p>

      <div className="mt-3 min-h-[15.2em] border-t border-rule pt-3 sm:min-h-[15.2em]">
        <AnimatePresence initial={false}>
          {LINES.slice(0, shown).map((line) => (
            <motion.p
              key={`${run}-${line.key}`}
              initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.45, ease: easeOut }}
              className={`flex gap-3 ${line.tone ? toneClass[line.tone] : "text-body"} ${
                line.tone === "receipt" ? "mt-1.5 border-t border-dashed border-rule pt-1.5" : ""
              }`}
            >
              {line.label && <span className="w-11 shrink-0 text-faint">{line.label}</span>}
              <span className="min-w-0">{line.text}</span>
            </motion.p>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {done && !reduce && (
          <motion.button
            type="button"
            onClick={replay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 font-sans text-xs text-muted transition-colors hover:bg-paper-3 hover:text-ink"
          >
            <RotateCcw size={12} /> Replay
          </motion.button>
        )}
      </AnimatePresence>
    </figure>
  );
}
