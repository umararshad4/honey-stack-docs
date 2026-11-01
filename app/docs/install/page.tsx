import type { Metadata } from "next";
import { Code } from "@/components/code";
import { Callout, DocHeader, H2, Steps } from "@/components/docs/prose";
import { installCommand } from "@/lib/site";

export const metadata: Metadata = { title: "Installation" };

export default function Page() {
  return (
    <>
      <DocHeader
        title="Installation"
        lede="One command installs honey-stack into Claude Code and Codex, puts honey on your PATH and turns off competing always-on plugins. Every change is reversible."
      />
      <div className="prose-docs">
        <H2 id="requirements">Requirements</H2>
        <p>
          Claude Code and/or Codex, <code>python3</code> 3.9 or newer, and <code>git</code>. macOS and Linux are supported; Windows isn&apos;t yet.
        </p>

        <H2 id="quick-install">Quick install</H2>
        <p>The script clones the repository and runs a dry run. It then prints the install command to run.</p>
        <Code>{installCommand}</Code>
        <p>Or do it by hand:</p>
        <Code>{`git clone https://github.com/umararshad4/honey-stack.git && cd honey-stack
bin/honey install --dry-run && bin/honey install`}</Code>

        <H2 id="plugin-only">Plugin only</H2>
        <p>If you only want the plugin, without the CLI on your PATH:</p>
        <Code>{`claude plugin marketplace add umararshad4/honey-stack && claude plugin install honey@honey-stack
codex plugin marketplace add umararshad4/honey-stack && codex plugin add honey@honey-stack`}</Code>
        <p>
          Pin a version with <code>marketplace add … --ref v0.2.0</code>. In this mode <code>honey</code> isn&apos;t on PATH, so run it as{" "}
          <code>python3 &lt;plugin dir&gt;/bin/honey doctor</code> (the same goes for <code>uninstall</code>).
        </p>

        <H2 id="after-install">After installing</H2>
        <Steps>
          <li>
            <strong>Claude Code:</strong> run <code>/reload-plugins</code>.
          </li>
          <li>
            <strong>Codex:</strong> open <code>/hooks</code> and trust the honey entries.
          </li>
          <li>
            Check everything with <code>honey doctor</code>.
          </li>
        </Steps>

        <H2 id="activation">Global activation</H2>
        <p>
          <code>honey install</code> adds a small managed block to <code>~/.claude/CLAUDE.md</code> and <code>~/.codex/AGENTS.md</code>, preserving
          your personal instructions. At the first user turn it loads <code>honey bootstrap --agent claude</code> (or <code>codex</code>). This
          read-only fallback provides the workflow and the indicator when startup context is missing; it never fakes hook events. Uninstall removes the
          block and keeps any later personal edits.
        </p>

        <H2 id="verify-hooks">Verify hook delivery</H2>
        <p>
          The <code>🍯 HONEY</code> prefix shows that rules were injected. To check whether a session actually receives hooks:
        </p>
        <Code>{`honey doctor --agent codex --session <session-id> --json   # or --agent claude`}</Code>
        <p>
          Installation, enablement, recent delivery and payload coverage are reported separately. For Codex, <code>hook_trust</code> reads the native
          hook registry: <code>review_required</code> means the plugin needs review in <code>/hooks</code>, and <code>unknown</code> means the registry
          couldn&apos;t be checked.
        </p>
        <Callout title="Not proof of enforcement">
          A prefix or a smoke test doesn&apos;t prove hooks are enforced. Saved approvals alone don&apos;t prove current trust either — use{" "}
          <code>honey doctor</code>.
        </Callout>
      </div>
    </>
  );
}
