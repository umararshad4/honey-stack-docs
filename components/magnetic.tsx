"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import type { ReactNode } from "react";

/** Pulls its child a few pixels toward the cursor, then springs back. */
export function Magnetic({ children, strength = 0.22, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });

  return (
    <motion.span
      className={`inline-flex ${className}`}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set(Math.max(-10, Math.min(10, (e.clientX - (r.left + r.width / 2)) * strength)));
        y.set(Math.max(-8, Math.min(8, (e.clientY - (r.top + r.height / 2)) * strength)));
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}
