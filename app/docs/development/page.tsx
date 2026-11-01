import { Code } from "@/components/code";
import { DocHeader, H2, Table } from "@/components/docs/prose";
import { repoPath } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

const PATH = "/docs/development";

export const metadata = pageMetadata(PATH);

export default function Page() {
  return (
    <>
      <DocHeader
        path={PATH}
        title="Development"
        lede="Stdlib tests, plugin validation and evals locally — then every green merge to main versions and publishes itself."
      />
      <div className="prose-docs">
        <H2 id="local-checks">Local checks</H2>
        <Code>{`python3 tests/run.py                    # stdlib self-checks
claude plugin validate .
claude plugin eval . --tag smoke --runs 1 --ablation none --max-cost-usd 2 --no-publish --allow-tools Bash Write Edit
python3 scripts/release.py X.Y.Z --push # optional manual release`}</Code>
        <p>
          The runner gives every test script temporary state and a fake model provider, so tests run offline and never make paid model calls.
          JavaScript regex compatibility is also checked when Node is installed.
        </p>

        <H2 id="automatic-releases">Automatic releases</H2>
        <p>
          Every push or merge to <code>main</code> runs the full CI matrix, then versions and publishes the tested revision. Conventional commits pick
          the bump:
        </p>
        <Table
          head={["Commit", "Release"]}
          rows={[
            [<code key="f">feat: …</code>, "Minor"],
            [<code key="b">feat!: … or BREAKING CHANGE:</code>, "Major"],
            ["Anything else", "Patch"],
          ]}
        />
        <p>
          Both plugin manifests, the Python version, the changelog, the release commit and the tag move together. Jobs for the same revision are
          serialised, an atomic push prevents orphan tags, and rerunning a failed job resumes the tagged release instead of bumping again. Failed tests
          never publish.
        </p>

        <H2 id="versioning">Versioning</H2>
        <Table
          head={["Bump", "When"]}
          rows={[
            ["Major", "Breaking changes to hook commands (Codex would need to re-trust), the ~/.honey layout or the CLI"],
            ["Minor", "New skills or RSI capabilities"],
            ["Patch", "Fixes"],
          ]}
        />

        <H2 id="further-reading">Further reading</H2>
        <p>
          <a href={repoPath("CHANGELOG.md")}>Changelog</a> · <a href={repoPath("docs/skill-style.md")}>Skill style guide</a> ·{" "}
          <a href={repoPath("docs/design/plan.md")}>Design plan</a> · <a href={repoPath("THIRD_PARTY.md")}>Credits and licenses</a>
        </p>
      </div>
    </>
  );
}
