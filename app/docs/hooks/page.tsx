import { Callout, DocHeader, H2, Table } from "@/components/docs/prose";
import { pageMetadata } from "@/lib/seo";

const PATH = "/docs/hooks";

export const metadata = pageMetadata(PATH);

export default function Page() {
  return (
    <>
      <DocHeader
        path={PATH}
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
          Every hit is advisory: honey adds a warning to the agent&apos;s context and records it, but never blocks or denies the command. The guard
          stays on even when you say <code>honey off</code>.
        </p>
        <p>
          It stays quiet on routine cleanup. <code>rm -rf</code> and <code>find -delete</code> on absolute paths strictly inside the tool call&apos;s
          working directory or a temp dir pass; the directory itself, <code>&lt;root&gt;/*</code>, <code>..</code> escapes, siblings, home and{" "}
          <code>/</code> still warn. Heredoc bodies are data unless a shell consumes them (<code>bash &lt;&lt;EOF</code>, <code>| sh</code>,{" "}
          <code>eval &quot;$(cat &lt;&lt;EOF</code>, or <code>$( )</code> in an unquoted heredoc). Anything ambiguous — a quoted, commented or
          unterminated <code>&lt;&lt;</code> — stays under inspection. Windows drive and backslash paths are compared the same way.
        </p>
        <Callout title="A safety net, not a sandbox">
          Runtime indirection like <code>a=/; rm -rf $a</code> or decoded payloads can get through. Treat the guard as a last line of defence.
        </Callout>

        <H2 id="speed">Speed</H2>
        <p>
          Hooks run on every tool call — about 180 times in an average session — so each event loads only the code it needs. Measured on an M1 Pro,
          v1.2.0 against v1.3.0:
        </p>
        <Table
          head={["Hook", "v1.2.0", "v1.3.0"]}
          rows={[
            ["Before a tool call", "55.4 ms", "31.2 ms"],
            ["After a tool call", "54.5 ms", "30.6 ms"],
            ["Prompt submit", "55.9 ms", "36.9 ms"],
            ["Stop", "54.6 ms", "36.2 ms"],
            ["Session start", "62.2 ms", "51.8 ms"],
          ]}
        />
        <p>
          A test fails the build if heavy modules creep back into the tool-call path, so the gain can&apos;t quietly regress.
        </p>

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
