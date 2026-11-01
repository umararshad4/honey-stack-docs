export type DocLink = { title: string; href: string; blurb: string };
export type DocGroup = { label: string; links: DocLink[] };

/** Single source for the sidebar, the prev/next pager and the sitemap. */
export const docsNav: DocGroup[] = [
  {
    label: "Start",
    links: [
      { title: "Introduction", href: "/docs", blurb: "What honey-stack is and why it exists." },
      { title: "Installation", href: "/docs/install", blurb: "One command, both agents, fully reversible." },
      { title: "Modes", href: "/docs/modes", blurb: "direct, explain, balance — and how to pause." },
    ],
  },
  {
    label: "How it works",
    links: [
      { title: "Always-on rules", href: "/docs/rules", blurb: "Sizing, the ladder, proof, decisions." },
      { title: "Skills & agents", href: "/docs/skills", blurb: "38 skills and four subagents." },
      { title: "Hooks & safety", href: "/docs/hooks", blurb: "Guard, secret scan and the receipt gate." },
      { title: "Task evidence", href: "/docs/evidence", blurb: "Bounded task records and fresh proof." },
    ],
  },
  {
    label: "Self-improvement",
    links: [
      { title: "RSI: how it learns", href: "/docs/rsi", blurb: "Observe, reflect, curate, apply." },
      { title: "Publishing", href: "/docs/publishing", blurb: "From suggestion to merged release." },
    ],
  },
  {
    label: "Operate",
    links: [
      { title: "Configuration", href: "/docs/configuration", blurb: "~/.honey/config.json, budgets, privacy." },
      { title: "Update & uninstall", href: "/docs/updates", blurb: "Release tags, hook review, clean removal." },
      { title: "Development", href: "/docs/development", blurb: "Tests, evals and automatic releases." },
    ],
  },
];

export const flatDocs = docsNav.flatMap((group) => group.links);
