"use client";

import { useEffect, useRef } from "react";

type Cell = { x: number; y: number; glow: number };

const R = 21; // hex radius in CSS px
const SPOT = 150; // cursor spotlight radius

function hexPath(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.moveTo(x, y - r);
  for (let i = 1; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a));
  }
  ctx.closePath();
}

/**
 * Honeycomb field. The grid is drawn once per resize; a frame loop runs only while
 * cells are glowing (pointer nearby or the one-shot entrance ripple), then stops.
 */
export function Honeycomb() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const css = getComputedStyle(document.documentElement);
    const rule = css.getPropertyValue("--color-rule").trim() || "#3a332a";
    const honey = css.getPropertyValue("--color-honey").trim() || "#f5b941";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const grid = document.createElement("canvas");
    const gctx = grid.getContext("2d")!;
    let cells: Cell[] = [];
    let w = 0;
    let h = 0;
    let dpr = 1;
    let pointer: { x: number; y: number } | null = null;
    let raf = 0;
    const start = performance.now();
    let rippleDone = reduce;

    function layout() {
      const rect = canvas!.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      for (const c of [canvas!, grid]) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
      }
      const dx = Math.sqrt(3) * R;
      const dy = 1.5 * R;
      const prev = new Map(cells.map((c) => [`${c.x},${c.y}`, c.glow]));
      cells = [];
      for (let row = -1; row * dy < h + R * 2; row++) {
        const y = row * dy;
        const offset = row % 2 ? dx / 2 : 0;
        for (let x = offset - dx; x < w + dx; x += dx) {
          cells.push({ x, y, glow: prev.get(`${x},${y}`) ?? 0 });
        }
      }
      gctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gctx.clearRect(0, 0, w, h);
      gctx.strokeStyle = rule;
      gctx.lineWidth = 1;
      gctx.beginPath();
      for (const c of cells) hexPath(gctx, c.x, c.y, R - 1.5);
      gctx.stroke();
    }

    function frame(now: number) {
      raf = 0;
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx!.drawImage(grid, 0, 0);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Entrance: a single ripple travelling out from the top-left over ~1.8s.
      const front = rippleDone ? -1 : ((now - start) / 1800) * Math.hypot(w, h);
      if (!rippleDone && front > Math.hypot(w, h) + 200) rippleDone = true;

      let settling = !rippleDone;
      ctx!.strokeStyle = honey;
      ctx!.fillStyle = honey;
      for (const c of cells) {
        let target = 0;
        if (pointer) {
          const d = Math.hypot(c.x - pointer.x, c.y - pointer.y);
          if (d < SPOT) target = (1 - d / SPOT) ** 2;
        }
        if (front > 0) {
          const d = Math.abs(Math.hypot(c.x, c.y) - front);
          if (d < 90) target = Math.max(target, (1 - d / 90) * 0.55);
        }
        const delta = target - c.glow;
        c.glow += delta * (delta > 0 ? 0.25 : 0.06);
        if (Math.abs(delta) > 0.003) settling = true;
        if (c.glow < 0.004) {
          c.glow = 0;
          continue;
        }
        ctx!.beginPath();
        hexPath(ctx!, c.x, c.y, R - 1.5);
        ctx!.globalAlpha = c.glow * 0.16;
        ctx!.fill();
        ctx!.globalAlpha = c.glow * 0.85;
        ctx!.stroke();
      }
      ctx!.globalAlpha = 1;
      if (settling) raf = requestAnimationFrame(frame);
    }

    const wake = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    let last: { x: number; y: number } | null = null;
    function track() {
      if (!last) return;
      const rect = canvas!.getBoundingClientRect();
      const x = last.x - rect.left;
      const y = last.y - rect.top;
      pointer = x >= -SPOT && y >= -SPOT && x <= w + SPOT && y <= h + SPOT ? { x, y } : null;
      wake();
    }
    function onMove(e: PointerEvent) {
      last = { x: e.clientX, y: e.clientY };
      track();
    }
    const onLeave = () => {
      last = null;
      pointer = null;
      wake();
    };

    layout();
    wake();
    const ro = new ResizeObserver(() => {
      layout();
      wake();
    });
    ro.observe(canvas);
    if (!reduce) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("scroll", track, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", track);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full [mask-image:radial-gradient(ellipse_80%_70%_at_30%_30%,black_30%,transparent_80%)]"
    />
  );
}
