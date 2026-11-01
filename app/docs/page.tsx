import type { Metadata } from "next";
import Link from "next/link";
import { Bullets, Callout, DocHeader, H2 } from "@/components/docs/prose";
import { docsNav } from "@/lib/nav";

export const metadata: Metadata = { title: "Introduction" };

export default function Page() {
  return (
    <>
      <DocHeader
        title="Introduction"
        lede="honey-stack is one always-on toolkit for Claude Code and Codex. It keeps a small set of rules in every session, loads skills only when a task needs them, and learns from how your sessions actually go."
      />
      <div className="prose-docs">
        <H2 id="what-it-is">What it is</H2>
        <p>
          It distills the best of{" "}
          <a href="https://github.com/obra/superpowers">Superpowers</a>, <a href="https://github.com/DietrichGebert/ponytail">Ponytail</a>,{" "}
          <a href="https://github.com/mattpocock/skills">Matt Pocock&apos;s skills</a>,{" "}
          <a href="https://github.com/cursor/plugins/tree/main/pstack">pstack</a> and <a href="https://github.com/garrytan/gstack">gstack</a> into{" "}
          <strong>one layer</strong>, then adds <strong>RSI</strong> — recursive self-improvement. RSI learns from your corrections and can apply
          validated improvements on its own once you allow it.
        </p>
        <p>
          It ships as the plugin <code>honey</code> in the marketplace <code>honey-stack</code>, with the id <code>honey@honey-stack</code> on both
          agents, plus a <code>honey</code> command-line tool.
        </p>

        <H2 id="why">Why one layer</H2>
        <p>
          Stacking toolkits means every session starts with roughly 25 KB of competing “YOU MUST” text. The prompts overlap, contradict each other and
          crowd out your code. honey-stack replaces that with about 2 KB of rules that agree with each other.
        </p>
        <Bullets>
          <li>
            <strong>Small.</strong> About 2 KB of always-on rules instead of about 25 KB of stacked prompts.
          </li>
          <li>
            <strong>Opinionated.</strong> It sizes each task, makes the smallest complete change and proves it before saying “done”.
          </li>
          <li>
            <strong>You choose.</strong> Learned rules apply on their own; autonomous RSI is opt-in and applies validated improvements tier by tier.
          </li>
          <li>
            <strong>Local and reversible.</strong> Data lives in <code>~/.honey/</code>, and <code>honey uninstall</code> restores everything.
          </li>
        </Bullets>

        <H2 id="how-it-fits">How the pieces fit</H2>
        <p>
          Lifecycle <Link href="/docs/hooks">hooks</Link> call one entry point, <code>bin/honey</code>. At session start it injects the{" "}
          <Link href="/docs/rules">always-on rules</Link> and your learned brief. During the session a guard, a secret scan and a receipt gate run
          around tool calls. When the session ends, <Link href="/docs/rsi">RSI</Link> reflects on what happened. The agent picks{" "}
          <Link href="/docs/skills">skills</Link> as tasks arrive.
        </p>
        <Callout title="The indicator">
          Replies start with <code>🍯 HONEY · direct</code> (or your chosen mode) when the rules are loaded. If it says{" "}
          <code>hooks unverified</code>, instructions loaded but native hook delivery hasn&apos;t been observed yet — run <code>honey doctor</code>.
        </Callout>

        <H2 id="map">Docs map</H2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {docsNav
            .flatMap((g) => g.links)
            .filter((l) => l.href !== "/docs")
            .map((l) => (
              <Link
                key={l.href}
                href={l.href}
                data-plain=""
                className="group rounded-xl border border-rule p-4 transition-colors hover:border-rule-strong hover:bg-paper-2"
              >
                <span className="block font-medium text-ink">{l.title}</span>
                <span className="mt-1 block text-sm text-muted">{l.blurb}</span>
              </Link>
            ))}
        </div>
      </div>
    </>
  );
}
