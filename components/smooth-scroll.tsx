"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

function ResetOnNavigate() {
  const pathname = usePathname();
  const lenis = useLenis();
  useEffect(() => {
    if (!window.location.hash) lenis?.scrollTo(0, { immediate: true });
  }, [pathname, lenis]);
  return null;
}

/** Inertial page scroll. Disabled entirely when the user prefers reduced motion. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(!query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  if (!enabled) return children;

  return (
    <ReactLenis root options={{ lerp: 0.11, anchors: { offset: -88 }, allowNestedScroll: true }}>
      <ResetOnNavigate />
      {children}
    </ReactLenis>
  );
}
