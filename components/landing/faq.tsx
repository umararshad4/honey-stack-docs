"use client";

import { Plus } from "lucide-react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useId, useState } from "react";
import { faq } from "@/lib/faq";
import { easeOut, SectionHead } from "../reveal";

export function Faq() {
  const reduce = useReducedMotion();
  const id = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHead
            id="faq"
            title="Questions, answered plainly."
            accent="answered plainly."
            lede="The short version of what people ask before installing. Everything else lives in the docs."
          />
        </div>

        <ul className="divide-y divide-rule border-y border-rule">
          {faq.map((item, i) => {
            const expanded = open === i;
            return (
              <li key={item.q}>
                <h3>
                  <button
                    type="button"
                    id={`${id}-q-${i}`}
                    aria-expanded={expanded}
                    aria-controls={`${id}-a-${i}`}
                    onClick={() => setOpen(expanded ? null : i)}
                    className="group flex w-full items-center justify-between gap-6 py-5 text-left"
                  >
                    <span className={`text-[17px] transition-colors duration-(--dur-short) ${expanded ? "text-ink" : "text-body group-hover:text-ink"}`}>
                      {item.q}
                    </span>
                    <motion.span
                      animate={{ rotate: expanded ? 45 : 0 }}
                      transition={{ type: "spring", stiffness: 420, damping: 26 }}
                      className={`grid size-8 shrink-0 place-items-center rounded-full border transition-colors duration-(--dur-short) ${
                        expanded ? "border-honey/60 bg-honey/10 text-honey" : "border-rule text-muted group-hover:text-ink"
                      }`}
                    >
                      <Plus size={15} aria-hidden="true" />
                    </motion.span>
                  </button>
                </h3>
                {/* Answers stay in the DOM when collapsed, so search engines and find-in-page still see them. */}
                <motion.div
                  id={`${id}-a-${i}`}
                  role="region"
                  aria-labelledby={`${id}-q-${i}`}
                  aria-hidden={!expanded}
                  inert={!expanded}
                  initial={false}
                  animate={expanded ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                  transition={{ duration: reduce ? 0.15 : 0.45, ease: easeOut }}
                  className="overflow-hidden"
                >
                  <motion.p
                    initial={false}
                    animate={{ y: expanded || reduce ? 0 : -8 }}
                    transition={{ duration: 0.45, ease: easeOut }}
                    className="pr-14 pb-6 text-[15px] leading-relaxed text-muted"
                  >
                    {item.a}
                  </motion.p>
                </motion.div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
