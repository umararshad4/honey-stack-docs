"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";

/** A hairline of honey across the top that tracks reading progress. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  const opacity = useTransform(scrollYProgress, [0, 0.02], [0, 1]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-honey shadow-[0_0_12px_var(--color-honey)]"
      style={{ scaleX, opacity }}
    />
  );
}
