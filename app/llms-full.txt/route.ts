import { getLatestVersion, getRepoDoc } from "@/lib/github";
import { repoPath, site } from "@/lib/site";

/** The project's own Markdown docs, so AI assistants can read everything in one fetch. */
const DOCS = ["README.md", "docs/setup.md", "docs/skills.md", "docs/rsi.md", "docs/task-evidence.md", "docs/development.md"];

/** Full-text companion to /llms.txt (https://llmstxt.org): every repo doc, concatenated. */
export async function GET() {
  const [version, ...docs] = await Promise.all([getLatestVersion(), ...DOCS.map(getRepoDoc)]);
  const sections = DOCS.map((path, i) => (docs[i] ? `<!-- Source: ${repoPath(path)} -->\n\n${docs[i]}` : "")).filter(Boolean);

  const body = `# ${site.name} — full documentation

> ${site.description}

Latest release: ${version}. Site: ${site.url}. Source: ${site.repo}. Summary and page index: ${site.url}/llms.txt

${sections.join("\n\n---\n\n")}
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
