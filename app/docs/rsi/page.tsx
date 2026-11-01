import type { Metadata } from "next";
import Link from "next/link";
import { Code } from "@/components/code";
import { Callout, DocHeader, H2, Steps, Table } from "@/components/docs/prose";

export const metadata: Metadata = { title: "RSI: how it learns" };

export default function Page() {
  return (
    <>
      <DocHeader
        title="RSI: how it learns"
        lede="Recursive self-improvement watches how sessions actually go, turns repeated corrections into rules, and turns evidence into evaluated skill patches. Every change passes a gate first."
      />
      <div className="prose-docs">
        <H2 id="the-loop">The loop</H2>
        <Steps>
          <li>
            <strong>Observe.</strong> Hooks log bounded, redacted user requests, corrections, “still broken” moments and which skills fired. Feedback is
            classified as behaviour, requirement, preference or environment. Task identity and explicit skill references guide attribution; ambiguous
            feedback stays uncertain rather than blaming every recent skill.
          </li>
          <li>
            <strong>Reflect.</strong> After a session with signal, a small model — Haiku via Claude (about $0.002), otherwise Codex — proposes
            evidence-backed <code>WHEN → THEN</code> rules.
          </li>
          <li>
            <strong>Curate.</strong> A rule goes live once two sessions back it. It goes stale after 30 days and is archived after 90.
          </li>
          <li>
            <strong>Apply.</strong> Review mode queues changes for <code>/rsi review</code>. Autonomous mode applies supported changes after validation.
          </li>
        </Steps>

        <H2 id="tiers">Tiers</H2>
        <Table
          head={["Tier", "Changes", "Who decides"]}
          rows={[
            ["0", "Learned rules in each session's brief (≤1.5 KB)", "Automatic"],
            ["1", "Instruction edits and known toolkit repairs, with backups", "You, or autonomous RSI"],
            ["2", "Skill patches and new skills that pass regression evaluations", "You, or autonomous RSI"],
            ["3", "Enforced guards (≤1% false positives on replay)", "You, or autonomous RSI"],
          ]}
        />

        <H2 id="commands">Commands</H2>
        <Table
          head={["Command", "Use when"]}
          rows={[
            [<code key="a">/rsi autonomy on · off · status</code>, "Enable, disable or inspect automatic application."],
            [<code key="p">/rsi publish on · off · status · run</code>, "Publish suggestions as issues and validated skill changes as PRs."],
            [<code key="i">/rsi improve</code>, "Run a due improvement pass and apply eligible proposals."],
            [<code key="s">/rsi status</code>, "Check it's running and what's queued."],
            [<code key="r">/rsi review</code>, "Claude's status line shows rsi:N — decide on proposals."],
            [<code key="c">/rsi coach</code>, "An evidence-based report on what's improving or repeating."],
            [<code key="b">/rsi bootstrap</code>, "Fresh install: seed rules from your existing agent memories."],
            [<code key="w">/rsi why &lt;id&gt; · forget &lt;id&gt;</code>, "Inspect a rule, or reject it for good."],
          ]}
        />
        <p>
          In Codex, use <code>$rsi …</code> instead of <code>/rsi …</code>. A weekly job also checks upstream toolkits and surfaces only changes that
          match friction you actually had.
        </p>

        <H2 id="autonomy">Autonomous mode</H2>
        <Code>{`honey rsi autonomy on    # persists in ~/.honey/config.json
honey rsi autonomy off   # back to manual review`}</Code>
        <p>
          With autonomy on, session-end and startup catch-up jobs apply up to 20 pending proposals per pass and attempt one evidence-backed skill
          improvement every 24 hours. There is no background daemon — a session triggers due work. Failures rotate behind other eligible work, so one
          blocked patch doesn&apos;t freeze unrelated skills.
        </p>

        <H2 id="skill-patches">How skill patches are earned</H2>
        <p>
          Skill diagnoses route to the patcher using verified user quotes. A brand-new skill needs actual requests from at least two sessions and
          positive and negative trigger evaluations. Keyword-only suggestions stay pending.
        </p>
        <p>
          Each evaluation arm includes generated cases, existing name-matched cases and independently maintained behaviour cases for read-only
          preservation, scoped edits and failed verification. Fixture hashes and exact candidate content are checked before anything applies.
          Evaluator errors and incomplete results never count as passing.
        </p>
        <Callout title="Budgets">
          With dollar caps on, drafting is capped at $0.15 and each evaluation at $0.35, reserved against weekly and monthly budgets before starting.
          A budget deferral doesn&apos;t burn the daily attempt. See <Link href="/docs/configuration">Configuration</Link>.
        </Callout>

        <H2 id="safety">Safety and reversibility</H2>
        <p>
          Instruction edits have conflict-checked <code>honey rsi revert &lt;id&gt;</code> snapshots; toolkit repairs keep installer undo records.
          Guards stay inspectable with <code>honey rsi guards</code>. RSI never executes a proposal&apos;s free-form fix text, and automatic decisions
          never count as user feedback.
        </p>
        <p>
          Edited patch targets, runtime drift and diverged branches block application. Run <code>honey sync</code> from the source checkout once to
          refresh Codex and record the editable source; the plugin cache is never treated as editable.
        </p>
        <p>
          Next: <Link href="/docs/publishing">how improvements are published</Link>.
        </p>
      </div>
    </>
  );
}
