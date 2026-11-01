import { Code } from "@/components/code";
import { Callout, DocHeader, H2, Steps } from "@/components/docs/prose";
import { pageMetadata } from "@/lib/seo";

const PATH = "/docs/publishing";

export const metadata = pageMetadata(PATH);

export default function Page() {
  return (
    <>
      <DocHeader
        path={PATH}
        title="Publishing"
        lede="Opt in, and honey-stack turns what it learns into GitHub issues and evaluated skill PRs — and, if you allow it, merges and releases them for every install."
      />
      <div className="prose-docs">
        <H2 id="enable">Turn it on</H2>
        <p>Run this from your honey-stack source checkout. It pins the repository and default branch in your local config.</p>
        <Code>{`honey rsi publish on        # issues + PRs, review-only merges
honey rsi publish automatic # also CI-gated merges, releases and auto-updates
honey rsi publish status --json
honey rsi publish off`}</Code>
        <p>
          Publishing needs authenticated <code>gh</code> with permission to create issues, push branches and open PRs.
        </p>

        <H2 id="flow">The full flow</H2>
        <Steps>
          <li>
            <strong>Suggestion → GitHub issue.</strong> Pending toolkit diagnoses, new-skill ideas and upstream proposals become issues during normal
            RSI processing — even with automatic application off. Each issue says it&apos;s unimplemented and needs confirmation.
          </li>
          <li>
            <strong>Evaluation.</strong> The candidate runs against generated, matched and behaviour cases.
          </li>
          <li>
            <strong>Apply and sync locally.</strong> The patch applies to your install and syncs to both agents.
          </li>
          <li>
            <strong>Skill-only commit → PR.</strong> Commits start from the remote base and contain only the evaluated{" "}
            <code>skills/&lt;name&gt;/SKILL.md</code>.
          </li>
          <li>
            <strong>CI-gated merge</strong> (automatic mode). Only after all four CI test jobs pass, the exact head and evaluated base still match, and
            review requirements are met.
          </li>
          <li>
            <strong>Release and install.</strong> The main workflow publishes a versioned release; later RSI passes detect it and install it.
          </li>
        </Steps>

        <H2 id="privacy">What&apos;s shared, what stays local</H2>
        <p>
          Issues share only a bounded, redacted title, diagnosis and proposed next step. Session quotes, session ids and local evidence are excluded.
          PR text uses fixed metadata — never your quotes or the model&apos;s rationale. The skill text itself is shared.
        </p>
        <p>
          Personal preferences, instruction files, machine repairs, guards, session logs and generated evaluation prompts stay local. Local evaluation
          commits and their history are never pushed.
        </p>

        <H2 id="guarantees">Guarantees</H2>
        <p>
          No admin bypass and no force push, ever. Missing checks, failures, changed revisions, requested changes and conflicts remain visible
          blockers. Closed issues aren&apos;t recreated and a closed PR is respected. Failed GitHub requests retry later and look for an existing
          issue or PR first. A publication failure never undoes a successful local application.
        </p>
        <p>
          A clean local checkout still at the private evaluation commit is preserved in an <code>rsi/applied-backup-*</code> branch before moving to
          the public release. New local commits, uncommitted work or a different branch prevent reconciliation.
        </p>
        <Callout title="Published isn't proven">
          Published means the issue or PR exists — not that a suggestion is proven, or that a PR has passed CI or merged. Check{" "}
          <code>honey rsi status</code> for URLs, exact heads or blocked reasons.
        </Callout>
      </div>
    </>
  );
}
