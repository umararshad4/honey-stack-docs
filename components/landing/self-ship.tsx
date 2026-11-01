import { ArrowUpRight } from "lucide-react";
import type { Release } from "@/lib/github";
import { site } from "@/lib/site";
import { SectionHead } from "../reveal";
import { Pipeline } from "./pipeline";

const dateFmt = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

export function SelfShip({ releases }: { releases: Release[] }) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHead
        id="ships-itself"
        title="It ships its own upgrades."
        lede={
          <>
            Opt in with <code className="font-mono text-[15px] text-ink">honey rsi publish automatic</code> and a validated
            improvement travels all the way to every install. No admin bypass, no force push, and your private session data
            never leaves your machine.
          </>
        }
      />

      <div className="mt-14">
        <Pipeline />
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-16">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-ink">Recent releases</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">
            Every green merge to main is versioned and published automatically. Pulled live from GitHub, refreshed hourly.
          </p>
          <a
            href={`${site.repo}/releases`}
            className="mt-4 inline-flex items-center gap-1 text-sm text-ink underline decoration-honey/60 underline-offset-4 hover:decoration-honey"
          >
            All releases <ArrowUpRight size={14} />
          </a>
        </div>

        {releases.length > 0 ? (
          <ul className="divide-y divide-rule border-y border-rule">
            {releases.map((r) => (
              <li key={r.tag}>
                <a
                  href={r.url}
                  className="group grid grid-cols-1 gap-x-5 gap-y-1 py-3.5 transition-colors sm:grid-cols-[5.5rem_6.5rem_minmax(0,1fr)]"
                >
                  <span className="font-mono text-sm text-honey tabular-nums">{r.tag}</span>
                  <span className="text-sm text-muted tabular-nums">{r.date ? dateFmt.format(new Date(r.date)) : "—"}</span>
                  <span className="truncate text-sm text-body transition-colors group-hover:text-ink" title={r.summary}>
                    {r.summary || "See release notes"}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-xl border border-dashed border-rule p-5 text-sm text-muted">
            Release history couldn’t be loaded right now.{" "}
            <a href={`${site.repo}/releases`} className="text-ink underline underline-offset-4">
              View it on GitHub
            </a>
            .
          </p>
        )}
      </div>
    </section>
  );
}
