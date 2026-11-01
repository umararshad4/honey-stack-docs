"use client";

import { useEffect, useRef } from "react";

type Cell = { x: number; y: number; glow: number; boost: number };
type Ripple = { x: number; y: number; t0: number; strength: number };

const R = 21; // hex radius in CSS px
const SPOT = 150; // cursor spotlight radius
const RIPPLE_SPEED = 0.62; // px per ms
const RIPPLE_WIDTH = 80;

function hexPath(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.moveTo(x, y - r);
  for (let i = 1; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a));
  }
  ctx.closePath();
}

/**
 * Living honeycomb. The grid is drawn once per resize. A frame loop runs only while
 * something glows — the cursor spotlight, click ripples, or the occasional ambient
 * pulse — and it is paused entirely when the hero is off screen or the tab is hidden.
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
    let ripples: Ripple[] = reduce ? [] : [{ x: 0, y: 0, t0: performance.now(), strength: 0.6 }];
    let w = 0;
    let h = 0;
    let dpr = 1;
    let pointer: { x: number; y: number } | null = null;
    let raf = 0;
    let visible = true;
    let pulseTimer: ReturnType<typeof setTimeout> | undefined;

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
      cells = [];
      for (let row = -1; row * dy < h + R * 2; row++) {
        const y = row * dy;
        const offset = row % 2 ? dx / 2 : 0;
        for (let x = offset - dx; x < w + dx; x += dx) cells.push({ x, y, glow: 0, boost: 0 });
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

      const reach = Math.hypot(w, h) + RIPPLE_WIDTH * 2;
      ripples = ripples.filter((r) => (now - r.t0) * RIPPLE_SPEED < reach);
      let settling = ripples.length > 0;

      ctx!.strokeStyle = honey;
      ctx!.fillStyle = honey;
      for (const c of cells) {
        let target = c.boost;
        if (c.boost > 0.002) {
          c.boost *= 0.955;
          settling = true;
        } else c.boost = 0;
        if (pointer) {
          const d = Math.hypot(c.x - pointer.x, c.y - pointer.y);
          if (d < SPOT) target = Math.max(target, (1 - d / SPOT) ** 2);
        }
        for (const r of ripples) {
          const front = (now - r.t0) * RIPPLE_SPEED;
          const d = Math.abs(Math.hypot(c.x - r.x, c.y - r.y) - front);
          if (d < RIPPLE_WIDTH) {
            const fade = Math.max(0, 1 - front / reach);
            target = Math.max(target, (1 - d / RIPPLE_WIDTH) * r.strength * (0.4 + 0.6 * fade));
          }
        }
        const delta = target - c.glow;
        c.glow += delta * (delta > 0 ? 0.28 : 0.07);
        if (Math.abs(delta) > 0.003) settling = true;
        if (c.glow < 0.004) {
          c.glow = 0;
          continue;
        }
        ctx!.beginPath();
        hexPath(ctx!, c.x, c.y, R - 1.5);
        ctx!.globalAlpha = c.glow * 0.17;
        ctx!.fill();
        ctx!.globalAlpha = c.glow * 0.9;
        ctx!.stroke();
      }
      ctx!.globalAlpha = 1;
      if (settling && visible) raf = requestAnimationFrame(frame);
    }

    const wake = () => {
      if (!raf && visible) raf = requestAnimationFrame(frame);
    };

    // Ambient life: every second or so a few cells breathe in and out.
    function schedulePulse() {
      pulseTimer = setTimeout(() => {
        if (visible && cells.length) {
          const count = 1 + Math.floor(Math.random() * 2);
          for (let i = 0; i < count; i++) {
            const c = cells[Math.floor(Math.random() * cells.length)];
            // Favour the upper-left, where the mask keeps the grid visible.
            if (c.x < w * 0.75 && c.y < h * 0.8) c.boost = 0.35 + Math.random() * 0.35;
          }
          wake();
        }
        schedulePulse();
      }, 700 + Math.random() * 900);
    }

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
    function onDown(e: PointerEvent) {
      const el = e.target as Element | null;
      if (el?.closest("a, button, input, textarea, select, code, figure, [data-no-ripple]")) return;
      const rect = canvas!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > w || y > h) return;
      ripples.push({ x, y, t0: performance.now(), strength: 0.85 });
      if (ripples.length > 4) ripples.shift();
      wake();
    }
    const onLeave = () => {
      last = null;
      pointer = null;
      wake();
    };
    const onVisibility = () => {
      visible = document.visibilityState === "visible" && inView;
      if (visible) wake();
    };

    let inView = true;
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      onVisibility();
    });

    layout();
    wake();
    const ro = new ResizeObserver(() => {
      layout();
      wake();
    });
    ro.observe(canvas);
    io.observe(canvas);
    if (!reduce) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      window.addEventListener("scroll", track, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      document.addEventListener("visibilitychange", onVisibility);
      schedulePulse();
    }
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(pulseTimer);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", track);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
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
