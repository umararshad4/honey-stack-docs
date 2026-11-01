"use client";

import { useEffect } from "react";

/**
 * One delegated listener drives the cursor glow on every [data-spotlight] surface.
 * It only writes two CSS variables on the hovered element; the glow itself is CSS.
 */
export function Spotlight() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let frame = 0;
    let last: PointerEvent | null = null;

    const apply = () => {
      frame = 0;
      const target = (last?.target as Element | null)?.closest<HTMLElement>("[data-spotlight]");
      if (!target || !last) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--spot-x", `${last.clientX - rect.left}px`);
      target.style.setProperty("--spot-y", `${last.clientY - rect.top}px`);
    };
    const onMove = (e: PointerEvent) => {
      last = e;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return null;
}
