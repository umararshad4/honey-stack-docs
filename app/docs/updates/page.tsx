import type { Metadata } from "next";
import { Code } from "@/components/code";
import { Callout, DocHeader, H2 } from "@/components/docs/prose";

export const metadata: Metadata = { title: "Update & uninstall" };

export default function Page() {
  return (
    <>
      <DocHeader
        title="Update & uninstall"
        lede="honey-stack updates itself from release tags, never touches your local work, and uninstalls cleanly."
      />
      <div className="prose-docs">
        <H2 id="automatic-updates">Automatic updates</H2>
        <p>
          honey checks for updates at session start, at most once an hour. For local Git marketplaces it fetches the newest <code>vX.Y.Z</code> release
          tag reachable from <code>main</code>, fast-forwards the checkout and refreshes the installed plugin copies. The new version loads in the next
          session.
        </p>
        <p>
          Local changes, feature branches and diverged checkouts are left untouched and reported as skipped. A failed refresh retries in a later
          session, and the update notice only appears once the refresh succeeds. Remote marketplaces use the agent&apos;s own update commands.
        </p>
        <Callout title="Codex hook review">
          Any plugin update, including an evaluated skill patch, can require fresh review in <code>/hooks</code>. honey never approves changed plugin
          code automatically. Say <code>update hooks</code> (or <code>$honey update hooks</code>) to authorise a one-time, honey-only review and
          update for that run.
        </Callout>

        <H2 id="manual">Update or remove by hand</H2>
        <Code>{`honey update                                   # update now; then /reload-plugins in Claude
honey autoupdate --now                         # check release tags without waiting an hour
honey uninstall --dry-run && honey uninstall   # keeps ~/.honey; add --purge to delete it`}</Code>

        <H2 id="plugin-only">Plugin-only installs</H2>
        <Code>{`claude plugin marketplace update honey-stack && claude plugin update honey@honey-stack
codex plugin marketplace upgrade honey-stack && codex plugin add honey@honey-stack`}</Code>

        <H2 id="what-uninstall-does">What uninstall restores</H2>
        <p>
          Uninstall reverses the installer: it removes the plugin and the managed activation block, and re-enables the always-on plugins it turned off.
          Your later personal edits to instruction files are preserved, and <code>~/.honey</code> is kept unless you pass <code>--purge</code>.
        </p>
      </div>
    </>
  );
}
