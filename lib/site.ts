export const site = {
  name: "honey-stack",
  tagline: "One always-on toolkit for Claude Code and Codex that learns from every session.",
  description:
    "honey-stack is a free, open-source plugin for Claude Code and Codex: ~2 KB of always-on rules, 38 skills, and RSI that learns from your corrections and ships its own improvements.",
  url: "https://honey-stack.vercel.app",
  repo: "https://github.com/umararshad4/honey-stack",
  docsRepo: "https://github.com/umararshad4/honey-stack-docs",
  author: "King Umar",
  authorUrl: "https://github.com/umararshad4",
  /** Shown when the GitHub API is unreachable at build or revalidation time. */
  fallbackVersion: "v0.16.2",
} as const;

export const installCommand =
  "curl -fsSL https://raw.githubusercontent.com/umararshad4/honey-stack/main/install.sh | bash";

export const repoPath = (path: string) => `${site.repo}/blob/main/${path}`;
