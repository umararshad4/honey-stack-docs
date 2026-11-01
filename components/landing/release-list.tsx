"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import type { Release } from "@/lib/github";
import { easeOut } from "../reveal";

const dateFmt = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

export function ReleaseList({ releases }: { releases: Release[] }) {
  const reduce = useReducedMotion();
  return (
    <motion.ul
      className="divide-y divide-rule border-y border-rule"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
    >
      {releases.map((r, i) => (
        <motion.li
          key={r.tag}
          variants={{
            hidden: reduce ? { opacity: 0 } : { opacity: 0, x: -12 },
            show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: easeOut } },
          }}
        >
          <a
            href={r.url}
            data-spotlight=""
            className="group grid grid-cols-1 gap-x-5 gap-y-1 rounded-lg py-3.5 transition-transform duration-(--dur-long) ease-out hover:translate-x-1.5 sm:grid-cols-[5.5rem_6.5rem_minmax(0,1fr)_1rem]"
          >
            <span className="flex items-center gap-2 font-mono text-sm text-honey tabular-nums">
              {i === 0 && (
                <>
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-honey shadow-[0_0_10px_var(--color-honey)]" />
                  <span className="sr-only">Latest:</span>
                </>
              )}
              {r.tag}
            </span>
            <span className="text-sm text-muted tabular-nums">{r.date ? dateFmt.format(new Date(r.date)) : "—"}</span>
            <span className="truncate text-sm text-body transition-colors group-hover:text-ink" title={r.summary}>
              {r.summary || "See release notes"}
            </span>
            <ArrowUpRight
              size={14}
              aria-hidden="true"
              className="hidden -translate-x-1 self-center text-honey opacity-0 transition-all duration-(--dur-short) group-hover:translate-x-0 group-hover:opacity-100 sm:block"
            />
          </a>
        </motion.li>
      ))}
    </motion.ul>
  );
}
