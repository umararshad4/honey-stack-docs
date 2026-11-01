import type { Metadata } from "next";
import { docsNav, flatDocs } from "./nav";
import { site } from "./site";

/** Content dates for sitemap lastmod and article dates. Bump CONTENT_UPDATED when page copy changes. */
export const CONTENT_PUBLISHED = "2026-11-01";
export const CONTENT_UPDATED = "2026-11-01";

export const OG_SIZE = { width: 1200, height: 630 } as const;

export type PageSeo = {
  path: string;
  /** Short name used in breadcrumbs, structured data and the share image. */
  name: string;
  /** Page title. Docs titles get " · honey-stack" appended; keep the result ≤ 60 characters. */
  title: string;
  /** Search snippet, 120–160 characters. */
  description: string;
  keywords: string[];
};

const home: PageSeo = {
  path: "/",
  name: "honey-stack",
  title: "honey-stack — a self-improving Claude Code & Codex plugin",
  description:
    "honey-stack is a free, open-source plugin for Claude Code and Codex: ~2 KB of always-on rules, 38 skills, and RSI that learns from your corrections.",
  keywords: [
    "Claude Code plugin",
    "Codex plugin",
    "AI coding agent toolkit",
    "Claude Code skills",
    "Claude Code hooks",
    "self-improving AI agent",
    "recursive self-improvement",
    "CLAUDE.md rules",
    "honey-stack",
  ],
};

const docs: Record<string, Omit<PageSeo, "path" | "name">> = {
  "/docs": {
    title: "Introduction to the always-on agent toolkit",
    description:
      "What honey-stack is: one small always-on layer for Claude Code and Codex that combines five agent toolkits, loads skills on demand and learns from you.",
    keywords: ["honey-stack documentation", "Claude Code toolkit", "Codex toolkit", "AI agent rules"],
  },
  "/docs/install": {
    title: "Install honey-stack for Claude Code and Codex",
    description:
      "Install honey-stack with one command or as a Claude Code and Codex plugin. Requirements, activation, Codex hook trust and checking delivery with honey doctor.",
    keywords: ["install Claude Code plugin", "Codex plugin install", "Claude Code marketplace", "honey doctor"],
  },
  "/docs/modes": {
    title: "Response modes: direct, explain and balance",
    description:
      "Switch honey-stack between direct, explain and balance replies, pause it for a session, and teach your agent a rule instantly with remember: when X, Y.",
    keywords: ["Claude Code response style", "Codex response mode", "agent verbosity", "teach agent rules"],
  },
  "/docs/rules": {
    title: "Always-on rules: sizing, the ladder, proof",
    description:
      "The ~2 KB of rules honey-stack keeps in every session: task sizing, the six-rung smallest-change ladder, proof before done and decisions over questions.",
    keywords: ["AI agent rules", "CLAUDE.md best practices", "smallest complete change", "YAGNI for AI agents"],
  },
  "/docs/skills": {
    title: "38 Claude Code & Codex skills, 4 subagents",
    description:
      "Every honey-stack skill and subagent — grill, plan, execute, debug, tdd, verify, review, ship and more — and which fire on their own versus on request.",
    keywords: ["Claude Code skills", "Codex skills", "Claude Code subagents", "AI agent skills list"],
  },
  "/docs/hooks": {
    title: "Hooks & safety: guard, secret scan, receipts",
    description:
      "How honey-stack's lifecycle hooks work in Claude Code and Codex: a destructive-command guard, a secret scan of newly written text and a receipt gate.",
    keywords: ["Claude Code hooks", "Codex hooks", "dangerous command guard", "AI agent secret scanning"],
  },
  "/docs/evidence": {
    title: "Task evidence: proof that checks really ran",
    description:
      "honey task records each task's scope, workspace and required checks, so an agent's “done” is tied to fresh, real test and lint results — not a summary.",
    keywords: ["AI agent verification", "proof of tests for AI agents", "honey task", "agent evidence"],
  },
  "/docs/rsi": {
    title: "RSI: how honey-stack learns every session",
    description:
      "Recursive self-improvement: observe, reflect, curate, apply. How your corrections become WHEN → THEN rules and evaluated skill patches, tier by tier.",
    keywords: ["recursive self-improvement", "self-improving AI agent", "agent learns from corrections", "RSI"],
  },
  "/docs/publishing": {
    title: "Publishing: from suggestion to merged release",
    description:
      "Opt in and honey-stack publishes improvements as GitHub issues and evaluated skill PRs, with CI-gated merges and releases — private session data stays local.",
    keywords: ["automatic skill pull requests", "CI-gated merge", "self-publishing AI agent", "semantic release"],
  },
  "/docs/configuration": {
    title: "Configuration: budgets, autonomy, privacy",
    description:
      "Every ~/.honey/config.json option — response mode, RSI budgets, autonomy holdouts and auto-update — plus privacy: no telemetry, redacted snippets only.",
    keywords: ["honey-stack config", "AI agent budget caps", "no telemetry", "agent privacy"],
  },
  "/docs/updates": {
    title: "Update and uninstall honey-stack safely",
    description:
      "How honey-stack updates itself from release tags without touching your local work, how Codex hook review works, and how to uninstall it cleanly.",
    keywords: ["update Claude Code plugin", "uninstall Codex plugin", "plugin auto-update", "Codex hook review"],
  },
  "/docs/development": {
    title: "Develop honey-stack: tests, evals, releases",
    description:
      "Run honey-stack's offline stdlib tests, plugin validation and smoke evals, and see how every green merge to main is versioned and published automatically.",
    keywords: ["Claude plugin eval", "automatic semantic versioning", "plugin development", "conventional commits"],
  },
};

