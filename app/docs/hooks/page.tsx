import type { Metadata } from "next";
import { Callout, DocHeader, H2, Table } from "@/components/docs/prose";

export const metadata: Metadata = { title: "Hooks & safety" };

export default function Page() {
  return (
    <>
      <DocHeader
        title="Hooks & safety"
        lede="Every lifecycle event in Claude Code and Codex calls one frozen command. All logic lives behind it in a small, stdlib-only Python package."
      />
      <div className="prose-docs">
        <H2 id="one-entry-point">One entry point</H2>
        <p>
          Both agents run <code>python3 bin/honey hook --agent claude</code> (or <code>codex</code>) on each event. The command strings are{" "}
          <strong>frozen</strong>: Codex trusts each hook entry by hash, so keeping them fixed means updates don&apos;t silently invalidate your
          trust. The package is Python 3.9-compatible and uses only the standard library.
        </p>

        <H2 id="what-runs">What runs, and when</H2>
        <Table
          head={["Event", "What honey does"]}
          rows={[
            ["Session start", "Injects the always-on rules, your mode, the indicator and the learned brief (≤1.5 KB)."],
            ["Prompt submit", "Handles modes, remember: rules and task scope; records bounded, redacted signals for RSI."],
            ["Before a tool call", "The guard inspects shell commands for catastrophic or risky operations."],
            ["After a tool call", "The secret scan checks newly written text for keys and tokens."],
            ["Stop", "The receipt gate asks for the Checks run line after a turn that edited files."],
            ["Session end", "Starts reflection in the background when the session had signal."],
          ]}
        />

        <H2 id="guard">The guard</H2>
        <p>
          The guard tokenizes shell commands — respecting quotes and operators — and inspects the real command and arguments. Dangerous words used as
          data pass, while real destructive commands are caught, including ones hidden behind <code>bash -lc</code>, git global options or pipes like{" "}
          <code>xargs rm -rf</code>.
        </p>
        <p>
          Recoverable-but-risky commands (git history, cloud resources) are asked about; catastrophic ones are denied. Under bypass permissions, or on
          Codex, every hit is a deny. The guard stays on even when you say <code>honey off</code>.
        </p>
        <Callout title="A safety net, not a sandbox">
          Runtime indirection like <code>a=/; rm -rf $a</code> or decoded payloads can get through. Treat the guard as a last line of defence.
        </Callout>

        <H2 id="secret-scan">Secret scan</H2>
        <p>
          After writes, only the <strong>new</strong> text is scanned — so old fixtures don&apos;t re-fire forever. It looks for Anthropic and OpenAI
          keys, private keys, AWS access keys, GitHub, Slack and Stripe live tokens, and hard-coded secrets.
        </p>

        <H2 id="receipt-gate">Receipt gate</H2>
        <p>
          After a turn that edited files, the stop hook asks once for the receipt line — <code>Checks run: … Skipped: … Risk: …</code>. Question and
          answer turns are never nagged, and honest “not yet verified” reports are allowed.
        </p>
      </div>
    </>
  );
}
