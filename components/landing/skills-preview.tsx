"use client";

import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { autoSkills, manualSkills, skillCount, type Skill } from "@/lib/skills";
import { easeOut, SectionHead } from "../reveal";

function Group({ title, note, skills, onPick, picked }: {
  title: string;
  note: string;
  skills: Skill[];
  picked: string;
  onPick: (s: Skill) => void;
}) {
  return (
    <div>
      <p className="text-sm text-ink">
        {title} <span className="text-muted">· {note}</span>
      </p>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {skills.map((s) => (
          <li key={s.name}>
            <button
              type="button"
              onPointerEnter={() => onPick(s)}
              onFocus={() => onPick(s)}
              onClick={() => onPick(s)}
              aria-pressed={picked === s.name}
              className={`rounded-full border px-3 py-1 font-mono text-[13px] transition-colors duration-(--dur-micro) ${
                picked === s.name
                  ? "border-honey/70 bg-honey/10 text-honey"
                  : "border-rule text-body hover:border-rule-strong hover:text-ink"
              }`}
            >
              {s.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SkillsPreview() {
  const [picked, setPicked] = useState<Skill>(autoSkills[3]);

  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHead
        id="skills"
        title={`${skillCount} skills. It picks the right one.`}
        lede="Skills stay out of context until a task needs them. Most fire on their own; the rest are a slash command away — /honey:<skill> in Claude Code, $<skill> in Codex."
      />

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.6fr)] lg:gap-14">
        <div className="space-y-8">
          <Group title="Chosen for you" note={`${autoSkills.length} skills`} skills={autoSkills} picked={picked.name} onPick={setPicked} />
          <Group title="Yours to call" note={`${manualSkills.length} skills`} skills={manualSkills} picked={picked.name} onPick={setPicked} />
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="min-h-[9.5rem] rounded-2xl border border-rule bg-paper-2/60 p-6" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div
                key={picked.name}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: easeOut }}
              >
                <p className="font-mono text-honey">{picked.name}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-body">{picked.summary}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <Link
            href="/docs/skills"
            className="group mt-4 inline-flex items-center gap-1.5 text-sm text-ink"
          >
            Every skill and subagent
            <ArrowRight size={14} className="transition-transform duration-(--dur-short) group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
