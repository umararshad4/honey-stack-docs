import type { ReactNode } from "react";

/**
 * Re-mounts on every docs navigation, so the CSS entrance replays per page. Being CSS,
 * it also starts on first paint — the page never waits for hydration to become visible.
 */
export default function DocsTemplate({ children }: { children: ReactNode }) {
  return <div className="page-in">{children}</div>;
}
