export const site = {
  name: "honey-stack",
  tagline: "One always-on toolkit for Claude Code and Codex that learns from every session.",
  url: "https://honey-stack.vercel.app",
  repo: "https://github.com/umararshad4/honey-stack",
  author: "King Umar",
  /** Shown when the GitHub API is unreachable at build or revalidation time. */
  fallbackVersion: "v0.16.0",
} as const;

export const installCommand =
  "curl -fsSL https://raw.githubusercontent.com/umararshad4/honey-stack/main/install.sh | bash";

export const repoPath = (path: string) => `${site.repo}/blob/main/${path}`;
