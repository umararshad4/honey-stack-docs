import { Callout, DocHeader, H2, Table } from "@/components/docs/prose";
import { agents, autoSkills, manualSkills, skillCount, type Skill } from "@/lib/skills";
import { pageMetadata } from "@/lib/seo";

const PATH = "/docs/skills";

export const metadata = pageMetadata(PATH);

const rows = (skills: Skill[]) => skills.map((s) => [<code key={s.name}>{s.name}</code>, s.summary]);

export default function Page() {
  return (
    <>
      <DocHeader
        path={PATH}
        title="Skills & agents"
        lede={`${skillCount} skills and four subagents. Skills stay out of context until a task calls for them, so the always-on footprint stays small.`}
      />
      <div className="prose-docs">
        <H2 id="flow">The flow</H2>
        <p>
          <strong>grill → plan → execute → verify → review → ship.</strong> Bugs start at <strong>debug</strong>. In Claude Code, call a skill with{" "}
          <code>/honey:&lt;skill&gt;</code>; in Codex, use <code>$&lt;skill&gt;</code>.
        </p>

        <H2 id="auto">Chosen for you</H2>
        <p>The agent picks these itself when the situation matches.</p>
        <Table head={["Skill", "Use"]} rows={rows(autoSkills)} />

        <H2 id="manual">Yours to call</H2>
        <p>These run only when you invoke them, so their descriptions never expand the always-loaded workflow.</p>
        <Table head={["Skill", "Use"]} rows={rows(manualSkills)} />

        <H2 id="agents">Subagents</H2>
        <p>Four focused agents handle delegated work with their own tools and reports.</p>
        <Table head={["Agent", "Role"]} rows={rows(agents)} />

        <H2 id="highlights">Workflow highlights</H2>
        <p>
          <strong>project-verify</strong> creates or maintains a project-local verification skill — launch, readiness checks, feature journeys,
          observable side effects and safe cleanup. A generated harness counts as ready only after its recipe runs successfully. <code>verify</code>{" "}
          and <code>qa</code> reuse it.
        </p>
        <p>
          <strong>triage</strong> reads complete reports, checks duplicates and existing fixes, and produces evidence-backed states and agent briefs.
          Its reproduce-and-fix branch requires before/after proof and delivers through <code>ship</code>.
        </p>
        <p>
          <strong>research</strong> answers technical and product questions from primary sources, with constraints, source dates, citations and
          unknowns. <strong>statechart</strong> checks queue, retry and workflow invariants with a model checker and explains counterexamples — a
          checked model is not proof of the production code.
        </p>
        <p>
          <strong>qa</strong> uses the tester-army/e2e CLI and project MCP server by default, and discovers existing WebMCP tools for setup and
          contract checks. Real interactions, visual checks and backend assertions still prove their own requirements. The fast QA path schedules
          independent flows across bounded workers while keeping failure screenshots.
        </p>
        <Callout title="Frontend quality">
          Motion audits, frame diagnostics, realistic worst-case data, touch and safe-area checks live in <code>frontend</code>, <code>qa</code>,{" "}
          <code>review</code> and <code>perf</code>. <code>stageshow</code> owns mocked product illustrations and cursor demos — not the
          production app&apos;s components.
        </Callout>
      </div>
    </>
  );
}
