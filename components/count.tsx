"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useEffect } from "react";
import { easeOut } from "./reveal";

type CountProps = { to: number; play?: boolean; delay?: number; duration?: number; decimals?: number; prefix?: string; suffix?: string };

/**
 * Counts up to `to` when `play` turns true. Server HTML carries the final value,
 * so crawlers and no-JS readers always see the real number.
 */
export function Count({ to, play = true, delay = 0, duration = 1.4, decimals = 0, prefix = "", suffix = "" }: CountProps) {
  const reduce = useReducedMotion();
  const value = useMotionValue(to);
  const text = useTransform(value, (v) => `${prefix}${v.toFixed(decimals)}${suffix}`);

  useEffect(() => {
    value.set(reduce ? to : 0);
  }, [reduce, to, value]);

  useEffect(() => {
    if (reduce || !play) return;
    const controls = animate(value, to, { duration, delay, ease: easeOut });
    return () => controls.stop();
  }, [reduce, play, to, delay, duration, value]);

  return <motion.span className="tabular-nums">{text}</motion.span>;
}
