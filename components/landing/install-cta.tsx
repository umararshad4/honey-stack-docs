import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { installCommand } from "@/lib/site";
import { Code } from "../code";
import { Magnetic } from "../magnetic";
import { Reveal, Words } from "../reveal";

const STEPS = [
  { cmd: "bin/honey install --dry-run", body: "Prints exactly what will change. Nothing is written." },
  { cmd: "bin/honey install", body: "Installs into Claude Code and Codex, puts honey on PATH." },
  { cmd: "honey doctor", body: "Confirms the hooks are installed, enabled and delivering." },
];

export function InstallCta() {
  return (
    <section className="mx-auto max-w-6xl px-5 pt-12 pb-28 sm:px-8 sm:pb-36">
      <Reveal spotlight className="relative overflow-hidden rounded-3xl border border-rule bg-paper-2/70 p-6 sm:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 -right-24 size-[28rem] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--color-honey)_14%,transparent),transparent)]"
        />
        <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
          <div>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-[2.6rem] sm:leading-[1.08]">
              <Words text="Install in one line." accent="one line." />
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-muted">
              Needs Claude Code and/or Codex, python3 3.9+ and git. macOS and Linux. Every change is reversible with{" "}
              <code className="font-mono text-[15px] text-ink">honey uninstall</code>.
            </p>
            <div className="mt-6">
              <Code>{installCommand}</Code>
            </div>
            <Magnetic className="mt-6">
              <Link
                href="/docs/install"
                className="group sheen inline-flex items-center gap-1.5 rounded-full bg-honey px-5 py-2.5 text-sm font-medium text-on-honey shadow-glow transition-transform duration-(--dur-micro) active:scale-[0.97]"
              >
                Installation guide
                <ArrowRight size={15} className="transition-transform duration-(--dur-short) group-hover:translate-x-0.5" />
              </Link>
            </Magnetic>
          </div>
          <ol className="space-y-5 lg:pt-2">
            {STEPS.map((s, i) => (
              <li key={s.cmd} className="flex gap-4">
                <span className="grid size-7 shrink-0 place-items-center rounded-full border border-rule-strong font-mono text-xs text-honey tabular-nums">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-sm break-words text-ink">{s.cmd}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>
    </section>
  );
}
