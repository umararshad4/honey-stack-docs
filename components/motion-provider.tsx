"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Motion skips transform and layout animation for visitors who prefer reduced motion. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
