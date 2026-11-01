import type { Metadata } from "next";
import { Code } from "@/components/code";
import { Callout, DocHeader, H2, Table } from "@/components/docs/prose";

export const metadata: Metadata = { title: "Modes" };

export default function Page() {
  return (
    <>
      <DocHeader
        title="Modes"
        lede="Pick how much the agent explains. Modes change response detail only — task sizing, verification and safety apply in every mode."
      />
      <div className="prose-docs">
        <H2 id="response-styles">Response styles</H2>
        <p>
          Send a mode as the <strong>whole message</strong>. Add <code>default</code> to save it for new sessions, for example{" "}
          <code>honey direct default</code>.
        </p>
        <Table
          head={["Mode", "Does", "Use when"]}
          rows={[
            [<code key="d">honey direct</code>, "Straight to the point, concise. The default.", "You want the answer and essential details."],
            [<code key="e">honey explain</code>, "Comprehensive explanations with context and examples.", "You want to understand the reasoning."],
            [<code key="b">honey balance</code>, "Moderate detail — not exhaustive, not terse.", "You want the answer with key reasoning."],
            [
              <code key="o">honey off · honey on</code>,
              "Pause or resume for this session. The safety guard stays on.",
              "A task where honey's rules get in the way.",
            ],
          ]}
        />
        <p>
          The indicator shows the active choice, like <code>🍯 HONEY · direct</code>. Run <code>honey status</code> to check it. An explicit request
          for detail always wins over the mode.
        </p>

        <H2 id="teach-a-rule">Teach a rule now</H2>
        <p>
          Don&apos;t wait for RSI to notice a pattern — tell it directly. Scope a rule with <code>(project)</code>, <code>(claude)</code>,{" "}
          <code>(codex)</code> or <code>(skill:&lt;name&gt;)</code>.
        </p>
        <Code>{`remember: when a migration touches users, run the backfill dry-run first
remember (project): use pnpm, never npm`}</Code>

        <H2 id="pause-learning">Pause learning</H2>
        <p>
          <code>rsi off</code> and <code>rsi on</code> pause and resume observation and jobs for the current session.
        </p>
        <Callout title="Older settings">
          Saved legacy <code>terse</code> settings read as <code>direct</code>, and <code>normal</code> as <code>balance</code>. Saving a new default
          replaces the old modes config without touching other settings.
        </Callout>
      </div>
    </>
  );
}
