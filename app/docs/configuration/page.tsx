import Link from "next/link";
import { Code } from "@/components/code";
import { Bullets, DocHeader, H2 } from "@/components/docs/prose";
import { pageMetadata } from "@/lib/seo";

const PATH = "/docs/configuration";

export const metadata = pageMetadata(PATH);

export default function Page() {
  return (
    <>
      <DocHeader
        path={PATH}
        title="Configuration"
        lede="Everything lives in ~/.honey/config.json, and every key is optional. The defaults are the recommended setup."
      />
      <div className="prose-docs">
        <H2 id="config-file">The config file</H2>
        <Code lang="json" title="~/.honey/config.json">{`{
  "mode": "direct",
  "budgets":  {"enabled": true, "reflection_usd": 0.15, "weekly_usd": 1.5, "monthly_usd": 5},
  "autonomy": {"min_sessions": 2, "holdout_rate": 0}
}`}</Code>

        <H2 id="keys">Useful keys</H2>
        <Bullets>
          <li>
            <code>holdout_rate: 0.1</code> leaves the brief out of 10% of sessions, so <code>/rsi coach</code> can measure whether rules actually help.
          </li>
          <li>
            <code>budgets.enabled: false</code> removes the rolling weekly and monthly dollar caps and the per-call dollar limits. Usage is still
            recorded, and rate limits, validation and provider limits still apply. <code>honey rsi status --json</code> reports{" "}
            <code>budget_caps_enabled</code>.
          </li>
          <li>
            <code>{`"autoupdate": false`}</code> turns off automatic updates.
          </li>
          <li>
            Lots of other skills installed? <code>honey install --skill-budget 0.02</code> gives skill descriptions more room (Claude only).
          </li>
        </Bullets>

        <H2 id="privacy">Privacy</H2>
        <p>
          No telemetry. Only redacted snippets of up to 300 characters are stored. Network use is limited to your model provider and the upstream
          radar&apos;s public <code>git fetch</code> — plus GitHub, only if you opt into <Link href="/docs/publishing">publishing</Link>.
        </p>

        <H2 id="platforms">Platforms</H2>
        <p>macOS and Linux. Windows isn&apos;t supported yet.</p>
      </div>
    </>
  );
}
