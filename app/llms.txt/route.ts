import { faq } from "@/lib/faq";
import { getLatestVersion } from "@/lib/github";
import { docsNav } from "@/lib/nav";
import { absolute, pageSeo } from "@/lib/seo";
import { installCommand, site } from "@/lib/site";
import { skillCount } from "@/lib/skills";

/** A plain-text map of the site for AI assistants (https://llmstxt.org). */
export async function GET() {
  const version = await getLatestVersion();
  const sections = docsNav
    .map((group) => {
      const links = group.links.map((l) => `- [${l.title}](${absolute(l.href)}): ${pageSeo(l.href).description}`);
      return `## ${group.label}\n\n${links.join("\n")}`;
    })
    .join("\n\n");

  const body = `# ${site.name}

> ${site.description}

Latest release: ${version}. License: MIT. Platforms: macOS and Linux. Requires Claude Code and/or Codex, python3 3.9+ and git.

Key facts:
- About 2 KB of always-on rules replace roughly 25 KB of stacked toolkit prompts.
- ${skillCount} skills load only when a task needs them; four subagents (planner, implementer, reviewer, verifier).
- Rules: size the task first, take the smallest complete change, prove work before saying done, decide routine choices instead of asking.
- RSI (recursive self-improvement) learns WHEN → THEN rules from corrections; skill patches must pass regression evaluations.
- No telemetry; data stays in ~/.honey; \`honey uninstall\` reverses the install.

Install: \`${installCommand}\`

${sections}

## FAQ

${faq.map((item) => `- ${item.q} ${item.a}`).join("\n")}

## Source

- [GitHub repository](${site.repo})
- [Releases](${site.repo}/releases)
- [Changelog](${site.repo}/blob/main/CHANGELOG.md)
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