export const pages: PageSeo[] = [
  home,
  ...flatDocs.map((d) => {
    const seo = docs[d.href];
    if (!seo) throw new Error(`Missing SEO entry for ${d.href}`);
    return { path: d.href, name: d.title, ...seo };
  }),
];

export function pageSeo(path: string): PageSeo {
  const page = pages.find((p) => p.path === path);
  if (!page) throw new Error(`No SEO entry registered for ${path}`);
  return page;
}

export const absolute = (path: string) => (path === "/" ? site.url : `${site.url}${path}`);

/** Share-image slug: "home" for /, "docs" for /docs, otherwise the docs sub-path. */
export const ogSlug = (path: string) => (path === "/" ? "home" : path === "/docs" ? "docs" : path.replace(/^\/docs\//, ""));
export const ogSlugs = () => pages.map((p) => ogSlug(p.path));
export const pageForOgSlug = (slug: string) => pages.find((p) => ogSlug(p.path) === slug);

export const sectionOf = (path: string) => docsNav.find((g) => g.links.some((l) => l.href === path))?.label;

/** Full metadata for a registered page: title, snippet, canonical, Open Graph and Twitter. */
export function pageMetadata(path: string): Metadata {
  const page = pageSeo(path);
  const url = absolute(path);
  const isDoc = path !== "/";
  const image = { url: `/og/${ogSlug(path)}`, ...OG_SIZE, alt: `${page.name} — honey-stack`, type: "image/png" };

  return {
    title: isDoc ? page.title : { absolute: page.title },
    description: page.description,
    keywords: page.keywords,
    alternates: { canonical: url, types: { "application/rss+xml": [{ url: "/releases.xml", title: "honey-stack releases" }] } },
    openGraph: {
      type: isDoc ? "article" : "website",
      url,
      siteName: site.name,
      locale: "en_US",
      title: page.title,
      description: page.description,
      images: [image],
      ...(isDoc && {
        publishedTime: CONTENT_PUBLISHED,
        modifiedTime: CONTENT_UPDATED,
        authors: [site.authorUrl],
        section: sectionOf(path),
        tags: page.keywords,
      }),
    },
    twitter: { card: "summary_large_image", title: page.title, description: page.description, images: [image] },
  };
}
