import { Code } from "@/components/code";
import { Callout, DocHeader, H2 } from "@/components/docs/prose";
import { pageMetadata } from "@/lib/seo";

const PATH = "/docs/evidence";

export const metadata = pageMetadata(PATH);

export default function Page() {
  return (
    <>
      <DocHeader
        path={PATH}
        title="Task evidence"
        lede="Hooks keep a bounded record of each task — its mode, workspace, targets and required checks — so “done” can be tied to fresh, real results."
      />
      <div className="prose-docs">
        <H2 id="task-records">Task records</H2>
        <p>
          A task is either inspection or execution. “Continue” and status questions keep the current task. Explicit inspection stays read-only for
          recognised edit operations until you ask for changes.
        </p>
        <Code>{`honey task status --json
honey task set --mode execute --operation code --cwd /actual/project --check tests --check lint
honey task verify --check tests --tool-call <actual-test-call-id>
honey task verify --check lint --tool-call <actual-lint-call-id>`}</Code>
        <p>
          Codex uses <code>CODEX_THREAD_ID</code>; otherwise add <code>--agent claude --session &lt;session-id&gt;</code>. Bind the project before
          running its checks. <code>task set</code> starts a new contract and can&apos;t promote an inspection task to execution without your request.
        </p>
        <Callout title="Evidence, not permission">
          A task record is an evidence aid. It isn&apos;t a permission grant or a complete sandbox; classification uses conservative heuristics.
        </Callout>

        <H2 id="freshness">What counts as proof</H2>
        <p>
          The default code check recognises direct test and lint commands. Explicit checks link a fresh, successful result — the agent still has to
          confirm the command proves the named requirement. Later edits, potentially mutating shell commands, failed reruns and incomplete results
          invalidate proof. Checks started before a mutation, or in a previous task, can&apos;t verify the new state.
        </p>
        <p>
          Completion claims without evidence trigger one reminder per evidence cycle. Honest unresolved reports and inspection answers are allowed.
        </p>

        <H2 id="operations">Uninstall and startup operations</H2>
        <p>
          <code>--operation uninstall</code> requires the checks <code>application</code>, <code>helpers</code>, <code>startup</code> and{" "}
          <code>preserved-data</code>. Declare concrete targets with <code>--target</code>; <code>--absent</code> and <code>--present</code> measure
          and recheck the real state.
        </p>
        <Code>{`honey task verify --check application --absent /Applications/Example.app`}</Code>
        <p>
          <code>--operation startup</code> requires its resulting registration to be checked.
        </p>

        <H2 id="opaque-hosts">Hosts that hide tool events</H2>
        <p>
          When a host doesn&apos;t deliver inner events for a wrapped tool, run the check through honey. It executes without a shell and records the
          exit status plus a source snapshot.
        </p>
        <Code>{`honey task set --mode execute --operation code --cwd /path/to/project
honey task run --check verification -- python3 tests/run.py`}</Code>
        <p>
          Printed success can&apos;t manufacture proof: changed source, HEAD or index makes the result stale. The snapshot covers tracked and
          non-ignored files (up to 20,000 files or 64 MiB), rejects source symlinks, and doesn&apos;t claim to cover ignored dependencies or the
          external environment.
        </p>

        <H2 id="metrics">Metrics</H2>
        <p>
          <code>honey task status</code> shows task and session tool counts, repeated reads and checks, failures, unknown results and reported
          durations. <code>/rsi coach</code> aggregates them with denominators. Missing durations are never estimated, and these observations are not
          measured speedups.
        </p>
      </div>
    </>
  );
}
