"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { Wordmark } from "./logo";

const links = [
  { href: "/docs", label: "Docs", match: (p: string) => p.startsWith("/docs") && !/\/docs\/(skills|rsi)/.test(p) },
  { href: "/docs/skills", label: "Skills", match: (p: string) => p.startsWith("/docs/skills"), wide: true },
  { href: "/docs/rsi", label: "RSI", match: (p: string) => p.startsWith("/docs/rsi"), wide: true },
];

export function GitHubMark({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.05-.49.05-.49.8.06 1.23.83 1.23.83.71 1.23 1.87.87 2.33.66.07-.52.28-.87.5-1.07-1.78-.2-3.65-.89-3.65-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.66 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

export function Nav({ version }: { version: string }) {
  const pathname = usePathname();

  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-3">
      <motion.nav
        aria-label="Primary"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto flex w-full max-w-3xl items-center gap-1 rounded-full border border-rule bg-paper-2/75 py-1.5 pr-1.5 pl-4 shadow-float backdrop-blur-xl"
      >
        <Link href="/" aria-label="honey-stack home" className="mr-auto rounded-full py-1" data-plain="">
          <Wordmark />
        </Link>

        <a
          href={`${site.repo}/releases`}
          className="mr-1 hidden rounded-full border border-rule px-2 py-0.5 font-mono text-[11px] text-muted tabular-nums transition-colors hover:border-rule-strong hover:text-ink md:block"
        >
          {version}
        </a>

        {links.map((link) => {
          const active = link.match(pathname);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`relative rounded-full px-3 py-1.5 text-[13px] whitespace-nowrap transition-colors duration-(--dur-short) ${
                active ? "text-ink" : "text-muted hover:text-ink"
              } ${link.wide ? "hidden sm:block" : ""}`}
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-paper-3"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                />
              )}
              <span className="relative">{link.label}</span>
            </Link>
          );
        })}

        <a
          href={site.repo}
          aria-label="honey-stack on GitHub"
          className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-paper-3 hover:text-ink"
        >
          <GitHubMark />
        </a>
      </motion.nav>
    </header>
  );
}
