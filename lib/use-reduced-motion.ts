"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/**
 * Hydration-safe reduced-motion preference. Hydration renders with the server value
 * (false), then React re-renders with the real preference — so server and client
 * markup always match. motion/react's hook reads the media query during the first
 * client render, which caused React error #418 for reduced-motion users.
 */
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false);
}
