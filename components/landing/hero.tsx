"use client";

import { ArrowRight } from "lucide-react";
import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import Link from "next/link";
import { Fragment, useRef, type PointerEvent, type ReactNode } from "react";
import { installCommand } from "@/lib/site";
import { skillCount } from "@/lib/skills";
import { CopyButton } from "../copy-button";
import { Count } from "../count";
import { Magnetic } from "../magnetic";
import { cssDelay } from "../rise-words";
import { Honeycomb } from "./honeycomb";
import { Session } from "./session";

const HEADLINE = ["The", "agent", "toolkit", "that", "learns", "from", "you."];

const STATS = [
  { value: 2, prefix: "~", suffix: " KB", label: "always-on rules" },
  { value: skillCount, suffix: "", label: "skills on demand" },
  { value: 2, suffix: "", label: "agents, one memory" },
  { value: 0, suffix: "", label: "telemetry" },
];

/** Tilts toward the cursor in 3D; flat for touch and reduced motion. */
function Tilt({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 18 });
  const sry = useSpring(ry, { stiffness: 150, damping: 18 });

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 9);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 7);
  }

  return (
    <div
      className="[perspective:1100px]"
      onPointerMove={onMove}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      <motion.div style={{ rotateX: srx, rotateY: sry }}>{children}</motion.div>
    </div>
  );
}

function Parallax({ progress, distance, children, className }: { progress: MotionValue<number>; distance: number; children: ReactNode; className?: string }) {
  const y = useTransform(progress, [0, 1], [0, distance]);
  const opacity = useTransform(progress, [0, 0.85], [1, 0]);
  return (
    <motion.div style={{ y, opacity }} className={className}>
      {children}
    </motion.div>
  );
}

export function Hero({ version, releasesUrl }: { version: string; releasesUrl: string }) {
  const reduce = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.3 });
  const fieldScale = useTransform(progress, [0, 1], [1, 1.12]);
  const fieldOpacity = useTransform(progress, [0, 0.9], [1, 0.25]);

  // The entrance below is CSS (.rise-in / .mask-rise / .draw-in): it starts on first paint,
  // so the hero never waits for hydration and LCP lands early on slow phones.
  return (
    <section ref={section} className="relative isolate overflow-hidden">
      <motion.div className="absolute inset-0 -z-10 origin-top-left" style={reduce ? undefined : { scale: fieldScale, opacity: fieldOpacity }}>
        <Honeycomb />
      </motion.div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-5 pt-32 pb-16 sm:px-8 sm:pt-40 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14 lg:pb-24">
        <Parallax progress={progress} distance={reduce ? 0 : -90} className="min-w-0">
          <a
            href={releasesUrl}
            style={cssDelay(0.05)}
            className="rise-in group sheen inline-flex items-center gap-2 rounded-full border border-rule bg-paper-2/70 py-1 pr-3 pl-1 text-xs text-muted backdrop-blur transition-colors hover:border-rule-strong hover:text-ink"
          >
            <span className="relative flex size-2 items-center justify-center pl-0.5">
              <span className="absolute size-2 animate-ping rounded-full bg-honey/60 motion-reduce:hidden" />
              <span className="relative size-1.5 rounded-full bg-honey" />
            </span>
            <span className="rounded-full bg-honey/15 px-2 py-0.5 font-mono text-[11px] text-honey tabular-nums">{version}</span>
            Released by its own pipeline
            <ArrowRight size={12} className="transition-transform duration-(--dur-short) group-hover:translate-x-0.5" />
          </a>

          <h1 className="mt-6 text-[2.75rem] leading-[1.02] font-semibold tracking-[-0.045em] text-balance text-ink [overflow-wrap:anywhere] sm:text-6xl lg:text-[4.5rem]">
            {HEADLINE.map((word, i) => (
              <Fragment key={word + i}>
                <span className="relative inline-block">
                  <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
                    <span className={`mask-rise inline-block ${word === "learns" ? "text-honey" : ""}`} style={cssDelay(0.08 + i * 0.06)}>
                      {word}
                    </span>
                  </span>
                  {word === "learns" && (
                    <svg aria-hidden="true" viewBox="0 0 200 14" preserveAspectRatio="none" className="absolute -bottom-[0.1em] left-0 h-[0.16em] w-full overflow-visible">
                      <path
                        d="M2 9 C 50 3, 120 2, 198 7"
                        pathLength={1}
                        fill="none"
                        stroke="var(--color-honey)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        className="draw-in"
                        style={cssDelay(0.85)}
                      />
                    </svg>
                  )}
                </span>
                {i < HEADLINE.length - 1 ? " " : null}
              </Fragment>
            ))}
          </h1>

          <p style={cssDelay(0.3)} className="rise-in mt-6 max-w-xl text-[17px] leading-relaxed text-pretty text-muted sm:text-lg">
            honey-stack distills five agent toolkits into one ~2 KB layer for Claude Code and Codex. It sizes every task,
            proves work before calling it done, and turns your corrections into rules — then ships its own improvements.
          </p>

          <div style={cssDelay(0.45)} className="rise-in mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div
              data-spotlight=""
              className="flex min-w-0 items-center gap-1 rounded-full border border-rule-strong bg-paper-2/90 py-1 pr-1 pl-4 shadow-glow backdrop-blur sm:max-w-md"
            >
              <span className="font-mono text-[13px] text-honey select-none">$</span>
              <code className="min-w-0 truncate px-2 font-mono text-[13px] text-ink" title={installCommand}>
                {installCommand}
              </code>
              <CopyButton text={installCommand} className="rounded-full" />
            </div>
            <Magnetic>
              <Link
                href="/docs"
                className="group inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium whitespace-nowrap text-ink transition-colors hover:bg-paper-3"
              >
                Read the docs
                <ArrowRight size={15} className="transition-transform duration-(--dur-short) ease-out group-hover:translate-x-0.5" />
              </Link>
            </Magnetic>
          </div>

          <dl style={cssDelay(0.6)} className="rise-in mt-10 grid max-w-xl grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
            {STATS.map((s, i) => (
              <div key={s.label} className="border-l border-rule pl-3">
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-mono text-xl text-ink">
                  <Count to={s.value} delay={0.7 + i * 0.12} prefix={s.prefix} suffix={s.suffix} />
                </dd>
                <dd className="mt-0.5 text-xs text-muted" aria-hidden="true">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </Parallax>

        <Parallax progress={progress} distance={reduce ? 0 : -40} className="min-w-0">
          <div className="rise-in" style={cssDelay(0.35)}>
            <Tilt>
              <Session />
            </Tilt>
          </div>
        </Parallax>
      </div>
    </section>
  );
}
