"use client";

import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { installCommand } from "@/lib/site";
import { CopyButton } from "../copy-button";
import { easeOut } from "../reveal";
import { Honeycomb } from "./honeycomb";
import { Session } from "./session";

const HEADLINE = ["The", "agent", "toolkit", "that", "learns", "from", "you."];

export function Hero({ version, releasesUrl }: { version: string; releasesUrl: string }) {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.15 } }
      : {
          initial: { opacity: 0, y: 16, filter: "blur(8px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: 0.8, delay, ease: easeOut },
        };

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Honeycomb />
      </div>

      <div className="mx-auto grid grid-cols-1 max-w-6xl items-center gap-12 px-5 pt-32 pb-20 sm:px-8 sm:pt-40 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14 lg:pb-28">
        <div className="min-w-0">
          <motion.a
            {...rise(0.05)}
            href={releasesUrl}
            className="group inline-flex items-center gap-2 rounded-full border border-rule bg-paper-2/70 py-1 pr-3 pl-1 text-xs text-muted backdrop-blur transition-colors hover:border-rule-strong hover:text-ink"
          >
            <span className="rounded-full bg-honey/15 px-2 py-0.5 font-mono text-[11px] text-honey tabular-nums">{version}</span>
            Released by its own pipeline
            <ArrowRight size={12} className="transition-transform duration-(--dur-short) group-hover:translate-x-0.5" />
          </motion.a>

          <h1 className="mt-6 text-[2.75rem] leading-[1.02] font-semibold tracking-[-0.045em] text-balance text-ink [overflow-wrap:anywhere] sm:text-6xl lg:text-[4.5rem]">
            {HEADLINE.map((word, i) => (
              <motion.span key={word + i} className="inline-block whitespace-pre" {...rise(0.12 + i * 0.055)}>
                {word === "learns" ? <span className="text-honey">{word}</span> : word}
                {i < HEADLINE.length - 1 ? " " : ""}
              </motion.span>
            ))}
          </h1>

          <motion.p {...rise(0.55)} className="mt-6 max-w-xl text-[17px] leading-relaxed text-pretty text-muted sm:text-lg">
            honey-stack distills five agent toolkits into one ~2 KB layer for Claude Code and Codex. It sizes every task,
            proves work before calling it done, and turns your corrections into rules — then ships its own improvements.
          </motion.p>

          <motion.div {...rise(0.68)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex min-w-0 items-center gap-1 rounded-full border border-rule-strong bg-paper-2/90 py-1 pr-1 pl-4 shadow-glow backdrop-blur sm:max-w-md">
              <span className="font-mono text-[13px] text-honey select-none">$</span>
              <code className="min-w-0 truncate px-2 font-mono text-[13px] text-ink" title={installCommand}>
                {installCommand}
              </code>
              <CopyButton text={installCommand} className="rounded-full" />
            </div>
            <Link
              href="/docs"
              className="group inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium whitespace-nowrap text-ink transition-colors hover:bg-paper-3"
            >
              Read the docs
              <ArrowRight size={15} className="transition-transform duration-(--dur-short) ease-out group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>

        <motion.div {...rise(0.4)} className="min-w-0">
          <Session />
        </motion.div>
      </div>
    </section>
  );
}
