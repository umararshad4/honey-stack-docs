export type Skill = { name: string; summary: string };

/** Skills the agent chooses on its own when the situation matches. */
export const autoSkills: Skill[] = [
  { name: "grill", summary: "Pressure-test an idea when a product decision is missing." },
  { name: "plan", summary: "Scope multi-file or multi-session work into a plan, spec or tickets." },
  { name: "execute", summary: "Work through a plan, ticket set or TODO list continuously." },
  { name: "debug", summary: "Find the root cause of a failure before touching the fix." },
  { name: "tdd", summary: "Build or fix test-first with a red-green loop." },
  { name: "verify", summary: "Run the checks that prove a change before calling it done." },
  { name: "review", summary: "Review diffs, branches and PRs; handle review feedback." },
  { name: "ship", summary: "Commit, push, open PRs, resolve conflicts, finish branches." },
  { name: "deploy", summary: "Cloud and PaaS deploys, containers, IaC and CI/CD." },
  { name: "test-design", summary: "Design the test matrix and hard edge cases before writing tests." },
  { name: "tooling", summary: "Monorepos, lint, format, typecheck, hooks and CI wiring." },
  { name: "database", summary: "Schemas, online migrations, indexes, N+1 and concurrency." },
  { name: "perf", summary: "Profile the real bottleneck and prove the speedup with numbers." },
  { name: "observability", summary: "Logs, metrics, tracing, SLOs and alerting, OpenTelemetry-first." },
  { name: "api-design", summary: "REST, GraphQL, gRPC contracts, versioning, errors, pagination." },
  { name: "upgrade", summary: "Dependency bumps, CVE patches, breaking changes and EOL runtimes." },
  { name: "incident", summary: "Mitigate first, investigate safely, write the postmortem." },
  { name: "frontend", summary: "UI, layout, components, responsive and React or Next.js work." },
  { name: "stageshow", summary: "Mocked product illustrations and animated cursor demos." },
  { name: "qa", summary: "Check a change in a real browser with visual proof." },
  { name: "security", summary: "Auth, secrets, payments, user data, webhooks and audits." },
  { name: "docs", summary: "READMEs, changelogs, ADRs and PR text that match the change." },
];

/** Skills you call by name. */
export const manualSkills: Skill[] = [
  { name: "honey", summary: "Pick the right skill or flow, or switch response modes." },
  { name: "rsi", summary: "Review what it learned, coach, save or forget learnings." },
  { name: "unslop", summary: "Cut AI tells and filler from any text." },
  { name: "reverse-engineer", summary: "Study software you are authorized to analyse, with evidence." },
  { name: "handoff", summary: "Write or restore a handoff so a fresh session can continue." },
  { name: "prototype", summary: "Throwaway prototypes that settle a design question." },
  { name: "architecture", summary: "Deepening opportunities and behaviour-preserving refactors." },
  { name: "domain", summary: "Sharpen domain terms; record decisions in CONTEXT.md and ADRs." },
  { name: "teach", summary: "Explain a concept, or how and why some code works." },
  { name: "write-skill", summary: "Write or patch a skill to the quality bar, with evals." },
  { name: "principles", summary: "Engineering principles index, read before citing." },
  { name: "opensrc", summary: "Library context from package.json and official docs." },
  { name: "project-verify", summary: "A project-local verification harness and feature map." },
  { name: "triage", summary: "Qualify issues, PRs and suggestions into actionable briefs." },
  { name: "research", summary: "Answer questions from primary sources with citations." },
  { name: "statechart", summary: "Model a stateful flow and check its invariants." },
];

export const agents: Skill[] = [
  { name: "planner", summary: "Turns a request into a scoped plan in honey plan format. Read-only." },
  { name: "implementer", summary: "Implements one scoped task with focused tests and a DONE / BLOCKED report." },
  { name: "reviewer", summary: "Checks spec compliance, then code quality, before commit or PR. Read-only." },
  { name: "verifier", summary: "Chooses and runs the checks that prove a change, and reports risk." },
];

export const skillCount = autoSkills.length + manualSkills.length;

/** The whole job, end to end: every skill belongs to exactly one area. */
export const areas = [
  { name: "Think", blurb: "Settle the decision before the code.", skills: ["grill", "plan", "architecture", "domain", "prototype", "research", "principles"] },
  { name: "Build", blurb: "Make the smallest complete change.", skills: ["execute", "frontend", "api-design", "database", "tooling", "upgrade", "opensrc", "stageshow"] },
  { name: "Prove", blurb: "Evidence before anyone says done.", skills: ["debug", "tdd", "test-design", "verify", "qa", "project-verify", "statechart", "perf"] },
  { name: "Ship & run", blurb: "Review, release and keep it healthy.", skills: ["review", "ship", "deploy", "observability", "incident", "security", "triage"] },
  { name: "Write & learn", blurb: "Clear words, and a toolkit that improves.", skills: ["docs", "unslop", "teach", "handoff", "write-skill", "honey", "rsi", "reverse-engineer"] },
] as const;

const byName = new Map([...autoSkills, ...manualSkills].map((s) => [s.name, s]));
const autoNames = new Set(autoSkills.map((s) => s.name));

export function skillInfo(name: string) {
  const skill = byName.get(name);
  if (!skill) throw new Error(`Unknown skill ${name}`);
  return { ...skill, auto: autoNames.has(name) };
}
